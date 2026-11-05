#!/usr/bin/env node
// 建立新主題頁：複製 templates/topic.html 並在 data/topics.js 登錄一筆資料。
//
// 用法：
//   node scripts/new-topic.mjs <slug> <中文標題> <英文標題> <分類 id> <難度>
// 範例：
//   node scripts/new-topic.mjs federated-learning "聯邦學習" "Federated Learning" data-privacy 進階
//
// 產生後仍需：撰寫頁面內容、填寫 summary 與 related，並執行 node scripts/check.mjs。

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadSiteData } from "./lib/load-data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const INSERT_MARKER = "// @new-topic-insert";

function fail(message) {
  console.error(`錯誤：${message}`);
  process.exit(1);
}

const [slug, title, titleEn, category, level] = process.argv.slice(2);
if (!slug || !title || !titleEn || !category || !level) {
  fail("參數不足。\n用法：node scripts/new-topic.mjs <slug> <中文標題> <英文標題> <分類 id> <難度>");
}

const data = loadSiteData(ROOT);
if (!SLUG_PATTERN.test(slug)) fail(`slug「${slug}」格式不符，只能使用小寫英文、數字與連字號。`);
if (data.topics.some((t) => t.slug === slug)) fail(`slug「${slug}」已存在於 data/topics.js。`);
if (!data.categories[category]) {
  fail(`分類「${category}」不存在。可用分類：${Object.keys(data.categories).join("、")}`);
}
if (!data.levels.includes(level)) fail(`難度「${level}」不存在。可用難度：${data.levels.join("、")}`);

const pagePath = join(ROOT, "topics", `${slug}.html`);
if (existsSync(pagePath)) fail(`檔案 topics/${slug}.html 已存在。`);

// 1. 由範本產生頁面
const template = readFileSync(join(ROOT, "templates", "topic.html"), "utf8");
const page = template
  .replaceAll("{{SLUG}}", slug)
  .replaceAll("{{TITLE}}", title)
  .replaceAll("{{TITLE_EN}}", titleEn)
  .replaceAll("{{SUMMARY}}", "{{待填寫：與 data/topics.js 的 summary 相同}}");
writeFileSync(pagePath, page, "utf8");

// 2. 在登錄表插入資料（插入在標記行之前，維持閱讀順序）
const today = new Date();
const updated = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

const entry = [
  "  {",
  `    slug: ${JSON.stringify(slug)},`,
  `    title: ${JSON.stringify(title)},`,
  `    titleEn: ${JSON.stringify(titleEn)},`,
  `    category: ${JSON.stringify(category)},`,
  `    level: ${JSON.stringify(level)},`,
  `    summary: "{{待填寫：30～80 字的卡片摘要}}",`,
  "    related: [],",
  `    updated: ${JSON.stringify(updated)}`,
  "  },"
].join("\n");

const registryPath = join(ROOT, "data", "topics.js");
const registry = readFileSync(registryPath, "utf8");
const markerIndex = registry.indexOf(INSERT_MARKER);
if (markerIndex === -1) fail(`data/topics.js 中找不到插入標記「${INSERT_MARKER}」。`);
const lineStart = registry.lastIndexOf("\n", markerIndex) + 1;
writeFileSync(registryPath, registry.slice(0, lineStart) + entry + "\n" + registry.slice(lineStart), "utf8");

console.log(`已建立 topics/${slug}.html，並在 data/topics.js 登錄「${title}」。`);
console.log("接下來請：");
console.log("  1. 依 AGENTS.md 的主題頁規範撰寫各區塊內容，並刪除範本中的撰寫說明註解。");
console.log("  2. 填寫 data/topics.js 中的 summary 與 related，並同步頁面的 meta description。");
console.log("  3. 執行 node scripts/check.mjs，確認沒有錯誤。");
