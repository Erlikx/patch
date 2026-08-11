/* ==========================================================
   Erlikx Store — reads the latest GitHub release of
   Erlikx/Builder-Morphe and renders it as a catalog.
   ========================================================== */

const CONFIG = {
  owner: "Erlikx",
  repo: "Builder-Morphe",
  cacheMinutes: 10,
};

// Mirrors lib/config.py in Builder-Morphe
const APPS = [
  { key: "youtube", name: "YouTube", pkg: "com.google.android.youtube", icon: "https://cdn.simpleicons.org/youtube/FF0000", source: "morphe" },
  { key: "youtube-music", name: "YT.Music", pkg: "com.google.android.apps.youtube.music", icon: "https://cdn.simpleicons.org/youtubemusic/FF0000", source: "morphe" },
  { key: "reddit", name: "Reddit", pkg: "com.reddit.frontpage", icon: "https://cdn.simpleicons.org/reddit/FF4500", source: "morphe" },
  { key: "twitter", name: "Twitter", pkg: "com.twitter.android", icon: "https://cdn.simpleicons.org/x/ffffff", source: "piko", enable: ["Bring back twitter", "Disunify xchat system", "Export all activities"], exclude: ["Dynamic color"] },
  { key: "instagram", name: "Instagram", pkg: "com.instagram.android", icon: "https://cdn.simpleicons.org/instagram/E4405F", source: "piko" },
  { key: "gboard", name: "Gboard", pkg: "com.google.android.inputmethod.latin", icon: "https://cdn.simpleicons.org/google/4285F4", source: "jasonwu" },
  { key: "speedtest", name: "Speedtest", pkg: "org.zwanoo.android.speedtest", icon: "https://www.google.com/s2/favicons?sz=128&domain=speedtest.net", source: "rushi" },
  { key: "brave", name: "Brave", pkg: "com.brave.browser", icon: "https://cdn.simpleicons.org/brave/FB542B", source: "bufferk" },
  { key: "proton-vpn", name: "Proton VPN", pkg: "ch.protonvpn.android", icon: "https://cdn.simpleicons.org/protonvpn/ffffff", source: "hoodles" },
  { key: "tiktok", name: "TikTok", pkg: "com.zhiliaoapp.musically", icon: "https://cdn.simpleicons.org/tiktok/ffffff", source: "tiktok" },
  { key: "warp", name: "1.1.1.1", pkg: "com.cloudflare.onedotonedotonedotone", icon: "https://cdn.simpleicons.org/1dot1dot1dot1/ffffff", source: "rushi" },
  { key: "inshot", name: "InShot", pkg: "com.camerasideas.instashot", icon: "https://www.google.com/s2/favicons?sz=128&domain=inshot.com", source: "hooman" },
  { key: "google-photos", name: "Google Photos", pkg: "com.google.android.apps.photos", icon: "https://cdn.simpleicons.org/googlephotos", source: "rushi", enable: ["AMOLED dark theme", "Change package name", "Enable DCIM folders backup control", "Fix DCIM folder classification", "Spoof features", "GmsCore support"] },
];

const SOURCES = {
  morphe: { label: "Morphe", color: "#29d9c2", repo: "MorpheApp/morphe-patches" },
  piko: { label: "Piko", color: "#ff6fa5", repo: "crimera/piko" },
  rushi: { label: "Rushiranpise", color: "#ffc65c", repo: "rushiranpise/morphe-patches" },
  bufferk: { label: "Bufferk", color: "#7c6cff", repo: "bufferk/morphe-patches" },
  hoodles: { label: "hoo-dles", color: "#6bcb77", repo: "hoo-dles/morphe-patches" },
  tiktok: { label: "TikTok Patches", color: "#ff4d6d", repo: "icysymmetra/tiktok-patches-for-morphe" },
  hooman: { label: "Hooman's Patches", color: "#4da6ff", repo: "arandomhooman/hoomans-morphe-patches" },
  jasonwu: { label: "JasonWu", color: "#c77dff", repo: "jasonwu1994/Gboard-patches" },
};

const APPS_BY_KEY = Object.fromEntries(APPS.map(a => [a.key, a]));

let state = { catalog: [], filterSource: "all", search: "", sort: "name" };

const $ = sel => document.querySelector(sel);

function normalize(str) {
  return str.replace(/[ ._-]+/g, "").toLowerCase();
}

function matchAsset(fileName) {
  if (!fileName.toLowerCase().endsWith(".apk")) return null;
  if (fileName.toLowerCase().startsWith("microg")) return null;
  const base = fileName.slice(0, -4);
  const dashIdx = base.indexOf("-");
  if (dashIdx === -1) return null;
  const namePart = normalize(base.slice(0, dashIdx));
  const versionPart = base.slice(dashIdx + 1);
  const app = APPS.find(a => normalize(a.name) === namePart);
  if (!app) return null;
  return { app, version: versionPart };
}

function formatBytes(bytes) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "az önce";
  if (h < 24) return `${h} saat önce`;
  const d = Math.floor(h / 24);
  return `${d} gün önce`;
}

async function loadCatalog() {
  const cacheKey = `es_cache_${CONFIG.owner}_${CONFIG.repo}`;
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    if (cached && Date.now() - cached.at < CONFIG.cacheMinutes * 60000) {
      renderCatalog(cached.data, cached.publishedAt);
      return;
    }
  } catch (_) { /* ignore cache errors */ }

  try {
    const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const release = await res.json();

    const catalog = [];
    for (const asset of release.assets || []) {
      const matched = matchAsset(asset.name);
      if (!matched) continue;
      catalog.push({
        key: matched.app.key,
        version: matched.version,
        size: asset.size,
        downloadUrl: asset.browser_download_url,
        publishedAt: asset.updated_at || release.published_at,
      });
    }

    localStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), data: catalog, publishedAt: release.published_at }));
    renderCatalog(catalog, release.published_at);
  } catch (err) {
    showError(err);
  }
}

function showError(err) {
  $("#loading").hidden = true;
  const box = $("#errorBox");
  box.hidden = false;
  box.textContent = `Katalog yüklenemedi: ${err.message}. GitHub API oran sınırına takılmış olabilirsiniz — birazdan tekrar deneyin.`;
  setStatus("err", "Yüklenemedi");
}

function setStatus(kind, text) {
  $("#statusDot").className = `status-dot ${kind}`;
  $("#statusText").textContent = text;
}

function buildSourceChips() {
  const used = [...new Set(APPS.map(a => a.source))];
  const wrap = $("#sourceChips");
  used.forEach(key => {
    const src = SOURCES[key];
    if (!src) return;
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.type = "button";
    btn.dataset.source = key;
    btn.innerHTML = `<span class="chip-dot" style="background:${src.color}"></span>${src.label}`;
    btn.addEventListener("click", () => {
      state.filterSource = key;
      document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === btn));
      renderGrid();
    });
    wrap.appendChild(btn);
  });
  wrap.querySelector('[data-source="all"]').addEventListener("click", e => {
    state.filterSource = "all";
    document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === e.currentTarget));
    renderGrid();
  });
}

function renderCatalog(catalog, publishedAt) {
  state.catalog = catalog;
  $("#loading").hidden = true;
  $("#grid").hidden = false;
  setStatus("ok", `Güncel · ${timeAgo(publishedAt)}`);
  $("#footerUpdated").textContent = publishedAt ? `Son derleme: ${new Date(publishedAt).toLocaleString("tr-TR")}` : "";
  renderGrid();
}

function renderGrid() {
  let items = [...state.catalog];

  if (state.filterSource !== "all") {
    items = items.filter(i => APPS_BY_KEY[i.key].source === state.filterSource);
  }
  if (state.search.trim()) {
    const q = state.search.trim().toLowerCase();
    items = items.filter(i => APPS_BY_KEY[i.key].name.toLowerCase().includes(q));
  }

  items.sort((a, b) => {
    const appA = APPS_BY_KEY[a.key], appB = APPS_BY_KEY[b.key];
    if (state.sort === "name") return appA.name.localeCompare(appB.name);
    if (state.sort === "size") return (b.size || 0) - (a.size || 0);
    if (state.sort === "source") return SOURCES[appA.source].label.localeCompare(SOURCES[appB.source].label);
    return 0;
  });

  const grid = $("#grid");
  grid.innerHTML = "";
  $("#emptyState").hidden = items.length !== 0;
  $("#countLine").textContent = `${items.length} uygulama`;

  items.forEach(item => grid.appendChild(renderCard(item)));
}

function renderCard(item) {
  const app = APPS_BY_KEY[item.key];
  const src = SOURCES[app.source];
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card glass";
  card.innerHTML = `
    <div class="card-top">
      <img class="card-icon" src="${app.icon}" alt="" loading="lazy" onerror="this.style.opacity=0.3">
      <div>
        <p class="card-name">${app.name}</p>
        <p class="card-version mono">v${item.version}</p>
      </div>
    </div>
    <div class="card-meta">
      <span class="source-tag"><span class="source-dot" style="background:${src.color}"></span>${src.label}</span>
      <span>${formatBytes(item.size)}</span>
    </div>
  `;
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  });
  card.addEventListener("click", () => openDetail(item));
  return card;
}

function obtainiumUrl(app) {
  const cfg = {
    id: app.pkg,
    url: `https://github.com/${CONFIG.owner}/${CONFIG.repo}`,
    author: CONFIG.owner,
    name: app.name,
    additionalSettings: JSON.stringify({
      apkFilterRegEx: `^${app.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-`,
      includePrereleases: false,
      fallbackToOlderReleases: true,
    }),
  };
  const encoded = encodeURIComponent(JSON.stringify(cfg));
  return `obtainium://add/${cfg.url}?config=${encoded}`;
}

function openDetail(item) {
  const app = APPS_BY_KEY[item.key];
  const src = SOURCES[app.source];
  $("#detailIcon").src = app.icon;
  $("#detailTitle").textContent = app.name;
  $("#detailVersion").textContent = `v${item.version}`;

  let extra = "";
  if (app.enable?.length) {
    extra += `<p class="muted" style="margin-top:14px">Etkinleştirilen özel yamalar:</p><div class="tag-list">${app.enable.map(p => `<span>${p}</span>`).join("")}</div>`;
  }
  if (app.exclude?.length) {
    extra += `<p class="muted" style="margin-top:14px">Devre dışı bırakılan yamalar:</p><div class="tag-list">${app.exclude.map(p => `<span>${p}</span>`).join("")}</div>`;
  }

  $("#detailBody").innerHTML = `
    <div class="detail-row"><span>Paket adı</span><span class="mono">${app.pkg}</span></div>
    <div class="detail-row"><span>Yama kaynağı</span><span>${src.label} · <a href="https://github.com/${src.repo}" target="_blank" rel="noopener noreferrer">${src.repo}</a></span></div>
    <div class="detail-row"><span>Dosya boyutu</span><span>${formatBytes(item.size)}</span></div>
    ${extra}
  `;

  $("#detailDownload").href = item.downloadUrl;
  $("#detailDownload").setAttribute("download", `${app.name}-${item.version}.apk`);
  $("#detailObtainium").onclick = () => openObtainium(app);

  openModal("#detailModal");
}

function openObtainium(app) {
  const url = obtainiumUrl(app);
  $("#obtLink").value = url;
  $("#obtOpen").href = url;
  $("#obtCopy").onclick = () => {
    navigator.clipboard.writeText(url).then(() => showToast("Bağlantı kopyalandı"));
  };
  openModal("#obtainiumModal");
}

function openModal(sel) {
  const el = $(sel);
  el.hidden = false;
  el.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => el.classList.add("open"));
}
function closeModal(el) {
  el.classList.remove("open");
  el.setAttribute("aria-hidden", "true");
  setTimeout(() => { el.hidden = true; }, 250);
}

function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove("show"), 2200);
}

function initEvents() {
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(overlay); });
    overlay.querySelector(".modal-close")?.addEventListener("click", () => closeModal(overlay));
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") document.querySelectorAll(".modal-overlay.open").forEach(closeModal);
  });

  const input = $("#searchInput");
  input.addEventListener("input", () => {
    state.search = input.value;
    $("#clearSearch").classList.toggle("show", !!input.value);
    renderGrid();
  });
  $("#clearSearch").addEventListener("click", () => {
    input.value = "";
    state.search = "";
    $("#clearSearch").classList.remove("show");
    renderGrid();
  });

  $("#sortSelect").addEventListener("change", e => {
    state.sort = e.target.value;
    renderGrid();
  });
}

buildSourceChips();
initEvents();
loadCatalog();
