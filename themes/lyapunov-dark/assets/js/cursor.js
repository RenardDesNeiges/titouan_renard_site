/* ==========================================================================
   cursor.js — negative-colour triangle pointer
   Replaces the native pointer with a small white right triangle drawn with
   mix-blend-mode: difference, so it reads as light over the dark background and
   as dark over light text. Progressive enhancement: without JS (or on coarse
   pointers) nothing is created and the native cursor stays. The element lives
   directly under <body>, outside <main>, so in-place navigation never removes
   it; positions are applied in a single requestAnimationFrame per pointer move.
   ========================================================================== */

(function () {
  'use strict';

  var ROOT_CLASS = 'has-custom-cursor';
  var CURSOR_CLASS = 'custom-cursor';
  var VISIBLE_CLASS = 'is-visible';

  // The pointer is hidden over the fixed motif panel: the panel is a drawing,
  // not a UI surface, so neither cursor should sit on top of it.
  var MOTIF_SELECTOR = '.motif';

  var el = null;
  var motifEl = null;
  var fineQuery = null;
  var hoverQuery = null;

  var x = 0;
  var y = 0;
  var hasPosition = false;
  var active = false; // false after pointerleave / window blur
  var frame = 0;

  /* ------------------------------------------------------------------------
     Pointer capability
     ------------------------------------------------------------------------ */

  function finePointer() {
    if (!window.matchMedia) return false;
    try {
      if (fineQuery && !fineQuery.matches) return false;
      if (hoverQuery && hoverQuery.matches) return false;
      return true;
    } catch (error) {
      return false;
    }
  }

  /* ------------------------------------------------------------------------
     Element lifecycle (created once, reused for the whole session)
     ------------------------------------------------------------------------ */

  function createCursor() {
    if (el || !document.body) return;

    // Adopt an element left behind by a previous run instead of duplicating it.
    el = document.querySelector('.' + CURSOR_CLASS);
    if (!el) {
      el = document.createElement('div');
      el.className = CURSOR_CLASS;
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="60px" height="60px" ' +
        'viewBox="0 0 60 60" focusable="false" aria-hidden="true">' +
        '<polygon points="0,0 60,24 24,60" fill="#fff"/></svg>';
      document.body.appendChild(el);
    }

    document.documentElement.classList.add(ROOT_CLASS);
  }

  function removeCursor() {
    if (frame && window.cancelAnimationFrame) window.cancelAnimationFrame(frame);
    frame = 0;

    if (el && el.parentNode) el.parentNode.removeChild(el);
    el = null;

    document.documentElement.classList.remove(ROOT_CLASS);
    hasPosition = false;
    active = false;
  }

  /* ------------------------------------------------------------------------
     Motif panel test
     ------------------------------------------------------------------------ */

  function motifRect() {
    if (!motifEl || !document.documentElement.contains(motifEl)) {
      motifEl = document.querySelector(MOTIF_SELECTOR);
    }
    if (!motifEl) return null;

    var style;
    try {
      style = window.getComputedStyle(motifEl);
    } catch (error) {
      return null;
    }
    if (!style) return null;
    if (style.display === 'none' || style.visibility === 'hidden') return null;

    var rect = motifEl.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return null;
    return rect;
  }

  function overMotif(px, py) {
    var rect = motifRect();
    if (!rect) return false;
    return px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom;
  }

  /* ------------------------------------------------------------------------
     Painting (one frame per burst of pointer moves, no smoothing)
     ------------------------------------------------------------------------ */

  function paint() {
    frame = 0;
    if (!el) return;

    el.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';

    var show = active && hasPosition && !overMotif(x, y);
    if (show) {
      el.classList.add(VISIBLE_CLASS);
    } else {
      el.classList.remove(VISIBLE_CLASS);
    }
  }

  function schedule() {
    if (frame) return;
    if (typeof window.requestAnimationFrame === 'function') {
      frame = window.requestAnimationFrame(paint);
    } else {
      frame = window.setTimeout(paint, 16);
    }
  }

  function onMove(event) {
    if (!el) return;

    // Touch-generated pointer events must never wake the desktop pointer.
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
      return;
    }

    var px = event.clientX;
    var py = event.clientY;
    if (typeof px !== 'number' || typeof py !== 'number') return;

    x = px;
    y = py;
    hasPosition = true;
    active = true;
    schedule();
  }

  function onLeave() {
    if (!el) return;
    active = false;
    schedule();
  }

  function onBlur() {
    if (!el) return;
    active = false;
    schedule();
  }

  /* ------------------------------------------------------------------------
     Wiring
     ------------------------------------------------------------------------ */

  function listen(target, type, handler) {
    try {
      target.addEventListener(type, handler, { passive: true });
    } catch (error) {
      target.addEventListener(type, handler, false);
    }
  }

  var listening = false;

  function bind() {
    if (listening) return;
    listening = true;

    listen(window, 'pointermove', onMove);
    listen(window, 'mousemove', onMove); // fallback for browsers without Pointer Events
    listen(window, 'blur', onBlur);
    listen(document.documentElement, 'pointerleave', onLeave);
    listen(document, 'pointerleave', onLeave);

    // In-place navigation swaps <main>; the pointer may end up over (or away
    // from) the motif panel without another move, so re-evaluate afterwards.
    listen(window, 'popstate', schedule);
  }

  function sync() {
    if (!document.body) return;

    if (finePointer()) {
      createCursor();
      bind();
      schedule();
    } else {
      removeCursor();
    }
  }

  function onCapabilityChange() {
    sync();
  }

  function watch(query) {
    if (!query) return;
    try {
      if (typeof query.addEventListener === 'function') {
        query.addEventListener('change', onCapabilityChange);
      } else if (typeof query.addListener === 'function') {
        query.addListener(onCapabilityChange);
      }
    } catch (error) {
      // No capability events: the initial check is still correct.
    }
  }

  function start() {
    if (!window.matchMedia) return;

    try {
      fineQuery = window.matchMedia('(pointer: fine)');
      hoverQuery = window.matchMedia('(hover: none)');
    } catch (error) {
      return;
    }

    watch(fineQuery);
    watch(hoverQuery);
    sync();
  }

  if (document.body) {
    start();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', start);
  }
})();
