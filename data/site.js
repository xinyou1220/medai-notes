/*
 * 全站設定與分類表。
 * 規則：新增分類時，必須同時在 assets/css/style.css 新增對應的 --cat-<id> 色彩變數（淺色與深色模式皆需）。
 * 詳細規範請見 AGENTS.md「資料登錄表」一節。
 */
window.SITE_DATA = window.SITE_DATA || {};

window.SITE_DATA.site = {
  name: "醫療人工智慧概念講義",
  nameEn: "MedAI Notes",
  description: "以臨床情境為核心，整理醫療人工智慧的重要概念、應用案例與限制。",
  repo: "",
  nav: [
    { label: "首頁", href: "index.html", page: "home" },
    { label: "名詞表", href: "glossary.html", page: "glossary" },
    { label: "關於本站", href: "about.html", page: "about" }
  ]
};

window.SITE_DATA.categories = {
  "imaging": {
    name: "醫學影像",
    description: "以影像資料為主的偵測、分類與分割技術。"
  },
  "clinical-text": {
    name: "臨床文本",
    description: "病歷、報告等文字資料的處理與生成。"
  },
  "data-privacy": {
    name: "資料與隱私",
    description: "跨機構資料使用、隱私保護與資料治理。"
  },
  "trustworthy-ai": {
    name: "可信任 AI",
    description: "可解釋性、公平性與模型可靠度。"
  },
  "regulation": {
    name: "法規與驗證",
    description: "醫療器材軟體的管理架構與臨床證據。"
  }
};

window.SITE_DATA.levels = ["入門", "進階"];
