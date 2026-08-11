// ============================================================
// Builder-Morphe — Downloads page
// Fetches the latest GitHub release and renders it. All app
// data below mirrors lib/config.py in the Builder-Morphe repo —
// keep them in sync when apps are added/removed there.
// ============================================================

const OWNER = "Erlikx";
const REPO = "Builder-Morphe";
const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
const DEFAULT_VISIBLE = 5;

const DISPLAY_NAMES = {
  "youtube": "YouTube", "youtube-music": "YT.Music", "reddit": "Reddit",
  "twitter": "Twitter", "instagram": "Instagram", "gboard": "Gboard",
  "speedtest": "Speedtest", "brave": "Brave", "proton-vpn": "Proton VPN",
  "tiktok": "TikTok", "warp": "1.1.1.1", "inshot": "InShot",
  "google-photos": "Google Photos",
};

const APPS_CONFIG = {
  "youtube": { pkg: "com.google.android.youtube", patch_source: "morphe",
    icon: "https://cdn.simpleicons.org/youtube/FF0000", exclude: [] },
  "youtube-music": { pkg: "com.google.android.apps.youtube.music", patch_source: "morphe",
    icon: "https://cdn.simpleicons.org/youtubemusic/FF0000", exclude: [] },
  "reddit": { pkg: "com.reddit.frontpage", patch_source: "morphe",
    icon: "https://cdn.simpleicons.org/reddit/FF4500", exclude: [] },
  "twitter": { pkg: "com.twitter.android", patch_source: "piko",
    icon: "https://cdn.simpleicons.org/x/000000",
    exclude: ["Dynamic color"],
    enable: ["Bring back twitter", "Disunify xchat system", "Export all activities"] },
  "instagram": { pkg: "com.instagram.android", patch_source: "piko",
    icon: "https://cdn.simpleicons.org/instagram/E4405F", exclude: [] },
  "gboard": { pkg: "com.google.android.inputmethod.latin", patch_source: "jasonwu",
    icon: "https://cdn.simpleicons.org/google/4285F4",
    exclude: ["Zhuyin Bottom Row Key Sizes", "Zhuyin Quick Traditional/Simplified Toggle", "Zhuyin Slide Input"] },
  "speedtest": { pkg: "org.zwanoo.android.speedtest", patch_source: "rushi",
    icon: "https://www.google.com/s2/favicons?sz=128&domain=speedtest.net", exclude: [] },
  "brave": { pkg: "com.brave.browser", patch_source: "bufferk",
    icon: "https://cdn.simpleicons.org/brave/FB542B", exclude: [] },
  "proton-vpn": { pkg: "ch.protonvpn.android", patch_source: "hoodles",
    icon: "https://cdn.simpleicons.org/protonvpn", exclude: [] },
  "tiktok": { pkg: "com.zhiliaoapp.musically", patch_source: "tiktok",
    icon: "https://cdn.simpleicons.org/tiktok", exclude: [] },
  "warp": { pkg: "com.cloudflare.onedotonedotonedotone", patch_source: "rushi",
    icon: "https://cdn.simpleicons.org/1dot1dot1dot1", exclude: [] },
  "inshot": { pkg: "com.camerasideas.instashot", patch_source: "hooman",
    icon: "https://www.google.com/s2/favicons?sz=128&domain=inshot.com", exclude: [] },
  "google-photos": { pkg: "com.google.android.apps.photos", patch_source: "rushi",
    icon: "https://cdn.simpleicons.org/googlephotos",
    exclude: [],
    enable: ["AMOLED dark theme", "Change package name", "Enable DCIM folders backup control",
             "Fix DCIM folder classification", "Spoof features", "GmsCore support"] },
};

const PROCESS_ORDER = ["youtube", "youtube-music", "reddit", "twitter", "instagram", "gboard",
  "speedtest", "brave", "proton-vpn", "tiktok", "warp", "inshot", "google-photos"];

const PATCH_SOURCES = {
  "morphe": ["MorpheApp", "morphe-patches", "Morphe"],
  "piko": ["crimera", "piko", "Piko"],
  "adobo": ["jkennethcarino", "adobo", "Adobo"],
  "rushi": ["rushiranpise", "morphe-patches", "Rushiranpise"],
  "bufferk": ["bufferk", "morphe-patches", "Bufferk"],
  "hoodles": ["hoo-dles", "morphe-patches", "hoo-dles"],
  "tiktok": ["icysymmetra", "tiktok-patches-for-morphe", "TikTok Patches"],
  "hooman": ["arandomhooman", "hoomans-morphe-patches", "Hooman's Patches"],
  "jasonwu": ["jasonwu1994", "Gboard-patches", "JasonWu Gboard"],
};

const NAME_TO_KEY = {};
Object.entries(DISPLAY_NAMES).forEach(([key, name]) => { NAME_TO_KEY[name] = key; });

const SRC_COLORS = {
  morphe: "#4c9eff", piko: "#a78bfa", adobo: "#f48b3a", rushi: "#e8a838",
  bufferk: "#f06b8a", hoodles: "#23d18b", tiktok: "#18d4c8", hooman: "#d46ff0", jasonwu: "#5ab8f5",
};
const CHART_COLORS = ["#4c9eff", "#23d18b", "#f48b3a", "#a57cf5", "#e8a838", "#f06b8a",
  "#18d4c8", "#7cc84e", "#d46ff0", "#5ab8f5", "#f0c240", "#60c88a", "#ef6f6c"];

const fmt = (n) => Number(n || 0).toLocaleString("en-US");
const fmtDt = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
const fmtSz = (b) => (b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB");

// Same normalize-and-match algorithm as finalize_release.py's match_asset().
function normalize(s) { return s.replace(/[ ._-]+/g, "").toLowerCase(); }
function matchAsset(fileName) {
  if (!fileName.toLowerCase().endsWith(".apk")) return null;
  if (fileName.toLowerCase().startsWith("microg")) return null;
  const base = fileName.slice(0, -4);
  const lastDash = base.lastIndexOf("-");
  if (lastDash === -1) return null;
  const namePart = base.slice(0, lastDash);
  const versionPart = base.slice(lastDash + 1);
  const normalizedNamePart = normalize(namePart);
  for (const [name, key] of Object.entries(NAME_TO_KEY)) {
    if (normalize(name) === normalizedNamePart) return { appKey: key, version: versionPart };
  }
  return null;
}

function buildObtainiumLink(appKey, cfg, displayName) {
  const filter = "^" + displayName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "-";
  const payload = {
    id: cfg.pkg,
    url: REPO_URL,
    author: OWNER,
    name: displayName + " (patched)",
    preferredApkIndex: 0,
    additionalSettings: JSON.stringify({
      apkFilterRegEx: filter,
      invertAPKFilter: false,
      autoApkFilterByArch: false,
      trackOnly: false,
      about: `Patched via ${REPO}`,
    }),
    overrideSource: "GitHub",
  };
  return "obtainium://app/" + encodeURIComponent(JSON.stringify(payload));
}

function dlIcon(s = 12) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 16 16" fill="currentColor"><path d="M7.47 10.78a.75.75 0 001.06 0l3.75-3.75a.75.75 0 00-1.06-1.06L8.75 8.44V1.75a.75.75 0 00-1.5 0v6.69L4.78 5.97a.75.75 0 00-1.06 1.06l3.75 3.75zM1.75 13.5a.75.75 0 000 1.5h12.5a.75.75 0 000-1.5H1.75z"/></svg>`;
}
function chevSvg(s = 10) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 16 16" fill="currentColor"><path d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"/></svg>`;
}
function extIcon(s = 11) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 16 16" fill="currentColor"><path d="M3.75 2h3.5a.75.75 0 010 1.5h-3.5a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25v-3.5a.75.75 0 011.5 0v3.5A1.75 1.75 0 0112.25 14h-8.5A1.75 1.75 0 012 12.25v-8.5C2 2.784 2.784 2 3.75 2zm6.854-1h4a.75.75 0 01.75.75v4a.75.75 0 01-1.5 0V2.56l-5.22 5.22a.75.75 0 01-1.06-1.06L12.44 1.5h-1.836a.75.75 0 010-1.5z"/></svg>`;
}

async function fetchLatestRelease() {
  const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.message || `HTTP ${r.status}`);
  return d;
}

let _release = null, _sort = "downloads", _filterSource = "all", _query = "";

function buildAppRows(release) {
  const assets = Array.isArray(release.assets) ? release.assets : [];
  let microgAsset = null;
  const matchedByKey = {};

  assets.forEach((asset) => {
    if (asset.name.toLowerCase() === "microg.apk") { microgAsset = asset; return; }
    const m = matchAsset(asset.name);
    if (m) matchedByKey[m.appKey] = { version: m.version, asset };
  });

  const rows = PROCESS_ORDER.map((appKey) => {
    const cfg = APPS_CONFIG[appKey];
    const displayName = DISPLAY_NAMES[appKey];
    const match = matchedByKey[appKey];
    return {
      appKey, cfg, displayName,
      version: match ? match.version : null,
      asset: match ? match.asset : null,
      downloads: match ? match.asset.download_count : 0,
      size: match ? match.asset.size : 0,
    };
  });

  return { rows, microgAsset };
}

function render() {
  const release = _release;
  const { rows, microgAsset } = buildAppRows(release);

  const totalDl = rows.reduce((s, r) => s + r.downloads, 0) + (microgAsset ? microgAsset.download_count : 0);
  const publishedRows = rows.filter((r) => r.asset);
  const topRow = publishedRows.length
    ? publishedRows.reduce((a, b) => (a.downloads > b.downloads ? a : b))
    : null;
  const sourceCount = new Set(Object.values(APPS_CONFIG).map((c) => c.patch_source)).size;

  // filter + sort
  let visible = rows.filter((r) => {
    if (_filterSource !== "all" && r.cfg.patch_source !== _filterSource) return false;
    if (_query) {
      const q = _query.toLowerCase();
      if (!r.displayName.toLowerCase().includes(q) && !r.cfg.pkg.toLowerCase().includes(q)) return false;
    }
    return true;
  });
  if (_sort === "downloads") visible = [...visible].sort((a, b) => b.downloads - a.downloads);
  if (_sort === "name") visible = [...visible].sort((a, b) => a.displayName.localeCompare(b.displayName));
  if (_sort === "size") visible = [...visible].sort((a, b) => b.size - a.size);

  const maxDl = Math.max(...rows.map((r) => r.downloads), 1);

  // chart: downloads by app, published apps only, always sorted desc for the chart itself
  const chartRows = [...publishedRows]
    .sort((a, b) => b.downloads - a.downloads)
    .map((r, i) => ({ ...r, color: CHART_COLORS[i % CHART_COLORS.length] }));
  const maxChart = Math.max(...chartRows.map((r) => r.downloads), 1);

  const chartRowsHTML = chartRows
    .map((r, i) => `
      <div class="bar-row ${i >= DEFAULT_VISIBLE ? "hidden" : ""}" data-chart-idx="${i}">
        <div class="bar-lbl"><span class="bar-tag">${r.displayName}</span><span class="bar-date">v${r.version}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round((r.downloads / maxChart) * 100)}%;background:${r.color}"></div></div>
        <span class="bar-cnt">${fmt(r.downloads)}</span>
      </div>`)
    .join("");
  const chartToggleHTML = chartRows.length > DEFAULT_VISIBLE
    ? `<button class="chart-toggle" onclick="toggleChart()">${chevSvg(10)} Show all ${chartRows.length} apps</button>`
    : "";

  function rankCls(i) { return i === 0 ? "r1" : i === 1 ? "r2" : i === 2 ? "r3" : "r-other"; }

  function assetRow(r, sectionIdx) {
    const src = PATCH_SOURCES[r.cfg.patch_source];
    const srcLabel = src ? src[2] : r.cfg.patch_source;
    const srcColor = SRC_COLORS[r.cfg.patch_source] || "#4c9eff";
    const pct = Math.round((r.downloads / maxDl) * 100);
    const obLink = r.asset ? buildObtainiumLink(r.appKey, r.cfg, r.displayName) : null;
    const hasDiff = (r.cfg.enable && r.cfg.enable.length) || (r.cfg.exclude && r.cfg.exclude.length);
    const diffId = `diff-${r.appKey}`;

    let diffToggleHTML = "";
    if (hasDiff) {
      const bits = [];
      if (r.cfg.enable && r.cfg.enable.length) bits.push(`<span class="plus">+${r.cfg.enable.length}</span>`);
      if (r.cfg.exclude && r.cfg.exclude.length) bits.push(`<span class="minus">-${r.cfg.exclude.length}</span>`);
      diffToggleHTML = `
        <button class="diff-toggle" aria-expanded="false" data-target="${diffId}" onclick="toggleDiff(event,'${diffId}')">
          ${bits.join(" ")} patches <span class="chev2">&#9656;</span>
        </button>`;
    }

    return `
      <div class="asset-item ${r.asset ? "is-apk" : "is-pending"}">
        <div class="asset-row">
          <div class="asset-info">
            <span class="rank-dot ${rankCls(sectionIdx)}">${sectionIdx + 1}</span>
            <div class="asset-icon"><img src="${r.cfg.icon}" alt="" loading="lazy" onerror="this.style.opacity=0"></div>
            <span class="asset-name" title="${r.displayName}">${r.displayName}</span>
            ${r.asset ? `<span class="asset-version">v${r.version}</span>` : `<span class="asset-version missing">not in latest build</span>`}
            <span class="src-tag" style="background:${srcColor}22;color:${srcColor}">${srcLabel}</span>
            ${diffToggleHTML}
          </div>
          <div class="btn-stack">
            <a class="dl-btn apk-dl" ${r.asset ? `href="${r.asset.browser_download_url}"` : `aria-disabled="true" href="#"`}>
              ${dlIcon(12)} Download
            </a>
            <a class="dl-btn ob-btn" ${obLink ? `href="${obLink}"` : `aria-disabled="true" href="#"`}>
              + Obtainium
            </a>
          </div>
          <div class="asset-stats">
            <span class="sz-lbl">${r.asset ? fmtSz(r.size) : "—"}</span>
            <div class="dl-bar-wrap">
              <div class="dl-bar"><div class="dl-bar-fill" style="width:${pct}%"></div></div>
              <span class="dl-count">${fmt(r.downloads)}</span>
              <span class="dl-count-note">dls</span>
            </div>
          </div>
          ${hasDiff ? `<div class="diff-detail" id="${diffId}"></div>` : ""}
        </div>
      </div>`;
  }

  const appsBody = visible.length
    ? visible.map((r, i) => assetRow(r, i)).join("")
    : `<div class="no-asset">No apps match this filter.</div>`;

  const microgBody = microgAsset
    ? `<div class="asset-item is-mod">
        <div class="asset-row">
          <div class="asset-info">
            <span class="rank-dot r-other">1</span>
            <div class="asset-icon" style="font-size:13px;display:flex;align-items:center;justify-content:center;">🔧</div>
            <span class="asset-name">MicroG</span>
            <span class="asset-version">companion runtime</span>
          </div>
          <div class="btn-stack">
            <a class="dl-btn mod-dl" href="${microgAsset.browser_download_url}">${dlIcon(12)} Download</a>
          </div>
          <div class="asset-stats">
            <span class="sz-lbl">${fmtSz(microgAsset.size)}</span>
            <div class="dl-bar-wrap">
              <div class="dl-bar"><div class="dl-bar-fill" style="width:100%;background:${SRC_COLORS.hoodles}"></div></div>
              <span class="dl-count">${fmt(microgAsset.download_count)}</span>
              <span class="dl-count-note">dls</span>
            </div>
          </div>
        </div>
      </div>`
    : "";

  const sourceOpts = Object.entries(PATCH_SOURCES)
    .map(([key, s]) => `<option value="${key}">${s[2]}</option>`)
    .join("");

  document.getElementById("root").innerHTML = `
    <div class="hd">
      <div class="brand">
        <div class="brand-ico">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </div>
        <div class="brand-tx">
          <div class="brand-owner">${OWNER}</div>
          <div class="brand-repo">${REPO}</div>
        </div>
      </div>
      <button class="ref-btn" onclick="loadData()">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3a5 5 0 105 5 .75.75 0 011.5 0 6.5 6.5 0 11-6.5-6.5h.75V.25a.25.25 0 01.427-.177l2.5 2.5a.25.25 0 010 .354l-2.5 2.5A.25.25 0 018.75 5.25V3H8z"/></svg>
        Refresh
      </button>
    </div>
    <div class="update-pill">${dlIcon(12)} Published ${fmtDt(release.published_at)}</div>

    <div class="guide" id="setup-guide">
      <div class="guide-toggle" onclick="toggleGuide()">
        <div class="guide-toggle-l">
          <div class="guide-icon">📖</div>
          <div>
            <div class="guide-label">How to Install</div>
            <div class="guide-sub">Direct download or auto-updating — tap to expand</div>
          </div>
        </div>
        <span class="guide-chev">▾</span>
      </div>
      <div class="guide-body">
        <div class="guide-grid">
          <div class="guide-card apk">
            <div class="guide-card-hd">
              <div class="guide-card-ico">📦</div>
              <div>
                <div class="guide-card-title">Direct install</div>
                <span class="guide-card-tag">One-time download</span>
              </div>
            </div>
            <ul class="guide-steps">
              <li class="guide-step"><span class="guide-step-num">1</span><span>If you have the Play Store version installed, uninstall it — patched builds use a different signing key.</span></li>
              <li class="guide-step"><span class="guide-step-num">2</span><span>Tap <strong>Download</strong> on any app below and allow installs from your browser when prompted.</span></li>
              <li class="guide-step"><span class="guide-step-num">3</span><span>For <strong>Google Photos</strong>, install MicroG first — it relies on it for backup and account features.</span></li>
            </ul>
            <div class="guide-deps">
              <span class="guide-dep-label">Optional dependency</span>
              <a class="dep-link microg" href="${REPO_URL}#readme" target="_blank" rel="noopener">
                ${extIcon(11)} MicroG <span class="dep-badge">below</span>
              </a>
            </div>
          </div>
          <div class="guide-card mod">
            <div class="guide-card-hd">
              <div class="guide-card-ico">🔁</div>
              <div>
                <div class="guide-card-title">Obtainium</div>
                <span class="guide-card-tag">Auto-updates</span>
              </div>
            </div>
            <ul class="guide-steps">
              <li class="guide-step"><span class="guide-step-num">1</span><span>Install <strong>Obtainium</strong> from its releases page or F-Droid.</span></li>
              <li class="guide-step"><span class="guide-step-num">2</span><span>Tap <strong>+ Obtainium</strong> on any app — it opens with the repo and filename filter already filled in.</span></li>
              <li class="guide-step"><span class="guide-step-num">3</span><span>Confirm the add. One release holds every app, so the filter keeps it locked to the right file.</span></li>
            </ul>
            <div class="guide-deps">
              <span class="guide-dep-label">Get it</span>
              <a class="dep-link detach" href="https://github.com/ImranR98/Obtainium/releases" target="_blank" rel="noopener">
                ${extIcon(11)} Obtainium <span class="dep-badge">releases</span>
              </a>
            </div>
          </div>
        </div>
        <div class="guide-note">
          <span class="guide-note-ico">💡</span>
          <span>Every build is checked against a pinned signing certificate before it's published — trust-on-first-use, same model Obtainium and F-Droid use.</span>
        </div>
      </div>
    </div>

    <div class="metrics">
      <div class="met"><div class="met-lbl">Total Downloads</div><div class="met-val blue">${fmt(totalDl)}</div><div class="met-sub">all assets</div></div>
      <div class="met"><div class="met-lbl">Apps</div><div class="met-val green">${rows.length}</div><div class="met-sub">${publishedRows.length} published</div></div>
      <div class="met"><div class="met-lbl">Patch Sources</div><div class="met-val">${sourceCount}</div></div>
      <div class="met"><div class="met-lbl">Latest</div><div class="met-val sm">${release.tag_name}</div><div class="met-sub">${fmtDt(release.published_at)}</div></div>
    </div>

    ${topRow ? `
    <div class="banner">
      <span class="banner-star">★</span>
      Most downloaded: <code>${topRow.displayName}</code> · <strong>${fmt(topRow.downloads)} downloads</strong>
    </div>` : ""}

    <div class="legend">
      <span class="legend-label">Key</span>
      <div class="legend-item"><span class="legend-swatch apk"></span>📦 Patched APK — install directly or track with Obtainium</div>
      <div class="legend-item"><span class="legend-swatch mod"></span>🔧 Companion — supporting runtime, install alongside</div>
    </div>

    ${chartRows.length ? `
    <div class="chart-card">
      <div class="sec-hd">
        <span class="sec-title">Downloads by App</span>
        <span class="sec-hint">most → least</span>
      </div>
      <div id="chart-rows">${chartRowsHTML}</div>
      ${chartToggleHTML}
    </div>` : ""}

    <div class="search-box">
      <div class="search-input-wrap" id="searchWrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="searchInput" placeholder="Search apps or package names…" value="${_query}">
        <button type="button" id="searchClearBtn" aria-label="Clear search" onclick="setQuery('')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>

    <div class="controls">
      <div class="ctl-l">
        <span class="ctl-lbl">Source</span>
        <select id="fsel" onchange="setFilterSource(this.value)">
          <option value="all">All sources</option>
          ${sourceOpts}
        </select>
        <button class="srt-btn ${_sort === "downloads" ? "on" : ""}" onclick="setSort('downloads')">Downloads</button>
        <button class="srt-btn ${_sort === "name" ? "on" : ""}" onclick="setSort('name')">Name</button>
        <button class="srt-btn ${_sort === "size" ? "on" : ""}" onclick="setSort('size')">Size</button>
      </div>
      <span class="ctl-count">${visible.length} / ${rows.length}</span>
    </div>

    <div class="rel-card" id="rel-card">
      <div class="rel-hd" onclick="tog('rel-card')">
        <div class="rel-hd-l">
          <div class="rel-tag-row">
            <span class="rel-tag">${release.tag_name}</span>
            <span class="chev">▾</span>
          </div>
          <div class="rel-meta">
            <span>${fmtDt(release.published_at)}</span>
            <span class="sep"></span>
            <span class="dl-pill">${dlIcon(10)} ${fmt(totalDl)} downloads</span>
          </div>
        </div>
        <div class="rel-hd-r">
          <span class="badge b-latest">Latest</span>
          ${release.prerelease ? `<span class="badge b-pre">Pre-release</span>` : ""}
        </div>
      </div>
      <div class="rel-body">
        <div class="asset-section">
          <div class="asset-section-hd">
            <div class="asset-section-ico apk">📦</div>
            <span class="asset-section-name apk">Patched APKs</span>
            <span class="asset-section-desc">${rows.length} apps · direct install or track with Obtainium</span>
          </div>
          ${appsBody}
        </div>
        ${microgAsset ? `
        <div class="asset-section">
          <div class="asset-section-hd">
            <div class="asset-section-ico mod">🔧</div>
            <span class="asset-section-name mod">Companion</span>
            <span class="asset-section-desc">Required by Google Photos</span>
          </div>
          ${microgBody}
        </div>` : ""}
      </div>
    </div>

    <footer class="site">
      Built by an unattended GitHub Actions run. No analytics, no trackers. ·
      <a href="${REPO_URL}" target="_blank" rel="noopener">${OWNER}/${REPO}</a>
    </footer>
  `;

  document.getElementById("fsel").value = _filterSource;

  // fill diff details
  rows.forEach((r) => {
    const el = document.getElementById(`diff-${r.appKey}`);
    if (!el) return;
    (r.cfg.enable || []).forEach((p) => {
      const d = document.createElement("div"); d.className = "l-add"; d.textContent = "+ " + p; el.appendChild(d);
    });
    (r.cfg.exclude || []).forEach((p) => {
      const d = document.createElement("div"); d.className = "l-rem"; d.textContent = "- " + p; el.appendChild(d);
    });
  });

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => setQuery(e.target.value));
  document.getElementById("searchWrap").classList.toggle("has-value", !!_query);
}

function tog(id) { const el = document.getElementById(id); if (el) el.classList.toggle("collapsed"); }
function toggleGuide() { const g = document.getElementById("setup-guide"); if (g) g.classList.toggle("open"); }
function toggleDiff(evt, id) {
  evt.stopPropagation();
  const btn = evt.currentTarget;
  const expanded = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", String(!expanded));
  document.getElementById(id).classList.toggle("open", !expanded);
}
function setSort(s) { _sort = s; render(); }
function setFilterSource(v) { _filterSource = v; render(); }
function setQuery(v) {
  _query = v;
  const wrap = document.getElementById("searchWrap");
  if (wrap) wrap.classList.toggle("has-value", !!v);
  render();
  const input = document.getElementById("searchInput");
  if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
}

function toggleChart() {
  const btn = document.querySelector(".chart-toggle");
  if (!btn) return;
  const rows = document.querySelectorAll("[data-chart-idx]");
  const isExpanded = btn.classList.contains("expanded");
  rows.forEach((row) => {
    const idx = parseInt(row.dataset.chartIdx, 10);
    if (isExpanded) { if (idx >= DEFAULT_VISIBLE) row.classList.add("hidden"); }
    else row.classList.remove("hidden");
  });
  btn.classList.toggle("expanded");
  btn.innerHTML = `${chevSvg(10)} ${isExpanded ? `Show all ${rows.length} apps` : "Show less"}`;
}

async function loadData() {
  document.getElementById("root").innerHTML = `<div class="state"><div class="spin"></div><br>Fetching release data…</div>`;
  try {
    _release = await fetchLatestRelease();
    render();
    const g = document.getElementById("setup-guide");
    if (g) g.classList.add("open");
  } catch (e) {
    document.getElementById("root").innerHTML = `
      <div class="state err">
        GitHub API error: ${e.message}<br>
        This is usually a rate limit — try again in a bit, or open the
        <a href="${REPO_URL}/releases/latest" target="_blank" rel="noopener" style="color:var(--acc-text)">release page</a> directly.
        <br><br>
        <button class="ref-btn" onclick="loadData()">Try again</button>
      </div>`;
  }
}

loadData();
