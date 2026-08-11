# Builder-Morphe — Downloads

Static GitHub Pages site for [`Erlikx/Builder-Morphe`](https://github.com/Erlikx/Builder-Morphe).

Fetches the repo's latest GitHub release client-side (`GET /repos/Erlikx/Builder-Morphe/releases/latest`),
matches each asset to a configured app, and renders download links + Obtainium deep links.
No backend, no build step — three static files.

## Files

- `index.html` — page shell, loads `style.css` and `script.js`
- `style.css` — all styling
- `script.js` — app config (mirrors `lib/config.py` in the main repo), release fetching, rendering

## Deploy

1. Push this repo's contents to the repo root (or a `docs/` folder).
2. In **Settings → Pages**, set the source to that branch/folder.
3. Done — no Actions workflow required, it's pure client-side fetch.

## Keeping app data in sync

`script.js` hardcodes `DISPLAY_NAMES`, `APPS_CONFIG`, `PROCESS_ORDER`, and `PATCH_SOURCES` to match
`lib/config.py` in the main repo. When an app is added, removed, or its patch set changes there,
update the same objects here.
