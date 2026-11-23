/* Site behaviour. You normally don't need to edit this file:
   change your settings in js/config.js instead. */
(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var doc = document;
  var ZH = window.SITE_LANG === "zh";
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

  /* ---------- Sale calendar (config: saleEvents) ----------
     Picks today's sale in Singapore time. No sale today = full prices. */
  function sgToday() {
    try {
      return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    } catch (e) {
      var d = new Date(Date.now() + 8 * 3600 * 1000);
      return d.toISOString().slice(0, 10);
    }
  }
  function niceDate(iso) {
    var m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var p = iso.split("-");
    return ZH ? Number(p[1]) + "月" + Number(p[2]) + "日" : Number(p[2]) + " " + m[Number(p[1]) - 1];
  }
  var today = sgToday();
  var SALE = (C.saleEvents || []).filter(function (e) { return e && e.from <= today && today <= e.to; })[0] || null;
  var daysLeft = SALE ? Math.round((Date.parse(SALE.to) - Date.parse(today)) / 864e5) : 0;
  /* Price right now: the sale price during a sale, otherwise the original. */
  function num(v) { return Number(String(v).replace(/[^\d.]/g, "")); }
  function onSale(p) { return !!(SALE && p.oldPrice && p.oldPrice > p.price); }
  function nowPrice(p) { return SALE || !p.oldPrice ? p.price : p.oldPrice; }

  var calc = C.calculator, pkgs = C.packages || [];

  /* ---------- Floating sale banner (stays at the top while you scroll) ---------- */
  var bar = doc.getElementById("sale-bar");
  if (bar && SALE && pkgs.length) {
    var first = pkgs[0];
    var ends = ZH ? (daysLeft === 0 ? "今天结束" : daysLeft === 1 ? "明天结束" : daysLeft <= 7 ? "还剩 " + daysLeft + " 天" : "至 " + niceDate(SALE.to))
      : daysLeft === 0 ? "ends today" : daysLeft === 1 ? "ends tomorrow" : daysLeft <= 7 ? daysLeft + " days left" : "until " + niceDate(SALE.to);
    bar.querySelector("[data-sale-text]").textContent = ZH
      ? SALE.name + "：S$" + money(first.price) + " 起" + (first.oldPrice ? "（原价 S$" + money(first.oldPrice) + "）" : "") + " · " + ends
      : SALE.name + ": from S$" + money(first.price) + (first.oldPrice ? " (was S$" + money(first.oldPrice) + ")" : "") + " · " + ends;
    bar.hidden = false;
  }

  /* ---------- Price calculator (config: packages, calculator) ----------
     Always shows the LOWEST package that covers everything picked.
     An "extra" (complex automation) is shown on its own line, never in the big number. */
  var sizesBox = doc.getElementById("calc-sizes"), extrasBox = doc.getElementById("calc-extras");
  if (calc && sizesBox && extrasBox && pkgs.length) {
    var rank = {};
    pkgs.forEach(function (p, i) { rank[p.id] = i; });
    function pkgOf(id) { return pkgs[rank[id] || 0]; }

    /* Site size: each option shows its own price */
    var pickSize = Math.max(0, (calc.sizes || []).findIndex(function (o) { return o.selected; }));
    (calc.sizes || []).forEach(function (o, i) {
      var lab = el("label", "calc-opt");
      var inp = el("input"); inp.type = "radio"; inp.name = "calc-size"; inp.value = String(i);
      if (i === pickSize) inp.checked = true;
      var box = el("span", "box");
      box.appendChild(el("b", null, o.label));
      if (o.hint) box.appendChild(el("small", null, o.hint));
      var pr = el("span", "opt-price");
      var p = pkgOf(o.needs);
      if (onSale(p)) { var w = el("s", null, "S$" + money(p.oldPrice)); pr.appendChild(w); pr.appendChild(doc.createTextNode(" ")); }
      pr.appendChild(el("span", null, "S$" + money(nowPrice(p))));
      box.appendChild(pr);
      lab.appendChild(inp); lab.appendChild(box);
      sizesBox.appendChild(lab);
    });

    /* Options, in groups */
    var chips = [];
    (calc.groups || [{ id: "", label: ZH ? "添加您需要的" : "Add what you need" }]).forEach(function (g) {
      var items = (calc.extras || []).map(function (o, i) { return [o, i]; }).filter(function (x) { return (x[0].group || "") === g.id || (!g.id && !x[0].group); });
      if (!items.length) return;
      var fs = el("fieldset", "calc-group");
      var lg = el("legend", null, g.label);
      if (g.hint) lg.appendChild(el("span", null, g.hint));
      fs.appendChild(lg);
      var wrap = el("div", "calc-extras");
      items.forEach(function (x) {
        var o = x[0];
        var lab = el("label", "calc-chip" + (o.hint ? " has-hint" : ""));
        var inp = el("input"); inp.type = "checkbox"; inp.value = String(x[1]);
        var txt = el("span");
        var name = el("b", null, o.label);
        txt.appendChild(name);
        var tag = el("em", "tag");
        txt.appendChild(tag);
        if (o.hint) txt.appendChild(el("small", null, o.hint));
        lab.appendChild(inp); lab.appendChild(txt);
        wrap.appendChild(lab);
        chips.push({ o: o, inp: inp, tag: tag });
      });
      fs.appendChild(wrap);
      extrasBox.appendChild(fs);
    });

    var out = {
      pkg: doc.getElementById("calc-pkg"), price: doc.getElementById("calc-price"),
      lines: doc.getElementById("calc-lines"), extra: doc.getElementById("calc-extra"), send: doc.getElementById("calc-send")
    };
    var mini = { pkg: doc.getElementById("calc-mini-pkg"), price: doc.getElementById("calc-mini-price"), send: doc.getElementById("calc-mini-send") };
    var shown = null, tween = 0;
    var animate = doc.documentElement.classList.contains("motion");
    function showPrice(v) {
      if (shown === null || !animate) { out.price.textContent = money(v); shown = v; return; }
      var from = shown, start = null; shown = v;
      cancelAnimationFrame(tween);
      (function step(t) {
        if (start === null) start = t;
        var k = Math.min(1, (t - start) / 450), e = 1 - Math.pow(1 - k, 3);
        out.price.textContent = money(Math.round((from + (v - from) * e) / 10) * 10);
        if (k < 1) tween = requestAnimationFrame(step); else out.price.textContent = money(v);
      })(performance.now());
    }
    function line(label, amount, cls, sub) {
      var li = el("li", cls || "");
      var l = el("span", "ql-label", label);
      if (sub) l.appendChild(el("small", null, sub));
      li.appendChild(l);
      li.appendChild(el("span", "ql-amt", amount));
      out.lines.appendChild(li);
    }
    function update(e) {
      var sizeInp = sizesBox.querySelector("input:checked");
      var size = calc.sizes[Number(sizeInp ? sizeInp.value : 0)];
      var need = rank[size.needs] || 0;
      var picked = chips.filter(function (c) { return c.inp.checked; });
      picked.forEach(function (c) { if (rank[c.o.needs] > need) need = rank[c.o.needs]; });
      var p = pkgs[need];

      /* Live tags: Free, Included, +S$ difference, or the add-on price */
      chips.forEach(function (c) {
        var o = c.o, t;
        if (o.extra) t = "+S$" + money(o.extra);
        else if (o.free) t = ZH ? "免费" : "Free";
        else if (rank[o.needs] > need) t = "+S$" + money(num(nowPrice(pkgOf(o.needs))) - num(nowPrice(p)));
        else t = ZH ? "已包含" : "Included";
        c.tag.textContent = t;
        c.tag.className = "tag" + (o.extra || t.charAt(0) === "+" ? " tag-plus" : o.free ? " tag-free" : "");
      });

      var old = out.pkg.textContent;
      out.pkg.textContent = p.name;
      if (e && old !== p.name && animate) { out.pkg.classList.remove("calc-bump"); void out.pkg.offsetWidth; out.pkg.classList.add("calc-bump"); }

      /* The quote */
      out.lines.textContent = "";
      var incl = [size.label].concat(picked.filter(function (c) { return !c.o.free && !c.o.extra; }).map(function (c) { return c.o.label; }));
      line(p.name + (ZH ? "套餐" : " package"), "S$" + money(onSale(p) ? p.oldPrice : nowPrice(p)), "", incl.join(" · "));
      if (onSale(p)) line(SALE.name, "−S$" + money(num(p.oldPrice) - num(p.price)), "ql-sale");
      picked.filter(function (c) { return c.o.free; }).forEach(function (c) { line(c.o.label, ZH ? "免费" : "Free", "ql-free"); });
      showPrice(num(nowPrice(p)));

      var extras = picked.filter(function (c) { return c.o.extra; });
      var extraCost = extras.reduce(function (a, c) { return a + num(c.o.extra); }, 0);
      if (extraCost) {
        out.extra.textContent = "+ S$" + money(extraCost) + " " + extras.map(function (c) { return c.o.label; }).join(", ") + ", " + (calc.extraNote || "");
        out.extra.hidden = false;
      } else out.extra.hidden = true;

      var items = [size.label].concat(picked.map(function (c) { return c.o.extra ? c.o.label + " (+S$" + money(c.o.extra) + ")" : c.o.label; }));
      var msg = (calc.message || "Hi Jie, I'd like the {package} package.")
        .replace("{package}", p.name).replace("{price}", money(nowPrice(p)))
        .replace("{items}", items.join(", "));
      out.send.href = waLink(msg);
      if (mini.pkg) { mini.pkg.textContent = p.name; mini.price.textContent = money(nowPrice(p)); mini.send.href = out.send.href; }
    }
    /* hide the little bar once the full quote is on screen */
    var miniBox = doc.getElementById("calc-mini");
    if (miniBox && "IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { miniBox.classList.toggle("is-gone", en[0].isIntersecting); }, { threshold: 0.25 })
        .observe(doc.getElementById("calc-result"));
    }
    doc.getElementById("calc-form").addEventListener("change", update);
    update();
  }

  /* ---------- Drag to compare ---------- */
  doc.querySelectorAll("[data-compare]").forEach(function (box) {
    var range = box.querySelector(".cmp-range");
    function setPos(v) {
      v = Math.max(0, Math.min(100, v));
      box.style.setProperty("--pos", v + "%");
      if (range) range.value = String(Math.round(v));
    }
    function fromX(x) { var r = box.getBoundingClientRect(); setPos((x - r.left) / r.width * 100); }
    /* Mouse: drag anywhere. Touch: only once the finger moves sideways,
       so starting a scroll on the phone doesn't jump the line. */
    var dragging = false, startX = 0, isTouch = false;
    box.addEventListener("pointerdown", function (e) {
      dragging = true; startX = e.clientX; isTouch = e.pointerType !== "mouse";
      if (!isTouch) { box.setPointerCapture(e.pointerId); box.dataset.touched = "1"; fromX(e.clientX); }
    });
    box.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      if (isTouch && Math.abs(e.clientX - startX) < 6 && !box.dataset.touched) return;
      box.dataset.touched = "1"; fromX(e.clientX);
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (t) { box.addEventListener(t, function () { dragging = false; }); });
    if (range) range.addEventListener("input", function () { box.dataset.touched = "1"; setPos(Number(range.value)); });
    /* One gentle sweep the first time it's on screen, so people see it moves.
       Stops the moment they touch it. */
    if (doc.documentElement.classList.contains("motion") && "IntersectionObserver" in window) {
      var nudged = false;
      var nudgeObs = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting || nudged || box.dataset.touched) return;
        nudged = true; nudgeObs.disconnect();
        var path = [[50, 14, 900], [14, 86, 1300], [86, 50, 800]], seg = 0, t0 = null;
        function ease(k) { return k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }
        function step(t) {
          if (box.dataset.touched) return;
          if (t0 === null) t0 = t;
          var p = path[seg], k = Math.min(1, (t - t0) / p[2]);
          setPos(p[0] + (p[1] - p[0]) * ease(k));
          if (k < 1) requestAnimationFrame(step);
          else if (++seg < path.length) { t0 = null; requestAnimationFrame(step); }
        }
        setTimeout(function () { requestAnimationFrame(step); }, 500);
      }, { threshold: 0.7 });
      nudgeObs.observe(box);
    }
  });

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

  /* ---------- Header background on scroll ---------- */
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
    doc.querySelectorAll(".hero-actions .btn, .contact-copy .btn, .site-footer, .calc-form").forEach(function (n) { io.observe(n); });

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
      doc.querySelectorAll(".btn").forEach(function (n) { strip.observe(n); });
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

    /* 3. Pause the hero's drifting glows while the hero is off screen. */
    var loopObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle("is-paused", !en.isIntersecting); });
    });
    doc.querySelectorAll(".hero").forEach(function (n) { loopObs.observe(n); });

    /* 4. "More enquiries" highlight: it sweeps in at the start, then follows
          your scroll. Scroll down and the highlight wipes away; scroll back
          up and it returns. Only the highlight's width changes, once a frame. */
    var mark = doc.querySelector("[data-mark]");
    var title = mark && mark.closest(".hero-title");
    if (mark && title) {
      var live = false, queued = false;
      var setMark = function () {
        queued = false;
        var k = Math.max(0, Math.min(1, 1 - window.scrollY / (window.innerHeight * 0.45)));
        mark.style.setProperty("--m", k.toFixed(3));
      };
      window.addEventListener("scroll", function () {
        if (live && !queued) { queued = true; requestAnimationFrame(setMark); }
      }, { passive: true });
      /* wait until the first sweep has finished, then hand over to the scroll */
      setTimeout(function () { mark.classList.add("is-live"); live = true; setMark(); }, 2400);
    }
  }

  window.__siteReady = true;
})();
