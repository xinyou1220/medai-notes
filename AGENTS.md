# AGENTS.md：醫療人工智慧概念講義（MedAI Notes）

本文件是本專案給 AI 程式助理（Claude Code、Codex、Cursor 等）與人工編輯共同遵守的規範。
修改或新增任何內容之前，請先完整閱讀本文件；若本文件與其他說明衝突，以本文件為準。

---

## 1. 專案目的

- 本專案是一個靜態網站，以「主題頁」為單位整理醫療人工智慧的概念、代表性案例與限制。
- **目標讀者**：具備基礎資訊或醫學背景的大學生、研究生與臨床人員。
- **核心原則**：
  - 每個主題頁都採用相同的結構，讀者可以用相同方式閱讀任何一頁。
  - 新增內容時，只需依照本文件的流程操作，不需要重新設計版面。
- **部署方式**：GitHub Pages（main 分支根目錄），不需建置步驟。

## 2. 技術架構與限制

| 項目 | 規範 |
|---|---|
| 技術 | 純 HTML、CSS、原生 JavaScript（ES5 相容寫法即可） |
| 建置 | 無。檔案直接部署，雙擊 `index.html` 也必須能在本機瀏覽 |
| 資料 | 放在 `data/*.js`，以 `window.SITE_DATA` 提供給頁面；不得改用 `fetch` 讀取 JSON（本機 `file://` 會失敗） |
| 共用版面 | 頁首、頁尾、導覽路徑、目次、相關主題、上一篇與下一篇，皆由 `assets/js/site.js` 產生 |
| 樣式 | 只能使用 `assets/css/style.css`；不得使用 `style` 屬性或在 HTML 中撰寫 `<style>` |
| 外部資源 | 不得使用 CDN、外部字型、追蹤碼或第三方套件 |
| 腳本 | `scripts/` 下的工具只能使用 Node.js 內建模組，不得新增 `package.json` 相依套件 |

## 3. 目錄結構

```
medai-notes/
├── AGENTS.md              本文件：專案規範（唯一的規則來源）
├── CLAUDE.md              指向本文件（供 Claude Code 自動載入）
├── README.md              專案簡介與快速開始
├── index.html             首頁（data-page="home"）
├── glossary.html          名詞表（data-page="glossary"）
├── about.html             關於本站（data-page="about"）
├── topics/                主題頁，一個主題一個檔案：<slug>.html
├── data/
│   ├── site.js            網站設定、導覽列、分類表、難度選項
│   ├── topics.js          主題登錄表（順序即建議閱讀順序）
│   └── glossary.js        名詞表資料
├── assets/
│   ├── css/style.css      全站樣式與設計變數
│   └── js/site.js         全站共用程式
├── templates/topic.html   主題頁範本（不直接部署為內容頁）
├── scripts/
│   ├── new-topic.mjs      由範本建立新主題頁並登錄資料
│   ├── check.mjs          規則檢查（提交前必須通過）
│   └── lib/load-data.mjs  供腳本讀取 data/*.js
├── .github/workflows/check.yml  推送時自動執行規則檢查
└── .nojekyll              讓 GitHub Pages 直接提供原始檔案
```

### 命名規則

- **主題 slug**：小寫英文單字，以連字號連接，須能表達主題，例如 `medical-imaging-ai`、`federated-learning`。
- **檔名**：主題頁檔名必須是 `topics/<slug>.html`，且與登錄表中的 `slug` 完全相同。
- **slug 不得變更**：發布後的 slug 會成為網址的一部分。若必須更名，須同時更新：
  - 所有 `related` 欄位
  - 名詞表的 `topics` 欄位
  - 所有內部連結
- **名詞與分類 id**：名詞 id 與分類 id 採用相同格式，例如 `cnn`、`differential-privacy`。

## 4. 網站風格

### 4.1 寫作語氣

- 使用 **繁體中文（台灣用語）**、正式書面語、客觀的第三人稱敘述。
- 不使用第一或第二人稱，例如「我」「你」「我們」。
- 不使用網路用語、驚嘆號、誇飾語氣，例如「超強」「完全取代醫師」。
- **全站禁止使用表情符號（emoji）**，包含頁面、資料檔、程式註解與文件。`check.mjs` 會檢查。
- **專有名詞**：
  - 首次出現時以「中文（English, 縮寫）」標註，例如「卷積神經網路（Convolutional Neural Network, CNN）」。
  - 之後可只寫中文或縮寫。
- **排版**：
  - 中文與英文、數字之間加一個半形空格，例如「2016 年」「AI 模型」。
  - 中文語句使用全形標點（，。：；「」（））。
- **引用研究**：
  - 須寫出第一作者與年份，例如「Gulshan 等人（2016）」，並列入該頁參考資料。
  - 數據須與原始文獻一致，不得四捨五入到改變意義。

### 4.2 視覺風格

- **整體**：簡潔、學術講義風格；主色為深青綠色（`--color-primary`）；標題使用襯線字體，內文使用無襯線字體。
- **淺色與深色模式**：皆已在 `style.css` 定義。新增顏色時必須同時定義兩種模式。
- **分類顏色**：每個分類有專屬顏色變數 `--cat-<分類 id>`，用於卡片上緣與分類標籤。
- **允許使用的內容元件**：只能使用下表元件，不得自行發明新的 class；確實需要時，先修改 `style.css` 與本表。

| 用途 | 寫法 |
|---|---|
| 補充說明 | `<div class="note"><p><span class="label">補充</span>內容</p></div>` |
| 注意事項 | `<div class="warning"><p><span class="label">注意</span>內容</p></div>` |
| 表格 | `<div class="table-wrap"><table><caption>表格說明</caption>...</table></div>` |
| 名詞連結 | `<a class="term" href="../glossary.html#<名詞 id>">名詞</a>` |
| 其他 | `<p>`、`<ul>`、`<ol>`、`<strong>`、`<code>`、`<cite>`、`<h3>`（僅限區塊內小標） |

## 5. 資料登錄表

### 5.1 `data/topics.js`（主題）

```js
{
  slug: "medical-imaging-ai",          // 與檔名相同
  title: "醫學影像 AI",                 // 與頁面 <h1> 相同
  titleEn: "Medical Imaging AI",        // 與頁面 p.title-en 相同
  category: "imaging",                  // 必須存在於 data/site.js 的 categories
  level: "入門",                        // 「入門」或「進階」
  summary: "……",                        // 30～80 字，用於首頁卡片與頁面 meta description
  related: ["explainable-ai"],          // 1～3 個既有主題 slug，不可包含自己
  updated: "2026-11-05"                 // 最後實質修改日期，YYYY-MM-DD
},
```

- 陣列順序就是 **建議閱讀順序**，也決定上一篇與下一篇。
- **排列原則**：
  - 同一分類的主題相鄰。
  - 入門主題排在進階主題之前。
- 新主題一律由 `scripts/new-topic.mjs` 插入，插入位置在 `// @new-topic-insert` 標記之前。若要調整閱讀順序，可再手動移動該筆資料。
- `related` 盡量雙向設定：A 列出 B 時，評估 B 是否也應列出 A。

### 5.2 `data/glossary.js`（名詞）

```js
{
  id: "cnn",
  term: "卷積神經網路",
  en: "Convolutional Neural Network (CNN)",
  definition: "……",                      // 40～120 字，一段完整敘述
  topics: ["medical-imaging-ai"]         // 出現此名詞的主題 slug，至少 1 個
},
```

- **排序**：依 `en` 的英文字母順序排列（不分大小寫）。`check.mjs` 會檢查。
- **收錄標準**：只收錄理解主題所需的核心名詞，一般用語不收錄。
- **連結方式**：主題頁內文以 `a.term` 連結名詞，每個名詞在同一頁只連結第一次出現的位置。

### 5.3 `data/site.js`（設定與分類）

- **現有分類**：`imaging`（醫學影像）、`clinical-text`（臨床文本）、`data-privacy`（資料與隱私）、`trustworthy-ai`（可信任 AI）、`regulation`（法規與驗證）。
- **新增分類**的步驟見第 7.4 節。

## 6. 主題頁規範

### 6.1 檔案骨架

- 一律由 `templates/topic.html` 產生，不得從零手寫。
- **必要屬性**：`<body>` 必須有 `data-page="topic"`、`data-root=".."`、`data-slug="<slug>"`。
- **標題**：`<title>` 格式為 `<主題名稱>｜醫療人工智慧概念講義`。
- **摘要**：`<meta name="description">` 必須與登錄表的 `summary` 完全相同。
- **自動產生的元素**：
  - `#breadcrumb`、`#topic-meta`、`#related`、`#pager`、`#toc` 由 `site.js` 自動產生。
  - HTML 中保留空元素即可，不要手動填入內容。

### 6.2 必備區塊（順序固定，標題文字固定）

| 順序 | id | 標題 | 撰寫要求 |
|---|---|---|---|
| 1 | `summary` | 摘要 | 1～2 句、60～120 字：這是什麼、在醫療上用來做什麼 |
| 2 | `background` | 背景與動機 | 1～2 段：醫療現場的問題與需求 |
| 3 | `principle` | 核心原理 | 2～4 段：運作方式，可用條列或表格；避免數學式 |
| 4 | `applications` | 臨床應用案例 | 2～4 個案例，每個以 `<h3>` 開頭，寫出研究或產品名稱、年份與主要結果 |
| 5 | `limitations` | 限制與風險 | 3～5 點 `<li>`，每點以 `<strong>關鍵詞</strong>` 開頭 |
| 6 | `key-points` | 重點整理 | 3～5 點 `<li>`，每點一句 |
| 7 | `references` | 參考資料 | 2～8 筆 `<li>`，每筆附 https 連結 |

- **正文長度**（不含參考資料）：1,000～2,500 字。
- **涉及安全或倫理的議題**：限制與風險之外，可在相關段落使用 `div.warning` 提醒。

### 6.3 參考資料格式

```html
<li>Gulshan V, et al. Development and validation of a deep learning algorithm for detection of
diabetic retinopathy in retinal fundus photographs. <cite>JAMA</cite>. 2016;316(22):2402-2410.
<a href="https://doi.org/10.1001/jama.2016.17216">doi:10.1001/jama.2016.17216</a></li>
```

- **作者**：第一作者「姓 名字縮寫」加上 `et al.`；作者不超過兩位時全部列出。
- **連結優先順序**：DOI（`https://doi.org/...`）> arXiv（`https://arxiv.org/abs/...`）> 主管機關或組織官方網頁。
- **嚴禁虛構文獻、作者、數據或 DOI**。只能引用確實存在且可查證的資料：
  - 無法確認時寧可不引用。
  - 新增的 DOI 應實際開啟或查詢確認。

## 7. 標準作業流程

### 7.1 新增一個主題頁

1. **確認不重複**：閱讀 `data/topics.js`，確認主題不與現有主題重複；若只是現有主題的一部分，改為擴充該頁。
2. **決定屬性**：決定 slug、分類與難度，分類必須使用既有分類。
3. **建立檔案**：執行
   ```
   node scripts/new-topic.mjs <slug> "<中文標題>" "<英文標題>" <分類 id> <入門|進階>
   ```
4. **撰寫內容**：依第 6 節撰寫 `topics/<slug>.html` 的 7 個區塊，並刪除所有「撰寫說明」註解與 `{{...}}` 佔位文字。
5. **填寫登錄表**：
   - 在 `data/topics.js` 填寫 `summary`（並同步到頁面的 meta description）與 `related`。
   - 需要時調整該筆資料的位置，以符合閱讀順序。
6. **處理名詞**：
   - 文中的核心名詞若已在名詞表，加上 `a.term` 連結。
   - 若尚未收錄，依第 7.3 節新增，並把本主題加入名詞的 `topics`。
7. **更新相關主題**：檢查其他主題的 `related`，必要時加入新主題。
8. **執行檢查**：執行 `node scripts/check.mjs`，必須是 0 個錯誤；警告也應修正。
9. **檢查版面**：在瀏覽器開啟頁面，確認桌面與手機寬度（約 375px）皆正常顯示。
10. **提交**：commit 訊息格式為 `content: 新增主題「<中文標題>」`。

### 7.2 修改既有主題頁

- 只修改需要變更的區塊，維持區塊結構與標題不變。
- 內容有實質修改時，更新登錄表的 `updated` 日期；只修正錯字時不更新。
- 修改 `summary` 時，必須同步修改頁面的 meta description。
- commit 訊息格式為 `content: 更新主題「<中文標題>」：<修改摘要>`。

### 7.3 新增名詞

1. 依 `en` 的字母順序，把名詞插入 `data/glossary.js` 的正確位置。
2. `definition` 寫成 40～120 字的完整敘述，不得只寫翻譯。
3. 在相關主題頁的第一次出現處加上 `a.term` 連結。
4. 執行 `node scripts/check.mjs`。

### 7.4 新增分類

1. 在 `data/site.js` 的 `categories` 新增 `id`、`name`、`description`。
2. 在 `style.css` 的淺色與深色變數區各新增 `--cat-<id>`，並新增 `[data-category="<id>"]` 選擇器。
3. 更新本文件第 5.3 節的分類清單。
4. 執行 `node scripts/check.mjs`。

### 7.5 新增其他類型的頁面

- **一般內文頁**（例如學習資源整理）：
  - 參照 `about.html`，設定 `data-page="about"`，使用 `.prose` 版面。
  - 需要出現在導覽列時，在 `data/site.js` 的 `nav` 新增項目。
- **需要新的渲染邏輯時**：
  - 在 `site.js` 新增以 `data-page` 判斷的函式。
  - 在同一次 commit 中更新本文件第 3 節與本節，說明新的頁面類型。

## 8. 內容正確性（醫療內容特別規範）

- **不提供醫療建議**：不得提供個人化的醫療建議、診斷或用藥指示。內容以說明技術與研究為目的。
- **效能數據須附來源**：寫出準確率、AUC 等數據時，必須說明資料來源、研究設計與適用範圍，不得把回顧性研究的結果寫成臨床定論。
- **標示時效**：法規、產品核准狀態等會隨時間變動的資訊，須標示時間點，例如「截至 2024 年」「於 2018 年獲准」。
- **不確定時保守撰寫**：無法確認的事實不寫；需要推論時，明確寫出「可能」「研究顯示」等限定語，不得誇大。
- **呈現兩面**：介紹新技術時，必須同時呈現其限制，避免只寫優點。

## 9. 檢查與發布

- **提交前必須執行** `node scripts/check.mjs`，錯誤數必須為 0。檢查項目包括：
  - 登錄表欄位與字數
  - 主題頁的必備區塊、順序與數量
  - 標題與摘要的一致性
  - 內部連結與名詞連結
  - 禁止 `style` 屬性、內嵌 script 與外部資源
  - 全專案禁止表情符號
  - 中英文間距與全形標點（警告）
- **自動檢查**：推送到 GitHub 時，`.github/workflows/check.yml` 會自動執行同一份檢查。
- **commit 訊息前綴**：

| 前綴 | 用途 |
|---|---|
| `content:` | 主題、名詞等內容 |
| `feat:` | 功能 |
| `style:` | 樣式 |
| `fix:` | 修正錯誤 |
| `docs:` | 文件 |
| `chore:` | 工具與設定 |

- **發布方式**：推送到 main 分支後，GitHub Pages 自動更新，不需額外步驟。

## 10. 禁止事項

- 修改頁首、頁尾等共用版面時，直接改 HTML（應修改 `site.js`）。
- 在 HTML 中使用 `style` 屬性、`<style>`、內嵌 `<script>`。
- 引入框架、建置工具、npm 套件、CDN 或外部字型。
- 變更主題頁的區塊順序、區塊 id 或標題文字。
- 虛構文獻、數據、DOI 或產品資訊。
- 使用表情符號。
- 修改規則卻沒有同步更新本文件。

## 11. 完成定義（Definition of Done）

AI 完成任務後，回報時須列出新增或修改的檔案、`check.mjs` 的執行結果，以及仍需人工確認的事項（例如待查證的文獻）。

每次新增或修改內容，須確認以下項目全部成立才算完成：

- [ ] 主題頁由範本產生，7 個必備區塊齊全、順序正確，無佔位文字與撰寫說明註解。
- [ ] 登錄表資料完整，`summary` 與 meta description 一致，`related` 已設定。
- [ ] 新出現的核心名詞已加入名詞表並建立連結。
- [ ] 參考資料皆真實可查證，且附有連結。
- [ ] `node scripts/check.mjs` 為 0 個錯誤、0 個警告。
- [ ] 已在瀏覽器確認桌面與手機版面。
- [ ] commit 訊息符合第 9 節格式。
