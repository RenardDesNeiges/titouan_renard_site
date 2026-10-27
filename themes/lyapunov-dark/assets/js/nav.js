/* ==========================================================================
   nav.js — mobile menu, margin-note keys, and in-place page navigation
   Progressive enhancement: without JS every link is a normal full-page
   navigation. With JS, same-origin links swap <main class="page"> in place so
   the fixed header, motif panel and footer stay put, while the URL, title and
   history keep working (back/forward included).
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Mobile menu toggle
     ------------------------------------------------------------------------ */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.classList.add('js-nav');

    var isOpen = function () {
      return toggle.getAttribute('aria-expanded') === 'true';
    };

    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    // Close when a link is followed.
    nav.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('a')) setOpen(false);
    });

    // Close on Escape and restore focus to the button.
    document.addEventListener('keydown', function (event) {
      if ((event.key === 'Escape' || event.key === 'Esc') && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Close as soon as the viewport is wide enough for the inline nav.
    var mq = window.matchMedia('(min-width: 601px)');

    var onViewportChange = function (event) {
      if (event.matches) setOpen(false);
    };

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onViewportChange);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(onViewportChange);
    }
  }

  // Margin-note markers are focusable labels, but labels are not activated by
  // Space/Enter natively in every browser. Forward those keys to a click so
  // the note can be expanded without a pointer (≤1080px layout).
  document.addEventListener('keydown', function (event) {
    var target = event.target;
    if (!target || !target.classList || !target.classList.contains('note-marker')) return;
    if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter') {
      event.preventDefault();
      target.click();
    }
  });

  /* ------------------------------------------------------------------------
     In-place navigation
     ------------------------------------------------------------------------ */

  var FILE_EXTENSION = /\.(pdf|png|jpe?g|svg|webp|gif|zip|json|xml|txt|webmanifest|css|js)$/i;
  var navToken = 0;

  function normalizePath(pathname) {
    if (pathname.length > 1 && pathname.charAt(pathname.length - 1) === '/') {
      return pathname.slice(0, -1);
    }
    return pathname;
  }

  function currentMain() {
    return document.querySelector('main.page');
  }

  function absoluteUrl(value, base) {
    try {
      return new URL(value, base).href;
    } catch (error) {
      return value;
    }
  }

  // Highlight the menu entry for the current URL (and clear it after a swap).
  function updateActiveNav() {
    var links = document.querySelectorAll('#site-nav a');
    var here = normalizePath(window.location.pathname);
    var i;

    for (i = 0; i < links.length; i += 1) {
      var href = links[i].getAttribute('href');
      var target = null;

      if (href) {
        try {
          target = new URL(href, window.location.origin);
        } catch (error) {
          target = null;
        }
      }

      if (
        target &&
        target.origin === window.location.origin &&
        normalizePath(target.pathname) === here
      ) {
        links[i].setAttribute('aria-current', 'page');
      } else {
        links[i].removeAttribute('aria-current');
      }
    }
  }

  function copyAttribute(from, to, name) {
    var value = from.getAttribute(name);
    if (value !== null) to.setAttribute(name, value);
  }

  function normalizeStyle(text) {
    return String(text || '').replace(/\s+/g, '');
  }

  // Append an asset and resolve on load or error (a failed CDN request must
  // not block the rest of the navigation).
  function loadAsset(element) {
    return new Promise(function (resolve) {
      element.addEventListener('load', resolve);
      element.addEventListener('error', resolve);
      document.head.appendChild(element);
    });
  }

  // The fetched page may need CDN assets (KaTeX / Plotly) that the current
  // page never loaded. Copy only the missing ones, then wait for them.
  function loadHeadAssets(doc, pageUrl) {
    var jobs = [];
    var existingLinks = {};
    var existingScripts = {};
    var existingStyles = {};
    var index;

    var currentLinks = document.head.querySelectorAll('link[href]');
    for (index = 0; index < currentLinks.length; index += 1) {
      existingLinks[absoluteUrl(currentLinks[index].getAttribute('href'), window.location.href)] = true;
    }

    var currentScripts = document.head.querySelectorAll('script[src]');
    for (index = 0; index < currentScripts.length; index += 1) {
      existingScripts[absoluteUrl(currentScripts[index].getAttribute('src'), window.location.href)] = true;
    }

    var currentStyles = document.head.querySelectorAll('style');
    for (index = 0; index < currentStyles.length; index += 1) {
      existingStyles[normalizeStyle(currentStyles[index].textContent)] = true;
    }

    // Stylesheets.
    var nextLinks = doc.head.querySelectorAll('link[rel="stylesheet"][href]');
    for (index = 0; index < nextLinks.length; index += 1) {
      var nextLink = nextLinks[index];
      var href = absoluteUrl(nextLink.getAttribute('href'), pageUrl);
      if (existingLinks[href]) continue;
      existingLinks[href] = true;

      var link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', href);
      copyAttribute(nextLink, link, 'integrity');
      copyAttribute(nextLink, link, 'crossorigin');
      copyAttribute(nextLink, link, 'media');
      jobs.push(loadAsset(link));
    }

    // Scripts. Dynamic scripts ignore defer, so async = false preserves the
    // fetched document order (KaTeX before auto-render).
    var nextScripts = doc.head.querySelectorAll('script[src]');
    for (index = 0; index < nextScripts.length; index += 1) {
      var nextScript = nextScripts[index];
      var src = absoluteUrl(nextScript.getAttribute('src'), pageUrl);
      if (existingScripts[src]) continue;
      existingScripts[src] = true;

      var script = document.createElement('script');
      script.async = false;
      script.setAttribute('src', src);
      copyAttribute(nextScript, script, 'integrity');
      copyAttribute(nextScript, script, 'crossorigin');
      copyAttribute(nextScript, script, 'type');
      jobs.push(loadAsset(script));
    }

    // Inline <style> blocks (e.g. Plotly's `svg { display: inherit; }`).
    var nextStyles = doc.head.querySelectorAll('style');
    for (index = 0; index < nextStyles.length; index += 1) {
      var text = nextStyles[index].textContent;
      var key = normalizeStyle(text);
      if (!key || existingStyles[key]) continue;
      existingStyles[key] = true;

      document.head.appendChild(nextStyles[index].cloneNode(true));
    }

    if (typeof Promise.allSettled === 'function') {
      return Promise.allSettled(jobs);
    }
    return Promise.all(jobs);
  }

  // Same delimiters as partials/head/katex.html.
  function renderMath(root) {
    if (typeof window.renderMathInElement !== 'function') return;

    try {
      window.renderMathInElement(root, {
        delimiters: [
          { left: '$', right: '$', display: false },
          { left: '$$', right: '$$', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\begin{equation}', right: '\\end{equation}', display: true },
          { left: '\\begin{align}', right: '\\end{align}', display: true }
        ],
        throwOnError: false
      });
    } catch (error) {
      // A malformed formula must never break navigation.
    }
  }

  function refreshMotif() {
    if (window.LyapunovMotif && typeof window.LyapunovMotif.refresh === 'function') {
      window.LyapunovMotif.refresh();
    } else if (typeof window.Event === 'function') {
      window.dispatchEvent(new window.Event('resize'));
    }
  }

  function updateMeta(doc) {
    var next = doc.querySelector('meta[name="description"]');
    if (!next) return;

    var current = document.querySelector('meta[name="description"]');
    if (!current) {
      current = document.createElement('meta');
      current.setAttribute('name', 'description');
      document.head.appendChild(current);
    }
    current.setAttribute('content', next.getAttribute('content') || '');
  }

  function updateCanonical(doc) {
    var next = doc.querySelector('link[rel="canonical"]');
    if (!next) return;

    var current = document.querySelector('link[rel="canonical"]');
    if (!current) {
      current = document.createElement('link');
      current.setAttribute('rel', 'canonical');
      document.head.appendChild(current);
    }
    current.setAttribute('href', next.getAttribute('href') || '');
  }

  function updateRss(doc) {
    var selector = 'link[rel="alternate"][type="application/rss+xml"]';
    var next = doc.querySelector(selector);
    var current = document.querySelector(selector);

    if (!next) {
      if (current) current.parentNode.removeChild(current);
      return;
    }

    if (!current) {
      current = document.createElement('link');
      current.setAttribute('rel', 'alternate');
      current.setAttribute('type', 'application/rss+xml');
      document.head.appendChild(current);
    }

    current.setAttribute('href', next.getAttribute('href') || '');
    var title = next.getAttribute('title');
    if (title) current.setAttribute('title', title);
  }

  function applyDocument(doc, newMain, url, push, token) {
    var main = currentMain();
    if (!main) {
      window.location.assign(url);
      return;
    }

    var imported = document.importNode(newMain, true);
    main.parentNode.replaceChild(imported, main);

    // Body class drives layout-home / layout-doc / layout-post (and therefore
    // whether the fixed motif panel is visible).
    document.body.className = doc.body.className;

    var lang = doc.documentElement.getAttribute('lang');
    if (lang) document.documentElement.lang = lang;

    document.title = doc.title;
    updateMeta(doc);
    updateCanonical(doc);
    updateRss(doc);

    if (push) {
      window.history.pushState({ spa: true }, '', url);
    }

    updateActiveNav();

    // Start at the top, then honour a #fragment if the URL has one.
    var hash = url.indexOf('#') !== -1 ? url.slice(url.indexOf('#') + 1) : '';
    window.scrollTo(0, 0);
    if (hash) {
      var target = document.getElementById(decodeURIComponent(hash));
      if (target) target.scrollIntoView();
    }

    // Make the new content the focus target, without scrolling back.
    imported.setAttribute('tabindex', '-1');
    try {
      imported.focus({ preventScroll: true });
    } catch (error) {
      imported.focus();
    }

    // Re-initialize page-scoped dynamic content.
    if (window.LyapunovBlobs && typeof window.LyapunovBlobs.init === 'function') {
      window.LyapunovBlobs.init(imported);
    }
    if (window.LyapunovPlotly && typeof window.LyapunovPlotly.init === 'function') {
      window.LyapunovPlotly.init(imported);
    }
    refreshMotif();

    // Load anything the new page needs, then render the deferred extras.
    loadHeadAssets(doc, url).then(function () {
      if (token !== navToken) return;
      renderMath(imported);
      if (window.LyapunovPlotly && typeof window.LyapunovPlotly.init === 'function') {
        window.LyapunovPlotly.init(imported);
      }
    });
  }

  function navigate(url, push) {
    var token = navToken + 1;
    navToken = token;

    fetch(url, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var type = response.headers.get('content-type') || '';
        if (type && type.indexOf('text/html') === -1) throw new Error('Not HTML');
        return response.text();
      })
      .then(function (html) {
        if (token !== navToken) return;

        var doc = new DOMParser().parseFromString(html, 'text/html');
        var newMain = doc.querySelector('main.page');

        // No shell to swap into (e.g. the /post/ redirect stub): do a normal
        // full-page navigation instead.
        if (!newMain) {
          window.location.assign(url);
          return;
        }

        applyDocument(doc, newMain, url, push, token);
      })
      .catch(function () {
        if (token !== navToken) return;
        window.location.assign(url);
      });
  }

  function isPlainLeftClick(event) {
    return (
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    );
  }

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || !isPlainLeftClick(event)) return;

    var clicked = event.target;
    var link = clicked && clicked.closest ? clicked.closest('a') : null;
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;

    if (link.hasAttribute('download') || link.hasAttribute('data-no-spa')) return;

    var linkTarget = link.getAttribute('target');
    if (linkTarget && linkTarget !== '_self') return;

    if (/^(mailto:|tel:|javascript:)/i.test(href)) return;

    // Hash-only links stay native (in-page scroll).
    if (href.charAt(0) === '#') return;

    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (error) {
      return;
    }

    if (url.origin !== window.location.origin) return;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
    if (FILE_EXTENSION.test(url.pathname)) return;

    // Same page (possibly a different #fragment): let the browser handle it.
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;

    // Nothing to swap into: keep the native behaviour.
    if (!currentMain()) return;

    event.preventDefault();
    navigate(url.href, true);
  });

  window.addEventListener('popstate', function () {
    navigate(window.location.href, false);
  });

  // Reflect the URL the page was loaded with.
  updateActiveNav();
})();
