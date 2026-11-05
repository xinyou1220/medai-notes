// 讀取 data/*.js 資料檔（瀏覽器用的 window.SITE_DATA 格式），供 Node 腳本使用。
import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

export function loadSiteData(root) {
  const context = { window: {} };
  vm.createContext(context);
  for (const file of ["site.js", "topics.js", "glossary.js"]) {
    const code = readFileSync(join(root, "data", file), "utf8");
    vm.runInContext(code, context, { filename: `data/${file}` });
  }
  return context.window.SITE_DATA;
}
