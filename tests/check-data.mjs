// Data-integrity check for index.html — Node, no dependencies.
// Usage: node tests/check-data.mjs   (exit code 0 = all checks pass, 1 = at least one failure)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const htmlPath = fileURLToPath(new URL("../index.html", import.meta.url));
const html = readFileSync(htmlPath, "utf8");
const script = (html.match(/<script>([\s\S]*?)<\/script>/) || [])[1];
if (!script) { console.error("FAIL: no inline <script> found in index.html"); process.exit(1); }

// Evaluate only the data part (everything before the app code, which needs a DOM).
const cut = script.indexOf("/* ================= app");
if (cut < 0) { console.error("FAIL: app marker not found in script"); process.exit(1); }
const D = new Function(script.slice(0, cut) +
  ";return {VIDEOS,META,EVIDENCE,STATIONS,CURVES,CURVE_KEYS,CURVE_STYLE,ZOOM,DIAGRAMS,SOURCES,L};")();

let failed = 0;
const check = (name, errors) => {
  if (errors.length) { failed++; console.log(`FAIL  ${name}`); errors.slice(0, 15).forEach(e => console.log("      - " + e)); }
  else console.log(`PASS  ${name}`);
};

/* 1. all languages have identical keys (deep; arrays compared by length) */
const paths = (o, p = "", out = []) => {
  if (Array.isArray(o)) { out.push(`${p}[len=${o.length}]`); o.forEach((v, i) => typeof v === "object" && v && paths(v, `${p}[${i}]`, out)); }
  else if (o && typeof o === "object") for (const k of Object.keys(o)) { out.push(p + "." + k); paths(o[k], p + "." + k, out); }
  return out;
};
{
  const errs = [], langs = D.META.langs, ref = new Set(paths(D.L[langs[0]]));
  for (const l of langs) {
    if (!D.L[l]) { errs.push(`language pack "${l}" missing`); continue; }
    const cur = new Set(paths(D.L[l]));
    for (const k of ref) if (!cur.has(k)) errs.push(`${l} missing ${k}`);
    for (const k of cur) if (!ref.has(k)) errs.push(`${l} has extra ${k}`);
  }
  check(`languages ${langs.join("/")} have identical keys (${ref.size} each)`, errs);
}

/* 2. every figure: source exists in SOURCES, evidence is valid, label + context keys exist */
{
  const errs = [], ids = new Set(D.SOURCES.map(s => s.id)), L0 = D.L[D.META.def];
  let n = 0;
  for (const st of D.STATIONS) for (const f of st.figs) {
    n++;
    const at = `${st.id}/${f.id}`;
    for (const k of ["id", "value", "source", "evidence", "context"]) if (!(k in f)) errs.push(`${at}: missing field "${k}"`);
    if (f.source != null && !ids.has(f.source)) errs.push(`${at}: source "${f.source}" not in SOURCES`);
    if (!D.EVIDENCE.includes(f.evidence)) errs.push(`${at}: evidence "${f.evidence}" not allowed`);
    if (L0.fig[f.id] == null) errs.push(`${at}: no label L.${D.META.def}.fig.${f.id}`);
    if (L0.ev[f.evidence] == null) errs.push(`${at}: no badge text for ${f.evidence}`);
    if (f.context && L0.ctx[f.context.s] == null) errs.push(`${at}: context key "${f.context.s}" not in L.ctx`);
  }
  check(`figures (${n}): sources exist, evidence valid, labels/context keys exist`, errs);
}

/* 3. station ranges: 0 <= start <= end <= 72 (end null = open-ended); focus inside representative */
{
  const errs = [], T = D.META.tMax, displays = ["range", "from", "uncertain", "atEnd"];
  const okRange = (r, name, at) => {
    if (r == null) return;
    const [a, b] = r;
    if (!(Number.isFinite(a) && a >= 0 && a <= T)) errs.push(`${at}.${name}: bad start ${a}`);
    if (b !== null && !(Number.isFinite(b) && b >= a && b <= T)) errs.push(`${at}.${name}: bad end ${b} (start ${a})`);
  };
  for (const st of D.STATIONS) {
    okRange(st.representative, "representative", st.id);
    okRange(st.onset, "onset", st.id);
    okRange(st.focus, "focus", st.id);
    if (st.focus && st.focus[1] === null) errs.push(`${st.id}.focus: end must not be null`);
    if (!displays.includes(st.display)) errs.push(`${st.id}.display: "${st.display}"`);
    if ((st.display === "range" || st.display === "from") && !st.representative) errs.push(`${st.id}: display "${st.display}" needs representative`);
    if (st.display === "range" && st.representative && st.representative[1] === null) errs.push(`${st.id}: display "range" needs a closed representative`);
    if (st.focus) {
      if (!st.representative) errs.push(`${st.id}: focus without representative`);
      else {
        const [ra, rb] = st.representative, re = rb === null ? T : rb;
        if (st.focus[0] < ra || st.focus[1] > re) errs.push(`${st.id}: focus [${st.focus}] outside representative [${ra},${rb}]`);
      }
    }
  }
  check(`station ranges (${D.STATIONS.length} stations) within 0..${T}, focus inside representative`, errs);
}

/* 4. curves: strictly increasing x in 0..72, values in 0..1 */
{
  const errs = [];
  for (const k of D.CURVE_KEYS) {
    const c = D.CURVES[k];
    if (!Array.isArray(c) || c.length < 2) { errs.push(`${k}: missing or too short`); continue; }
    c.forEach(([x, y], i) => {
      if (!(x >= 0 && x <= D.META.tMax)) errs.push(`${k}[${i}]: x=${x} outside 0..${D.META.tMax}`);
      if (!(y >= 0 && y <= 1)) errs.push(`${k}[${i}]: value=${y} outside 0..1`);
      if (i && !(x > c[i - 1][0])) errs.push(`${k}[${i}]: x=${x} not > previous ${c[i - 1][0]}`);
    });
  }
  check(`curves (${D.CURVE_KEYS.length}): strictly increasing x in 0..${D.META.tMax}, values in 0..1`, errs);
}

/* 4b. zoom steps */
{
  const want = [1, 2, 4, 8, 12, 24, 36, 72], errs = [];
  if (JSON.stringify(D.ZOOM) !== JSON.stringify(want)) errs.push(`ZOOM is ${JSON.stringify(D.ZOOM)}, expected ${JSON.stringify(want)}`);
  check(`zoom: exactly 8 steps ${JSON.stringify(want)}`, errs);
}

/* 4c. curve styles: one per curve, 6 different colours, 6 different dash patterns */
{
  const errs = [], keys = Object.keys(D.CURVE_STYLE || {});
  if (keys.length !== 6 || D.CURVE_KEYS.some(k => !keys.includes(k))) errs.push(`CURVE_STYLE keys [${keys}] must match CURVE_KEYS [${D.CURVE_KEYS}]`);
  const colors = D.CURVE_KEYS.map(k => String(D.CURVE_STYLE[k]?.color).toLowerCase());
  const dashes = D.CURVE_KEYS.map(k => String(D.CURVE_STYLE[k]?.dash).replace(/[\s,]+/g, " ").trim());
  colors.forEach((c, i) => { if (!/^#[0-9a-f]{6}$/.test(c)) errs.push(`${D.CURVE_KEYS[i]}: colour "${c}" is not #rrggbb`); });
  const dup = (arr, what) => arr.forEach((v, i) => { const j = arr.indexOf(v); if (j !== i) errs.push(`${what} "${v}" used by both ${D.CURVE_KEYS[j]} and ${D.CURVE_KEYS[i]}`); });
  dup(colors, "colour"); dup(dashes, "dash pattern");
  check(`curve styles: 6 different colours, 6 different dash patterns`, errs);
}

/* 5. video slots */
{
  const errs = [], re = /^[A-Za-z0-9_-]{11}$/;
  if (D.VIDEOS.length !== 16) errs.push(`expected 16 slots, found ${D.VIDEOS.length}`);
  D.VIDEOS.forEach((v, i) => { if (!v.id) errs.push(`slot ${i + 1}: empty id (all 16 must be filled)`); });
  D.VIDEOS.forEach((v, i) => { if (v.id && !re.test(v.id)) errs.push(`slot ${i + 1}: bad id "${v.id}"`); });
  const filled = D.VIDEOS.filter(v => v.id).length;
  check(`videos: exactly 16 slots, all filled (${filled}/16), ids match ^[A-Za-z0-9_-]{11}$`, errs);
}

/* 6. diagram label keys exist in every language */
{
  const errs = [];
  for (const [id, items] of Object.entries(D.DIAGRAMS)) for (const it of items)
    for (const key of [it.n, it.k, it.t].filter(Boolean))
      for (const l of D.META.langs) if (D.L[l].dl[key] == null) errs.push(`${id}: L.${l}.dl.${key} missing`);
  check(`diagram labels exist in all languages`, errs);
}

console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
