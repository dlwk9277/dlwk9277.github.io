/* Two hands made of dots: they reach for each other, touch, drift apart
   into dust, and come back together. Dots move out of the way of your
   finger or mouse.

   You normally don't need to edit this file. The hand shape is the
   "Hand Pointing" icon from Phosphor Icons (MIT licence), plus a forearm.

   Performance: one canvas, a few thousand dots drawn in 4 batches per
   frame, and the loop stops completely while the section is off screen. */
(function () {
  "use strict";

  var section = document.querySelector("[data-hands]");
  var canvas = section && section.querySelector("canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  var CALM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var HAND = "M224,104v50.93c0,46.2-36.85,84.55-83,85.06A83.71,83.71,0,0,1,80.6,215.4C58.79,192.33,34.15,136,34.15,136a16,16,0,0,1,6.53-22.23c7.66-4,17.1-.84,21.4,6.62l21,36.44a6.09,6.09,0,0,0,6,3.09l.12,0A8.19,8.19,0,0,0,96,151.74V32a16,16,0,0,1,16.77-16c8.61.4,15.23,7.82,15.23,16.43V104a8,8,0,0,0,8.53,8,8.17,8.17,0,0,0,7.47-8.25V88a16,16,0,0,1,16.77-16c8.61.4,15.23,7.82,15.23,16.43V112a8,8,0,0,0,8.53,8,8.17,8.17,0,0,0,7.47-8.25v-7.28c0-8.61,6.62-16,15.23-16.43A16,16,0,0,1,224,104Z";

  /* Shape space ("units"): the hand points right, fingertip at (TIP_X, TIP_Y). */
  var UX0 = -290, UX1 = 246, UY0 = 26, UY1 = 266, TIP_X = 240, TIP_Y = 112;

  var colors = {
    dot: "245,245,247",
    accent: "160,178,255"
  };

  var W = 0, H = 0, DPR = 1, cx = 0, cy = 0, G0 = 0;
  var dots = [], dust = [];
  var pointer = { x: -9999, y: -9999, on: false };
  var running = false, visible = false, raf = 0, t0 = 0, sparkAt = -1, lastPhase = -1;

  /* ---------- Build the dots ---------- */
  function rasterHand(s) {
    var w = Math.ceil((UX1 - UX0) * s), h = Math.ceil((UY1 - UY0) * s);
    var off = document.createElement("canvas");
    off.width = w; off.height = h;
    var o = off.getContext("2d");
    o.scale(s, s);
    o.translate(-UX0, -UY0);
    o.fillStyle = "#fff";
    /* forearm */
    o.beginPath();
    o.moveTo(64, 94); o.lineTo(UX0, 152); o.lineTo(UX0, 262); o.lineTo(64, 228); o.closePath();
    o.fill();
    /* hand: the icon points up, so turn it a quarter turn to point right */
    o.save();
    o.transform(0, 1, -1, 0, 256, 0);
    o.fill(new Path2D(HAND));
    o.restore();
    return { data: o.getImageData(0, 0, w, h).data, w: w, h: h };
  }

  function build() {
    var rect = section.getBoundingClientRect();
    W = Math.round(rect.width); H = Math.round(rect.height);
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    var phone = W < 700;
    var L = phone ? W * 0.8 : Math.min(W * 0.43, 620);   /* one hand + forearm, in px */
    var s = L / (UX1 - UX0);
    cx = W / 2;
    cy = phone ? H * 0.62 : H * 0.62;
    G0 = phone ? W * 0.09 : Math.min(W * 0.08, 110);

    var img = rasterHand(s);
    var filled = 0, i;
    for (i = 3; i < img.data.length; i += 4) if (img.data[i] > 128) filled++;
    var target = phone ? 1500 : 1800;                       /* dots per hand, before the forearm thins out */
    var g = Math.max(2.6, Math.sqrt(filled / target));
    var e = Math.max(2, Math.round(g * 1.1));

    function alphaAt(x, y) {
      x = Math.round(x); y = Math.round(y);
      if (x < 0 || y < 0 || x >= img.w || y >= img.h) return 0;
      return img.data[(y * img.w + x) * 4 + 3];
    }

    var base = [];
    for (var y = 0; y < img.h; y += g) {
      for (var x = 0; x < img.w; x += g) {
        var jx = x + (Math.random() - 0.5) * g * 0.8, jy = y + (Math.random() - 0.5) * g * 0.8;
        if (alphaAt(jx, jy) < 128) continue;
        var edge = alphaAt(jx + e, jy) < 128 || alphaAt(jx - e, jy) < 128 || alphaAt(jx, jy + e) < 128 || alphaAt(jx, jy - e) < 128;
        var ux = jx / s + UX0, uy = jy / s + UY0;
        var lx = (ux - TIP_X) * s, ly = (uy - TIP_Y) * s;
        var nearTip = Math.hypot(ux - TIP_X, uy - TIP_Y) < 70;
        /* the forearm thins out into dust towards the screen edge */
        var fade = Math.min(1, Math.max(0, (ux - UX0) / 330));
        if (Math.random() > 0.12 + 0.88 * fade) continue;
        fade = 0.25 + 0.75 * fade;
        base.push({
          lx: lx, ly: ly,
          b: (edge ? 0.95 : 0.28 + Math.random() * 0.35) * fade,
          accent: nearTip ? Math.random() < 0.55 : Math.random() < 0.05,
          size: edge ? 1.8 : 1.45
        });
      }
    }

    /* Hand A: lower left, reaching up-right. Hand B: mirror image, upper right. */
    var tilt = phone ? 0.1 : 0.13;
    dots = [];
    [0, 1].forEach(function (hand) {
      var ang = hand === 0 ? -tilt : Math.PI - tilt;
      var ca = Math.cos(ang), sa = Math.sin(ang);
      base.forEach(function (p) {
        var ly = hand === 0 ? p.ly : -p.ly;
        var ox = p.lx * ca - ly * sa;
        var oy = p.lx * sa + ly * ca;
        var a = Math.random() * Math.PI * 2;
        var away = hand === 0 ? -1 : 1;
        var r = 60 + Math.random() * 260;
        dots.push({
          hand: hand, ox: ox, oy: oy,
          sx: Math.cos(a) * r * 0.7 + away * r * 0.5, sy: Math.sin(a) * r * 0.6 - 40 * Math.random(),
          b: p.b, accent: p.accent, size: p.size,
          x: cx + ox + Math.cos(a) * r, y: cy + oy + Math.sin(a) * r,
          vx: 0, vy: 0, wi: (Math.random() * 64) | 0
        });
      });
    });

    dust = [];
    var nd = phone ? 50 : 110;
    for (i = 0; i < nd; i++) {
      dust.push({ x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, hx: Math.random() * W, hy: Math.random() * H, b: 0.12 + Math.random() * 0.3, ph: Math.random() * 6.283 });
    }
  }

  /* ---------- Timeline (seconds, loops every T) ---------- */
  var T = 10.5;
  function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  /* returns gap between fingertips (px), scatter (0..1), brightness (0..1) */
  function state(t) {
    var gap, k, alpha, phase;
    if (t < 2.0) { phase = 0; var a = ease(clamp01(t / 2.0)); gap = G0; k = 1 - a; alpha = 0.15 + 0.85 * a; }
    else if (t < 4.0) { phase = 1; gap = G0 * (1 - ease(clamp01((t - 2.0) / 2.0))); k = 0; alpha = 1; }
    else if (t < 6.0) { phase = 2; gap = 0; k = 0; alpha = 1; }
    else if (t < 8.6) { phase = 3; var d = ease(clamp01((t - 6.0) / 2.6)); gap = G0 * 1.15 * d; k = d; alpha = 1 - 0.85 * d; }
    else { phase = 4; gap = G0 * 1.15 - (G0 * 0.15) * clamp01((t - 8.6) / 1.9); k = 1; alpha = 0.15; }
    return { gap: gap, k: k, alpha: alpha, phase: phase };
  }

  /* ---------- Draw ---------- */
  var buckets = [[], [], [], []];   /* dim, mid, bright, accent */
  var SIN = new Float32Array(64), COS = new Float32Array(64);
  function frame(now) {
    raf = 0;
    if (!running) return;
    var t = ((now - t0) / 1000) % T;
    var st = state(t);
    if (st.phase === 2 && lastPhase === 1) sparkAt = now;
    lastPhase = st.phase;

    var R = W < 700 ? 70 : 110, R2 = R * R;
    var px = pointer.on ? pointer.x : -9999, py = pointer.on ? pointer.y : -9999;
    var time = now / 1000;
    var breathe = st.phase === 2 ? Math.sin(time * 2.2) * 1.2 : 0;

    buckets[0].length = buckets[1].length = buckets[2].length = buckets[3].length = 0;
    /* 64 wobble phases shared by all dots: far fewer sin/cos calls per frame */
    var wob = 1.2 + st.k * 26;
    for (var w = 0; w < 64; w++) { var ph = w * 0.0982; SIN[w] = Math.sin(time * 0.9 + ph); COS[w] = Math.cos(time * 0.8 + ph); }

    for (var i = 0; i < dots.length; i++) {
      var p = dots[i];
      var dir = p.hand === 0 ? -1 : 1;
      var hx = cx + dir * (st.gap + breathe) + p.ox;
      var hy = cy + p.oy;
      var wi = p.wi;
      var tx = hx + p.sx * st.k + SIN[wi] * wob;
      var ty = hy + p.sy * st.k + COS[wi] * wob;
      p.vx += (tx - p.x) * 0.055;
      p.vy += (ty - p.y) * 0.055;
      var dx = p.x - px, dy = p.y - py, d2 = dx * dx + dy * dy;
      if (d2 < R2) {
        var d = Math.sqrt(d2) || 1, f = (1 - d / R); f = f * f * 7;
        p.vx += dx / d * f; p.vy += dy / d * f;
      }
      p.vx *= 0.84; p.vy *= 0.84;
      p.x += p.vx; p.y += p.vy;
      var v = p.b * st.alpha;
      var bi = p.accent ? 3 : v > 0.7 ? 2 : v > 0.4 ? 1 : 0;
      buckets[bi].push(p);
    }

    ctx.clearRect(0, 0, W, H);

    /* drifting dust in the background */
    ctx.fillStyle = "rgba(" + colors.dot + ",0.35)";
    ctx.beginPath();
    for (i = 0; i < dust.length; i++) {
      var q = dust[i];
      var qx = q.hx + Math.sin(time * 0.15 + q.ph) * 30, qy = q.hy + Math.cos(time * 0.12 + q.ph) * 24;
      q.vx += (qx - q.x) * 0.02; q.vy += (qy - q.y) * 0.02;
      var ex = q.x - px, ey = q.y - py, e2 = ex * ex + ey * ey;
      if (e2 < R2) { var ed = Math.sqrt(e2) || 1, ef = (1 - ed / R) * 4; q.vx += ex / ed * ef; q.vy += ey / ed * ef; }
      q.vx *= 0.9; q.vy *= 0.9; q.x += q.vx; q.y += q.vy;
      ctx.rect(q.x, q.y, 1.2, 1.2);
    }
    ctx.fill();

    /* the touch: a soft flash where the fingertips meet */
    var glow = 0;
    if (sparkAt > 0) {
      var age = (now - sparkAt) / 1000;
      if (age < 2.6) glow = age < 0.25 ? age / 0.25 : Math.max(0, 1 - (age - 0.25) / 2.35);
    }
    if (st.phase === 2) glow = Math.max(glow, 0.35);
    if (glow > 0.01) {
      var gr = (W < 700 ? 70 : 120) * (0.7 + glow * 0.5);
      var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr);
      grad.addColorStop(0, "rgba(" + colors.accent + "," + (0.55 * glow).toFixed(3) + ")");
      grad.addColorStop(0.35, "rgba(" + colors.accent + "," + (0.18 * glow).toFixed(3) + ")");
      grad.addColorStop(1, "rgba(" + colors.accent + ",0)");
      ctx.fillStyle = grad;
      ctx.fillRect(cx - gr, cy - gr, gr * 2, gr * 2);
    }

    var styles = [
      "rgba(" + colors.dot + "," + (0.32 * st.alpha).toFixed(3) + ")",
      "rgba(" + colors.dot + "," + (0.6 * st.alpha).toFixed(3) + ")",
      "rgba(" + colors.dot + "," + (0.95 * st.alpha).toFixed(3) + ")",
      "rgba(" + colors.accent + "," + (0.95 * st.alpha).toFixed(3) + ")"
    ];
    for (var bk = 0; bk < 4; bk++) {
      var list = buckets[bk];
      if (!list.length) continue;
      ctx.fillStyle = styles[bk];
      ctx.beginPath();
      for (var j = 0; j < list.length; j++) { var r = list[j]; ctx.rect(r.x, r.y, r.size, r.size); }
      ctx.fill();
    }

    raf = requestAnimationFrame(frame);
  }

  /* A still picture for visitors who prefer less motion */
  function drawStill() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(function (p) {
      var dir = p.hand === 0 ? -1 : 1;
      p.x = cx + dir * G0 * 0.12 + p.ox; p.y = cy + p.oy;
    });
    [[0.32, false, 0, 0.4], [0.6, false, 0.4, 0.7], [0.95, false, 0.7, 9]].forEach(function (b) {
      ctx.fillStyle = "rgba(" + colors.dot + "," + b[0] + ")";
      ctx.beginPath();
      dots.forEach(function (p) { if (!p.accent && p.b > b[2] && p.b <= b[3]) ctx.rect(p.x, p.y, p.size, p.size); });
      ctx.fill();
    });
    ctx.fillStyle = "rgba(" + colors.accent + ",0.95)";
    ctx.beginPath();
    dots.forEach(function (p) { if (p.accent) ctx.rect(p.x, p.y, p.size, p.size); });
    ctx.fill();
  }

  function start() {
    if (running || CALM) return;
    running = true;
    if (!t0) t0 = performance.now();
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  build();
  if (CALM) drawStill();

  /* Only animate while on screen and the tab is visible */
  new IntersectionObserver(function (en) {
    visible = en[0].isIntersecting;
    if (visible && !document.hidden) start(); else stop();
  }, { rootMargin: "100px 0px" }).observe(section);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else if (visible) start();
  });

  /* Rebuild when the width changes (not when a phone's address bar hides) */
  var lastW = W, rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      var w = Math.round(section.getBoundingClientRect().width);
      if (w === lastW) return;
      lastW = w; build(); if (CALM) drawStill();
    }, 200);
  });

  /* Pointer and touch: dots give way. Touch listeners are passive, so
     scrolling the page over the hands still works normally. */
  if (!CALM) {
    function setPoint(x, y) {
      var r = canvas.getBoundingClientRect();
      pointer.x = x - r.left; pointer.y = y - r.top; pointer.on = true;
    }
    section.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") setPoint(e.clientX, e.clientY); }, { passive: true });
    section.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") pointer.on = false; });
    section.addEventListener("touchstart", function (e) { var t = e.touches[0]; setPoint(t.clientX, t.clientY); }, { passive: true });
    section.addEventListener("touchmove", function (e) { var t = e.touches[0]; setPoint(t.clientX, t.clientY); }, { passive: true });
    section.addEventListener("touchend", function () { setTimeout(function () { pointer.on = false; }, 250); }, { passive: true });
  }
})();
