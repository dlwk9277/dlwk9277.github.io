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
      slip.setAttribute("data-reveal", "");
      slip.setAttribute("data-spot", "");
      if (p.featured) slip.appendChild(el("span", "slip-bg"));   /* inner layer for the moving border light */
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
      list.appendChild(slip);
    });
  }

  /* Prices count up when their card scrolls into view (see MOTION below).
     Prices are real text the whole time; the count only changes the digits,
     then lands on the exact value. */
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


  /* =====================================================================
     MOTION
     Runs only when <html> has the "motion" class (set in the <head> of
     index.html; never for visitors who asked for reduced motion).
     Everything here moves with transform/opacity only, and anything that
     loops is paused while it's off screen, so scrolling stays smooth.
     ===================================================================== */
  var html = doc.documentElement;
  var MOTION = html.classList.contains("motion");
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Cursor spotlight on cards (desktop only). It answers the pointer,
     so it also runs for reduced-motion visitors. */
  if (finePointer) {
    doc.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest("[data-spot]");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* Moving strips: a second copy of each strip follows the first, so the
     loop is seamless. (The strips are decorative and hidden from screen readers.) */
  doc.querySelectorAll(".marquee-track").forEach(function (t) { t.parentNode.appendChild(t.cloneNode(true)); });

  if (MOTION) {
    /* 1. Split headings into words, so each word can slide up from a mask.
          The words stay real text, so screen readers and Google read them normally. */
    doc.querySelectorAll("[data-split]").forEach(function (node) {
      var n = 0;
      (function walk(parent) {
        Array.prototype.slice.call(parent.childNodes).forEach(function (c) {
          if (c.nodeType === 1) { walk(c); return; }
          if (c.nodeType !== 3) return;
          var frag = doc.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(" ")); return; }
            var w = el("span", "w"), wi = el("span", "wi", part);
            wi.style.setProperty("--i", n++);
            w.appendChild(wi);
            frag.appendChild(w);
          });
          parent.replaceChild(frag, c);
        });
      })(node);
      node.classList.add("is-split");
    });

    /* 2. Reveal things as they scroll into view. Items that arrive together
          (a row of cards, a list) come in one after another. */
    function onReveal(entries, obs) {
      var k = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target;
        obs.unobserve(t);
        if (t.hasAttribute("data-reveal")) t.style.setProperty("--d", Math.min(k++ * 0.09, 0.45) + "s");
        t.classList.add("is-in");
        if (t.classList.contains("slip")) t.querySelectorAll(".amt").forEach(countUp);
        setTimeout(function () { t.classList.add("is-settled"); }, 1500);
      });
    }
    var revealObs = new IntersectionObserver(onReveal, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    /* Things at the very bottom of the page can't scroll any higher, so they
       reveal as soon as any part of them shows. */
    var edgeObs = new IntersectionObserver(onReveal, { threshold: 0 });
    doc.querySelectorAll("[data-reveal], [data-split]").forEach(function (n) {
      (n.classList.contains("footer-giant") ? edgeObs : revealObs).observe(n);
    });

    /* 3. Pause looping animations while they're off screen. */
    var loopObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle("is-paused", !en.isIntersecting); });
    });
    doc.querySelectorAll(".hero, .marquees, .slips").forEach(function (n) { loopObs.observe(n); });

    /* 4. Example enquiries popping up beside the phone, every 3 seconds. */
    var pings = doc.querySelectorAll(".ping");
    var hero = doc.querySelector(".hero");
    if (pings.length > 1 && hero) {
      var cur = 0, heroOn = true;
      setInterval(function () {
        if (!heroOn || doc.hidden) return;
        var out = pings[cur];
        out.classList.remove("is-on");
        out.classList.add("is-out");
        setTimeout(function () { out.classList.remove("is-out"); }, 700);
        cur = (cur + 1) % pings.length;
        pings[cur].classList.add("is-on");
      }, 3000);
      new IntersectionObserver(function (en) { heroOn = en[0].isIntersecting; }).observe(hero);
    }

    /* 5. The phone tilts gently towards the cursor (desktop only). */
    var tilt = doc.querySelector("[data-tilt]");
    if (tilt && hero && finePointer) {
      var tx = 0, ty = 0, tiltQueued = false;
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
        if (tiltQueued) return;
        tiltQueued = true;
        requestAnimationFrame(function () {
          tiltQueued = false;
          tilt.style.transform = "rotateY(" + (tx * 14).toFixed(2) + "deg) rotateX(" + (-ty * 10).toFixed(2) + "deg)";
        });
      }, { passive: true });
      hero.addEventListener("pointerleave", function () { tilt.style.transform = ""; });
    }

    /* 6. "How it works": the line fills and each step lights up as you scroll. */
    var steps = doc.querySelector("[data-timeline]");
    if (steps) {
      var stepItems = steps.querySelectorAll(".step");
      var howOn = false, howQueued = false;
      var paint = function () {
        howQueued = false;
        var r = steps.getBoundingClientRect();
        var line = window.innerHeight * 0.62;               /* the "reading line" on screen */
        var p = Math.max(0, Math.min(1, (line - r.top) / r.height));
        steps.style.setProperty("--p", p.toFixed(4));
        stepItems.forEach(function (s) {
          s.classList.toggle("is-lit", s.getBoundingClientRect().top < line);
        });
      };
      window.addEventListener("scroll", function () {
        if (howOn && !howQueued) { howQueued = true; requestAnimationFrame(paint); }
      }, { passive: true });
      new IntersectionObserver(function (en) { howOn = en[0].isIntersecting; if (howOn) paint(); }).observe(steps);
    }
  }

  window.__siteReady = true;
})();
