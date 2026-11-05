/*
 * 主題登錄表：每一個 topics/<slug>.html 都必須在此有一筆對應資料。
 * 陣列順序即為「建議閱讀順序」，也決定主題頁底部「上一篇／下一篇」的連結。
 * 欄位規則請見 AGENTS.md「資料登錄表」一節；新增主題請使用 scripts/new-topic.mjs。
 */
window.SITE_DATA = window.SITE_DATA || {};

window.SITE_DATA.topics = [
  {
    slug: "medical-imaging-ai",
    title: "醫學影像 AI",
    titleEn: "Medical Imaging AI",
    category: "imaging",
    level: "入門",
    summary: "以深度學習分析 X 光、電腦斷層、磁振造影與病理切片等醫學影像，協助病灶偵測、分類與分割的技術。",
    related: ["explainable-ai", "regulation-and-validation"],
    updated: "2026-11-05"
  },
  {
    slug: "clinical-nlp",
    title: "臨床自然語言處理",
    titleEn: "Clinical Natural Language Processing",
    category: "clinical-text",
    level: "入門",
    summary: "以電腦分析病歷與檢查報告等臨床文字，擷取診斷、用藥與症狀等結構化資訊，支援病歷檢索、研究收案與臨床決策。",
    related: ["medical-llm", "federated-learning"],
    updated: "2026-11-05"
  },
  {
    slug: "medical-llm",
    title: "大型語言模型於醫療",
    titleEn: "Large Language Models in Medicine",
    category: "clinical-text",
    level: "進階",
    summary: "以大量文字預訓練、能理解與生成自然語言的模型，可用於病歷摘要、文件草擬與衛教問答，但輸出可能有誤，須經專業人員審核。",
    related: ["clinical-nlp", "regulation-and-validation"],
    updated: "2026-11-05"
  },
  {
    slug: "federated-learning",
    title: "聯邦學習",
    titleEn: "Federated Learning",
    category: "data-privacy",
    level: "進階",
    summary: "讓多家醫院在病人資料不離開各自機構的前提下共同訓練模型，只交換模型更新量，以兼顧隱私保護與資料規模。",
    related: ["medical-imaging-ai", "clinical-nlp"],
    updated: "2026-11-05"
  },
  {
    slug: "explainable-ai",
    title: "可解釋人工智慧",
    titleEn: "Explainable Artificial Intelligence",
    category: "trustworthy-ai",
    level: "進階",
    summary: "說明模型為何做出某一預測的方法，例如標示影像中的關鍵區域或列出主要風險因子，協助醫師檢查模型的判斷依據是否合理。",
    related: ["medical-imaging-ai", "regulation-and-validation", "algorithmic-fairness"],
    updated: "2026-11-05"
  },
  {
    slug: "algorithmic-fairness",
    title: "演算法公平性與偏誤",
    titleEn: "Algorithmic Fairness and Bias",
    category: "trustworthy-ai",
    level: "進階",
    summary: "探討醫療 AI 在不同性別、族群與社經背景病人之間表現不一致的現象，並說明偏誤的來源、評估方式與改善策略。",
    related: ["explainable-ai", "regulation-and-validation", "medical-imaging-ai"],
    updated: "2026-11-05"
  },
  {
    slug: "regulation-and-validation",
    title: "醫療 AI 的法規與臨床驗證",
    titleEn: "Regulation and Clinical Validation of Medical AI",
    category: "regulation",
    level: "進階",
    summary: "說明醫療 AI 作為醫療器材軟體的上市審查架構，以及從內部驗證、外部驗證到前瞻性研究與上市後監測的臨床證據層級。",
    related: ["medical-imaging-ai", "explainable-ai", "algorithmic-fairness"],
    updated: "2026-11-05"
  },
  // @new-topic-insert（請勿刪除此行：scripts/new-topic.mjs 會在此行之前插入新主題）
];
