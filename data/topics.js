/*
 * 主題登錄表：每一個 topics/<slug>.html 都必須在此有一筆對應資料。
 * 陣列順序即為「建議閱讀順序」，也決定主題頁底部「上一篇／下一篇」的連結。
 * 欄位規則請見 AGENTS.md「資料登錄表」一節；新增主題請使用 scripts/new-topic.mjs。
 */
window.SITE_DATA = window.SITE_DATA || {};

window.SITE_DATA.topics = [
  // @new-topic-insert（請勿刪除此行：scripts/new-topic.mjs 會在此行之前插入新主題）
];
