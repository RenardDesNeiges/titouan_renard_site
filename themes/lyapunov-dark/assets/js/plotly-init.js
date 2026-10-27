(function () {
  'use strict';

  // Elements whose figure is already being fetched/rendered, so a re-init
  // (e.g. once right after a page swap and once after head assets load) never
  // starts two Plotly.newPlot calls on the same node.
  var pending = [];

  function isPending(el) {
    for (var i = 0; i < pending.length; i += 1) {
      if (pending[i] === el) return true;
    }
    return false;
  }

  function release(el) {
    for (var i = pending.length - 1; i >= 0; i -= 1) {
      if (pending[i] === el) pending.splice(i, 1);
    }
  }

  function render(el) {
    pending.push(el);

    fetch(el.getAttribute('data-json'))
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (fig) {
        // The page may have been swapped again while the JSON was in flight.
        if (!document.documentElement.contains(el)) {
          release(el);
          return null;
        }
        var layout = fig.layout || {};
        layout.modebar = { orientation: 'h' };
        layout.margin = { l: 0, r: 0, t: 40, b: 40 };
        return Plotly.newPlot(el.id, fig.data, layout, { displaylogo: false, responsive: true });
      })
      .then(function (result) {
        if (result === null) return;
        el.setAttribute('data-plotly-ready', '');
        release(el);
      })
      .catch(function (e) {
        release(el);
        console.error('plotly:', el.getAttribute('data-json'), e);
      });
  }

  // (Re)scan a root (the document, or the <main> swapped in by nav.js).
  // Figures already rendered are skipped, so repeated calls are safe.
  function init(root) {
    if (!window.Plotly) return;

    var scope = root || document;
    if (!scope.querySelectorAll) return;

    var elements = scope.querySelectorAll('.plotly[data-json]');
    for (var i = 0; i < elements.length; i += 1) {
      var el = elements[i];
      if (el.getAttribute('data-plotly-ready') !== null) continue;
      if (isPending(el)) continue;
      render(el);
    }
  }

  // Exposed for in-place navigation (nav.js).
  window.LyapunovPlotly = { init: init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(document); });
  else init(document);
})();
