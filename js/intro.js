/* Intro: a 3D phone fills the first screen; scrolling turns it round, enquiries arrive,
   and its screen opens into the website. Everything follows the scroll position, so
   scrolling back plays it in reverse. Words are in index.html (Chinese in js/i18n.js).
   To switch the intro off, delete the line that adds the "intro" class in index.html.
   The 3D model is js/phone3d.js (source: ~/sites/models/jiebuilds-phone). */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var sec = doc.getElementById("intro"), hero = doc.getElementById("top");
  if (!sec || !hero || !root.classList.contains("intro")) return;

  var $ = function (s) { return sec.querySelector(s); };
  var stage = $(".intro-stage"), canvas = $(".intro-canvas"), poster = $(".intro-poster"), flat = $(".intro-flat"),
      title = $(".intro-title"), notes = $(".intro-notes"), cards = notes.querySelectorAll("li"),
      foot = $(".intro-foot"), hint = $(".intro-hint"), label = $(".intro-label"), portal = $(".intro-portal"),
      sheet = $(".intro-sheet"),
      top = doc.querySelector(".top");

  /* Phone shape, matching js/phone3d.js */
  var PW = 1, PH = 2.08, EDGE = .035, RADIUS = .165;
  /* Timeline, as a share of the scroll through the intro */
  var TURN = .26, NOTE_AT = [.29, .41, .53], ZOOM = .70, OPEN = .93;

  /* The headline is shown by this file here, not by the load-in animation */
  var mark = hero.querySelector(".mark"), h1 = hero.querySelector(".hero-title");
  if (h1) h1.removeAttribute("data-split");
  if (mark) mark.removeAttribute("data-mark");
  Array.prototype.forEach.call(hero.querySelectorAll("[data-load]"), function (n) { n.removeAttribute("data-load"); });

  var api = null, loading = false, W = 0, H = 0, box = null, length = 1;
  var shown = null, raf = 0, last = 0, clone = null, cloneMark = null, opened = false, settle = 0;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function mix(a, b, t) { return a + (b - a) * t; }
  function inOut(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function out(t) { return 1 - Math.pow(1 - t, 4); }
  function px(n) { return n.toFixed(2) + "px"; }

  function measure() {
    root.style.setProperty("--top-h", top.offsetHeight + "px");
    W = stage.clientWidth; H = stage.clientHeight;
    length = Math.max(1, sec.offsetHeight - H);
    var css = getComputedStyle(root), from = parseFloat(css.getPropertyValue("--from")), to = H - parseFloat(css.getPropertyValue("--to"));
    var h = Math.min(to - from, 660, W * 1.63);
    box = { x: W / 2, y: from + (to - from) / 2, h: h };
    /* notifications: on the screen, but never over the buttons underneath */
    var sw = h * (PW - 2 * EDGE) / PH, sh = h * (PH - 2 * EDGE) / PH;
    var nw = Math.min(W - 28, Math.max(sw - 14, 244));
    var fs = Math.max(12.5, Math.min(15, nw / 17.5));
    notes.style.width = px(nw); notes.style.left = px(box.x - nw / 2); notes.style.fontSize = px(fs);
    var room = to + 4 - from;
    if (notes.offsetHeight > room) notes.style.fontSize = px(Math.max(11.5, fs * room / notes.offsetHeight));
    notes.style.top = px(Math.max(from - 8, Math.min(box.y - sh / 2 + sh * .29, to + 4 - notes.offsetHeight)));
    notes.classList.add("placed");
    /* still picture shown until the 3D arrives (rendered at 1100px phone height on a 900 x 1200 frame) */
    var ph = h * .92;
    poster.style.width = px(ph * 900 / 1100); poster.style.height = px(ph * 1200 / 1100);
    poster.style.left = px(box.x - ph * 450 / 1100); poster.style.top = px(box.y - ph * 600 / 1100);
    size();
  }
  function size() {
    if (!api) return;
    api.resize(W, H, Math.min(window.devicePixelRatio || 1, 1.75, Math.max(1, Math.sqrt(1800000 / (W * H)))));
  }

  /* The website that grows out of the phone screen is a copy of the real first screen */
  function makeClone() {
    if (clone) return;
    clone = hero.cloneNode(true);
    clone.removeAttribute("id"); clone.classList.remove("is-paused");
    Array.prototype.forEach.call(clone.querySelectorAll("[id]"), function (n) { n.removeAttribute("id"); });
    Array.prototype.forEach.call(clone.querySelectorAll("a, button, input"), function (n) { n.setAttribute("tabindex", "-1"); });
    cloneMark = clone.querySelector(".mark");
    portal.appendChild(clone);
  }

  /* "More enquiries": sweeps in as the website opens, then fades as you scroll on (as before) */
  function highlight() {
    if (!mark) return;
    var y = window.pageYOffset, open = y >= length * (OPEN - .03);
    if (open !== opened) {
      opened = open; mark.classList.remove("is-live"); clearTimeout(settle);
      if (open) settle = setTimeout(function () { mark.classList.add("is-live"); highlight(); }, 1100);
    }
    var m = !open ? 0 : mark.classList.contains("is-live") ? clamp(1 - (y - length) / (window.innerHeight * .45)) : 1;
    mark.style.setProperty("--m", m.toFixed(3));
    if (cloneMark) cloneMark.style.setProperty("--m", open ? "1" : "0");
  }

  function paint(p) {
    var e = inOut(clamp(p / TURN)), t = inOut(clamp((p - ZOOM) / (OPEN - ZOOM)));
    /* a short buzz as each message lands */
    var buzz = 0;
    NOTE_AT.forEach(function (a) { var u = (p - a) / .05; if (u > 0 && u < 1) buzz += Math.sin(u * Math.PI * 6) * (1 - u) * .028; });

    var sw = box.h * (PW - 2 * EDGE) / PH, sh = box.h * (PH - 2 * EDGE) / PH, sr = box.h * (RADIUS - EDGE) / PH;
    /* zooming in: the phone grows until its screen is as wide as the stage */
    var grow = mix(1, W / sw, t);
    var cx = mix(box.x, W / 2, t), cy = mix(box.y, H / 2, t);
    var pose = { x: cx, y: cy, h: t ? box.h * grow : box.h * mix(.92, 1, e),
                 rx: mix(.14, 0, e), ry: mix(-.74, 0, e), rz: mix(-.13, 0, e) + buzz };
    /* the screen rectangle at this moment */
    var r = { w: sw * grow, h: sh * grow, round: sr * grow * (1 - t) };
    r.x = cx - r.w / 2; r.y = cy - r.h / 2;

    var gone = 1 - clamp((t - .75) / .25);
    if (api) { canvas.style.opacity = gone.toFixed(3); if (gone > 0) api.render(pose); }
    else {
      poster.style.opacity = (1 - clamp((p - .03) / .1)).toFixed(3);
      flat.style.opacity = (clamp((p - .08) / .1) * gone).toFixed(3);
      flat.style.width = px(pose.h * PW / PH); flat.style.height = px(pose.h);
      flat.style.left = px(pose.x - pose.h * PW / PH / 2); flat.style.top = px(pose.y - pose.h / 2);
      flat.style.borderRadius = px(pose.h * RADIUS / PH);
      flat.style.borderWidth = px(pose.h * EDGE / PH);
    }

    notes.style.opacity = (1 - clamp(t / .12)).toFixed(3);
    notes.style.transform = "translateY(" + px((grow - 1) * -40) + ") scale(" + mix(1, 1.1, clamp(t / .12)).toFixed(3) + ") rotate(" + (-buzz).toFixed(4) + "rad)";
    Array.prototype.forEach.call(cards, function (li, i) {
      var q = out(clamp((p - NOTE_AT[i]) / .07));
      li.style.opacity = q.toFixed(3);
      li.style.transform = "translateY(" + px((1 - q) * -26) + ") scale(" + mix(.9, 1, q).toFixed(3) + ")";
    });

    hint.style.opacity = (1 - clamp(p / .05)).toFixed(3);
    label.style.opacity = (clamp((p - NOTE_AT[0]) / .05) * (1 - clamp(t / .12))).toFixed(3);
    title.style.opacity = foot.style.opacity = (1 - clamp(t / .15)).toFixed(3);

    /* the screen opens into the website */
    if (p > .5) makeClone();
    /* the screen goes black first, then the website appears on it */
    var see = clamp((t - .08) / .2);
    sheet.style.opacity = see.toFixed(3);
    portal.style.opacity = clamp((t - .24) / .26).toFixed(3);
    sheet.style.visibility = portal.style.visibility = see > 0 ? "visible" : "hidden";
    stage.classList.toggle("is-open", t > .98);
    if (see > 0) {
      /* the phone screen turns into the page: a black sheet exactly over the screen ... */
      sheet.style.width = px(r.w); sheet.style.height = px(r.h);
      sheet.style.transform = "translate(" + px(r.x) + "," + px(r.y) + ")";
      sheet.style.borderRadius = px(r.round);
      /* ... with the website on it, as wide as the screen, ending exactly where the real one is */
      var y0 = portal.offsetTop, k = r.w / W, ph = portal.offsetHeight;
      var ox = r.x, oy = mix(box.y - sh / 2, 0, t);          /* where the stage's top-left lands */
      portal.style.transform = "translate(" + px(ox) + "," + px(oy - y0 * (1 - k)) + ") scale(" + k.toFixed(5) + ")";
      portal.style.clipPath = "inset(" + px(-y0 + Math.max(0, r.y - oy) / k) + " 0 " + px(Math.max(0, ph + y0 - (r.y + r.h - oy) / k)) + " 0 round " + px(r.round / k) + ")";
    }
  }

  function progress() { return clamp(window.pageYOffset / length); }

  function frame(now) {
    raf = 0;
    var want = progress(), gap = now - last;
    /* follow the scroll with a very short glide so touch scrolling doesn't judder */
    if (shown === null || Math.abs(want - shown) > .3) shown = want;
    else {
      shown += (want - shown) * (1 - Math.exp(-Math.min(64, gap) / 70));
      if (Math.abs(want - shown) < .0006) shown = want;
    }
    last = now;
    paint(shown);
    if (shown !== want) queue();
  }
  function queue() { if (!raf) raf = requestAnimationFrame(frame); }

  function onScroll() {
    var past = window.pageYOffset >= length - .5;
    root.classList.toggle("intro-playing", !past);
    highlight();
    if (past) { shown = 1; return; }
    load(); queue();
  }

  /* The 3D arrives on the first touch or scroll, or shortly after the page has loaded */
  function load() {
    if (loading) return;
    loading = true;
    /* no 3D graphics on this device: the still picture and a flat phone carry the story */
    var gl = doc.createElement("canvas").getContext("webgl2");
    if (!gl) return;
    var drop = gl.getExtension("WEBGL_lose_context"); if (drop) drop.loseContext();
    var zh = window.SITE_LANG === "zh", now = new Date(), loc = zh ? "zh-CN" : "en-SG";
    var time = now.getHours() + ":" + ("0" + now.getMinutes()).slice(-2);
    var date = now.toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long" });
    var fonts = doc.fonts && doc.fonts.load ? doc.fonts.load('800 100px Archivo') : Promise.resolve();
    Promise.all([import(new URL("js/phone3d.js?v=20261126j", doc.baseURI).href), fonts])
      .then(function (r) {
        var scene = r[0].createPhone(canvas, { time: time, date: date });
        api = scene; size(); paint(shown === null ? progress() : shown);
        sec.classList.add("ready");
      })
      .catch(function (e) { if (window.console) console.warn("3D phone unavailable, keeping the flat one", e); });
  }

  /* "Skip", the logo and "Skip to content" go to the website itself */
  function toSite(focus) {
    window.scrollTo({ top: Math.ceil(length), behavior: "instant" });
    onScroll();
    if (focus && h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); }
  }
  doc.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href="#top"], a[href="#main"]');
    if (!a) return;
    ev.preventDefault(); toSite(true);
  });
  /* keyboard users who tab into the website get taken to it */
  hero.addEventListener("focusin", function () { if (window.pageYOffset < length - 1) toSite(false); });

  canvas.addEventListener("webglcontextlost", function (ev) { ev.preventDefault(); api = null; sec.classList.remove("ready"); queue(); });
  window.addEventListener("scroll", onScroll, { passive: true });
  ["pointerdown", "touchstart", "wheel"].forEach(function (n) { window.addEventListener(n, load, { passive: true, once: true }); });
  window.addEventListener("load", function () { setTimeout(load, 1800); });
  function refit() {
    measure(); portal.textContent = ""; clone = cloneMark = null;
    shown = progress(); paint(shown); onScroll();
  }
  var pending;
  window.addEventListener("resize", function () { clearTimeout(pending); pending = setTimeout(function () { if (stage.clientWidth !== W || stage.clientHeight !== H) refit(); }, 150); });
  /* the sale banner is filled in by site.js, which changes the height of the top bar */
  if ("ResizeObserver" in window) { var th = 0; new ResizeObserver(function () { if (top.offsetHeight !== th) { th = top.offsetHeight; refit(); } }).observe(top); }

  window.__introReady = true;
  refit();
  /* all scripts have run: the top bar has its real height */
  doc.addEventListener("DOMContentLoaded", function () { root.classList.add("top-ready"); refit(); });
  /* links to a section (jiebuilds.com/#work) still land on it */
  window.addEventListener("load", function () {
    var to = location.hash.length > 1 && location.hash !== "#top" && doc.getElementById(location.hash.slice(1));
    if (to) to.scrollIntoView({ behavior: "instant" });
  });
})();
