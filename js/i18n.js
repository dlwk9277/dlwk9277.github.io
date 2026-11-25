/* Language switch: English (default) or Chinese (简体).
   Runs before site.js. English text stays in index.html; for Chinese this file swaps the text in
   and translates the labels from config.js. To fix a Chinese sentence, edit it below.
   Share a Chinese link with ?lang=zh  (e.g. https://jiebuilds.com/?lang=zh) */
(function () {
  "use strict";
  var doc = document, LANG = "en";
  try {
    var q = /[?&]lang=(zh|en)\b/.exec(location.search);
    if (q) { LANG = q[1]; localStorage.setItem("lang", LANG); }
    else if (localStorage.getItem("lang") === "zh") LANG = "zh";
  } catch (e) { if (/[?&]lang=zh\b/.test(location.search)) LANG = "zh"; }
  window.SITE_LANG = LANG;

  /* Switcher buttons (both languages): remember the choice and reload so everything is rebuilt */
  function wire() {
    doc.querySelectorAll("[data-lang]").forEach(function (b) {
      var on = b.getAttribute("data-lang") === LANG;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.addEventListener("click", function () {
        var to = b.getAttribute("data-lang");
        if (to === LANG) return;
        try { localStorage.setItem("lang", to); } catch (e) {}
        var u = location.pathname + (location.hash || "");
        location.href = u + (u.indexOf("?") < 0 ? "" : "");
      });
    });
  }
  doc.documentElement.setAttribute("lang", LANG === "zh" ? "zh-Hans-SG" : "en-SG");
  wire();
  if (LANG !== "zh") return;

  /* ---------- Chinese: page text ---------- */
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  function H(sel, html, i) { var n = $$(sel)[i || 0]; if (n) n.innerHTML = html; }
  /* replace only the last text node (keeps icons and other child elements) */
  function Tn(sel, text, i) {
    var n = $$(sel)[i || 0]; if (!n) return;
    for (var k = n.childNodes.length - 1; k >= 0; k--) {
      var c = n.childNodes[k];
      if (c.nodeType === 3 && c.textContent.trim()) { c.textContent = text; return; }
    }
  }
  function A(sel, attr, v) { var n = $(sel); if (n) n.setAttribute(attr, v); }

  var PAGE = doc.body.getAttribute("data-page");   /* set on the aircon / plumber pages: they carry their own Chinese in data-zh */
  if (PAGE && window.PAGE_ZH) { doc.title = window.PAGE_ZH.title; A('meta[name="description"]', "content", window.PAGE_ZH.desc); }
  if (!PAGE) doc.title = "新加坡家居服务生意网站设计 | 杰 Builds";
  if (!PAGE) A('meta[name="description"]', "content", "为新加坡冷气、水管、清洁和装修生意制作网站。5 个工作天上线，免费托管，S$150 至 S$300。付款前先看免费设计预览。");
  Tn(".skip-link", "跳到内容");
  var hp = $(".hero-proof-text"); if (hp) hp.textContent = "我的作品";
  ["价格", "流程", "常见问题"].forEach(function (t, i) { Tn(".site-nav a", t, i); });
  A(".wordmark", "aria-label", "杰 Builds，回到顶部");

  /* The headline: plain text in Chinese (the word-by-word slide-in is for English only) */
  var h1 = $(".hero-title");
  if (h1 && !PAGE) {
    h1.removeAttribute("data-split");
    h1.innerHTML = '为您的家居服务生意带来<span class="mark" data-mark>更多询问</span>。';
  }
  if (!PAGE) H(".hero-sub", "为新加坡的冷气、水管、电工、清洁、搬家和装修生意制作网站，价格和 WhatsApp 一键即达。<strong>5 个工作天上线，免费托管。</strong>");
  Tn(".hero-actions .btn span", "WhatsApp 联系杰");
  Tn(".btn-ghost", "查看价格");
  ["免费设计预览", "现在付 50%，满意后再付 50%", "网站归您所有"].forEach(function (t, i) { Tn(".hero-terms li", t, i); });
  if (!PAGE) Tn(".hero-visual figcaption", "拖动对比。仅为示例，并非真实客户。");
  Tn(".cmp-tag-before", "之前"); Tn(".cmp-tag-after", "之后");
  A(".cmp-range", "aria-label", "对比前后：向左拖动可看到更多新网站");

  Tn("#calc-title", "查看您的价格");
  Tn(".calc-form legend", "您的网站");
  Tn(".quote-head > span", "您的报价");
  Tn(".quote-pkg", "套餐");
  H(".quote-total-label", "总计<small>起步价</small>");
  Tn("#calc-send span", "把此报价发给杰");
  Tn(".calc-note", "含免费托管。开工前，我会在 WhatsApp 上确认最终价格。");
  Tn("#calc-mini-send", "发送");
  Tn(".calc-mini b", "从 S$");

  Tn("#work-title", "近期作品");
  if (!PAGE) {
  Tn("#why-title", "为什么要有网站？");
  Tn(".why-claim", "的受访者说，没有网站的生意让人觉得没那么“真实”。");
  Tn(".why-card h3", "有网站", 0); Tn(".why-card h3", "没有网站", 1);
  [[["谷歌搜索", "客户看到您的服务、地区和价格。"], ["信任", "先看照片和价格才发消息，所以“多少钱？”的问题更少。"],
    ["深夜", "晚上 11 点网站照样开着，WhatsApp 按钮把访客变成询问。"], ["朋友推荐", "朋友推荐您，对方上网搜您的名字，找到一家真实的生意。"],
    ["所有权", "网站归您所有。社交媒体页面可能改变或消失。"]],
   [["谷歌搜索", "客户只看到地图上的一个点和一个电话号码。"], ["信任", "什么都得问您，或者直接找下一家。"],
    ["深夜", "他们可能给最先回复的那家发消息。"], ["朋友推荐", "他们搜您的名字，却找不到什么能证明您是真的。"],
    ["所有权", "您依赖不属于您的页面。"]]]
    .forEach(function (rows, c) {
      var card = $$(".why-card")[c]; if (!card) return;
      rows.forEach(function (p, i) { var li = $$("li", card)[i]; if (li) li.innerHTML = "<b>" + p[0] + "</b>" + p[1]; });
    });
  H(".why-source", '来源：<a href="https://www.dreamhost.com/blog/dreamhost-2026-local-business-trust-index/" target="_blank" rel="noopener">DreamHost《2026 本地生意信任指数》（Local Business Trust Index）</a>');

  }
  Tn("#how-title", "流程");
  [["WhatsApp 联系我", "告诉我您做什么生意。"], ["免费预览", "付款前，先看您的首页。"],
   ["付 50%，我来制作", "包含 2 轮修改。"], ["5 个工作天上线", "付清另外 50%。网站归您所有。"]]
    .forEach(function (p, i) { var li = $$(".how-steps li")[i]; if (li) { li.querySelector("b").textContent = p[0]; li.querySelector("span").textContent = p[1]; } });

  Tn("#faq-title", "常见问题");
  if (!PAGE)
  [["我需要给您什么资料？", "您的公司名称、服务项目、服务地区、大概的价格，以及用手机拍的工作照片。没有 logo？我会用清晰的文字设置您的名称。不知道怎么写？我会在 WhatsApp 上帮您。资料齐了，5 个工作天内上线。"],
   ["怎么付款？", "用 PayNow。看过免费预览并确认后付 50%，网站完成、您满意后再付 50%。没有隐藏费用。"],
   ["网站归我所有吗？", "是的。付清尾款后，网站和所有文件都归您所有，以后也可以找别人接手。"],
   ["什么是免费的？域名呢？", "托管没有月费。您自己的域名，例如 yourbusiness.sg，是可选的：每年约 S$20 到 S$60，用您的名字购买。我会帮您选择并连接。"],
   ["以后需要修改怎么办？", "维护计划每月 S$50 起，包括更新文字、照片和价格，以及小修小补。或者直接 WhatsApp 我，动手前我会先为这一项修改报价。"]]
    .forEach(function (p, i) { var d = $$(".faq-list details")[i]; if (d) { d.querySelector("summary").textContent = p[0]; d.querySelector(".faq-a p").textContent = p[1]; } });

  Tn("#contact-title", "联系杰");
  Tn(".contact-copy > p", "您会直接和制作网站的我聊，没有销售人员。");
  Tn(".contact-copy .btn span", "WhatsApp 联系杰");
  A(".portrait img", "alt", "杰的插画头像");
  Tn(".footer-brand", "杰 Builds，新加坡");
  Tn(".footer-small", "为家居服务和装修生意制作网站。");
  H(".footer-privacy", '<span data-pixel-notice hidden>本网站使用 Meta Pixel cookies 来衡量广告效果。</span>WhatsApp 消息只用于回复您的询问。<a href="privacy.html">阅读隐私声明</a>（英文）。');
  Tn('.footer-links a[href="privacy.html"]', "隐私");
  A(".wa-float", "aria-label", "在 WhatsApp 上联系杰");

  /* Any element with data-zh gets that Chinese text (used on the aircon / plumber pages and the footer links) */
  $$("[data-zh]").forEach(function (n) { n.innerHTML = n.getAttribute("data-zh"); });
  $$("[data-zh-alt]").forEach(function (n) { n.setAttribute("alt", n.getAttribute("data-zh-alt")); });

  /* ---------- Chinese: labels from config.js ---------- */
  var C = window.SITE_CONFIG || {};
  var MAP = {
    "Starter": "入门版", "Business": "商业版",
    "One page": "单页网站", "Services, prices, photos, WhatsApp": "服务、价格、照片、WhatsApp",
    "A page for each service": "每项服务一页", "4 to 6 pages": "4 到 6 页",
    "Get found": "让客户找到您", "Tools that answer customers": "自动回复客户的工具", "Free with any package": "任何套餐都免费",
    "Automation": "自动化",
    "Photo gallery": "照片库", "Google Maps": "谷歌地图", "Google SEO": "谷歌搜索优化",
    "Quote calculator": "报价计算器", "Booking form": "预约表单", "WhatsApp auto-reply": "WhatsApp 自动回复",
    "Chatbot": "聊天机器人", "Complex n8n automation": "复杂 n8n 自动化",
    "Leads into Google Sheets, invoices, reminders, AI replies": "询问存入 Google Sheets、发票、提醒、AI 回复",
    "Black Friday sale": "黑色星期五特惠", "12.12 sale": "12.12 特惠", "Christmas sale": "圣诞特惠", "New Year sale": "新年特惠",
    "Chinese New Year sale": "新春特惠", "Hari Raya sale": "哈芝节特惠", "Easter sale": "复活节特惠", "Labour Day sale": "劳动节特惠",
    "Vesak Day sale": "卫塞节特惠", "Great Singapore Sale": "新加坡大减价", "National Day sale": "国庆特惠", "9.9 sale": "9.9 特惠",
    "Mid-Autumn sale": "中秋特惠", "10.10 sale": "10.10 特惠", "Deepavali sale": "屠妖节特惠", "11.11 sale": "11.11 特惠"
  };
  function tr(s) { return MAP[s] || s; }
  (C.packages || []).forEach(function (p) { p.name = tr(p.name); });
  (C.saleEvents || []).forEach(function (e) { e.name = tr(e.name); });
  var cc = C.calculator;
  if (cc) {
    [cc.sizes, cc.groups, cc.extras].forEach(function (list) {
      (list || []).forEach(function (o) { o.label = tr(o.label); if (o.hint) o.hint = tr(o.hint); });
    });
    cc.extraNote = "单独报价，在 WhatsApp 上确认";
    cc.message = "您好杰，我用了您网站的价格计算器。我想要{package}套餐（从 S${price} 起），包含：{items}。可以聊聊吗？";
  }
  if (C.whatsappMessages) {
    var wm = C.whatsappMessages, a = "您好杰，我看到了您的网站，我想为我的生意做一个网站。";
    wm.general = a; wm.hero = a; wm.floating = a;
    wm.packages = "您好杰，我看到了您的套餐，可以帮我选一个适合我生意的吗？";
    wm.contact = "您好杰，我看到了您的网站，想和您聊聊为我的生意做网站。";
    wm.preview = "您好杰，我想为我的生意要一个免费的设计预览。";
  }
})();
