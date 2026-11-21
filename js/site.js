/* Site behaviour. You normally don't need to edit this file:
   change your settings in js/config.js instead. */
(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var doc = document;
  doc.documentElement.classList.add("js");

  /* ---------- Helpers ---------- */
  function el(tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function icon(id, cls) {
    var svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon" + (cls ? " " + cls : ""));
    svg.setAttribute("aria-hidden", "true");
    var use = doc.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#" + id);
    svg.appendChild(use);
    return svg;
  }
  /* Prices: accepts 1500, "1500", "1,500" or "S$1500" */
  function money(n) {
    var v = Number(String(n).replace(/[^\d.]/g, ""));
    return isFinite(v) && String(n).trim() !== "" ? v.toLocaleString("en-SG") : String(n);
  }
  /* WhatsApp number from config; if it's missing, keep the number already in the HTML links */
  var staticWa = doc.querySelector('a[href^="https://wa.me/"]');
  var FALLBACK_NUM = staticWa ? staticWa.getAttribute("href").replace(/^https:\/\/wa\.me\/(\d+).*$/, "$1") : "";
  var WA_NUM = String(C.whatsappNumber || "").replace(/\D/g, "") || FALLBACK_NUM;
  if (!String(C.whatsappNumber || "").replace(/\D/g, "")) console.warn("config.js: whatsappNumber is empty, using the number in the HTML.");
  function prettyNumber(d) {
    return d.length === 10 && d.indexOf("65") === 0 ? "+65 " + d.slice(2, 6) + " " + d.slice(6) : "+" + d;
  }
  function waLink(message) {
    var num = WA_NUM;
    return "https://wa.me/" + num + (message ? "?text=" + encodeURIComponent(message) : "");
  }
  function waButton(label, message, extraCls) {
    var a = el("a", "btn" + (extraCls ? " " + extraCls : ""));
    a.href = waLink(message);
    a.target = "_blank";
    a.rel = "noopener";
    a.appendChild(icon("i-wa"));
    a.appendChild(el("span", null, label));
    return a;
  }

  /* ---------- WhatsApp links (data-wa="hero" etc.) ---------- */
  var msgs = C.whatsappMessages || {};
  doc.querySelectorAll("[data-wa]").forEach(function (a) {
    var key = a.getAttribute("data-wa");
    a.href = waLink(msgs[key] || msgs.general || "");
  });
  /* Visible phone number text */
  doc.querySelectorAll("[data-wa-number]").forEach(function (n) { n.textContent = prettyNumber(WA_NUM); });

  /* ---------- Packages ---------- */
  var list = doc.getElementById("package-list");
  if (list && Array.isArray(C.packages)) {
    C.packages.forEach(function (p, i) {
      var slip = el("article", "slip" + (p.featured ? " is-featured" : ""));
      slip.setAttribute("aria-labelledby", "pkg-" + i);
      if (p.featured) slip.appendChild(el("span", "slip-tag", "Most popular"));

      var head = el("div", "slip-head");
      head.appendChild(el("span", "slip-doc", "Quotation"));
      head.appendChild(el("span", "slip-doc", "Option " + (i + 1)));
      slip.appendChild(head);

      var h = el("h3", "slip-name", p.name);
      h.id = "pkg-" + i;
      slip.appendChild(h);
      if (p.bestFor) slip.appendChild(el("p", "slip-for", p.bestFor));

      var ul = el("ul", "slip-items");
      (p.includes || []).forEach(function (item) {
        var li = el("li");
        li.appendChild(icon("i-check"));
        li.appendChild(el("span", null, item));
        ul.appendChild(li);
      });
      slip.appendChild(ul);

      var total = el("div", "slip-total");
      total.appendChild(el("span", "slip-total-label", "Total"));
      var amounts = el("div", "slip-amounts");
      if (p.oldPrice) {
        var deal = el("div", "slip-deal");
        if (C.discountTag) deal.appendChild(el("span", "slip-off", C.discountTag));
        var was = el("s", "slip-was");
        was.appendChild(el("span", "sr-only", "usual price "));
        was.appendChild(doc.createTextNode("S$" + money(p.oldPrice)));
        deal.appendChild(was);
        amounts.appendChild(deal);
      }
      var now = el("div", "slip-now");
      now.appendChild(el("span", "slip-from", "from"));
      /* The price is real text, read once. (It used to be duplicated in an
         sr-only copy, which made it read "S$300 S$300" in the page text.) */
      var price = el("span", "slip-price");
      price.appendChild(el("span", "cur", "S$"));
      var amount = el("span", "amt", money(p.price));
      amount.setAttribute("data-value", String(p.price).replace(/[^\d.]/g, ""));
      price.appendChild(amount);
      now.appendChild(price);
      amounts.appendChild(now);
      total.appendChild(amounts);
      slip.appendChild(total);

      slip.appendChild(waButton("Ask about " + p.name, p.message, p.featured ? "" : "btn-dark"));
      slip.style.setProperty("--i", i);
      list.appendChild(slip);
    });
  }

  /* ---------- Motion moment 2: slips handed over + prices count up ----------
     Only runs if the packages start below the screen (so nothing visible ever
     disappears), and never with reduced motion. Prices are real text the
     whole time; the count only changes the digits, then lands on the exact value. */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (list && !reduceMotion && "IntersectionObserver" in window &&
      list.getBoundingClientRect().top > window.innerHeight) {
    var slipObs = new IntersectionObserver(function (entries) {
      if (!entries.some(function (en) { return en.isIntersecting; })) return;
      slipObs.disconnect();
      list.querySelectorAll(".slip").forEach(function (s) { s.classList.add("is-entering"); });
      list.querySelectorAll(".amt").forEach(countUp);
    }, { rootMargin: "0px 0px 60px 0px" });   /* start just before they appear */
    slipObs.observe(list);
  }
  function countUp(node) {
    var target = Number(node.getAttribute("data-value"));
    if (!isFinite(target) || target <= 0) return;
    var finalText = node.textContent;
    node.setAttribute("aria-hidden", "true");
    node.style.display = "inline-block";
    node.style.minWidth = node.getBoundingClientRect().width + "px";  /* no layout shift */
    node.style.textAlign = "right";
    var start = null, dur = 650;
    function frame(t) {
      if (start === null) start = t;
      var k = Math.min(1, (t - start) / dur);
      var eased = 1 - Math.pow(1 - k, 3);              /* decelerate on arrival */
      node.textContent = k < 1 ? money(Math.round(target * eased / 10) * 10) : finalText;
      if (k < 1) requestAnimationFrame(frame); else node.removeAttribute("aria-hidden");
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Launch discount note (config: launchNote) ---------- */
  var note = doc.getElementById("launch-note");
  if (note && C.launchNote) { note.textContent = C.launchNote; note.hidden = false; }

  /* ---------- Care plan ---------- */
  var care = doc.getElementById("care-plan");
  if (care && C.carePlan) {
    var cp = C.carePlan;
    var txt = el("div");
    var t = el("p", "care-title");
    t.appendChild(doc.createTextNode(cp.name + " "));
    t.appendChild(el("span", "care-price", "from S$" + money(cp.pricePerMonth) + "/month"));
    txt.appendChild(t);
    txt.appendChild(el("p", null, cp.description));
    care.appendChild(txt);
    var a = el("a", null, "Ask about the " + cp.name);
    a.href = waLink(cp.message);
    a.target = "_blank";
    a.rel = "noopener";
    care.appendChild(a);
    care.hidden = false;
  }

  /* ---------- Portfolio (hidden when empty) ---------- */
  var projects = (C.projects || []).filter(function (p) { return p && p.name; });
  var work = doc.getElementById("work");
  var workList = doc.getElementById("work-list");
  if (work && workList && projects.length) {
    projects.forEach(function (p) {
      var card = el(p.url ? "a" : "div", "work-card");
      if (p.url) { card.href = p.url; card.target = "_blank"; card.rel = "noopener"; }
      if (p.image) {
        var img = el("img");
        img.src = p.image;
        img.alt = "Screenshot of the " + p.name + " website";
        img.loading = "lazy";
        img.decoding = "async";
        img.width = 800;
        img.height = 600;
        card.appendChild(img);
      }
      card.appendChild(el("h3", null, p.name));
      if (p.type) card.appendChild(el("p", null, p.type));
      if (p.url) card.appendChild(el("span", "btn-link", "Visit website"));
      workList.appendChild(card);
    });
    work.hidden = false;
  }

  /* ---------- Instagram (hidden when no handle) ---------- */
  var handle = String(C.instagramHandle || "").replace(/^@/, "").trim();
  doc.querySelectorAll("[data-instagram]").forEach(function (li) {
    if (!handle) return;
    var link = li.querySelector("a");
    link.href = "https://www.instagram.com/" + encodeURIComponent(handle) + "/";
    li.hidden = false;
  });

  /* ---------- Year ---------- */
  doc.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });

  /* ---------- Meta Pixel (only loads with a real ID) ---------- */
  var pixelId = String(C.metaPixelId || "").trim();
  var pixelOn = /^\d{6,20}$/.test(pixelId);
  if (pixelOn) {
    /* Standard Meta Pixel base code */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }
  /* Cookie notice in the footer only shows while the Pixel is actually on */
  doc.querySelectorAll("[data-pixel-notice]").forEach(function (n) { n.hidden = !pixelOn; });
  /* "Contact" event on every WhatsApp tap (works for buttons added later too) */
  function trackContact(e) {
    if (e.type === "auxclick" && e.button !== 1) return;  /* middle-click only */
    var a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
    if (a && pixelOn && typeof window.fbq === "function") window.fbq("track", "Contact");
  }
  doc.addEventListener("click", trackContact);
  doc.addEventListener("auxclick", trackContact);

  /* ---------- Header border on scroll ---------- */
  var header = doc.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Floating WhatsApp: hide when a big WhatsApp button is on screen ---------- */
  var float = doc.querySelector(".wa-float");
  if (float && "IntersectionObserver" in window) {
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.isIntersecting ? visible.add(en.target) : visible.delete(en.target); });
      float.classList.toggle("is-hidden", visible.size > 0);
    }, { threshold: 0.4 });
    doc.querySelectorAll(".hero-actions .btn, .promise-cta, .contact-copy .btn, .site-footer").forEach(function (n) { io.observe(n); });

    /* Never sit on top of a price or a call-to-action: watch a strip at the
       bottom of the screen, as tall as the button, and hide the button
       while any price row or button is inside that strip. */
    var under = new Set(), strip;
    function watchStrip() {
      if (strip) strip.disconnect();
      under.clear();
      var top = Math.max(0, window.innerHeight - 100);
      strip = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? under.add(en.target) : under.delete(en.target); });
        float.classList.toggle("is-covering", under.size > 0);
      }, { rootMargin: "-" + top + "px 0px 0px 0px" });
      doc.querySelectorAll(".slip-total, .btn, .cta-band, .care a").forEach(function (n) { strip.observe(n); });
    }
    watchStrip();
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(watchStrip, 200); });
  }

})();
