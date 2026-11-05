/*
 * 醫療人工智慧概念講義：全站共用程式
 *
 * 依 <body data-page="..."> 決定要執行哪一種頁面的渲染：
 *   home     首頁：統計數字、搜尋與分類篩選、主題卡片、建議閱讀順序
 *   topic    主題頁：導覽路徑、主題資訊列、目次、相關主題、上一篇／下一篇、名詞提示
 *   glossary 名詞表：依資料產生名詞清單與搜尋
 *   about    一般內文頁：僅產生頁首與頁尾
 *
 * 所有頁面共用的頁首與頁尾都由本檔產生，HTML 中只需保留
 * <header id="site-header"></header> 與 <footer id="site-footer"></footer>。
 * 資料來源：data/site.js、data/topics.js、data/glossary.js（須在本檔之前載入）。
 */
(function () {
  "use strict";

  var DATA = window.SITE_DATA || {};
  var SITE = DATA.site || {};
  var TOPICS = DATA.topics || [];
  var GLOSSARY = DATA.glossary || [];
  var CATEGORIES = DATA.categories || {};
  var LEVELS = DATA.levels || [];

  var body = document.body;
  var ROOT = body.getAttribute("data-root") || ".";
  var PAGE = body.getAttribute("data-page") || "";
  var CHARS_PER_MINUTE = 400;

  /* ---------- 工具函式 ---------- */

  function url(path) {
    return ROOT + "/" + path;
  }

  function topicUrl(slug) {
    return url("topics/" + slug + ".html");
  }

  function h(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === "text") node.textContent = value;
        else if (key === "className") node.className = value;
        else node.setAttribute(key, value);
      });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function findTopic(slug) {
    for (var i = 0; i < TOPICS.length; i++) {
      if (TOPICS[i].slug === slug) return TOPICS[i];
    }
    return null;
  }

  function categoryName(id) {
    return CATEGORIES[id] ? CATEGORIES[id].name : id;
  }

  function categoryTag(id) {
    return h("span", { className: "cat-tag", "data-category": id, text: categoryName(id) });
  }

  function topicCard(topic, headingTag) {
    return h("a", { className: "card", href: topicUrl(topic.slug), "data-category": topic.category }, [
      h("div", { className: "card-meta" }, [
        categoryTag(topic.category),
        h("span", { className: "level-tag", text: topic.level })
      ]),
      h(headingTag || "h3", { text: topic.title }),
      h("p", { className: "title-en", text: topic.titleEn }),
      h("p", { text: topic.summary })
    ]);
  }

  /* ---------- 頁首與頁尾 ---------- */

  function renderHeader() {
    var mount = document.getElementById("site-header");
    if (!mount) return;
    mount.className = "site-header";
    var items = (SITE.nav || []).map(function (item) {
      var current = item.page === PAGE ? "page" : null;
      return h("li", null, [h("a", { href: url(item.href), "aria-current": current, text: item.label })]);
    });
    mount.appendChild(
      h("div", { className: "container" }, [
        h("a", { className: "brand", href: url("index.html") }, [
          h("span", { className: "brand-name", text: SITE.name }),
          h("span", { className: "brand-en", text: SITE.nameEn })
        ]),
        h("nav", { className: "site-nav", "aria-label": "主要導覽" }, [h("ul", null, items)])
      ])
    );
  }

  function renderFooter() {
    var mount = document.getElementById("site-footer");
    if (!mount) return;
    mount.className = "site-footer";
    var lines = [
      h("p", { text: SITE.name + "（" + SITE.nameEn + "）" }),
      h("p", { text: "本站內容僅供學習參考，不構成任何醫療建議、診斷或治療依據。" })
    ];
    if (SITE.repo) {
      lines.push(h("p", null, ["原始碼與編寫規範：", h("a", { href: SITE.repo, text: SITE.repo })]));
    }
    mount.appendChild(h("div", { className: "container" }, lines));
  }

  /* ---------- 首頁 ---------- */

  function renderHome() {
    var stats = document.getElementById("stats");
    if (stats) {
      var categoryCount = Object.keys(CATEGORIES).length;
      [
        [TOPICS.length, "主題"],
        [categoryCount, "分類"],
        [GLOSSARY.length, "名詞"]
      ].forEach(function (pair) {
        stats.appendChild(h("li", null, [h("strong", { text: String(pair[0]) }), h("span", { text: pair[1] })]));
      });
    }

    var grid = document.getElementById("topic-grid");
    var search = document.getElementById("topic-search");
    var categoryChips = document.getElementById("category-filter");
    var levelChips = document.getElementById("level-filter");
    var resultCount = document.getElementById("result-count");
    var state = { category: "all", level: "all", query: "" };

    function makeChips(container, key, options) {
      if (!container) return;
      options.forEach(function (option) {
        var chip = h("button", {
          type: "button",
          className: "chip",
          "aria-pressed": option.value === state[key] ? "true" : "false",
          text: option.label
        });
        chip.addEventListener("click", function () {
          state[key] = option.value;
          Array.prototype.forEach.call(container.children, function (c) {
            c.setAttribute("aria-pressed", c === chip ? "true" : "false");
          });
          update();
        });
        container.appendChild(chip);
      });
    }

    makeChips(categoryChips, "category", [{ value: "all", label: "全部分類" }].concat(
      Object.keys(CATEGORIES).map(function (id) { return { value: id, label: CATEGORIES[id].name }; })
    ));
    makeChips(levelChips, "level", [{ value: "all", label: "全部難度" }].concat(
      LEVELS.map(function (level) { return { value: level, label: level }; })
    ));

    function matches(topic) {
      if (state.category !== "all" && topic.category !== state.category) return false;
      if (state.level !== "all" && topic.level !== state.level) return false;
      if (!state.query) return true;
      var haystack = [topic.title, topic.titleEn, topic.summary, categoryName(topic.category)].join(" ").toLowerCase();
      return haystack.indexOf(state.query) !== -1;
    }

    function update() {
      if (!grid) return;
      grid.textContent = "";
      var shown = TOPICS.filter(matches);
      shown.forEach(function (topic) {
        grid.appendChild(h("li", null, [topicCard(topic)]));
      });
      if (!shown.length) {
        grid.appendChild(h("li", { className: "empty-state", text: "沒有符合條件的主題，請調整搜尋文字或篩選條件。" }));
      }
      if (resultCount) resultCount.textContent = "共 " + shown.length + " 個主題";
    }

    if (search) {
      search.addEventListener("input", function () {
        state.query = search.value.trim().toLowerCase();
        update();
      });
    }
    update();

    var path = document.getElementById("reading-path");
    if (path) {
      TOPICS.forEach(function (topic) {
        path.appendChild(h("li", null, [
          h("a", { href: topicUrl(topic.slug), text: topic.title }),
          "（" + topic.level + "，" + categoryName(topic.category) + "）"
        ]));
      });
    }
  }

  /* ---------- 主題頁 ---------- */

  function renderTopic() {
    var slug = body.getAttribute("data-slug");
    var topic = findTopic(slug);
    if (!topic) return;
    var index = TOPICS.indexOf(topic);

    var crumb = document.getElementById("breadcrumb");
    if (crumb) {
      crumb.appendChild(h("ol", null, [
        h("li", null, [h("a", { href: url("index.html"), text: "首頁" })]),
        h("li", { text: categoryName(topic.category) }),
        h("li", { "aria-current": "page", text: topic.title })
      ]));
    }

    var meta = document.getElementById("topic-meta");
    var article = document.querySelector("article.topic");
    if (meta && article) {
      var length = 0;
      article.querySelectorAll("section[id] p, section[id] li, section[id] td").forEach(function (n) {
        length += n.textContent.replace(/\s+/g, "").length;
      });
      var minutes = Math.max(1, Math.round(length / CHARS_PER_MINUTE));
      meta.appendChild(categoryTag(topic.category));
      meta.appendChild(h("span", { text: "難度：" + topic.level }));
      meta.appendChild(h("span", { text: "預估閱讀時間：約 " + minutes + " 分鐘" }));
      meta.appendChild(h("span", { text: "最後更新：" + topic.updated }));
    }

    var toc = document.getElementById("toc");
    if (toc && article) {
      var links = [];
      var list = h("ol");
      article.querySelectorAll("section[id] > h2").forEach(function (heading) {
        var id = heading.parentElement.id;
        var link = h("a", { href: "#" + id, text: heading.textContent });
        links.push({ id: id, link: link });
        list.appendChild(h("li", null, [link]));
      });
      toc.appendChild(h("h2", { text: "本頁目次" }));
      toc.appendChild(list);
      if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (item) {
              item.link.classList.toggle("active", item.id === entry.target.id);
            });
          });
        }, { rootMargin: "-20% 0px -70% 0px" });
        links.forEach(function (item) { observer.observe(document.getElementById(item.id)); });
      }
    }

    var related = document.getElementById("related");
    if (related && topic.related && topic.related.length) {
      var cards = h("ul", { className: "card-grid" });
      topic.related.forEach(function (relatedSlug) {
        var t = findTopic(relatedSlug);
        if (t) cards.appendChild(h("li", null, [topicCard(t, "h3")]));
      });
      related.appendChild(h("h2", { text: "相關主題" }));
      related.appendChild(cards);
    }

    var pager = document.getElementById("pager");
    if (pager) {
      var prev = TOPICS[index - 1];
      var next = TOPICS[index + 1];
      if (prev) {
        pager.appendChild(h("a", { className: "prev", href: topicUrl(prev.slug) }, [
          h("span", { text: "上一篇" }), prev.title
        ]));
      }
      if (next) {
        pager.appendChild(h("a", { className: "next", href: topicUrl(next.slug) }, [
          h("span", { text: "下一篇" }), next.title
        ]));
      }
    }

    // 名詞連結：滑鼠停留時顯示名詞表中的定義
    var definitions = {};
    GLOSSARY.forEach(function (entry) { definitions[entry.id] = entry; });
    document.querySelectorAll("a.term").forEach(function (link) {
      var id = (link.getAttribute("href") || "").split("#")[1];
      var entry = definitions[id];
      if (entry) link.setAttribute("title", entry.term + "（" + entry.en + "）：" + entry.definition);
    });
  }

  /* ---------- 名詞表 ---------- */

  function renderGlossary() {
    var list = document.getElementById("glossary-list");
    var search = document.getElementById("glossary-search");
    var count = document.getElementById("glossary-count");
    if (!list) return;

    var items = GLOSSARY.map(function (entry) {
      var topicLinks = [];
      (entry.topics || []).forEach(function (slug, i) {
        var t = findTopic(slug);
        if (!t) return;
        if (i > 0) topicLinks.push("、");
        topicLinks.push(h("a", { href: topicUrl(slug), text: t.title }));
      });
      var node = h("li", { className: "term-entry", id: entry.id }, [
        h("h3", { text: entry.term }),
        h("p", { className: "title-en", text: entry.en }),
        h("p", { text: entry.definition }),
        h("p", { className: "term-topics" }, ["出現於："].concat(topicLinks))
      ]);
      list.appendChild(node);
      return { entry: entry, node: node };
    });

    function update() {
      var q = search ? search.value.trim().toLowerCase() : "";
      var shown = 0;
      items.forEach(function (item) {
        var text = [item.entry.term, item.entry.en, item.entry.definition].join(" ").toLowerCase();
        var visible = !q || text.indexOf(q) !== -1;
        item.node.hidden = !visible;
        if (visible) shown++;
      });
      if (count) count.textContent = "共 " + shown + " 個名詞";
    }

    if (search) search.addEventListener("input", update);
    update();

    // 由主題頁連結進入時，捲動到指定名詞
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  /* ---------- 執行 ---------- */

  renderHeader();
  renderFooter();
  if (PAGE === "home") renderHome();
  if (PAGE === "topic") renderTopic();
  if (PAGE === "glossary") renderGlossary();
})();
