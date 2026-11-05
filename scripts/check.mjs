#!/usr/bin/env node
// 專案規則檢查：確認資料登錄表、主題頁結構、連結與寫作格式都符合 AGENTS.md。
// 用法：node scripts/check.mjs
// 有任何「錯誤」時結束代碼為 1；「警告」不影響結束代碼，但提交前應盡量修正。

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadSiteData } from "./lib/load-data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;
const CJK = "\\u3400-\\u4dbf\\u4e00-\\u9fff";

// 主題頁必備區塊：id、標題，依此順序出現
const REQUIRED_SECTIONS = [
  ["summary", "摘要"],
  ["background", "背景與動機"],
  ["principle", "核心原理"],
  ["applications", "臨床應用案例"],
  ["limitations", "限制與風險"],
  ["key-points", "重點整理"],
  ["references", "參考資料"]
];
const LIMITS = {
  summaryChars: [30, 80],        // data/topics.js 的 summary
  definitionChars: [40, 120],    // data/glossary.js 的 definition
  related: [1, 3],
  bodyChars: [1000, 2500],       // 主題頁正文（不含參考資料）
  applications: [2, 4],          // 臨床應用案例的 h3 數量
  limitations: [3, 5],
  keyPoints: [3, 5],
  references: [2, 8]
};

const errors = [];
const warnings = [];
const error = (where, message) => errors.push(`${where}：${message}`);
const warn = (where, message) => warnings.push(`${where}：${message}`);

const charCount = (s) => [...String(s).replace(/\s+/g, "")].length;
const inRange = (n, [min, max]) => n >= min && n <= max;

function stripTags(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ");
}

function listFiles(dir, exts) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...listFiles(full, exts));
    else if (exts.some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
}

const rel = (p) => relative(ROOT, p).replaceAll("\\", "/");

// ---------- 1. 資料登錄表 ----------
let data;
try {
  data = loadSiteData(ROOT);
} catch (e) {
  console.error(`無法讀取 data/*.js：${e.message}`);
  process.exit(1);
}
const { site, categories, levels, topics, glossary } = data;
const css = readFileSync(join(ROOT, "assets/css/style.css"), "utf8");

for (const [id, cat] of Object.entries(categories)) {
  const where = `data/site.js 分類「${id}」`;
  if (!SLUG_PATTERN.test(id)) error(where, "分類 id 只能使用小寫英文、數字與連字號");
  if (!cat.name || !cat.description) error(where, "缺少 name 或 description");
  const varCount = css.split(`--cat-${id}:`).length - 1;
  if (varCount < 2) error(where, `style.css 須在淺色與深色模式各定義一次 --cat-${id}`);
  if (!css.includes(`[data-category="${id}"]`)) error(where, `style.css 缺少 [data-category="${id}"] 選擇器`);
}

const slugs = new Set();
topics.forEach((t, i) => {
  const where = `data/topics.js 第 ${i + 1} 筆（${t.slug || "未命名"}）`;
  for (const field of ["slug", "title", "titleEn", "category", "level", "summary", "updated"]) {
    if (typeof t[field] !== "string" || !t[field].trim()) error(where, `缺少欄位 ${field}`);
  }
  if (!SLUG_PATTERN.test(t.slug || "")) error(where, "slug 只能使用小寫英文、數字與連字號");
  if (slugs.has(t.slug)) error(where, "slug 重複");
  slugs.add(t.slug);
  if (!categories[t.category]) error(where, `分類「${t.category}」不存在於 data/site.js`);
  if (!levels.includes(t.level)) error(where, `難度須為：${levels.join("、")}`);
  if (!DATE_PATTERN.test(t.updated || "") || Number.isNaN(Date.parse(t.updated))) error(where, "updated 須為 YYYY-MM-DD");
  if (!inRange(charCount(t.summary), LIMITS.summaryChars)) {
    error(where, `summary 須為 ${LIMITS.summaryChars.join("～")} 字（目前 ${charCount(t.summary)} 字）`);
  }
});
topics.forEach((t) => {
  const where = `data/topics.js（${t.slug}）`;
  const related = Array.isArray(t.related) ? t.related : [];
  if (!inRange(related.length, LIMITS.related)) error(where, `related 須有 ${LIMITS.related.join("～")} 筆`);
  if (new Set(related).size !== related.length) error(where, "related 有重複項目");
  for (const r of related) {
    if (r === t.slug) error(where, "related 不可包含自己");
    else if (!slugs.has(r)) error(where, `related 中的「${r}」不存在`);
  }
});

const termIds = new Set();
glossary.forEach((g, i) => {
  const where = `data/glossary.js 第 ${i + 1} 筆（${g.id || "未命名"}）`;
  for (const field of ["id", "term", "en", "definition"]) {
    if (typeof g[field] !== "string" || !g[field].trim()) error(where, `缺少欄位 ${field}`);
  }
  if (!SLUG_PATTERN.test(g.id || "")) error(where, "id 只能使用小寫英文、數字與連字號");
  if (termIds.has(g.id)) error(where, "id 重複");
  termIds.add(g.id);
  if (!inRange(charCount(g.definition), LIMITS.definitionChars)) {
    error(where, `definition 須為 ${LIMITS.definitionChars.join("～")} 字（目前 ${charCount(g.definition)} 字）`);
  }
  if (!Array.isArray(g.topics) || g.topics.length === 0) error(where, "topics 至少需要 1 個主題 slug");
  for (const s of g.topics || []) if (!slugs.has(s)) error(where, `topics 中的「${s}」不存在`);
  const prev = glossary[i - 1];
  if (prev && prev.en.localeCompare(g.en, "en", { sensitivity: "base" }) > 0) {
    error(where, `未依英文字母順序排列（應排在「${prev.en}」之前）`);
  }
});

// ---------- 2. 主題頁 ----------
const topicDir = join(ROOT, "topics");
const topicFiles = existsSync(topicDir) ? readdirSync(topicDir).filter((f) => f.endsWith(".html")) : [];
for (const file of topicFiles) {
  if (!slugs.has(file.replace(/\.html$/, ""))) error(`topics/${file}`, "未在 data/topics.js 登錄");
}

for (const t of topics) {
  const where = `topics/${t.slug}.html`;
  const path = join(topicDir, `${t.slug}.html`);
  if (!existsSync(path)) {
    error(where, "檔案不存在");
    continue;
  }
  const html = readFileSync(path, "utf8");

  if (!html.includes(`data-page="topic"`)) error(where, `body 須有 data-page="topic"`);
  if (!html.includes(`data-root=".."`)) error(where, `body 須有 data-root=".."`);
  if (!html.includes(`data-slug="${t.slug}"`)) error(where, `body 的 data-slug 須為「${t.slug}」`);

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  if (title !== `${t.title}｜${site.name}`) error(where, `<title> 須為「${t.title}｜${site.name}」`);
  const h1 = (html.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1];
  if (h1 !== t.title) error(where, `<h1> 須與登錄表 title 相同（${t.title}）`);
  const en = (html.match(/<p class="title-en">([\s\S]*?)<\/p>/) || [])[1];
  if (en !== t.titleEn) error(where, `p.title-en 須與登錄表 titleEn 相同（${t.titleEn}）`);
  const description = (html.match(/<meta name="description" content="([^"]*)">/) || [])[1];
  if (description !== t.summary) error(where, "meta description 須與登錄表 summary 完全相同");

  if (html.includes("{{")) error(where, "仍有未填寫的 {{...}} 佔位文字");
  if (html.includes("撰寫說明")) error(where, "請刪除範本中的撰寫說明註解");

  // 必備區塊與順序
  let lastIndex = -1;
  const sections = {};
  for (const [id, heading] of REQUIRED_SECTIONS) {
    const start = html.indexOf(`<section id="${id}"`);
    if (start === -1) {
      error(where, `缺少區塊 <section id="${id}">（${heading}）`);
      continue;
    }
    if (start < lastIndex) error(where, `區塊「${heading}」的順序不正確`);
    lastIndex = start;
    const end = html.indexOf("</section>", start);
    const content = html.slice(start, end);
    sections[id] = content;
    const h2 = (content.match(/<h2>([\s\S]*?)<\/h2>/) || [])[1];
    if (h2 !== heading) error(where, `區塊 #${id} 的標題須為「${heading}」`);
  }

  const count = (content, pattern) => (content ? (content.match(pattern) || []).length : 0);
  const checkCount = (id, pattern, limit, label) => {
    const n = count(sections[id], pattern);
    if (sections[id] && !inRange(n, limit)) error(where, `${label}須為 ${limit.join("～")} 項（目前 ${n} 項）`);
  };
  checkCount("applications", /<h3>/g, LIMITS.applications, "臨床應用案例的 h3 ");
  checkCount("limitations", /<li>/g, LIMITS.limitations, "限制與風險的條列");
  checkCount("key-points", /<li>/g, LIMITS.keyPoints, "重點整理的條列");
  checkCount("references", /<li>/g, LIMITS.references, "參考資料");

  if (sections.limitations) {
    const items = sections.limitations.match(/<li>[\s\S]*?<\/li>/g) || [];
    items.forEach((li, i) => {
      if (!li.startsWith("<li><strong>")) error(where, `限制與風險第 ${i + 1} 點須以 <strong> 關鍵詞開頭`);
    });
  }
  if (sections.references) {
    const items = sections.references.match(/<li>[\s\S]*?<\/li>/g) || [];
    items.forEach((li, i) => {
      if (!/<a href="https:\/\/[^"]+">/.test(li)) error(where, `參考資料第 ${i + 1} 筆須附 https 連結（DOI、arXiv 或官方網址）`);
    });
  }

  // 正文字數（不含參考資料）
  const bodyText = REQUIRED_SECTIONS.filter(([id]) => id !== "references")
    .map(([id]) => stripTags((sections[id] || "").replace(/<h2>[\s\S]*?<\/h2>/, "")))
    .join("");
  const bodyChars = charCount(bodyText);
  if (!inRange(bodyChars, LIMITS.bodyChars)) {
    error(where, `正文須為 ${LIMITS.bodyChars.join("～")} 字（目前 ${bodyChars} 字，不含參考資料）`);
  }

  // 名詞連結
  for (const m of html.matchAll(/<a class="term" href="([^"]*)"/g)) {
    const target = m[1];
    const id = target.startsWith("../glossary.html#") ? target.slice("../glossary.html#".length) : null;
    if (!id) error(where, `名詞連結格式須為 ../glossary.html#<id>（目前為 ${target}）`);
    else if (!termIds.has(id)) error(where, `名詞連結 #${id} 不存在於 data/glossary.js`);
  }

  // 排版：中英文之間空格、中文語句的全形標點（僅檢查正文）
  const spacing = new RegExp(`[${CJK}][A-Za-z0-9]|[A-Za-z0-9][${CJK}]`, "g");
  const halfwidth = new RegExp(`[${CJK}][,;:!?()]|[,;:!?()][${CJK}]`, "g");
  const report = (pattern, message) => {
    const hits = [...bodyText.matchAll(pattern)].slice(0, 5);
    for (const hit of hits) {
      const s = Math.max(0, hit.index - 8);
      warn(where, `${message}：「…${bodyText.slice(s, hit.index + 10).replace(/\s+/g, " ")}…」`);
    }
  };
  report(spacing, "中文與英文或數字之間應加半形空格");
  report(halfwidth, "中文語句應使用全形標點");
}

// ---------- 3. 所有 HTML：連結、內嵌樣式與外部資源 ----------
const htmlFiles = listFiles(ROOT, [".html"]).filter((f) => !rel(f).startsWith("templates/"));
for (const file of htmlFiles) {
  const where = rel(file);
  const html = readFileSync(file, "utf8");
  if (/\sstyle="/.test(html)) error(where, "不得使用 style 屬性，請改用 style.css 中的 class");
  for (const m of html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>/g)) error(where, `不得使用內嵌 script：${m[0]}`);
  for (const m of html.matchAll(/<(script|link)[^>]+(src|href)="(https?:)?\/\/[^"]+"/g)) {
    error(where, `不得載入外部資源（CDN）：${m[0]}`);
  }
  for (const m of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    const target = m[2];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const pathPart = target.split("#")[0].split("?")[0];
    if (!pathPart) continue;
    if (!existsSync(resolve(dirname(file), pathPart))) error(where, `連結目標不存在：${target}`);
  }
}

// ---------- 4. 全專案：禁止表情符號 ----------
for (const file of listFiles(ROOT, [".html", ".js", ".mjs", ".css", ".md", ".yml"])) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (EMOJI_PATTERN.test(line)) error(`${rel(file)} 第 ${i + 1} 行`, "不得使用表情符號（emoji）");
  });
}

// ---------- 結果 ----------
for (const w of warnings) console.log(`[警告] ${w}`);
for (const e of errors) console.log(`[錯誤] ${e}`);
console.log(
  `\n檢查完成：${topics.length} 個主題、${glossary.length} 個名詞、${htmlFiles.length} 個頁面；` +
  `${errors.length} 個錯誤、${warnings.length} 個警告。`
);
process.exit(errors.length ? 1 : 0);
