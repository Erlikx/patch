*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #07090d;
  --bg2: #0c1018;
  --bg3: #131a23;
  --bg4: #192030;
  --bg5: #1f2a3c;
  --br: #1e2d40;
  --br2: #28394f;
  --br3: #344d68;
  --tx: #c8d8ea;
  --tx2: #8fa8c0;
  --tx3: #4d6a84;
  --acc: #4c9eff;
  --acc-dim: rgba(76, 158, 255, 0.1);
  --acc-border: rgba(76, 158, 255, 0.25);
  --acc-text: #82bfff;
  --grn: #23d18b;
  --grn-dim: rgba(35, 209, 139, 0.1);
  --grn-text: #4ddfaa;
  --amb: #e8a838;
  --amb-text: #f2c46a;
  --red-text: #f87171;
  --mod: #f59e0b;
  --mod-dim: rgba(245, 158, 11, 0.09);
  --mod-border: rgba(245, 158, 11, 0.25);
  --mod-text: #fbbf24;
  --apk: #a78bfa;
  --apk-dim: rgba(167, 139, 250, 0.09);
  --apk-border: rgba(167, 139, 250, 0.25);
  --apk-text: #c4b5fd;
  --r: 8px;
  --rl: 10px;
  --fn: "Inter", system-ui, sans-serif;
  --mo: "JetBrains Mono", monospace;
}

body {
  background: var(--bg);
  color: var(--tx);
  font-family: var(--fn);
  font-size: 14px;
  line-height: 1.5;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 70% 45% at 50% 0%, rgba(76, 158, 255, 0.05) 0%, transparent 70%),
    radial-gradient(ellipse 40% 30% at 90% 90%, rgba(35, 209, 139, 0.03) 0%, transparent 65%);
}
:focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }

.wrap {
  max-width: 880px;
  margin: 0 auto;
  padding: 1.25rem 1rem 4rem;
  position: relative;
  z-index: 1;
}

/* ── Header ── */
.hd { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 0.9rem; }
.brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
.brand-ico {
  width: 34px; height: 34px; flex-shrink: 0; border-radius: 9px;
  background: var(--bg3); border: 1px solid var(--br2);
  display: flex; align-items: center; justify-content: center; color: var(--acc-text);
}
.brand-tx { min-width: 0; }
.brand-owner { font-size: 10px; color: var(--tx3); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
.brand-repo { font-size: 15px; font-weight: 800; color: var(--tx); letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ref-btn {
  flex-shrink: 0; background: var(--bg3); border: 1px solid var(--br2); color: var(--tx2);
  padding: 7px 13px; border-radius: var(--r); cursor: pointer; font-size: 12px;
  font-family: var(--fn); font-weight: 600; transition: all 0.15s;
  display: inline-flex; align-items: center; gap: 5px;
}
.ref-btn:hover { background: var(--bg4); border-color: var(--acc); color: var(--acc-text); }

.update-pill {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; color: var(--tx3); margin-bottom: 1rem;
}
.update-pill svg { flex-shrink: 0; }

/* ── Guide ── */
.guide { background: var(--bg2); border: 1px solid var(--br); border-radius: var(--rl); margin-bottom: 1rem; overflow: hidden; }
.guide-toggle { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; cursor: pointer; user-select: none; gap: 8px; transition: background 0.15s; }
.guide-toggle:hover { background: rgba(76, 158, 255, 0.04); }
.guide-toggle-l { display: flex; align-items: center; gap: 9px; }
.guide-icon {
  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: var(--acc-dim); border: 1px solid var(--acc-border); font-size: 14px; line-height: 1;
}
.guide-label { font-size: 13px; font-weight: 700; color: var(--tx); }
.guide-sub { font-size: 11px; color: var(--tx3); margin-top: 1px; }
.guide-chev { color: var(--tx3); transition: transform 0.2s; font-size: 11px; flex-shrink: 0; }
.guide.open .guide-chev { transform: rotate(180deg); }
.guide-body { display: none; padding: 0 14px 14px; }
.guide.open .guide-body { display: block; }

.guide-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
@media (max-width: 540px) { .guide-grid { grid-template-columns: 1fr; } }

.guide-card { border-radius: var(--r); padding: 13px; border: 1px solid; }
.guide-card.apk { background: var(--apk-dim); border-color: var(--apk-border); }
.guide-card.mod { background: var(--mod-dim); border-color: var(--mod-border); }
.guide-card-hd { display: flex; align-items: center; gap: 8px; margin-bottom: 11px; padding-bottom: 10px; border-bottom: 1px solid; }
.guide-card.apk .guide-card-hd { border-color: var(--apk-border); }
.guide-card.mod .guide-card-hd { border-color: var(--mod-border); }
.guide-card-ico { font-size: 18px; line-height: 1; flex-shrink: 0; }
.guide-card-title { font-size: 13px; font-weight: 700; line-height: 1.2; }
.guide-card.apk .guide-card-title { color: var(--apk-text); }
.guide-card.mod .guide-card-title { color: var(--mod-text); }
.guide-card-tag {
  display: inline-block; margin-top: 3px; font-size: 9px; font-weight: 700; padding: 1px 6px;
  border-radius: 3px; text-transform: uppercase; letter-spacing: 0.06em; border: 1px solid;
}
.guide-card.apk .guide-card-tag { background: var(--apk-dim); color: var(--apk-text); border-color: var(--apk-border); }
.guide-card.mod .guide-card-tag { background: var(--mod-dim); color: var(--mod-text); border-color: var(--mod-border); }

.guide-steps { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.guide-step { display: flex; gap: 8px; font-size: 12.5px; color: var(--tx2); line-height: 1.45; }
.guide-step-num {
  flex-shrink: 0; width: 18px; height: 18px; border-radius: 5px; margin-top: 1px;
  display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; font-family: var(--mo);
}
.guide-card.apk .guide-step-num { background: rgba(167, 139, 250, 0.18); color: var(--apk-text); }
.guide-card.mod .guide-step-num { background: rgba(245, 158, 11, 0.18); color: var(--mod-text); }
.guide-step strong { color: var(--tx); font-weight: 600; }

.guide-deps { margin-top: 11px; padding-top: 10px; border-top: 1px solid; display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
.guide-card.apk .guide-deps { border-color: var(--apk-border); }
.guide-card.mod .guide-deps { border-color: var(--mod-border); }
.guide-dep-label { font-size: 10px; color: var(--tx3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; width: 100%; margin-bottom: 2px; }
.dep-link {
  display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: var(--r);
  text-decoration: none; font-size: 11.5px; font-weight: 600; font-family: var(--fn); border: 1px solid; transition: all 0.14s;
}
.dep-link.microg { background: var(--apk-dim); border-color: var(--apk-border); color: var(--apk-text); }
.dep-link.microg:hover { background: rgba(167, 139, 250, 0.2); }
.dep-link.detach { background: var(--mod-dim); border-color: var(--mod-border); color: var(--mod-text); }
.dep-link.detach:hover { background: rgba(245, 158, 11, 0.2); }
.dep-badge { font-size: 8.5px; font-weight: 700; padding: 1px 5px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid; }
.dep-link.microg .dep-badge { background: var(--apk-dim); color: var(--apk-text); border-color: var(--apk-border); }
.dep-link.detach .dep-badge { background: var(--mod-dim); color: var(--mod-text); border-color: var(--mod-border); }

.guide-note {
  margin-top: 10px; padding: 10px 12px; border-radius: var(--r);
  background: rgba(35, 209, 139, 0.05); border: 1px solid rgba(35, 209, 139, 0.15);
  font-size: 12px; color: var(--tx2); display: flex; gap: 8px; align-items: flex-start; line-height: 1.5;
}
.guide-note-ico { flex-shrink: 0; font-size: 13px; margin-top: 1px; }
.guide-note strong { color: var(--grn-text); font-weight: 600; }

/* ── Metrics ── */
.metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 1rem; }
@media (max-width: 520px) { .metrics { grid-template-columns: repeat(2, 1fr); } }
.met { background: var(--bg2); border: 1px solid var(--br); border-radius: var(--rl); padding: 12px 13px; position: relative; overflow: hidden; }
.met::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(135deg, rgba(255, 255, 255, 0.014) 0%, transparent 55%); }
.met-lbl { font-size: 9.5px; color: var(--tx3); text-transform: uppercase; letter-spacing: 0.09em; font-weight: 700; margin-bottom: 5px; }
.met-val { font-size: 22px; font-weight: 800; line-height: 1; letter-spacing: -0.03em; }
.met-val.blue { color: var(--acc-text); }
.met-val.green { color: var(--grn-text); }
.met-val.sm { font-size: 11px; font-family: var(--mo); font-weight: 600; letter-spacing: 0; padding-top: 4px; }
.met-sub { font-size: 10px; color: var(--tx3); margin-top: 3px; }

/* ── Banner ── */
.banner {
  background: linear-gradient(120deg, rgba(76, 158, 255, 0.07), rgba(76, 158, 255, 0.03));
  border: 1px solid var(--acc-border); border-radius: var(--r); padding: 9px 13px; margin-bottom: 1rem;
  font-size: 12.5px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.banner-star { color: var(--amb); font-size: 12px; flex-shrink: 0; }
.banner code { font-family: var(--mo); font-size: 11.5px; background: rgba(255, 255, 255, 0.06); padding: 1px 6px; border-radius: 4px; color: var(--acc-text); word-break: break-all; }
.banner strong { color: var(--acc-text); font-weight: 700; }

/* ── Legend ── */
.legend {
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 1rem;
  padding: 9px 13px; background: var(--bg2); border: 1px solid var(--br); border-radius: var(--r); font-size: 11.5px;
}
.legend-label { font-size: 10px; color: var(--tx3); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.legend-item { display: flex; align-items: center; gap: 6px; color: var(--tx2); }
.legend-swatch { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.legend-swatch.mod { background: var(--mod); }
.legend-swatch.apk { background: var(--apk); }

/* ── Chart ── */
.chart-card { background: var(--bg2); border: 1px solid var(--br); border-radius: var(--rl); padding: 13px 15px; margin-bottom: 1rem; }
.sec-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 11px; gap: 8px; }
.sec-title { font-size: 10px; font-weight: 700; color: var(--tx2); text-transform: uppercase; letter-spacing: 0.09em; }
.sec-hint { font-size: 10px; color: var(--tx3); }
.bar-row { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
.bar-row:last-child { margin-bottom: 0; }
.bar-row.hidden { display: none; }
.bar-lbl { width: 92px; flex-shrink: 0; text-align: right; }
.bar-tag { font-size: 10px; font-family: var(--mo); font-weight: 700; color: var(--tx); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-date { font-size: 9px; color: var(--tx3); display: block; margin-top: 1px; }
.bar-track { flex: 1; height: 14px; background: var(--bg3); border-radius: 4px; overflow: hidden; min-width: 0; }
.bar-fill { height: 100%; border-radius: 4px; position: relative; transition: width 0.85s cubic-bezier(0.4, 0, 0.2, 1); }
.bar-fill::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 40%, rgba(255, 255, 255, 0.08)); }
.bar-cnt { font-size: 10.5px; font-weight: 700; font-family: var(--mo); min-width: 32px; text-align: right; color: var(--tx); flex-shrink: 0; }
.chart-toggle {
  display: inline-flex; align-items: center; gap: 4px; margin-top: 8px; padding: 5px 10px;
  background: var(--bg3); border: 1px solid var(--br); border-radius: var(--r); color: var(--tx2);
  font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.14s;
}
.chart-toggle:hover { background: var(--bg4); border-color: var(--acc-border); color: var(--acc-text); }
.chart-toggle.expanded svg { transform: rotate(180deg); }

/* ── Search + Controls ── */
.search-box { margin-bottom: 0.7rem; }
.search-input-wrap {
  display: flex; align-items: center; gap: 8px; background: var(--bg2); border: 1px solid var(--br2);
  border-radius: var(--r); padding: 9px 12px; transition: border-color 0.15s;
}
.search-input-wrap:focus-within { border-color: var(--acc); }
.search-icon { color: var(--tx3); flex-shrink: 0; }
.search-input-wrap input {
  flex: 1; background: none; border: none; outline: none; color: var(--tx);
  font-family: var(--fn); font-size: 13px; min-width: 0;
}
.search-input-wrap input::placeholder { color: var(--tx3); }
#searchClearBtn { display: none; background: none; border: none; color: var(--tx3); cursor: pointer; padding: 2px; flex-shrink: 0; }
.search-input-wrap.has-value #searchClearBtn { display: flex; }
#searchClearBtn:hover { color: var(--tx); }

.controls { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 0.85rem; flex-wrap: wrap; }
.ctl-l { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.ctl-lbl { font-size: 10px; color: var(--tx3); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
select {
  font-size: 12px; padding: 6px 10px; border-radius: var(--r); border: 1px solid var(--br2);
  background: var(--bg2); color: var(--tx); cursor: pointer; font-family: var(--fn); font-weight: 500; max-width: 190px;
}
select:focus { outline: 2px solid var(--acc); outline-offset: 1px; }
.srt-btn {
  background: var(--bg3); border: 1px solid var(--br); color: var(--tx3); padding: 5px 10px; border-radius: var(--r);
  cursor: pointer; font-size: 11px; font-family: var(--fn); font-weight: 600; letter-spacing: 0.03em; transition: all 0.14s;
}
.srt-btn.on { border-color: var(--acc-border); color: var(--acc-text); background: var(--acc-dim); }
.srt-btn:not(.on):hover { color: var(--tx); border-color: var(--br2); }
.ctl-count { font-size: 11px; color: var(--tx3); white-space: nowrap; }

/* ── Release card ── */
.rel-card { background: var(--bg2); border: 1px solid var(--br); border-radius: var(--rl); overflow: hidden; margin-bottom: 7px; transition: border-color 0.18s, box-shadow 0.18s; }
.rel-card:hover { border-color: var(--br2); box-shadow: 0 2px 16px rgba(0, 0, 0, 0.22); }
.rel-hd {
  display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; gap: 10px; cursor: pointer;
  user-select: none; background: linear-gradient(135deg, rgba(255, 255, 255, 0.01), transparent);
  border-bottom: 1px solid var(--br); transition: background 0.15s;
}
.rel-hd:hover { background: rgba(76, 158, 255, 0.035); }
.rel-card.collapsed .rel-hd { border-bottom-color: transparent; }
.rel-card.collapsed .rel-body { display: none; }
.rel-hd-l { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1; flex-wrap: wrap; }
.rel-tag-row { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.rel-tag { font-family: var(--mo); font-size: 13px; font-weight: 700; color: var(--acc-text); white-space: nowrap; }
.chev { font-size: 10px; color: var(--tx3); transition: transform 0.2s; flex-shrink: 0; }
.rel-card.collapsed .chev { transform: rotate(-90deg); }
.rel-name { font-size: 11px; color: var(--tx2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rel-meta { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; font-size: 11px; color: var(--tx3); }
.rel-meta .sep { width: 2px; height: 2px; border-radius: 50%; background: var(--tx3); flex-shrink: 0; }
.dl-pill {
  display: inline-flex; align-items: center; gap: 4px; background: var(--acc-dim); border: 1px solid var(--acc-border);
  color: var(--acc-text); font-family: var(--mo); font-size: 10.5px; font-weight: 700; padding: 1px 7px; border-radius: 20px; white-space: nowrap;
}
.rel-hd-r { display: flex; align-items: center; gap: 5px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
.badge { font-size: 9.5px; padding: 2px 7px; border-radius: 20px; border: 1px solid; font-weight: 700; white-space: nowrap; letter-spacing: 0.03em; }
.b-latest { background: var(--grn-dim); color: var(--grn-text); border-color: rgba(35, 209, 139, 0.28); }
.b-pre { background: rgba(232, 168, 56, 0.07); color: var(--amb-text); border-color: rgba(232, 168, 56, 0.22); }

/* ── Asset sections ── */
.asset-section + .asset-section .asset-section-hd { border-top: 1px solid var(--br); }
.asset-section-hd { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-bottom: 1px solid var(--br); }
.asset-section-ico { width: 20px; height: 20px; border-radius: 5px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; }
.asset-section-ico.mod { background: var(--mod-dim); border: 1px solid var(--mod-border); }
.asset-section-ico.apk { background: var(--apk-dim); border: 1px solid var(--apk-border); }
.asset-section-name { font-size: 11px; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; }
.asset-section-name.mod { color: var(--mod-text); }
.asset-section-name.apk { color: var(--apk-text); }
.asset-section-desc { font-size: 10.5px; color: var(--tx3); }

/* ── Asset rows ── */
.asset-item { padding: 10px 14px; border-bottom: 1px solid var(--br); transition: background 0.1s; }
.asset-item:last-child { border-bottom: none; }
.asset-item:hover { background: rgba(76, 158, 255, 0.025); }
.asset-item.hidden { display: none; }
.asset-item.is-apk { border-left: 2px solid var(--apk-border); }
.asset-item.is-mod { border-left: 2px solid var(--mod-border); }
.asset-item.is-pending { opacity: 0.45; }
.asset-item.is-pending:hover { background: none; }

.asset-row { display: grid; grid-template-columns: 1fr auto; grid-template-rows: auto auto; gap: 0 12px; align-items: center; }

.asset-icon { width: 22px; height: 22px; border-radius: 6px; background: var(--bg3); border: 1px solid var(--br2); flex-shrink: 0; display: flex; align-items: center; justify-content: center; padding: 3px; overflow: hidden; }
.asset-icon img { width: 100%; height: 100%; object-fit: contain; }

.asset-info { grid-column: 1; grid-row: 1; display: flex; align-items: center; gap: 7px; min-width: 0; flex-wrap: wrap; }
.rank-dot {
  width: 17px; height: 17px; border-radius: 4px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
  font-size: 8.5px; font-weight: 800; font-family: var(--mo);
}
.r1 { background: rgba(232, 168, 56, 0.12); color: var(--amb); border: 1px solid rgba(232, 168, 56, 0.25); }
.r2 { background: rgba(180, 180, 180, 0.07); color: #8a9bb0; border: 1px solid rgba(180, 180, 180, 0.15); }
.r3 { background: rgba(160, 90, 40, 0.1); color: #b07040; border: 1px solid rgba(160, 90, 40, 0.2); }
.r-other { opacity: 0; pointer-events: none; }
.asset-name { font-size: 12.5px; font-weight: 700; color: var(--tx); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.asset-version { font-family: var(--mo); font-size: 10.5px; color: var(--grn-text); flex-shrink: 0; }
.asset-version.missing { color: var(--tx3); }
.src-tag { font-size: 8px; font-weight: 700; padding: 1px 5px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0; }

.diff-toggle {
  all: unset; cursor: pointer; font-family: var(--mo); font-size: 10px; color: var(--tx3);
  display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0;
}
.diff-toggle:hover { color: var(--tx2); }
.diff-toggle .plus { color: var(--grn-text); }
.diff-toggle .minus { color: var(--red-text); }
.diff-toggle .chev2 { transition: transform 0.15s; font-size: 8px; }
.diff-toggle[aria-expanded="true"] .chev2 { transform: rotate(90deg); }
.diff-detail {
  display: none; grid-column: 1 / -1; font-family: var(--mo); font-size: 11px; line-height: 1.7;
  background: var(--bg); border: 1px solid var(--br); border-radius: 6px; padding: 8px 10px; margin-top: 8px;
}
.diff-detail.open { display: block; }
.diff-detail .l-add { color: var(--grn-text); }
.diff-detail .l-rem { color: var(--red-text); }
.diff-detail div { white-space: pre-wrap; word-break: break-word; }

.asset-stats { grid-column: 1; grid-row: 2; display: flex; align-items: center; gap: 8px; margin-top: 5px; }
.sz-lbl { font-size: 10px; color: var(--tx3); font-family: var(--mo); white-space: nowrap; flex-shrink: 0; }
.dl-bar-wrap { flex: 1; display: flex; align-items: center; gap: 6px; min-width: 0; }
.dl-bar { flex: 1; height: 4px; background: var(--bg4); border-radius: 3px; overflow: hidden; min-width: 20px; }
.dl-bar-fill { height: 100%; border-radius: 3px; background: var(--acc); opacity: 0.65; }
.dl-count { font-size: 10.5px; font-weight: 700; font-family: var(--mo); color: var(--tx2); white-space: nowrap; flex-shrink: 0; }
.dl-count-note { font-size: 9.5px; color: var(--tx3); white-space: nowrap; }

.btn-stack { grid-column: 2; grid-row: 1 / 3; display: flex; flex-direction: column; gap: 5px; align-self: center; }
.dl-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 5px; padding: 6px 14px; border-radius: 20px;
  background: var(--acc-dim); border: 1px solid var(--acc-border); color: var(--acc-text); font-size: 11.5px;
  font-family: var(--fn); font-weight: 600; text-decoration: none; white-space: nowrap; transition: all 0.14s;
}
.dl-btn:hover { background: rgba(76, 158, 255, 0.22); border-color: var(--acc); color: #fff; }
.dl-btn.apk-dl { background: var(--apk-dim); border-color: var(--apk-border); color: var(--apk-text); }
.dl-btn.apk-dl:hover { background: rgba(167, 139, 250, 0.22); border-color: var(--apk); color: #fff; }
.dl-btn.mod-dl { background: var(--mod-dim); border-color: var(--mod-border); color: var(--mod-text); }
.dl-btn.mod-dl:hover { background: rgba(245, 158, 11, 0.22); border-color: var(--mod); color: #fff; }
.dl-btn.ob-btn { background: none; border-color: var(--br2); color: var(--tx3); }
.dl-btn.ob-btn:hover { border-color: var(--br3); color: var(--tx); }
.dl-btn[aria-disabled="true"] { opacity: 0.35; pointer-events: none; }

.no-asset { padding: 18px; text-align: center; color: var(--tx3); font-size: 13px; }

/* ── States ── */
.state { text-align: center; padding: 3.5rem 1rem; color: var(--tx2); font-size: 14px; }
.err { color: var(--red-text); background: rgba(248, 113, 113, 0.05); border: 1px solid rgba(248, 113, 113, 0.17); border-radius: var(--rl); }
.spin { display: inline-block; width: 20px; height: 20px; border: 2px solid var(--br); border-top-color: var(--acc); border-radius: 50%; animation: sp 0.7s linear infinite; margin-bottom: 10px; }
@keyframes sp { to { transform: rotate(360deg); } }

footer.site { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--br); font-size: 11.5px; color: var(--tx3); text-align: center; }
footer.site a { color: var(--tx2); text-decoration: none; }
footer.site a:hover { color: var(--acc-text); }

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}

@media (max-width: 480px) {
  .asset-row { grid-template-columns: 1fr; grid-template-rows: auto auto auto; }
  .btn-stack { grid-column: 1; grid-row: 3; flex-direction: row; align-self: stretch; margin-top: 8px; }
  .btn-stack .dl-btn { flex: 1; }
  .asset-stats { grid-row: 2; }
}
