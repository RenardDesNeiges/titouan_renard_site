(function () {
  'use strict';

  /* ======================================================================
     Blog-card blobs

     Every .post-blob canvas gets a static, closed organic blob silhouette
     drawn as a set of concentric outlines: the same smooth shape repeated
     five times, scaled uniformly toward the canvas centre, stroked in the
     same thin colour with no fill. The shape is derived only from the canvas
     data-seed, so it is deterministic and stable across reloads and resizes.
     ====================================================================== */

  var MAX_RADIUS_RATIO = 0.43; // of min(css width, css height)
  var MIN_VERTEX_RATIO = 0.1; // of the maximum radius
  var MAX_ANGLE_JITTER = 0.08; // radians
  var RING_SCALES = [1, 0.8, 0.6, 0.4, 0.2]; // outer -> inner
  var DEFAULT_STROKE = '#9a9a9a';

  // Stroke colour comes from the stylesheet, with a safe fallback.
  var STROKE_COLOR = DEFAULT_STROKE;

  try {
    var rootStyle = window.getComputedStyle(document.documentElement);
    if (rootStyle) {
      var configuredStroke = rootStyle
        .getPropertyValue('--color-blob')
        .trim();
      if (configuredStroke) {
        STROKE_COLOR = configuredStroke;
      }
    }
  } catch (error) {
    STROKE_COLOR = DEFAULT_STROKE;
  }

  /* ======================================================================
     Seeded randomness
     ====================================================================== */

  // FNV-1a: string -> uint32 seed.
  function hashSeed(text) {
    var hash = 0x811c9dc5;
    for (var i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash >>> 0;
  }

  // mulberry32: tiny deterministic PRNG returning floats in [0, 1).
  function mulberry32(seed) {
    var state = seed >>> 0;
    return function () {
      state = (state + 0x6d2b79f5) >>> 0;
      var t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ======================================================================
     Geometry
     ====================================================================== */

  // Irregular star-shaped polygon: 4-7 vertices, evenly spaced angles with a
  // little jitter, and a random radius per vertex.
  function buildPoints(seed, maxRadius) {
    var random = mulberry32(hashSeed(seed));
    var count = 4 + Math.floor(random() * 4);
    var baseRotation = random() * Math.PI * 2;
    var angleStep = (Math.PI * 2) / count;
    var points = [];
    var i;
    var angle;
    var radius;

    for (i = 0; i < count; i += 1) {
      angle = baseRotation + i * angleStep;
      angle += (random() - 0.5) * MAX_ANGLE_JITTER * 2;
      radius = maxRadius * (MIN_VERTEX_RATIO + random() * (1 - MIN_VERTEX_RATIO));
      points.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      });
    }

    return points;
  }

  // Closed Catmull-Rom spline converted to cubic Bézier segments. Each
  // vertex is visited once and the path is closed, so there are no corners.
  // The same segments are used for drawing and for measuring the outline.
  function buildSegments(points) {
    var count = points.length;
    var segments = [];
    var i;
    var p0;
    var p1;
    var p2;
    var p3;

    for (i = 0; i < count; i += 1) {
      p0 = points[(i - 1 + count) % count];
      p1 = points[i];
      p2 = points[(i + 1) % count];
      p3 = points[(i + 2) % count];

      segments.push({
        x0: p1.x,
        y0: p1.y,
        c1x: p1.x + (p2.x - p0.x) / 6,
        c1y: p1.y + (p2.y - p0.y) / 6,
        c2x: p2.x - (p3.x - p1.x) / 6,
        c2y: p2.y - (p3.y - p1.y) / 6,
        x1: p2.x,
        y1: p2.y
      });
    }

    return segments;
  }

  function traceBlob(ctx, points) {
    var segments = buildSegments(points);
    var i;

    ctx.beginPath();
    ctx.moveTo(segments[0].x0, segments[0].y0);

    for (i = 0; i < segments.length; i += 1) {
      ctx.bezierCurveTo(
        segments[i].c1x,
        segments[i].c1y,
        segments[i].c2x,
        segments[i].c2y,
        segments[i].x1,
        segments[i].y1
      );
    }

    ctx.closePath();
  }

  // Value of one cubic Bézier coordinate at parameter t.
  function cubicAt(a, b, c, d, t) {
    var mt = 1 - t;
    return (
      mt * mt * mt * a +
      3 * mt * mt * t * b +
      3 * mt * t * t * c +
      t * t * t * d
    );
  }

  // Bounding box of the drawn outline, sampled along every cubic segment so
  // the spline's overshoot beyond the polygon vertices is included.
  function curveBounds(points) {
    var segments = buildSegments(points);
    var samples = 20;
    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;
    var i;
    var step;
    var t;
    var x;
    var y;

    for (i = 0; i < segments.length; i += 1) {
      for (step = 0; step <= samples; step += 1) {
        t = step / samples;
        x = cubicAt(
          segments[i].x0,
          segments[i].c1x,
          segments[i].c2x,
          segments[i].x1,
          t
        );
        y = cubicAt(
          segments[i].y0,
          segments[i].c1y,
          segments[i].c2y,
          segments[i].y1,
          t
        );

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    return {
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
  }

  // Shift the vertices so the drawn outline's bounding box is centred on the
  // local origin. Scaling about that origin then keeps every ring concentric.
  function centerPoints(points) {
    var bounds = curveBounds(points);
    var centered = [];
    var i;

    for (i = 0; i < points.length; i += 1) {
      centered.push({
        x: points[i].x - bounds.centerX,
        y: points[i].y - bounds.centerY
      });
    }

    return centered;
  }

  // Uniformly scale the generated points about the origin (which is the
  // canvas centre after the translate). Scaling the coordinates instead of
  // the context keeps every ring stroked at the same 1 CSS px line width.
  function scalePoints(points, scale) {
    var scaled = [];
    var i;

    for (i = 0; i < points.length; i += 1) {
      scaled.push({
        x: points[i].x * scale,
        y: points[i].y * scale
      });
    }

    return scaled;
  }

  /* ======================================================================
     Rendering
     ====================================================================== */

  function drawCanvas(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    var cssWidth = canvas.clientWidth;
    var cssHeight = canvas.clientHeight;
    if (cssWidth <= 0 || cssHeight <= 0) {
      return;
    }

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var pixelWidth = Math.max(1, Math.round(cssWidth * dpr));
    var pixelHeight = Math.max(1, Math.round(cssHeight * dpr));

    // Resize the backing store only when needed; setting width/height always
    // resets the context, so the transform is applied below either way.
    if (canvas.width !== pixelWidth) {
      canvas.width = pixelWidth;
    }
    if (canvas.height !== pixelHeight) {
      canvas.height = pixelHeight;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    var maxRadius = Math.min(cssWidth, cssHeight) * MAX_RADIUS_RATIO;
    var seed = canvas.getAttribute('data-seed') || '';
    var points = centerPoints(buildPoints(seed, maxRadius));

    ctx.save();
    ctx.translate(cssWidth / 2, cssHeight / 2);

    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = STROKE_COLOR;

    for (var ringIndex = 0; ringIndex < RING_SCALES.length; ringIndex += 1) {
      traceBlob(ctx, scalePoints(points, RING_SCALES[ringIndex]));
      ctx.stroke();
    }

    ctx.restore();
  }

  /* ======================================================================
     Setup / resize handling
     ====================================================================== */

  var items = [];
  var observer = null;

  function schedule(item) {
    if (item.frameId) {
      return;
    }
    item.frameId = window.requestAnimationFrame(function () {
      item.frameId = 0;
      drawCanvas(item.canvas);
    });
  }

  function findItem(canvas) {
    for (var itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
      if (items[itemIndex].canvas === canvas) {
        return items[itemIndex];
      }
    }
    return null;
  }

  // Drop canvases that left the document (in-place navigation replaces the
  // whole <main>), so the observer never accumulates detached nodes.
  function prune() {
    for (var itemIndex = items.length - 1; itemIndex >= 0; itemIndex -= 1) {
      if (!document.documentElement.contains(items[itemIndex].canvas)) {
        if (observer) {
          observer.unobserve(items[itemIndex].canvas);
        }
        items.splice(itemIndex, 1);
      }
    }
  }

  function ensureObserver() {
    if (observer || typeof window.ResizeObserver !== 'function') {
      return;
    }

    observer = new window.ResizeObserver(function (entries) {
      for (var entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
        var observed = findItem(entries[entryIndex].target);
        if (observed) {
          schedule(observed);
        }
      }
    });
  }

  // (Re)scan a root (the document, or the <main> swapped in by nav.js).
  // Canvases already initialized are left untouched, so calling this twice
  // never draws or observes the same canvas twice.
  function init(root) {
    var scope = root || document;
    if (!scope.querySelectorAll) {
      return;
    }

    prune();
    ensureObserver();

    var canvases = scope.querySelectorAll('.post-blob');
    for (var canvasIndex = 0; canvasIndex < canvases.length; canvasIndex += 1) {
      var canvas = canvases[canvasIndex];
      if (findItem(canvas)) {
        continue;
      }

      var item = { canvas: canvas, frameId: 0 };
      items.push(item);

      if (observer) {
        observer.observe(canvas);
      }

      // Draw once now. The ResizeObserver may schedule one identical redraw;
      // the shape is deterministic, so nothing visibly changes.
      drawCanvas(canvas);
    }
  }

  if (typeof window.ResizeObserver !== 'function') {
    window.addEventListener('resize', function () {
      for (var itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
        schedule(items[itemIndex]);
      }
    });
  }

  // Exposed for in-place navigation (nav.js).
  window.LyapunovBlobs = { init: init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init(document);
    });
  } else {
    init(document);
  }
})();
