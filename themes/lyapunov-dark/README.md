# lyapunov-dark

A dark, minimal, typographic Hugo theme: an animated contour motif on the left of
the home page, seeded blob thumbnails on post cards, and Tufte-style margin notes
in the right gutter.

## Install

Copy (or clone) this directory to `themes/lyapunov-dark` in your site, then set:

```toml
theme = 'lyapunov-dark'
```

Requires Hugo extended >= 0.146.0.

## Config keys read by the theme

Top level:

| Key | Used for |
|---|---|
| `title` | site title in the header, `<title>`, RSS |
| `baseURL` | absolute favicon / sitemap URLs |
| `enableRobotsTXT` | emits `robots.txt` from the theme template |

`[params]`:

| Key | Used for |
|---|---|
| `description` | default `<meta name="description">` |
| `copyright` | footer line |
| `AllowAIRobots` | when `false`, `robots.txt` also blocks AI crawlers |
| `author.name` | post byline fallback |
| `author.email` | RSS `managingEditor` / `webMaster` |
| `favicon.ico`, `favicon.svg`, `favicon.png`, `favicon.apple`, `favicon.webmanifest`, `favicon.appTitle` | `<head>` icon links (emitted as absolute URLs) |
| `RSS.limit` | number of RSS items (default 15) |
| `RSS.content` | number of items with full content (default 15) |

`[menu.main]` entries: `pageRef` or `url`, `name`, `weight`; an optional
`[menu.main.params] target = "_blank"` adds `target` + `rel="noopener"`.

All other keys from previous themes (`HideHugoCredit`, `extMeta`, `coffeeStat`,
`ZenMode`, `DisableFootBar`, `unifiedFooter`, `analytics`, `comments`, `feed`,
`home`, `logo`, `posts`, `search`, `socialCard`, `typeface`) are **not read**.

## Content contracts

- **Post front matter**: `title`, `date`, `draft`, `author`, `math = true`,
  `plotly = true`. Posts live under `content/post/`.
- **Pages**: `about`, `publications` and anything else outside `post/` render
  with the contour motif and no date/byline.
- **Shortcodes**:
  - `{{</* marginpar */>}}…{{</* /marginpar */>}}` — unnumbered note in the right gutter.
  - `{{</* marginnote */>}}…{{</* /marginnote */>}}` — numbered note in the right gutter.
  - Optional positional `abs` (full-width note) and `safeHTML` (raw inner HTML).
  - `{{</* epigraph pre="…" cite="…" post="…" */>}}…{{</* /epigraph */>}}`.
  - `{{</* plotly json="plots/X.json" height="400px" */>}}` — JSON figures live in `static/plots/`.
- **Math**: `$$…$$` and `\[…\]` are server-rendered; inline `$…$` is rendered in
  the browser by KaTeX when `math = true` is set in front matter.
- **Code**: syntax highlighting is emitted as inline styles (`noClasses = true`),
  so no Chroma stylesheet is needed.

## License

MIT © Titouan Renard — see `LICENSE`.
