# PLAN — Replace `hugo-brewm` with the `lyapunov-dark` theme

Status: ready for implementation. No theme code has been written yet.
Target repo: `/Users/admin/Documents/Projects/titouan_renard_site/hugo_repo`
Reference design: `/Users/admin/Documents/Projects/titouan_renard_site/design_concept/`
(`index.html`, `style.css`, `motif.js`, `blobs.js`, `contour.svg`, `example_lines.png`)

---

## 1. Locked decisions

| # | Decision | Value |
|---|---|---|
| 1 | Packaging | Plain tracked directory `themes/lyapunov-dark/` in this repo (no submodule), `theme = 'lyapunov-dark'` |
| 2 | Home page | Faithful port of `design_concept/index.html` + `style.css` (right column, `#111`, Inter, fixed animated contour on the left half) |
| 3 | Post pages | Same visual language, **no** contour motif, centered prose column with a Tufte-style right gutter, one large seeded blob as a header decoration |
| 4 | Other pages (`about`, `publications`, `404`) | Same visual language **with** the contour motif (narrower panel, see §6.4) |
| 5 | Home thumbnails | Deterministic seeded blob canvases (port of `blobs.js`) |
| 6 | Motif | Animated canvas (port of `motif.js`) + static frame for `prefers-reduced-motion` / hidden tab |
| 7 | Fonts | Inter 400/700 from Google Fonts, loaded with `<link rel="preconnect">` + `<link rel="stylesheet">` in `<head>` (not `@import`) |
| 8 | Margin notes | Tufte-style right gutter; inline expandable markers below 900 px |
| 9 | Home copy | `design_concept/index.html` is authoritative (5 paragraphs, `titouan.renard[at]gmail.com.`, heading **“Latest posts:”**) |
| 10 | `/post/` listing | Removed; `/post/` redirects to `/`; `/post/<slug>/` unchanged |
| 11 | Preserved behaviour | RSS + robots.txt + sitemap, reading time on cards, KaTeX (block + inline), Plotly (6 figures), `marginpar`/`marginnote`/`epigraph` |
| 12 | Dropped behaviour | a11y panel, contrast modes, BionRead, light/dark toggle, theme switcher, search/Pagefind, comments, share, related, colophon, history, carousels/slides, taxonomies, TOC, social cards/OpenGraph, multilingual, breadcrumbs, pagination, syntax-highlight theme |
| 13 | Plotly | Moves into the theme; site overrides deleted; `content/assets/css/custom.css` deleted |
| 14 | 404 | No auto-redirect, static page with a “return home” link |
| 15 | Repo hygiene | Included as a separate final phase (§10, Phase 6) |
| 16 | Deliverable shape | Phased, file-by-file, with explicit parallel subagent split (§10) |

Anything not listed above is out of scope (§14).

---

## 2. Current-feature inventory (the compatibility contract)

The new theme must reproduce **only** this surface. Everything else in `hugo-brewm` is ignored.

### 2.1 Content that must render

| Path | Front matter in use | Body features |
|---|---|---|
| `content/_index.md` | none after cleanup | 5 intro paragraphs |
| `content/about.md` | `title` | `###`/`####` headings, bullet lists, ~19 `marginpar`, 7 local PDF links, external links |
| `content/publications.md` | `title` | `###` headings, bullet lists, 3 `marginpar`, external DOI links |
| `content/post/basics_of_input_output.md` | `title`, `date`, `draft`, `author`, `math`, `plotly`, `meta` | `##` headings, Markdown tables, inline `$…$`, block `$$…$$`, 1 `plotly` (500 px) |
| `content/post/gaillard_oct_2025.md` | same | `#`/`##`, tables, 25 `marginnote`, 2 `marginpar`, 3 `plotly` (400 px) |
| `content/post/recap_neoclassical_trade_theory.md` | same | 4 `marginnote`, 1 `marginpar`, 1 `epigraph`, 2 `plotly` (700 px) |
| `content/post/comparative_cost.md` | same, `draft = true` | 5 `marginnote`, raw HTML `<div>`, must still build under `--buildDrafts` |

Shortcode call contracts that must not change:

```
{{< marginpar >}}…markdown…{{< /marginpar >}}          (also positional "abs", "safeHTML")
{{< marginnote >}}…markdown…{{< /marginnote >}}        (same positional args)
{{< epigraph pre="…" cite="…" post="…" >}}…{{< /epigraph >}}   (optional named "link")
{{< plotly json="plots/X.json" height="400px" >}}
```

### 2.2 Outputs that must exist after `hugo`

```
/                          home
/about/                    page
/publications/             page
/post/<slug>/              ×3 published posts (4 with --buildDrafts)
/post/                     redirect page → /
/404.html                  static, no redirect
/index.xml, /post/index.xml  RSS
/sitemap.xml, /robots.txt
/css/<fingerprinted>.css, /js/<fingerprinted>.js
```

No `/post/` listing, no `/page/N/`, no `/tags/`, no `/categories/`, no `/search/`, no `/index.json`.

---

## 3. Theme directory layout

Create exactly this tree (nothing more):

```
themes/lyapunov-dark/
├── theme.toml
├── LICENSE                       MIT, © Titouan Renard
├── README.md                     short: install, config keys, content contracts
├── hugo.toml                     [module.hugoVersion] extended = true, min = "0.146.0"
├── archetypes/
│   └── default.md                (copy of the current site archetype)
├── i18n/
│   └── en.toml                   only the strings this theme uses (§6.9)
├── assets/
│   ├── css/
│   │   ├── tokens.css            :root variables only
│   │   ├── base.css              reset, body, links, headings, tables, lists, blockquote, code
│   │   ├── header.css            fixed header, logo, nav, mobile menu
│   │   ├── motif.css             .motif panel + canvas sizing
│   │   ├── home.css              intro, blog heading, cards, thumbnails, footer spacing
│   │   ├── post.css              article shell, post header, blob decoration, page titles
│   │   ├── notes.css             marginpar / marginnote / epigraph
│   │   ├── footer.css
│   │   ├── chroma.css            Chroma class styles (only if §8 item 5 keeps noClasses=false)
│   │   └── print.css
│   └── js/
│       ├── motif.js              port of design_concept/motif.js
│       ├── blobs.js              port of design_concept/blobs.js
│       ├── plotly-init.js        scans .plotly[data-json]
│       └── nav.js                mobile menu toggle only
├── layouts/
│   ├── baseof.html
│   ├── home.html
│   ├── 404.html
│   ├── robots.txt
│   ├── post/
│   │   └── single.html
│   ├── _default/
│   │   ├── single.html           about / publications (and anything non-post)
│   │   ├── rss.xml
│   │   └── section.html          `/post/` redirect stub (§7.6)
│   ├── _markup/
│   │   ├── render-passthrough.html   server-side KaTeX for block math
│   │   └── render-link.html          external links → target/rel (port)
│   ├── partials/
│   │   ├── head.html
│   │   ├── head/meta.html
│   │   ├── head/css.html
│   │   ├── head/js.html
│   │   ├── head/katex.html
│   │   ├── head/plotly.html
│   │   ├── site-header.html
│   │   ├── nav.html
│   │   ├── site-footer.html
│   │   ├── motif.html
│   │   ├── blob.html             emits one <canvas class="post-blob" data-seed=… data-size=…>
│   │   ├── home/intro.html
│   │   ├── post-card.html
│   │   ├── page/header.html      title + date + author + reading time
│   │   └── page/prev-next.html   (optional, only if trivial)
│   └── shortcodes/
│       ├── marginpar.html
│       ├── marginnote.html
│       ├── epigraph.html
│       └── plotly.html
└── static/                       (empty; no local fonts, no images)
```

Notes:
- Do **not** ship `contour.svg`; the animated canvas replaces it. Keep `motif.js`’s static-frame fallback instead.
- Do **not** copy any brewm partial/CSS; only the two JS files and the `render-link` logic are direct ports.
- Use classic `layouts/partials` + `layouts/shortcodes` (not the newer `_partials`) for consistency with the rest of the repo.

---

## 4. Design tokens

`assets/css/tokens.css` — single source of truth. Values from `design_concept/style.css`, with the concept’s duplicate declarations resolved.

```css
:root {
  /* colour */
  --color-bg: #111111;
  --color-text: #ffffff;
  --color-hover: #f4a405;
  --color-motif: #ffffff;
  --color-blob: #9a9a9a;
  --color-rule: #2b2b2b;        /* NEW: card left rule, see §5.2 */
  --color-muted: #9a9a9a;       /* NEW: dates, reading time, footer */

  /* type */
  --font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --fs-logo: 18px;
  --fs-text: 14.5px;
  --fs-note: 14.5px;
  --fs-heading: 34px;
  --fs-body: 15px;              /* NEW: long-form prose, see §6.6 */
  --lh-body: 1.7;
  --fs-margin: 13px;
  --lh-margin: 1.45;

  /* layout */
  --header-h: 73px;
  --motif-w: 50vw;              /* overridden on doc pages */
  --measure: 32rem;             /* prose column */
  --note-w: 15rem;              /* margin-note column */
  --note-gap: 2.5rem;
  --gutter-right: 79px;
  --gutter-left: 34px;
}
```

Rules:
- Dark only. No `prefers-color-scheme` query, no toggle, no `data-theme`.
- No border-radius, no box-shadow, no gradients anywhere.
- Hover = `color: var(--color-hover)`; add the `transition: color .2s ease` the concept forgot (it declared `transition: opacity` but changed `color`).
- `:focus-visible { outline: 2px solid var(--color-text); outline-offset: 4px; }`
- `html { overscroll-behavior-y: none; background: var(--color-bg); }`, `body { overflow-x: hidden; }`
- Breakpoints: **1200 / 1080 / 900 / 600** (same as the concept) plus **375** guard.
- Fix the concept’s contradicting 600-px block: final values `--fs-logo: 15px; --fs-text: 16px; --fs-note: 14px; --fs-heading: 30px`.

---

## 5. Home page

### 5.1 Markup (`layouts/home.html`)

```html
{{ define "main" }}
<main id="home" class="home">
  <h1 class="visually-hidden">{{ site.Title }}</h1>
  {{ partial "home/intro.html" . }}             <!-- .Content of content/_index.md -->
  <section class="blog" aria-labelledby="blog-heading">
    <h2 id="blog-heading">{{ i18n "latestPosts" }}</h2>
    {{ range sort (where site.RegularPages "Section" "post") "Date" "desc" }}
      {{ partial "post-card.html" . }}
    {{ end }}
  </section>
</main>
{{ end }}
```

- `home.html` fills the `main` block of `baseof.html`; the body class (`layout-home`), header, motif and footer come from `baseof`.
- No pagination: every published post is listed. (3 today.)
- `where … "Section" "post"` picks up draft filtering automatically.

### 5.2 Layout CSS (`home.css` + `motif.css`)

Port from the concept verbatim, with these corrections:

| Element | Rule |
|---|---|
| `header.site-header` | `position: fixed; inset: 0 0 auto 0; height: 73px; z-index: 100; background: var(--color-bg); display:flex; justify-content:space-between; align-items:center; padding: 0 43px 0 23px` |
| `aside.motif` | `position: fixed; top: 73px; left: 0; z-index: 0; width: var(--motif-w); height: calc(100vh - 73px); overflow: hidden; pointer-events: none` |
| `#motif-canvas` | `display:block; width: max(var(--motif-w), calc((100vh - 73px) * 0.8229)); aspect-ratio: 748/909; height:auto; max-width:none` |
| `main.home` | `position:relative; z-index:1; margin-left: var(--motif-w); padding: 119px 79px 0 34px; max-width: 46rem` |
| `.intro` | `max-width: 440px; font-size: var(--fs-text); line-height: 22px`; `p { margin: 0 0 22px }` |
| `.blog` | `margin-top: 30px` |
| `.blog h2` | `margin: 0 0 30px; font-size: var(--fs-heading); font-weight: 700; line-height: 1.15; letter-spacing: -.01em` |
| `.post` | `margin-bottom: 63px; padding-left: 20px; border-left: 1px solid var(--color-rule)` ← the thin rule the PNG mockup shows but the concept CSS never implemented |
| `.post-meta` | `display:block; text-align:right; font-size:var(--fs-note); color:var(--color-muted)` |
| `.post h3` | `margin: 34px 0 0; font-size: var(--fs-heading); font-weight: 700; line-height: 44px` |
| `.post-body` | `display:flex; gap:21px; margin-top:26px; align-items:flex-start` |
| `.post-body p` | `flex:1 1 auto; max-width:350px; font-size:var(--fs-text); line-height:19.5px` |
| `.post-figure` | `flex:0 0 244px; width:244px` and `canvas { width:244px; height:208px; display:block }` |
| `footer.site-footer` | `position:relative; z-index:1; background:var(--color-bg); padding:110px 0 28px 24px; font-size:var(--fs-text)`; keep the `::after` 100vh filler so the fixed canvas never shows below the footer |

Responsive corrections (deliberate, documented deviations):

- `≤1200`: heading 40 px / h3 line-height 38 px / figure 200×175 (as concept).
- `≤1080`: `.post-body` becomes `flex-direction: column`; figure **stays visible** at `width:100%; height:200px` (the concept sets `display:none` and never restores it — that is a bug; blobs must remain as the visual signature).
- `≤900`: motif `display:none`; `main { margin-left:0; padding:110px 24px 0 }`; nav gap 20 px.
- `≤600`: header 64 px; nav collapses (see §6.2); main padding `96px 20px 0`; blog `margin-top:64px`; `.post { padding-left:0; border-left:none }` (rule would crowd the text).

### 5.3 `partials/post-card.html`

```html
<article class="post">
  <time class="post-meta" datetime="{{ .Date.Format "2006-01-02" }}">
    {{ .Date | time.Format ":date_long" }}
    <span class="reading-time">· {{ .ReadingTime }} {{ i18n "readingTime" }}</span>
  </time>
  <h3><a href="{{ .RelPermalink }}">{{ .Title }}</a></h3>
  <div class="post-body">
    <p>{{ .Summary | plainify | truncate 320 }}</p>
    <div class="post-figure">{{ partial "blob.html" (dict "seed" .RelPermalink "w" 244 "h" 208) }}</div>
  </div>
</article>
```

- Date and reading time share the right-aligned `.post-meta` line (the mockup has only the date; reading time is a required feature and belongs on that line).
- Seed = `.RelPermalink` (stable and unique); the concept’s hand-written slugs are dropped.
- `.Summary` is used as-is: no `<!--more-->` exists in the content, so Hugo’s automatic 70-word summary applies.

### 5.4 `partials/blob.html`

```html
<canvas class="post-blob" width="{{ .w }}" height="{{ .h }}"
        data-seed="{{ .seed }}" aria-hidden="true"></canvas>
```

CSS controls display size; JS reads CSS pixels via `getBoundingClientRect()` (never the HTML attributes) so DPR handling matches the concept.

---

## 6. Shell, header, footer, notes

### 6.1 `baseof.html`

Minimal skeleton — no background divs, no a11y panel, no colophon:

```html
<!DOCTYPE html>
<html lang="{{ or site.Language.Locale site.Language.LanguageCode "en" }}">
<head>{{ partial "head.html" . }}{{ block "head" . }}{{ end }}</head>
<body class="{{ if .IsHome }}layout-home{{ else if eq .Section "post" }}layout-post{{ else }}layout-doc{{ end }}">
  {{ partial "site-header.html" . }}
  {{ if or .IsHome (ne .Section "post") }}{{ partial "motif.html" . }}{{ end }}
  <main id="{{ .Kind }}" class="page">{{ block "main" . }}{{ end }}</main>
  {{ partial "site-footer.html" . }}
  {{ partialCached "head/js.html" . }}
</body>
</html>
```

- **404 also gets the motif** (`Kind == "404"` is not `post`), matching the “other pages” decision.
- `main` classes differ per body class in CSS; nothing in the markup branches further.

### 6.2 `site-header.html` + `nav.html`

- Fixed, 73 px, opaque `#111`, logo = `{{ site.Title }}` linking `{{ site.Home.RelPermalink }}`.
- Nav loops `site.Menus.main` sorted by weight; each item:
  - `pageRef` entries → `.URL` (Hugo resolves), same tab.
  - `url` entries → `target` from `.Params.target` when present, plus `rel="noopener"` when `_blank`.
- No `pre`/icon font (the `pre = "github"` key is dropped from config).
- **Mobile menu (design addition, no mockup exists):** below 600 px the four links do not fit next to the logo. Add a `<button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">` (three 16×1 px bars, no icon font) and `nav.js` toggling `aria-expanded` + `.is-open` on `#site-nav`, which renders as a full-width `#111` panel under the header. Panel closes on `Escape`, on link click, and on `matchMedia('(min-width:601px)')`. Without JS the nav stays visible inline (progressive enhancement: `.nav { display:flex }` default, JS adds `.js-nav` to the button).
- ≥601 px: button `display:none`, nav inline with `gap:56px` (20 px ≤900, 11 px ≤600 until collapse).

### 6.3 `site-footer.html`

```html
<footer class="site-footer"><p>{{ site.Copyright | default (printf "© %d %s" now.Year site.Title) }}</p></footer>
```

- Config copyright becomes `Copyright 2026 © Titouan Renard` (matches the mockup).
- No footer menu, no copyright credit, no “powered by”.

### 6.4 Motif on doc pages

- Home: `--motif-w: 50vw`.
- `.layout-doc`: `--motif-w: 34vw`; `main { margin-left: var(--motif-w); padding: 119px 79px 0 34px }`; motif hidden `≤1200` (the note gutter needs the width).
- Rationale: about/publications use margin notes and must fit `measure + note-w` in the right-hand area (at 1440 px: 806 px available vs 762 px needed).

### 6.5 Post page shell (`layouts/post/single.html`)

```html
{{ define "main" }}
<article class="post-article" id="main-article">
  <header class="post-header">
    {{ partial "blob.html" (dict "seed" .RelPermalink "w" 280 "h" 240) }}
    <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date | time.Format ":date_long" }}</time>
    <h1>{{ .Title }}</h1>
    <p class="post-byline">
      {{ with (or .Params.author site.Params.author.name) }}{{ . }}{{ end }}
      <span>· {{ .ReadingTime }} {{ i18n "readingTime" }}</span>
    </p>
  </header>
  <div class="content">{{ .Content }}</div>
</article>
{{ end }}
```

- Blob is a decoration: right-aligned above the title (`.post-header .post-blob { width:280px; height:240px; margin-left:auto; display:block }`), hidden `≤600` if it crowds the title.
- Header/footer identical to the home page; **no motif**, `main` is centered.
- No breadcrumbs, no TOC, no related posts, no share, no author taxonomy.
- `.content img { max-width:100%; height:auto }`; tables `border-collapse:collapse` with 1 px `--color-rule` rules; because the IO tables are wider than the measure, style `.content table { display:block; overflow-x:auto; max-width:100% }` so they scroll inside the column instead of breaking the page layout.

### 6.6 Post typography + Tufte grid

```
.post-article {
  width: calc(var(--measure) + var(--note-gap) + var(--note-w));  /* 32 + 2.5 + 15 = 49.5rem */
  max-width: calc(100% - 48px);
  margin: 0 auto;
  padding: 119px 0 110px;
}
.post-header, .content > * { max-width: var(--measure); }
.content { font-size: var(--fs-body); line-height: var(--lh-body); }
```

- Prose `15px/1.7` (the card excerpt stays `14.5/19.5`); `h1` 34 px, `h2` 26 px, `h3` 20 px, all 700, `letter-spacing:-.01em`.
- First-level headings inside posts (`#` in content) must not outrank the post `h1`: render `#` as ~30 px and `##` as 24 px via `.content h1/h2` sizing rather than relying on browser defaults.
- `≤1080`: note gutter collapses (see §6.7) and `.post-article` becomes `max-width: var(--measure) + 48px`.
- `.layout-post main` is centered with `padding: 0 24px`; the blob header keeps the page visually anchored.

### 6.7 Margin notes (`notes.css` + shortcodes)

Port the markup contract, drop the brewm variables:

```css
.post-article, .doc-article { counter-reset: marginnote; }

.note-ctrl {                     /* hidden checkbox, unchanged from brewm */
  position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none;
}
.note-marker {                   /* visually hidden on desktop, still rendered → counters work */
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip-path: inset(50%); white-space: nowrap;
}
.note-marker--number { counter-increment: marginnote; }  /* only marginnote consumes a number */
.note-marker--glyph::before { content: "∗"; }

.marginpar {
  float: right; clear: right;
  width: var(--note-w);
  margin-right: calc(-1 * (var(--note-w) + var(--note-gap)));
  margin-top: 0; margin-bottom: 1em;
  font-size: var(--fs-margin);
  line-height: var(--lh-margin);
  font-style: italic;
  color: var(--color-text);
}
.marginpar.abs { float: none; clear: none; width: auto; margin: 0 0 1.5em; padding-left: var(--note-gap); }
.note-marker--number + .marginpar::before {
  content: "[" counter(marginnote) "]";
  margin-right: .35em; font-style: normal; font-size: .85em; color: var(--color-muted);
}

@media (max-width: 1080px) {
  .marginpar {
    display: none; float: none; width: auto;
    margin: 0 0 1em; font-size: var(--fs-margin); font-style: normal;
    color: var(--color-muted);
  }
  .note-marker {                    /* becomes a tappable superscript marker */
    position: static; width: auto; height: auto; clip-path: none;
    overflow: visible; display: inline; vertical-align: super;
    font: .7rem/1 var(--font-sans); color: var(--color-hover);
    cursor: pointer; padding: 0 2px;
  }
  .note-marker--number::before { content: "[" counter(marginnote) "]"; }
  .note-ctrl:checked + .note-marker + .marginpar { display: block; }
}
```

- Shortcode classes: `marginpar` label → `class="note-marker note-marker--glyph"`; `marginnote` label → `class="note-marker note-marker--number"`. The counter is incremented by the label, which precedes the note in document order, so both the marker and the note show the same `[n]`.
- On mobile both markers are tappable and expand the note inline; on desktop the marker is invisible and the note is always in the gutter.
- The labels must stay rendered (clipped, not `display:none`) on desktop so CSS counters increment. **Verify** numbering 1..25 on `gaillard_oct_2025`; if the counter proves unreliable, drop numbering entirely (keep notes unnumbered) rather than adding JS.
- `.epigraph`: blockquote, `font-size: .95em; color: var(--color-muted); border-left: 1px solid var(--color-rule); padding-left: 1.25rem; margin: 2rem 0`, `footer` right-aligned italic.
- Notes inside `<li>` rely on float + negative margin; check `about.md` (19 notes) and `gaillard` (25) for stacking and no overlap with the next block. If floats misbehave inside list items, fall back to brewm’s relative-position technique (`position:relative; left:calc(note-w+gap); margin-left:calc(note-w*-1)`).

### 6.8 Doc pages (`layouts/_default/single.html`)

Same shell as posts but with the motif, and no blob:

```html
{{ define "main" }}
<article class="doc-article" id="main-article">
  <header><h1>{{ .Title }}</h1></header>
  <div class="content">{{ .Content }}</div>
</article>
{{ end }}
```

- `.doc-article { width: calc(var(--measure) + var(--note-gap) + var(--note-w)); max-width: calc(100% - 96px); }`
- Title styling identical to post `h1`; no date/author (these pages have none).
- About/publications headings keep the content’s `###`/`####` hierarchy → map to 22 px / 17 px, uppercase-free, with `margin-top: 2.2em`.

### 6.9 `i18n/en.toml`

Only: `latestPosts = "Latest posts:"`, `readingTime = "min read"`, `returnHome = "Return home"`, `notFound = "Page not found"`, `marginNote = "Margin note"`. No other string is needed.

### 6.10 Shortcode contracts (exact markup)

`layouts/shortcodes/marginpar.html`:

```go-html-template
{{- $arg := .Get 0 }}
{{- $abs := eq $arg "abs" }}
{{- $force := eq $arg "safeHTML" }}
{{- $id := printf "marginpar-%d" .Ordinal }}
<input id="{{ $id }}" class="note-ctrl" type="checkbox" aria-label="{{ i18n "marginNote" }}" aria-controls="the-{{ $id }}">
<label for="{{ $id }}" class="note-marker note-marker--glyph" tabindex="0" aria-controls="the-{{ $id }}" aria-label="{{ i18n "marginNote" }}"></label>
{{- if $abs }}
<div id="the-{{ $id }}" class="marginpar abs" role="note">{{ if $force }}{{ safeHTML .Inner }}{{ else }}{{ markdownify .Inner }}{{ end }}</div>
{{- else }}
<span id="the-{{ $id }}" class="marginpar" role="note">{{ if $force }}{{ safeHTML .Inner }}{{ else }}{{ markdownify .Inner }}{{ end }}</span>
{{- end }}
```

`layouts/shortcodes/marginnote.html`: identical except `marginnote-` id prefix and `class="note-marker note-marker--number"`.

Rules:
- Element order **must** be `input`, `label`, `note` — the CSS uses adjacent-sibling selectors.
- Do **not** put the `hidden` attribute on the input (brewm does, which makes it unfocusable): `.note-ctrl` already hides it via CSS, and keeping it focusable makes Space/Enter toggling work.
- Keep the `abs` / `safeHTML` positional arguments and the `markdownify`/`safeHTML` branches even though current content never uses them — they are part of the content contract and cost nothing.
- `layouts/shortcodes/epigraph.html`: port brewm’s version unchanged (named `pre`, `cite`, `post`, `link`; `markdownify .Inner`), keeping `role="doc-epigraph"` and the `.epigraph` class.

---

## 7. Head, assets, feeds, 404

### 7.1 `partials/head.html`

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{{ partial "head/meta.html" . }}
{{ partial "head/css.html" . }}
{{ with .OutputFormats.Get "rss" }}<link rel="alternate" type="application/rss+xml" href="{{ .Permalink }}" title="{{ site.Title }}">{{ end }}
{{ if .Params.plotly }}{{ partial "head/plotly.html" . }}{{ end }}
{{ if .Page.Store.Get "hasMath" }}<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css" integrity="sha384-WcoG4HRXMzYzfCgiyfrySxx90XSl2rxY5mnVY5TwtWE6KLrArNKn0T/mOgNL0Mmi" crossorigin="anonymous">{{ end }}
{{ if .Params.math }}{{ partial "head/katex.html" . }}{{ end }}
```

- `{{ $noop := .WordCount }}` **must** appear before the `hasMath` check: it forces content rendering so the `render-passthrough` hook can set `.Page.Store "hasMath"`. (This is why brewm’s `single.html` has that line; reproduce it in `head.html` or `baseof.html`.)
- No `analytics` partial, no social cards, no manifest beyond the one added in §10 (Phase 6).

### 7.2 `head/meta.html`

- `<title>{{ if .IsHome }}{{ site.Title }}{{ else }}{{ .Title }} — {{ site.Title }}{{ end }}</title>`
- `<meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ site.Params.description }}{{ end }}">`
- canonical: `<link rel="canonical" href="{{ .Permalink }}">`
- Google Fonts (see decision 7):
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
  ```
  Use `<link>` rather than the concept’s `@import` so the request is discovered in the initial HTML parse.
- favicons: reuse the config map, but emit **absolute** URLs (`absURL`) — the current theme’s relative paths break on `/post/<slug>/`:
  - `favicon.ico`, `favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`, `manifest` (`/site.webmanifest`), `appTitle` as `<meta name="apple-mobile-web-app-title">` + `<meta name="theme-color" content="#111111">`.

### 7.3 `head/css.html` / `head/js.html`

Concretely:

```go-html-template
{{- $files := slice
    (resources.Get "css/tokens.css")
    (resources.Get "css/base.css")
    (resources.Get "css/header.css")
    (resources.Get "css/motif.css")
    (resources.Get "css/home.css")
    (resources.Get "css/post.css")
    (resources.Get "css/notes.css")
    (resources.Get "css/footer.css")
    (resources.Get "css/print.css") }}
{{- $css := $files | resources.Concat "css/lyapunov-dark.css" | minify | fingerprint "sha256" }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}">
```

Same pattern for JS in `head/js.html`:

```go-html-template
{{- $files := slice (resources.Get "js/motif.js") (resources.Get "js/blobs.js") (resources.Get "js/plotly-init.js") (resources.Get "js/nav.js") }}
{{- $js := $files | resources.Concat "js/lyapunov-dark.js" | minify | fingerprint "sha256" }}
<script src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}" defer></script>
```

Load order matters for Plotly: `head/plotly.html` (CDN, `defer`) must be emitted **before** the bundle so the deferred scripts execute in document order; `plotly-init.js` additionally guards with `if (!window.Plotly) return`.

### 7.4 `head/katex.html` (inline `$…$` + fallback renderer)

Keep the current runtime behaviour exactly — the config only server-renders `\[…\]` and `$$…$$`; inline `$…$` is client-side:

```html
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.js" integrity="…" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/contrib/auto-render.min.js"
        integrity="…" crossorigin="anonymous"
        onload="renderMathInElement(document.getElementById('main-article') || document.body, {delimiters:[{left:'$',right:'$',display:false},{left:'$$',right:'$$',display:true},{left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true}],throwOnError:false});"></script>
```

- `onload` + `defer` is what the current theme does; keep the delimiters identical (including `\begin{equation}`/`\begin{align}`) to avoid regressions.
- Do **not** add `$…$` to `markup.goldmark.extensions.passthrough` — the economics text contains dollar amounts and that would break during the build.

### 7.5 `plotly` integration

`head/plotly.html`:

```html
<script src="https://cdn.plot.ly/plotly-3.0.1.min.js" defer></script>
<style>svg { display: inherit; }</style>
```

`shortcodes/plotly.html`:

```go-html-template
{{- $json := .Get "json" -}}
{{- $h := .Get "height" | default "400px" -}}
<div id="plotly-{{ .Ordinal }}" class="plotly"
     data-json="{{ $json | relURL }}" style="height:{{ $h }}; width:100%"></div>
```

`assets/js/plotly-init.js`:

```js
(function () {
  'use strict';
  function init() {
    if (!window.Plotly) return;
    document.querySelectorAll('.plotly[data-json]').forEach(function (el) {
      fetch(el.dataset.json).then(function (r) { return r.json(); }).then(function (fig) {
        var layout = fig.layout || {};
        layout.modebar = { orientation: 'h' };
        layout.margin = { l: 0, r: 0, t: 40, b: 40 };
        Plotly.newPlot(el.id, fig.data, layout, { displaylogo: false, responsive: true });
      }).catch(function (e) { console.error('plotly:', el.dataset.json, e); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
```

- Preserves the current behaviours: horizontal modebar, zeroed L/R margins, no logo, responsive.
- Improvement over the current shortcode: DOM-safe ids (no `/` or `.` inside an `id`), one shared loader instead of re-declaring `loadPlotly` per figure, and `relURL` so it behaves under any `baseURL` subpath.
- Plot files stay in `static/plots/`; no content changes.

### 7.6 `/post/` removal

`/post/` must stop being a listing but must keep working, and `/post/index.xml` must keep existing (RSS discovery for the section).

1. Create `content/post/_index.md`:
   ```yaml
   ---
   title: Posts
   _build:
     list: never
   ---
   ```
   (`list: never` hides it from any listing; `render` stays enabled so the section’s RSS output is still produced.)
2. Add `layouts/_default/section.html` as a redirect stub:

   ```html
   <!DOCTYPE html><html lang="en"><head>
   <meta charset="utf-8">
   <title>Redirecting…</title>
   <link rel="canonical" href="{{ site.Home.Permalink }}">
   <meta http-equiv="refresh" content="0; url={{ site.Home.RelPermalink }}">
   </head><body>
   <p><a href="{{ site.Home.RelPermalink }}">{{ i18n "returnHome" }}</a></p>
   </body></html>
   ```

   This template is only reachable for sections; `/post/` is currently the only section in the site (there is no `content/posts/`).

3. If a host-level 301 is preferred over a client-side redirect: switch to `_build: {render: never}` on the section plus `aliases: ["/post/"]` on the home page — but that **deletes `/post/index.xml`**, so only do it if the section feed is declared expendable.

Verify: `ls public/post/index.html public/post/index.xml` both exist; the listing markup is gone; `/post/<slug>/` unchanged; the draft is still reachable at `/post/comparative_cost/` under `--buildDrafts`.

### 7.7 RSS

Port the current `rss.xml` semantics but simplified and fixed:

- `title`: `{{ with .Title }}{{ . }} — {{ end }}{{ site.Title }}` (fixes the empty `<title></title>` caused by `site.Title` being unset — also fixed globally in §8).
- Items: `where site.RegularPages "Section" "post"`, then `first (default 15 site.Params.RSS.limit)`; full `.Content` only for the first `default 15 site.Params.RSS.content` items.
- `<dc:creator>` from `.Params.author` → `site.Params.author.name`.
- Author email in `managingEditor`/`webMaster` from `site.Params.author.email`.
- `<copyright>` from `site.Copyright`; `<language>en</language>`.
- No enclosure/social image, no translations block.

### 7.8 `robots.txt`

Keep the two things the site currently produces: sitemap line + AI-crawler block.

```go-html-template
Sitemap: {{ "sitemap.xml" | absURL }}
User-agent: *
Disallow:

{{- if not site.Params.AllowAIRobots }}
  {{- $url := "https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/main/robots.json" }}
  {{- with try (resources.GetRemote $url) }}
    {{- with .Err }}{{ warnf "robots.txt: %s" . }}{{ else }}
      {{- range $ua, $_ := (unmarshal .Value.Content) }}
User-agent: {{ $ua }}
Disallow: /
      {{- end }}
    {{- end }}
  {{- end }}
{{- end }}
```

- Fixes the current bug where only one `Disallow: /` is emitted at the very end for all agents.
- Wrapping in `try` means an offline build warns instead of failing (today it hard-fails).

### 7.9 Sitemap

Use Hugo’s built-in sitemap — **no theme template**. The site already sets `[sitemap] changeFreq = 'monthly'`. Verify the output contains exactly: `/`, `/about/`, `/publications/`, 3 post URLs (drafts excluded, no `/post/`, no `/page/1/`).

### 7.10 404

`layouts/404.html`: full shell, motif visible, centered:

```html
<main class="page notfound">
  <h1>404</h1>
  <p>{{ i18n "notFound" }} — <a href="{{ site.Home.RelPermalink }}">{{ i18n "returnHome" }}</a></p>
</main>
```

No `meta refresh`. Uses `layout-doc` styling so the motif panel is present.

---

## 8. Site config changes (`hugo.toml`)

Apply items **1, 2, 5, 7, 8 in Phase 1** — the `theme` switch cannot be deferred, because only one theme can be active at a time. Apply items **3, 4, 6 in Phase 4** once the new templates render.

1. Add top-level `title = "Titouan Renard"` (fixes empty RSS titles and `<title>`).
2. `theme = 'lyapunov-dark'`.
3. Menu: add Home (weight 0, `pageRef = "/"`), rename `About (CV)` → `CV` (keep `pageRef = "about"`), keep Publications, keep GitHub; delete `pre = "github"`; keep the `params.target = "_blank"` nesting on the GitHub entry.
4. Keep: `baseURL`, `enableGitInfo`, `canonifyURLs`, `relativeURLs`, `defaultContentLanguage`, `enableRobotsTXT`, `ignoreFiles`, `[markup]`, `[sitemap]`.
5. `markup.highlight`: set `noClasses = true` unless `chroma.css` is shipped (decision: prefer `noClasses = true` — zero CSS cost, no content currently uses code fences).
6. Prune `[params]` to what the new theme reads:
   - keep `title`, `description`, `copyright` (→ `Copyright 2026 © Titouan Renard`), `AllowAIRobots`, `author.name`, `author.email`, `favicon.*`, `RSS.limit`, `RSS.content`.
   - delete `HideHugoCredit`, `extMeta`, `coffeeStat`, `ZenMode`, `DisableFootBar`, `unifiedFooter`, `analytics`, `comments`, `feed`, `home`, `logo`, `posts`, `search`, `socialCard`, `typeface`.
   - document in `README.md` that these keys are no longer read.
7. Delete `config.toml` (shadowed by `hugo.toml`; it holds a stale GitHub URL).
8. Remove `hugo.toml` from `.gitignore` (it is tracked but ignored — an edit can silently not be staged).

---

## 9. Content changes

Small and exact:

### 9.1 `content/_index.md`

```markdown
I am **Titouan Renard** a political economy student at UNIGE with a background in robotics and artificial intelligence. Before political economy, I was mostly interested in optimal control, reinforcement learning and learning theory. Nowadays I am mostly interested in heterodox international economics, crises and complexity economics. I also make websites.

This is my website, it serves to list of my publications and as my CV.

To contact me, write me a mail at:

titouan.renard[at]gmail.com.

This website is also a blog, the posts are listed on this page.
```

- Verbatim from `design_concept/index.html` (including the slightly awkward “serves to list of my publications”).
- Drop the entire front matter: no `cover`, no `keepAspectRatio`, no `aliases` (the `/post/` redirect is handled by `layouts/_default/section.html`, §7.6).
- `portrait.jpeg` stays in `static/images/` unused (do not delete user assets).

### 9.2 `content/about.md`

- Delete line 6, the remote flowline image (`https://raw.githubusercontent.com/foxihd/hugo-et-hd/.../22.svg`). Nothing else changes.
- Keep `keepAspectRatio` removal (unused key).

### 9.3 `content/publications.md`

- No changes.

### 9.4 `content/post/*`

- No content changes. Do not add `type`, `toc`, `description`, or `cover`.
- Leave `meta = true` in place (now unused; removing it is churn).

### 9.5 `content/post/_index.md`

- New file, see §7.6.

### 9.6 `content/assets/css/custom.css`

- Delete. It is brewm-specific (a11y/contrast selectors, cookie banner) and is not even in Hugo’s asset path today (it lives under `content/`, so `resources.Get "css/custom.css"` never finds it).

---

## 10. Implementation phases (subagent split)

Give every subagent: this file, the design_concept path, and the file-ownership list. Only Phase 1 and Phase 4 are strictly sequential.

### Phase 1 — Foundation (1 agent, sequential)

Files: `themes/lyapunov-dark/{theme.toml,hugo.toml,LICENSE,README.md,archetypes/default.md,i18n/en.toml}`, `assets/css/{tokens,base,header,footer,print}.css`, `layouts/baseof.html`, `layouts/partials/{head.html,head/meta.html,head/css.html,head/js.html,site-header.html,nav.html,site-footer.html}`, `assets/js/nav.js`.

Also create **stub files** (empty or one-line placeholder) for every other file listed in §3 — every CSS/JS entry in the `head/css.html` + `head/js.html` slices, `head/katex.html`, `head/plotly.html`, `shortcodes/plotly.html`, `_markup/*`, `rss.xml`, `robots.txt`, `section.html`, `404.html`, `home.html`, `post/single.html`, `_default/single.html`. `head.css/html` references the whole slices from the first commit, so missing files would break every build in Phases 2–3. Phases 2–4 then *replace* stubs, never create new paths, which keeps ownership unambiguous.

In this phase also: switch `theme = 'lyapunov-dark'` in `hugo.toml` (§8 items 1, 2, 5, 7, 8) and **delete the site-level `layouts/partials/head.html`** — it wins over the theme’s head partial and would otherwise mask every head change. Plotly figures and KaTeX are expected to be non-functional from this point until Phase 3; that is the only intentional regression window.

Done when: `hugo --gc --minify` succeeds, every page returns a dark page with the correct header/footer, CSS+JS bundles are fingerprinted, no reference to `hugo-brewm` remains in the theme.

### Phase 2 — Parallel feature work (3 agents)

Files do not overlap. Each agent creates its own partial/CSS/JS files; the shared contract is fixed here.

**Agent A — home**
`layouts/home.html`, `layouts/partials/home/intro.html`, `layouts/partials/post-card.html`, `assets/css/home.css`.

**Agent B — single pages & notes**
`layouts/post/single.html`, `layouts/_default/single.html`, `layouts/partials/page/header.html`, `layouts/shortcodes/{marginpar,marginnote,epigraph}.html`, `assets/css/{post,notes}.css`.

**Agent C — canvas & interactions**
`layouts/partials/{motif.html,blob.html}`, `assets/css/motif.css`, `assets/js/{motif.js,blobs.js}`.

Shared contracts (must be in the Phase 1 scaffolding so all three agents can build against it):

| Contract | Producer | Consumer |
|---|---|---|
| `<aside class="motif"><canvas id="motif-canvas">` | C | A (via `baseof`) |
| `<canvas class="post-blob" data-seed="…">` | C | A, B |
| `#motif-canvas` absent ⇒ motif.js no-ops | C | all |
| `.post-blob` absent ⇒ blobs.js no-ops | C | all |
| `--color-motif` / `--color-blob` read from `:root` | tokens.css (P1) | C |
| `data-size` via CSS, JS measures `getBoundingClientRect()` | C | A, B |

### Phase 3 — Math, Plotly, redirect, feeds (1 agent, sequential)

`layouts/partials/{head/katex.html,head/plotly.html}`, `layouts/shortcodes/plotly.html`, `assets/js/plotly-init.js`, `layouts/_markup/render-passthrough.html`, `layouts/_markup/render-link.html`, `layouts/_default/rss.xml`, `layouts/_default/section.html`, `layouts/robots.txt`, `layouts/404.html`, `content/post/_index.md`.

Done when: all 6 Plotly figures render, block math is server-rendered, inline `$…$` renders client-side, `/post/` redirects while `/post/index.xml` still exists, 404 has the motif, RSS titles are non-empty.

### Phase 4 — Content edits + config finalisation (1 agent, sequential)

`hugo.toml` (menu + params pruning, §8 items 3, 4, 6), `content/_index.md` (prose + drop front matter), `content/about.md` (drop the remote flowline), delete `layouts/shortcodes/plotly.html` (the theme provides it), delete `content/assets/css/custom.css`, delete `config.toml`.

Must run **after** Phase 3, because it deletes the site-level `plotly` shortcode override that the pages currently use.

### Phase 5 — Responsive & interaction polish (1 agent)

Only edits `assets/css/*.css` and `assets/js/nav.js`. Verifies breakpoints 1512 / 1280 / 1200 / 1080 / 900 / 600 / 375, mobile nav, note expansion, reduced-motion static frame, print CSS.

### Phase 6 — Repo hygiene (1 agent, last)

- `git rm -r --cached public && rm -rf public`, add `public/` to `.gitignore`.
- Delete `.github/workflows/static.yml` (keep only `hugo.yaml`); align `HUGO_VERSION` with the version the theme is validated against (0.160.1 locally, currently 0.152.2 in CI) and keep `--gc --minify`.
- Remove the submodule: `git submodule deinit -f themes/hugo-brewm && git rm -f themes/hugo-brewm && rm -rf .git/modules/themes/hugo-brewm`, delete `.gitmodules` (or leave empty if other submodules exist — none do).
- Remove `hugo.toml` from `.gitignore`.
- Assets: add `static/site.webmanifest` (name/short_name from config, `theme_color`/`background_color` `#111111`, icons `favicon-96x96.png` + `web-app-manifest-192x192.png`) and create `static/images/apple-touch-icon.png` (180×180, derived from `favicon.png` with `sips -z 180 180`).
- Verify no build references `foxihd`, `hugo-brewm`, `flowlines`, or `content/assets`.

### Phase 7 — Verification (1 agent, no edits)

Run the checklist in §11 and report.

---

## 11. Acceptance checklist

**Build**

- [ ] `hugo --gc --minify` exits 0 with no ERROR lines (warnings allowed only for the robots fetch offline).
- [ ] `hugo --buildDrafts` also succeeds and renders `/post/comparative_cost/` (proves the shortcode surface is complete).
- [ ] `public/` contains exactly the URLs in §2.2; no `/post/` listing, no `/page/`, no `/tags/`.
- [ ] No output references `hugo-brewm`, `foxihd`, `bionread`, `accessibility`, `pagefind`, `giscus`.

**Home**

- [ ] 5 intro paragraphs, heading “Latest posts:”, 3 cards sorted newest-first: `recap_neoclassical_trade_theory` (2026-01-01), `basics_of_input_output` (2025-10-31), `gaillard_oct_2025` (2025-10-10).
- [ ] Each card: right-aligned date + reading time, bold link title, excerpt, 244×208 seeded blob.
- [ ] Blobs are deterministic across reloads and differ between posts.
- [ ] Motif animates; with `prefers-reduced-motion: reduce` it renders one frame and stops.
- [ ] Left panel does not show under the footer when over-scrolling.

**Posts**

- [ ] `basics_of_input_output`: 1 Plotly at 500 px, tables not overflowing, block math server-rendered.
- [ ] `gaillard_oct_2025`: 3 Plotly at 400 px, 25 notes + 2 marginpars in the right gutter, no overlap.
- [ ] `recap_neoclassical_trade_theory`: 2 Plotly at 700 px, epigraph renders with `pre`/`cite`/`post`, 4 notes.
- [ ] Inline `$…$` is rendered by KaTeX (no visible raw dollar math after load).
- [ ] Blob decoration appears above the title; no motif panel.
- [ ] No breadcrumbs/TOC/related/share blocks.

**About / publications**

- [ ] All 19 + 3 `marginpar` dates appear in the gutter; PDF links resolve (`/documents/...`).
- [ ] Motif panel visible at 1440 px, hidden ≤1200 px, text never overlaps it.

**Responsive**

- [ ] 1512 / 1280 / 1200 / 1080 / 900 / 600 / 375 px: no horizontal scroll on any page (check the wide tables in `gaillard`/`recap`).
- [ ] ≤600 px: hamburger opens/closes, `aria-expanded` flips, Escape closes.
- [ ] ≤1080 px: margin notes hidden, marker expands on tap, marker is keyboard-activatable (label has `tabindex="0"`).

**Feeds & metadata**

- [ ] `/index.xml` has a non-empty `<title>Titouan Renard</title>` and 15-item limit honoured.
- [ ] `/post/index.xml` still exists; `/post/` serves a redirect stub to `/` with no listing markup.
- [ ] `/sitemap.xml` has 6 URLs, `changefreq monthly`.
- [ ] `/robots.txt` emits `Sitemap:` and per-agent `Disallow: /` blocks.
- [ ] Favicons/manifest resolve from `/post/<slug>/` (absolute paths).
- [ ] 404 shows the motif and a working link home, no redirect.

**Visual fidelity** (compare against the mockup PNG at 1512 px)

- [ ] Header 73 px, logo left, nav right (`Home / CV / Publications / Github`), hover `#f4a405` + underline on nav.
- [ ] Home: motif occupies the left 50vw; text column starts at 50vw with 34 px left padding.
- [ ] Card left rule, right-aligned date, 34 px bold title, 350 px excerpt.
- [ ] Footer copyright bottom-left, no other chrome.
- [ ] Only `#111111`, `#ffffff`, `#f4a405`, `#9a9a9a` on screen (plus `--color-rule` for hairlines).

---

## 12. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Float-based margin notes overlap inside `<li>`/`<p>` (35+ uses) | Verify `about` (19) and `gaillard` (25); fallback = brewm’s relative-position technique; last resort = mobile-style expandable notes on desktop too |
| CSS counters break if the marker is `display:none` | Marker is clipped, not removed, on desktop; verify 1..25 numbering |
| `.Page.Store "hasMath"` empty at head time | Keep `{{ $noop := .WordCount }}` before the check (same trick as brewm) |
| Inline `$…$` only renders client-side (flash of TeX) | Accepted (matches today); optionally keep `$…$` out of passthrough config to avoid build breakage on dollar amounts |
| Google Fonts blocked/offline → fallback stack | `system-ui` fallback in `--font-sans`; no layout depends on exact metrics |
| Plotly JSON 404s under a `baseURL` subpath | `relURL` in the shortcode, `data-json` read via `fetch` |
| `/post/` must stop listing but keep its RSS | `_build.list: never` on the section + `_default/section.html` meta-refresh; do **not** use `_build.render: never`, which would delete `/post/index.xml` |
| Fixed motif bleeding below the footer on bounce overscroll | Keep `overscroll-behavior-y:none` + footer `::after` 100vh filler |
| Two Pages workflows deploying different trees | Delete `static.yml`, untrack `public/` (Phase 6) |
| Removing the brewm submodule breaks a working build mid-refactor | Do it last, after Phase 4 is green |
| Wide IO tables overflow the post column | `table { display:block; overflow-x:auto }`, `min-width:0` on flex/grid children |
| Reading time/date line deviates from the mockup | Accepted: reading time is a required feature; it joins the date line |

---

## 13. What “done” looks like (visual summary)

```
1512 px home
┌───────────────────────────┬──────────────────────────────────────┐
│ Titouan Renard      Home CV Publications Github                    │ 73px fixed
├───────────────────────────┼──────────────────────────────────────┤
│                           │ I am Titouan Renard …                │
│      ╱╲ animated          │                                      │
│     ╱  ╲ contour          │ Latest posts:                        │
│    ╱    ╲ (canvas)        │ ┌──────────────────────────────      │
│                           │ │ Jan 1, 2026 · 12 min read           │
│                           │ │ A Critical Engagement …        ▟    │
│                           │ │ excerpt…                  blob ┘    │
│                           │ └──────────────────────────────      │
│                           │ Copyright 2026 © Titouan Renard      │
└───────────────────────────┴──────────────────────────────────────┘

post page
        ┌─────────────── measure 32rem ───────────────┬── notes 15rem ──┐
        │                         ▟ blob              │                 │
        │ Jan 1, 2026                                 │                 │
        │ A Critical Engagement with Neoclassical …    │     [1] note    │
        │ Titouan Renard · 12 min read                 │     [2] note    │
        │ body text …        $inline$  $$block$$       │                 │
        │ [plotly …………………………………………]                │                 │
        └──────────────────────────────────────────────┴─────────────────┘
```

---

## 14. Explicitly out of scope

Accessibility panel (contrast levels, colour-vision palettes, font size, baseline stretch, OpenDyslexic/BionRead, focus mode, screen-reader mode), light mode / theme toggle, search & Pagefind, comments (Giscus/Fediverse), share buttons, related posts, colophon/QR, redaction history, slide carousel, taxonomy carousel and taxonomy pages, featured listings, network graph, multilingual/i18n switcher, social cards/OpenGraph/Twitter/Schema.org, analytics, coffee metric, TOC, breadcrumbs, pagination, `include`/`figure`/`theorem`/`tabular`/`network-graph`/`rss`/`section`/`vis-network` shortcodes, fullscreen layouts, headless/alias redirect pages beyond `/post/`, and any change to the publications/CV prose.

If a later request needs one of these, it is a new feature, not a parity fix.
