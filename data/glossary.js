/*
 * 名詞表：glossary.html 的資料來源，也提供主題頁中名詞連結的滑鼠提示。
 * 規則：依 en 欄位的英文字母順序排列（不分大小寫）；id 使用小寫英文與連字號。
 * 欄位規則請見 AGENTS.md「資料登錄表」一節。
 */
window.SITE_DATA = window.SITE_DATA || {};

window.SITE_DATA.glossary = [
  {
    id: "algorithmic-bias",
    term: "演算法偏誤",
    en: "Algorithmic Bias",
    definition: "模型對不同性別、族群或社經背景的群體，系統性地產生不同準確度或不同結果的現象，可能源自資料代表性、標籤定義、測量工具或部署方式，並可能擴大既有的健康不平等。",
    topics: ["algorithmic-fairness"]
  },
  {
    id: "auc",
    term: "ROC 曲線下面積",
    en: "Area Under the ROC Curve (AUC)",
    definition: "衡量分類模型區分陽性與陰性能力的指標，數值介於 0 到 1，越接近 1 表示區分能力越好，0.5 代表與隨機猜測相當；此指標不受單一判斷閾值影響，但不能直接反映臨床效益。",
    topics: ["medical-imaging-ai", "regulation-and-validation"]
  },
  {
    id: "cnn",
    term: "卷積神經網路",
    en: "Convolutional Neural Network (CNN)",
    definition: "一種專門處理影像等網格狀資料的深度學習架構，以可學習的濾波器擷取局部特徵，再經多層堆疊組合出高階特徵，是醫學影像分析最常用的模型架構。",
    topics: ["medical-imaging-ai", "explainable-ai"]
  },
  {
    id: "dataset-shift",
    term: "資料集偏移",
    en: "Dataset Shift",
    definition: "模型部署時遇到的資料分布與訓練資料不同的現象，例如更換影像設備、病人族群改變或臨床流程調整，可能導致模型效能下降，是需要上市後監測的主要原因之一。",
    topics: ["regulation-and-validation"]
  },
  {
    id: "differential-privacy",
    term: "差分隱私",
    en: "Differential Privacy",
    definition: "一種具數學定義的隱私保護方法，在統計結果或模型更新量中加入經過設計的雜訊，使外界難以推論任何單一個人的資料是否被使用，但雜訊可能降低模型準確度。",
    topics: ["federated-learning"]
  },
  {
    id: "ehr",
    term: "電子病歷",
    en: "Electronic Health Record (EHR)",
    definition: "以數位形式記錄病人健康資訊的系統，包含診斷、醫囑、檢驗結果、影像報告與病程紀錄等，其中許多資訊以自由文字記載，是臨床研究與醫療 AI 的重要資料來源。",
    topics: ["clinical-nlp", "federated-learning"]
  },
  {
    id: "external-validation",
    term: "外部驗證",
    en: "External Validation",
    definition: "以模型開發過程未使用過的資料評估模型效能，例如來自其他醫院、其他地區或其他時期的資料，用來確認模型能否推廣到不同的臨床環境與病人族群。",
    topics: ["medical-imaging-ai", "regulation-and-validation"]
  },
  {
    id: "fedavg",
    term: "聯邦平均演算法",
    en: "Federated Averaging (FedAvg)",
    definition: "聯邦學習中最常見的訓練方法，由各機構以本地資料訓練模型後上傳參數，中央伺服器再依各機構資料量加權平均，得到新的全域模型，並反覆進行多輪。",
    topics: ["federated-learning"]
  },
  {
    id: "grad-cam",
    term: "梯度加權類別活化映射",
    en: "Gradient-weighted Class Activation Mapping (Grad-CAM)",
    definition: "一種用於卷積神經網路的視覺化解釋方法，利用預測結果對卷積層特徵圖的梯度計算權重，產生熱圖標示影像中對預測影響最大的區域。",
    topics: ["explainable-ai"]
  },
  {
    id: "hallucination",
    term: "幻覺",
    en: "Hallucination",
    definition: "大型語言模型產生看似合理、語氣肯定，但與事實不符或缺乏依據的內容，例如虛構的文獻與錯誤的數據，是醫療應用中最主要的安全疑慮之一。",
    topics: ["medical-llm"]
  },
  {
    id: "segmentation",
    term: "影像分割",
    en: "Image Segmentation",
    definition: "將影像中的每個像素標示為所屬類別的任務，例如圈選腫瘤、器官或病灶範圍，可用於估算體積、追蹤病灶變化與規劃放射治療。",
    topics: ["medical-imaging-ai", "federated-learning"]
  },
  {
    id: "llm",
    term: "大型語言模型",
    en: "Large Language Model (LLM)",
    definition: "以大量文字資料預訓練、參數規模龐大的語言模型，能依照文字指令執行摘要、翻譯、問答與文件草擬等多種任務，但輸出內容不保證正確。",
    topics: ["medical-llm"]
  },
  {
    id: "ner",
    term: "命名實體辨識",
    en: "Named Entity Recognition (NER)",
    definition: "從文字中找出特定類別的詞彙或片語並加以標示的任務，在臨床文本中常用於辨識疾病、症狀、藥物、劑量與檢查項目，是許多臨床文本應用的基礎步驟。",
    topics: ["clinical-nlp"]
  },
  {
    id: "negation-detection",
    term: "否定偵測",
    en: "Negation Detection",
    definition: "判斷文字中提及的疾病或症狀是被確認存在還是被否定的任務，例如區分「有胸痛」與「否認胸痛」，可避免把已排除的診斷誤記為病人的病況。",
    topics: ["clinical-nlp"]
  },
  {
    id: "non-iid",
    term: "非獨立同分布資料",
    en: "Non-IID Data",
    definition: "各資料來源的資料分布彼此不同的情形，例如不同醫院的病人族群、設備與標註習慣不同，會使聯邦學習中各機構的模型更新方向不一致，影響全域模型的表現。",
    topics: ["federated-learning"]
  },
  {
    id: "proxy-variable",
    term: "代理變項",
    en: "Proxy Variable",
    definition: "以容易取得的變項代替難以直接測量的目標，例如以醫療費用代表健康需求；若代理變項與真正目標之間的關係在各群體間不同，模型就可能產生系統性偏誤。",
    topics: ["algorithmic-fairness"]
  },
  {
    id: "rag",
    term: "檢索增強生成",
    en: "Retrieval-Augmented Generation (RAG)",
    definition: "先從指定的資料來源檢索與問題相關的段落，再要求語言模型根據檢索結果作答的方法，可提供回答依據與出處，並降低模型產生錯誤內容的機會。",
    topics: ["medical-llm"]
  },
  {
    id: "sensitivity-specificity",
    term: "敏感度與特異度",
    en: "Sensitivity and Specificity",
    definition: "敏感度是實際患病者被判為陽性的比例，特異度是實際未患病者被判為陰性的比例；篩檢情境較重視敏感度以避免漏診，確診情境則需兼顧特異度。",
    topics: ["medical-imaging-ai", "regulation-and-validation", "algorithmic-fairness"]
  },
  {
    id: "shap",
    term: "SHAP",
    en: "SHapley Additive exPlanations (SHAP)",
    definition: "以賽局理論的 Shapley 值為基礎的解釋方法，計算每個輸入特徵對單一預測結果的貢獻方向與大小，常用於說明以表格型臨床資料建立的風險預測模型。",
    topics: ["explainable-ai"]
  },
  {
    id: "shortcut-learning",
    term: "捷徑學習",
    en: "Shortcut Learning",
    definition: "模型利用與目標無關、但在訓練資料中恰好與標籤相關的特徵做出判斷的現象，例如影像中的文字標記或醫院來源，使模型在新環境中的表現明顯下降。",
    topics: ["medical-imaging-ai", "explainable-ai", "algorithmic-fairness"]
  },
  {
    id: "samd",
    term: "醫療器材軟體",
    en: "Software as a Medical Device (SaMD)",
    definition: "依國際醫療器材法規管理論壇的定義，指本身具有一項或多項醫療用途、且不屬於醫療器材硬體一部分的軟體，例如以影像判斷疾病的 AI 軟體。",
    topics: ["regulation-and-validation"]
  },
  {
    id: "transfer-learning",
    term: "遷移學習",
    en: "Transfer Learning",
    definition: "先以大量資料訓練模型，再把學到的參數用於另一個相關任務並以少量資料微調的方法，可降低醫學影像等標註成本高昂的領域對標註資料量的需求。",
    topics: ["medical-imaging-ai"]
  },
  {
    id: "transformer",
    term: "Transformer 架構",
    en: "Transformer",
    definition: "以自注意力機制計算序列中各元素之間關聯的神經網路架構，可平行處理長篇文字，是 BERT 與大型語言模型等現代語言模型的共同基礎。",
    topics: ["clinical-nlp", "medical-llm"]
  }
];
