(function () {
  'use strict';

  var canvas = document.getElementById('motif-canvas');
  if (!canvas || typeof canvas.getContext !== 'function') {
    return;
  }

  var ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  /* ======================================================================
     Tunables
     ====================================================================== */

  var LINE_WIDTH = 1; // CSS px — identical for every contour, no exceptions
  var SPEED = 0.1; // breathing cycles per second (~16.7 s per full cycle)
  var LEVEL_COUNT = 10; // number of contour levels per frame
  var STROKE_ALPHA = 1; // one uniform alpha shared by all levels
  var GRID_STEP = 5; // field sample spacing, CSS px (18 samples per feature)
  var NOISE_SCALE = 1 / 260; // base feature size ~260 CSS px (~2-3 across a 748px panel)
  var OCTAVES = 1; // fBm octaves
  var NOISE_AMPLITUDE = 0.4; // noise strength relative to the base slope
  var MORPH_Z = 0.3; // noise-z distance travelled at full inhale
  var BASE_TILT = 0.18; // tilt of the base slope (0 = perfectly horizontal)
  var MAX_DELTA_MS = 50; // clamp long frames so a tab switch never causes a jump
  var SEED = 20260220; // fixed seed: the field is deterministic
  var CYCLE_MS = 1000 / SPEED;

  // Pointer-controlled local flow, ported from demo_3. HOVER_Z is in the same
  // units as MORPH_Z. The smoothstep falloff reaches exactly zero at
  // HOVER_RADIUS, so nothing outside the radius can change.
  var HOVER_RADIUS = 260; // CSS px
  var HOVER_Z = -1.4; // extra noise-z at full paint strength
  var HOVER_POS_TAU = 120; // cursor position smoothing, ms
  var HOVER_FADE_IN_TAU = 140; // hover strength ramp-up, ms
  var HOVER_FADE_OUT_TAU = 1060; // hover strength ramp-down, ms
  var HOVER_SNAP = 0.03; // below this the hover is considered finished

  // Persistent paint trail: one normalised amount [0, 1] per field sample, so
  // the z-offset stays anchored to the panel instead of following the cursor.
  // max() stamping means passing over the same spot again cannot deepen it.
  var TRAIL_DECAY_MS = 11000; // exponential time constant
  var TRAIL_SNAP = 0.004; // below this a trail sample is snapped to zero

  // Stroke colour comes from the stylesheet, with a safe fallback.
  var MOTIF_COLOR = '#ffffff';
  try {
    var rootStyle = window.getComputedStyle(document.documentElement);
    var configured = rootStyle ? rootStyle.getPropertyValue('--color-motif').trim() : '';
    if (configured) {
      MOTIF_COLOR = configured;
    }
  } catch (error) {
    MOTIF_COLOR = '#ffffff';
  }

  /* ======================================================================
     Seeded 3D Perlin noise
     ====================================================================== */

  var perm = new Uint8Array(512);

  (function buildPermutation() {
    var p = new Uint8Array(256);
    var i;
    var j;
    var tmp;

    for (i = 0; i < 256; i += 1) {
      p[i] = i;
    }

    // mulberry32: tiny, deterministic PRNG used only to shuffle the table.
    var state = SEED >>> 0;
    function random() {
      state = (state + 0x6d2b79f5) >>> 0;
      var t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    for (i = 255; i > 0; i -= 1) {
      j = (random() * (i + 1)) | 0;
      tmp = p[i];
      p[i] = p[j];
      p[j] = tmp;
    }

    for (i = 0; i < 512; i += 1) {
      perm[i] = p[i & 255];
    }
  })();

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Standard 12-direction gradient for 3D Perlin noise.
  function grad3(hash, x, y, z) {
    var h = hash & 15;
    var u = h < 8 ? x : y;
    var v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  function noise3(x, y, z) {
    var fx = Math.floor(x);
    var fy = Math.floor(y);
    var fz = Math.floor(z);
    var X = fx & 255;
    var Y = fy & 255;
    var Z = fz & 255;

    x -= fx;
    y -= fy;
    z -= fz;

    var u = fade(x);
    var v = fade(y);
    var w = fade(z);

    var A = perm[X] + Y;
    var AA = perm[A] + Z;
    var AB = perm[A + 1] + Z;
    var B = perm[X + 1] + Y;
    var BA = perm[B] + Z;
    var BB = perm[B + 1] + Z;

    return lerp(
      lerp(
        lerp(grad3(perm[AA], x, y, z), grad3(perm[BA], x - 1, y, z), u),
        lerp(
          grad3(perm[AB], x, y - 1, z),
          grad3(perm[BB], x - 1, y - 1, z),
          u
        ),
        v
      ),
      lerp(
        lerp(
          grad3(perm[AA + 1], x, y, z - 1),
          grad3(perm[BA + 1], x - 1, y, z - 1),
          u
        ),
        lerp(
          grad3(perm[AB + 1], x, y - 1, z - 1),
          grad3(perm[BB + 1], x - 1, y - 1, z - 1),
          u
        ),
        v
      ),
      w
    );
  }

  // Fractal Brownian motion, normalised back to roughly [-1, 1].
  function fbm(x, y, z) {
    var total = 0;
    var amplitude = 1;
    var frequency = 1;
    var norm = 0;
    for (var i = 0; i < OCTAVES; i += 1) {
      total += amplitude * noise3(x * frequency, y * frequency, z * frequency);
      norm += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    return total / norm;
  }

  // Smooth Hermite step: 0 below edge0, 1 above edge1, eased in between.
  function smoothstep(edge0, edge1, value) {
    var t = (value - edge0) / (edge1 - edge0);
    if (t < 0) {
      t = 0;
    } else if (t > 1) {
      t = 1;
    }
    return t * t * (3 - 2 * t);
  }

  /* ======================================================================
     Layout / canvas state
     ====================================================================== */

  var width = 0;
  var height = 0;
  var dpr = 1;

  var cols = 0;
  var rows = 0;
  var stepX = 1;
  var stepY = 1;

  var field = null; // scalar field, cols * rows, reused every frame
  var levels = new Float64Array(LEVEL_COUNT);

  // Scratch space for the four edge crossings of one cell (no per-cell alloc).
  var edgeX = new Float64Array(4);
  var edgeY = new Float64Array(4);

  // Reused static lookup tables for marching-squares edge pairing.
  // 0 = top, 1 = right, 2 = bottom, 3 = left. -1 = saddle / empty.
  var EDGE_A = new Int8Array([
    -1, 3, 0, 3, 1, -1, 0, 2,
    2, 0, -1, 1, 1, 0, 3, -1
  ]);
  var EDGE_B = new Int8Array([
    -1, 0, 1, 1, 2, -1, 2, 3,
    3, 2, -1, 2, 3, 1, 0, -1
  ]);

  var elapsed = 0; // accumulated animation time, in ms
  var lastTimestamp = 0;
  var frameId = 0;
  var running = false;
  var STATIC_Z = MORPH_Z * 0.5; // reduced-motion resting phase

  // One paint amount per field sample, anchored to the panel. The trail
  // survives pointerleave and fades out on its own.
  var trail = null; // Float32Array(cols * rows), values in [0, 1]
  var trailActive = false; // true while any sample is still above TRAIL_SNAP

  // Smoothed pointer state. Only mouse and pen pointers update it.
  var hover = {
    active: false, // pointer currently inside the canvas
    has: false, // a cursor position has been established
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    strength: 0
  };

  var motionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  var prefersReducedMotion = !!(motionQuery && motionQuery.matches);

  function measure() {
    var cssWidth = canvas.clientWidth;
    var cssHeight = canvas.clientHeight;

    if (cssWidth <= 0 || cssHeight <= 0) {
      // Hidden on mobile: nothing to draw, and the observer will call us
      // again if the canvas ever becomes visible.
      return false;
    }

    width = cssWidth;
    height = cssHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Only touch the backing store when the size actually changed: assigning
    // width/height wipes the canvas, and a refresh call (SPA navigation)
    // should not blank the panel for a frame.
    var backingWidth = Math.max(1, Math.round(cssWidth * dpr));
    var backingHeight = Math.max(1, Math.round(cssHeight * dpr));
    if (canvas.width !== backingWidth) {
      canvas.width = backingWidth;
    }
    if (canvas.height !== backingHeight) {
      canvas.height = backingHeight;
    }

    // Setting width/height resets the context, so re-apply the DPR scale
    // and the (constant) drawing state.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = MOTIF_COLOR;

    var nextCols = Math.ceil(width / GRID_STEP) + 1;
    var nextRows = Math.ceil(height / GRID_STEP) + 1;
    if (nextCols !== cols || nextRows !== rows) {
      cols = nextCols;
      rows = nextRows;
      field = new Float32Array(cols * rows);
      // The trail is anchored to the sample grid, so a new grid starts clean.
      trail = new Float32Array(cols * rows);
      trailActive = false;
    }
    // Stretch the grid to the exact panel edges: spacing stays close to
    // GRID_STEP while every border pixel is covered by the field.
    stepX = width / (cols - 1);
    stepY = height / (rows - 1);
    return true;
  }

  function sampleField(px, py, z) {
    // A gently tilted base slope keeps the iso-lines long and mostly
    // parallel; the fBm term warps them into meanders, loops and merges.
    var base = (py / height + BASE_TILT * (px / width)) / (1 + BASE_TILT);
    var n = fbm(px * NOISE_SCALE, py * NOISE_SCALE, z);
    return base + NOISE_AMPLITUDE * n;
  }

  function addSegment(ax, ay, bx, by) {
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
  }

  function drawField(zBase) {
    if (width <= 0 || height <= 0 || !field) {
      return;
    }

    // Transparent canvas: clear rather than paint, so #111 shows through.
    ctx.clearRect(0, 0, width, height);

    // ---- 1. Sample the hover-free base field, tracking its actual range. ----
    var min = Infinity;
    var max = -Infinity;
    var i;
    var j;
    var value;
    var row;

    for (j = 0; j < rows; j += 1) {
      row = j * cols;
      var py = j * stepY;
      for (i = 0; i < cols; i += 1) {
        value = sampleField(i * stepX, py, zBase);
        field[row + i] = value;
        if (value < min) {
          min = value;
        } else if (value > max) {
          max = value;
        }
      }
    }

    // ---- 2. Evenly spaced levels across the range seen this frame. ----
    // A small inset avoids degenerate one-cell loops at the extremes while
    // keeping the whole panel covered at every morph state.
    var span = max - min;
    if (!(span > 1e-6)) {
      return;
    }
    var lo = min + span * 0.03;
    var hi = max - span * 0.03;
    var levelStep = (hi - lo) / (LEVEL_COUNT - 1);
    for (i = 0; i < LEVEL_COUNT; i += 1) {
      levels[i] = lo + i * levelStep;
    }

    // ---- 3. Local hover/trail displacement. ----
    // Only the samples carrying paint are recomputed, and the levels stay
    // those of the base field, so the pointer cannot shift the tone mapping
    // of the whole panel (demo_3's base-field / apply-trail order).
    applyTrailField(zBase);

    // ---- 4. Marching squares into one path, then one stroke. ----
    ctx.beginPath();

    for (j = 0; j < rows - 1; j += 1) {
      var y0 = j * stepY;
      var y1 = y0 + stepY;
      var row0 = j * cols;
      var row1 = row0 + cols;

      for (i = 0; i < cols - 1; i += 1) {
        var x0 = i * stepX;
        var x1 = x0 + stepX;

        var v0 = field[row0 + i]; // top-left
        var v1 = field[row0 + i + 1]; // top-right
        var v2 = field[row1 + i + 1]; // bottom-right
        var v3 = field[row1 + i]; // bottom-left

        var cellMin = v0;
        var cellMax = v0;
        if (v1 < cellMin) {
          cellMin = v1;
        } else if (v1 > cellMax) {
          cellMax = v1;
        }
        if (v2 < cellMin) {
          cellMin = v2;
        } else if (v2 > cellMax) {
          cellMax = v2;
        }
        if (v3 < cellMin) {
          cellMin = v3;
        } else if (v3 > cellMax) {
          cellMax = v3;
        }

        // First level >= cellMin (binary search over the small level list).
        var lowIndex = 0;
        var highIndex = LEVEL_COUNT;
        while (lowIndex < highIndex) {
          var mid = (lowIndex + highIndex) >> 1;
          if (levels[mid] < cellMin) {
            lowIndex = mid + 1;
          } else {
            highIndex = mid;
          }
        }

        for (var li = lowIndex; li < LEVEL_COUNT; li += 1) {
          var level = levels[li];
          if (level > cellMax) {
            break;
          }

          // Be consistent about equality: a corner counts as "inside" when
          // its value is >= the level. The four cases where a corner lands
          // exactly on the level therefore stay topologically valid.
          var idx = 0;
          if (v0 >= level) {
            idx |= 1;
          }
          if (v1 >= level) {
            idx |= 2;
          }
          if (v2 >= level) {
            idx |= 4;
          }
          if (v3 >= level) {
            idx |= 8;
          }

          // idx 0 / 15 cannot happen here because cellMin <= level <= cellMax,
          // except for exact tangencies, where there is no segment to add.
          if (idx === 0 || idx === 15) {
            continue;
          }

          // Linear interpolation on every crossed edge.
          edgeX[0] = x0 + (x1 - x0) * ((level - v0) / (v1 - v0)); // top
          edgeY[0] = y0;
          edgeX[1] = x1; // right
          edgeY[1] = y0 + (y1 - y0) * ((level - v1) / (v2 - v1));
          edgeX[2] = x0 + (x1 - x0) * ((level - v3) / (v2 - v3)); // bottom
          edgeY[2] = y1;
          edgeX[3] = x0; // left
          edgeY[3] = y0 + (y1 - y0) * ((level - v0) / (v3 - v0));

          if (idx === 5 || idx === 10) {
            // Saddle: resolve with the bilinear cell-centre value so the
            // two segments connect the same way on both sides of the cell.
            var centre = (v0 + v1 + v2 + v3) * 0.25;
            var a;
            var b;
            var c;
            var d;
            if (idx === 5) {
              if (centre >= level) {
                a = 0; b = 1; c = 2; d = 3;
              } else {
                a = 3; b = 0; c = 1; d = 2;
              }
            } else if (centre >= level) {
              a = 3; b = 0; c = 1; d = 2;
            } else {
              a = 0; b = 1; c = 2; d = 3;
            }
            addSegment(edgeX[a], edgeY[a], edgeX[b], edgeY[b]);
            addSegment(edgeX[c], edgeY[c], edgeX[d], edgeY[d]);
          } else {
            var ea = EDGE_A[idx];
            var eb = EDGE_B[idx];
            addSegment(edgeX[ea], edgeY[ea], edgeX[eb], edgeY[eb]);
          }
        }
      }
    }

    // One path, one stroke: every line shares width and alpha exactly.
    ctx.stroke();
  }

  // ---------------------------------------------------------------------
  // Hover trail
  // ---------------------------------------------------------------------

  // Recompute only the field samples that carry paint. The z-offset is a
  // function of the stored trail amount, not of the cursor, which is what
  // makes the trace stay put after the pointer moves on.
  function applyTrailField(zBase) {
    if (!trail || !trailActive) {
      return;
    }

    var index = 0;
    var j;
    var i;
    var py;
    var amount;

    for (j = 0; j < rows; j += 1) {
      py = j * stepY;
      for (i = 0; i < cols; i += 1) {
        amount = trail[index];
        if (amount > 0) {
          field[index] = sampleField(i * stepX, py, zBase + HOVER_Z * amount);
        }
        index += 1;
      }
    }
  }

  // Stamp paint into the trail at the smoothed cursor position. The amount is
  // the product of the current hover strength and a radial falloff that
  // reaches zero at HOVER_RADIUS. Only the maximum is kept, so repeated
  // passes over the same spot cannot deepen the effect past one layer.
  function paintTrail() {
    if (!hover.active || !hover.has || !trail || hover.strength <= 0) {
      return;
    }

    var radiusSq = HOVER_RADIUS * HOVER_RADIUS;
    var minGX = Math.floor((hover.x - HOVER_RADIUS) / stepX);
    var maxGX = Math.ceil((hover.x + HOVER_RADIUS) / stepX);
    var minGY = Math.floor((hover.y - HOVER_RADIUS) / stepY);
    var maxGY = Math.ceil((hover.y + HOVER_RADIUS) / stepY);

    if (minGX < 0) {
      minGX = 0;
    }
    if (minGY < 0) {
      minGY = 0;
    }
    if (maxGX > cols - 1) {
      maxGX = cols - 1;
    }
    if (maxGY > rows - 1) {
      maxGY = rows - 1;
    }

    var strength = hover.strength;
    var gx;
    var gy;
    var px;
    var py;
    var dx;
    var dy;
    var distSq;
    var falloff;
    var amount;
    var index;

    for (gy = minGY; gy <= maxGY; gy += 1) {
      py = gy * stepY;
      dy = py - hover.y;
      if (dy * dy >= radiusSq) {
        continue;
      }
      index = gy * cols + minGX;
      for (gx = minGX; gx <= maxGX; gx += 1) {
        px = gx * stepX;
        dx = px - hover.x;
        distSq = dx * dx + dy * dy;
        if (distSq < radiusSq) {
          falloff = 1 - smoothstep(0, 1, Math.sqrt(distSq) / HOVER_RADIUS);
          amount = strength * falloff;
          if (amount > trail[index]) {
            trail[index] = amount;
            if (amount > TRAIL_SNAP) {
              trailActive = true;
            }
          }
        }
        index += 1;
      }
    }
  }

  // Exponential fade of every trail sample. Decay advances only on rendered
  // frames; when the page is hidden the loop stops, so a hidden tab freezes
  // the trace instead of erasing it. Values below TRAIL_SNAP are snapped to
  // zero, which lets the reduced-motion loop eventually come to rest.
  function decayTrail(deltaMs) {
    if (!trail || !trailActive) {
      return;
    }

    var decay = Math.exp(-deltaMs / TRAIL_DECAY_MS);
    var any = false;
    var value;
    var i;

    for (i = 0; i < trail.length; i += 1) {
      value = trail[i] * decay;
      if (value < TRAIL_SNAP) {
        trail[i] = 0;
      } else {
        trail[i] = value;
        any = true;
      }
    }

    trailActive = any;
  }

  // ---------------------------------------------------------------------
  // Hover state
  // ---------------------------------------------------------------------

  function updateHover(deltaMs) {
    if (!hover.has) {
      return;
    }

    var posK = 1 - Math.exp(-deltaMs / HOVER_POS_TAU);
    hover.x += (hover.targetX - hover.x) * posK;
    hover.y += (hover.targetY - hover.y) * posK;

    var target = hover.active ? 1 : 0;
    var tau = hover.active ? HOVER_FADE_IN_TAU : HOVER_FADE_OUT_TAU;
    var strengthK = 1 - Math.exp(-deltaMs / tau);
    hover.strength += (target - hover.strength) * strengthK;

    if (hover.strength > 1) {
      hover.strength = 1;
    }

    // Finish the fade cleanly so the next frame can be pixel-identical to the
    // untouched panel and the reduced-motion loop can come to rest.
    if (!hover.active && hover.strength < HOVER_SNAP) {
      hover.strength = 0;
    }
  }

  function handlePointerMove(event) {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
      return;
    }

    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      // The listener lives on window (the panel is pointer-events:none), so
      // leaving the canvas rect has to be detected here.
      hover.active = false;
      if (prefersReducedMotion) {
        start();
      }
      return;
    }

    // Entering with no residual hover: start exactly at the cursor rather
    // than sliding the patch in from the previous position. A residual fade
    // keeps its smoothed position so re-entry does not pop.
    if (!hover.has || hover.strength === 0) {
      hover.x = x;
      hover.y = y;
      hover.has = true;
    }

    hover.targetX = x;
    hover.targetY = y;
    hover.active = true;

    if (prefersReducedMotion) {
      start();
    }
  }

  function handlePointerEnd(event) {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
      return;
    }
    hover.active = false;
    if (prefersReducedMotion) {
      start();
    }
  }

  function handleWindowBlur() {
    hover.active = false;
    if (prefersReducedMotion) {
      start();
    }
  }

  // ---------------------------------------------------------------------
  // Animation clock
  // ---------------------------------------------------------------------

  function baseZ() {
    if (prefersReducedMotion) {
      return STATIC_Z;
    }
    // m = 0 -> 1 -> 0 with a cosine ease. At the cycle seam m is exactly
    // 0 again, so the field is identical and no reset is visible.
    var cycle = (elapsed % CYCLE_MS) / CYCLE_MS;
    var morph = 0.5 - 0.5 * Math.cos(cycle * Math.PI * 2);
    return morph * MORPH_Z;
  }

  function isVisible() {
    return canvas.clientWidth > 0 && canvas.clientHeight > 0;
  }

  function reducedMotionIdle() {
    return (
      prefersReducedMotion &&
      !hover.active &&
      hover.strength === 0 &&
      !trailActive
    );
  }

  function drawFrame() {
    drawField(baseZ());
  }

  function tick(timestamp) {
    if (!running) {
      return;
    }

    // A hidden panel (post pages, narrow viewports) must not keep the loop
    // alive; the ResizeObserver restarts it once the canvas has a size again.
    if (!isVisible()) {
      stop();
      return;
    }

    var delta = lastTimestamp ? timestamp - lastTimestamp : 0;
    if (delta < 0) {
      delta = 0;
    } else if (delta > MAX_DELTA_MS) {
      delta = MAX_DELTA_MS;
    }

    lastTimestamp = timestamp;

    // In reduced-motion mode the breathing clock stays frozen; only the
    // user-initiated hover fade and the trail decay evolve.
    if (!prefersReducedMotion) {
      elapsed += delta;
    }

    updateHover(delta);
    decayTrail(delta);
    paintTrail();
    drawFrame();

    if (reducedMotionIdle()) {
      // The last frame (now free of paint) stays on screen. Until the trail
      // has fully decayed the temporary loop keeps running so the trace
      // visibly fades instead of freezing at full strength.
      stop();
      return;
    }

    frameId = window.requestAnimationFrame(tick);
  }

  function start() {
    if (running || document.hidden || !isVisible() || reducedMotionIdle()) {
      return;
    }
    running = true;
    lastTimestamp = 0; // first tick contributes no delta, so no time jump
    frameId = window.requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }

  function applyMotionPreference() {
    if (prefersReducedMotion) {
      stop();
      drawFrame();
      if (hover.active || hover.strength > 0 || trailActive) {
        start();
      }
    } else {
      start();
    }
  }

  function handleResize() {
    if (!measure()) {
      // Hidden canvas: stop the loop instead of burning CPU. The observer
      // calls us again as soon as the panel gets a size back (SPA navigation,
      // resizing up from the mobile layout).
      stop();
      return;
    }
    // Redraw immediately; the loop would otherwise only catch up next frame.
    drawFrame();
    start();
  }

  function handleMotionChange(event) {
    prefersReducedMotion = event.matches;
    applyMotionPreference();
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerleave', handlePointerEnd, { passive: true });
  window.addEventListener('pointercancel', handlePointerEnd, { passive: true });
  window.addEventListener('blur', handleWindowBlur);

  var resizeObserver = null;

  if (typeof window.ResizeObserver === 'function') {
    resizeObserver = new window.ResizeObserver(handleResize);
    resizeObserver.observe(canvas);
  } else {
    window.addEventListener('resize', handleResize);
  }

  if (motionQuery) {
    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', handleMotionChange);
    } else if (typeof motionQuery.addListener === 'function') {
      motionQuery.addListener(handleMotionChange);
    }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stop();
    } else if (prefersReducedMotion) {
      if (hover.active || hover.strength > 0 || trailActive) {
        start();
      }
    } else {
      start();
    }
  });

  // Exposed for the SPA navigation code: after swapping content and the body
  // class the canvas may have gone from hidden to visible, or been resized.
  window.LyapunovMotif = { refresh: handleResize };

  handleResize();
  applyMotionPreference();
})();
