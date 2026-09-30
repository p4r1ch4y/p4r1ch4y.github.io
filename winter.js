/* Winter theme runtime: snowfall, ice-shard click bursts, theme frost wave. */
(function () {
    'use strict';

    var root = document.documentElement;
    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var reduced = mqReduce.matches;
    var TAU = Math.PI * 2;
    var MAX_PARTICLES = 400;

    // ---------- DOM ----------
    function mk(tag, cls) {
        var el = document.createElement(tag);
        el.className = cls;
        el.setAttribute('aria-hidden', 'true');
        return el;
    }
    var aurora = mk('div', 'winter-aurora');
    var snowCv = mk('canvas', 'winter-snow');
    var fxCv = mk('canvas', 'winter-fx');
    function mount() {
        var b = document.body;
        b.insertBefore(fxCv, b.firstChild);
        b.insertBefore(snowCv, b.firstChild);
        b.insertBefore(aurora, b.firstChild);
    }
    if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

    var sctx = snowCv.getContext('2d');
    var fctx = fxCv.getContext('2d');

    // ---------- Colors ----------
    var col = { snow: 'rgba(236,238,245,.80)', frag: '#e8ebf7', glow: 'rgba(70,80,200,.40)', dark: true };
    function readColors() {
        var cs = getComputedStyle(root);
        var g = function (n, d) { var v = cs.getPropertyValue(n).trim(); return v || d; };
        col.snow = g('--snow-color', col.snow);
        col.frag = g('--frag-color', col.frag);
        col.glow = g('--frag-glow', col.glow);
        col.dark = root.getAttribute('data-theme') !== 'light';
        buildSprite();
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', col.dark ? '#000000' : '#f8f9fb');
    }

    // ---------- Sizing ----------
    var W = 0, H = 0, dpr = 1;
    function size() {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        W = window.innerWidth; H = window.innerHeight;
        [snowCv, fxCv].forEach(function (c) {
            c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
        });
        sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seedSnow();
    }
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 150); });

    // ---------- Snow ----------
    var LAYERS = [
        { r: [0.6, 1.1], vy: [0.25, 0.5], a: [0.35, 0.55], share: 0.5, sway: 0.6 },
        { r: [1.1, 1.8], vy: [0.5, 0.9], a: [0.5, 0.75], share: 0.33, sway: 1.0 },
        { r: [1.8, 2.6], vy: [0.9, 1.5], a: [0.7, 0.95], share: 0.17, sway: 1.5 }
    ];
    var flakes = [], sprite = null, SP = 32;
    var snowOn = true, wind = 0, windTarget = 0, snowRaf = 0, lastT = 0;

    function rnd(a, b) { return a + Math.random() * (b - a); }

    function buildSprite() {
        try {
            var c = document.createElement('canvas');
            c.width = c.height = SP;
            var x = c.getContext('2d');
            var gr = x.createRadialGradient(SP / 2, SP / 2, 0, SP / 2, SP / 2, SP / 2);
            gr.addColorStop(0, col.snow);
            gr.addColorStop(0.45, col.snow);
            gr.addColorStop(1, 'rgba(255,255,255,0)');
            x.fillStyle = gr;
            x.fillRect(0, 0, SP, SP);
            sprite = c;
        } catch (e) { sprite = null; }
    }

    function seedSnow() {
        var n = Math.min(140, Math.floor(W * H / 12000));
        if (W < 640) n = Math.floor(n / 2);
        flakes = [];
        LAYERS.forEach(function (L) {
            var k = Math.round(n * L.share);
            for (var i = 0; i < k; i++) {
                flakes.push({
                    x: Math.random() * W, y: Math.random() * H,
                    r: rnd(L.r[0], L.r[1]), vy: rnd(L.vy[0], L.vy[1]),
                    vx: rnd(-0.1, 0.1), phase: rnd(0, TAU), freq: rnd(0.0004, 0.0012),
                    amp: L.sway * rnd(0.2, 0.5), alpha: rnd(L.a[0], L.a[1]), big: L.r[1] > 1.8
                });
            }
        });
    }

    function snowFrame(t) {
        snowRaf = 0;
        if (!snowOn || reduced || document.hidden) return;
        var dt = lastT ? Math.min(3, (t - lastT) / 16.67) : 1;
        lastT = t;
        wind += (windTarget - wind) * 0.02 * dt;
        sctx.clearRect(0, 0, W, H);
        for (var i = 0; i < flakes.length; i++) {
            var f = flakes[i];
            f.y += f.vy * dt;
            f.x += (f.vx + Math.sin(t * f.freq + f.phase) * f.amp + wind * f.r * 0.5) * dt;
            if (f.y > H + 6) { f.y = -6; f.x = Math.random() * W; }
            if (f.x > W + 6) f.x = -6; else if (f.x < -6) f.x = W + 6;
            sctx.globalAlpha = f.alpha;
            if (f.big && sprite) {
                var d = f.r * 3.2;
                sctx.drawImage(sprite, f.x - d / 2, f.y - d / 2, d, d);
            } else {
                sctx.fillStyle = col.snow;
                sctx.beginPath(); sctx.arc(f.x, f.y, f.r, 0, TAU); sctx.fill();
            }
        }
        sctx.globalAlpha = 1;
        snowRaf = requestAnimationFrame(snowFrame);
    }

    function snowSync() {
        var run = snowOn && !reduced && !document.hidden;
        snowCv.style.display = (snowOn && !reduced) ? '' : 'none';
        if (run && !snowRaf) { lastT = 0; snowRaf = requestAnimationFrame(snowFrame); }
        else if (!run && snowRaf) { cancelAnimationFrame(snowRaf); snowRaf = 0; }
        if (!snowOn || reduced) sctx.clearRect(0, 0, W, H);
    }

    function syncButtons() {
        var b = document.getElementById('snow-toggle');
        if (!b) return;
        b.setAttribute('aria-pressed', snowOn ? 'true' : 'false');
        var i = b.querySelector('i');
        if (i) i.style.opacity = snowOn ? '' : '0.4';
    }

    function setSnow(on) {
        snowOn = !!on;
        try { localStorage.setItem('snow', snowOn ? 'on' : 'off'); } catch (e) { /* ignore */ }
        syncButtons();
        snowSync();
    }

    document.addEventListener('visibilitychange', snowSync);
    window.addEventListener('pointermove', function (e) {
        windTarget = (e.clientX / (W || 1) - 0.5) * 1.6;
    }, { passive: true });

    function isEditable(el) {
        if (!el || !el.closest) return false;
        return !!el.closest('input,textarea,select,iframe,[contenteditable=""],[contenteditable="true"]');
    }
    document.addEventListener('keydown', function (e) {
        if ((e.key !== 's' && e.key !== 'S') || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
        if (isEditable(document.activeElement)) return;
        setSnow(!snowOn);
    });
    document.addEventListener('click', function (e) {
        var t = e.target && e.target.closest && e.target.closest('#snow-toggle');
        if (t) setSnow(!snowOn);
    });

    // ---------- FX particles ----------
    var parts = [], fxRaf = 0, fxLast = 0;

    function room(n) { return MAX_PARTICLES - parts.length >= n; }

    function shard(x, y) {
        var a = Math.random() * TAU, sp = rnd(2.5, 7);
        parts.push({
            k: 's', x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
            rot: Math.random() * TAU, vr: rnd(-0.25, 0.25), len: rnd(6, 14), w: rnd(1.6, 3),
            born: 0, life: rnd(650, 950)
        });
    }
    function sparkle(x, y, vx, vy, life) {
        parts.push({ k: 'k', x: x, y: y, vx: vx, vy: vy, size: rnd(1.5, 3.5), ph: rnd(0, TAU), born: 0, life: life || rnd(500, 900) });
    }

    function burst(x, y) {
        if (!fctx) return;
        if (reduced) {
            parts.push({ k: 'r', x: x, y: y, max: 40, born: 0, life: 500 });
            startFx();
            return;
        }
        if (!room(30)) return;
        var n = 12 + Math.floor(Math.random() * 5), i;
        for (i = 0; i < n; i++) shard(x, y);
        parts.push({ k: 'c', x: x, y: y, rot: Math.random() * TAU, size: rnd(16, 22), born: 0, life: 700 });
        parts.push({ k: 'r', x: x, y: y, max: 48, born: 0, life: 550 });
        var g = 6 + Math.floor(Math.random() * 3);
        for (i = 0; i < g; i++) {
            var a = Math.random() * TAU, sp = rnd(0.5, 2.2);
            sparkle(x + Math.cos(a) * rnd(4, 26), y + Math.sin(a) * rnd(4, 26), Math.cos(a) * sp, Math.sin(a) * sp - 0.3);
        }
        startFx();
    }

    function themeWave(x, y, toTheme) {
        if (!fctx || reduced) return;
        var R = Math.hypot(Math.max(x, W - x), Math.max(y, H - y));
        var life = 700;
        // wave colours follow the theme being switched to
        var c = toTheme === 'light' ? '#1f2690' : '#e8ebf7';
        var gl = toTheme === 'light' ? 'rgba(0,0,128,.18)' : 'rgba(70,80,200,.40)';
        parts.push({ k: 'w', x: x, y: y, R: R, born: 0, life: life, c: c, gl: gl, ease: true });
        var n = 40 + Math.floor(Math.random() * 21);
        for (var i = 0; i < n && room(1); i++) {
            var a = Math.random() * TAU;
            // seed along the ring; wakes when the ring front reaches its radius
            var at = rnd(0.1, 1), rr = R * at;
            parts.push({ k: 'k', x: x + Math.cos(a) * rr, y: y + Math.sin(a) * rr,
                vx: Math.cos(a) * rnd(0.3, 1.4), vy: Math.sin(a) * rnd(0.3, 1.4),
                size: rnd(1.5, 3.2), ph: rnd(0, TAU), born: 0, life: rnd(500, 850),
                delay: (1 - Math.pow(1 - at, 1 / 3)) * life, c: c });
        }
        for (var j = 0; j < 8 && room(1); j++) shard(x, y);
        startFx();
    }

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function drawFlake(x, y, size, rot, alpha, scale) {
        fctx.save();
        fctx.translate(x, y); fctx.rotate(rot); fctx.scale(scale, scale);
        fctx.globalAlpha = alpha;
        fctx.strokeStyle = col.frag; fctx.lineWidth = 1.4; fctx.lineCap = 'round';
        fctx.beginPath();
        for (var i = 0; i < 6; i++) {
            fctx.save();
            fctx.rotate(i * Math.PI / 3);
            fctx.moveTo(0, 0); fctx.lineTo(0, -size);
            fctx.moveTo(0, -size * 0.55); fctx.lineTo(size * 0.28, -size * 0.8);
            fctx.moveTo(0, -size * 0.55); fctx.lineTo(-size * 0.28, -size * 0.8);
            fctx.restore();
        }
        // stroke in local transforms: rebuild via per-arm path already applied
        fctx.stroke();
        fctx.restore();
    }

    function drawCross(x, y, s, alpha, color) {
        fctx.globalAlpha = alpha;
        fctx.strokeStyle = color; fctx.lineWidth = 1;
        fctx.beginPath();
        fctx.moveTo(x - s, y); fctx.lineTo(x + s, y);
        fctx.moveTo(x, y - s); fctx.lineTo(x, y + s);
        fctx.stroke();
    }

    function fxFrame(t) {
        fxRaf = 0;
        var dt = fxLast ? Math.min(3, (t - fxLast) / 16.67) : 1;
        var ms = fxLast ? Math.min(50, t - fxLast) : 16.67;
        fxLast = t;
        fctx.clearRect(0, 0, W, H);
        var glow = col.dark;
        var alive = [];
        for (var i = 0; i < parts.length; i++) {
            var p = parts[i];
            p.born += ms;
            var u = p.born / p.life;
            if (u >= 1) continue;
            alive.push(p);
            fctx.shadowBlur = 0;
            if (p.k === 's') {
                p.vy += 0.12 * dt; p.vx *= Math.pow(0.96, dt); p.vy *= Math.pow(0.96, dt);
                p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
                fctx.save();
                fctx.translate(p.x, p.y); fctx.rotate(p.rot);
                fctx.globalAlpha = 1 - u;
                if (glow) { fctx.shadowColor = col.glow; fctx.shadowBlur = 8; }
                fctx.fillStyle = col.frag;
                fctx.strokeStyle = glow ? '#ffffff' : 'rgba(255,255,255,.9)';
                fctx.lineWidth = 0.7;
                fctx.beginPath();
                fctx.moveTo(p.len, 0); fctx.lineTo(0, p.w); fctx.lineTo(-p.len * 0.35, 0); fctx.lineTo(0, -p.w);
                fctx.closePath(); fctx.fill(); fctx.stroke();
                fctx.restore();
            } else if (p.k === 'c') {
                var e = easeOut(u);
                if (glow) { fctx.shadowColor = col.glow; fctx.shadowBlur = 10; }
                drawFlake(p.x, p.y, p.size, p.rot + e * (Math.PI / 6), 1 - u, 1.2 * e);
            } else if (p.k === 'r') {
                var er = easeOut(u);
                if (glow) { fctx.shadowColor = col.glow; fctx.shadowBlur = 10; }
                fctx.globalAlpha = 1 - u; fctx.strokeStyle = col.frag;
                fctx.lineWidth = Math.max(0.1, 2 * (1 - u));
                fctx.beginPath(); fctx.arc(p.x, p.y, p.max * er, 0, TAU); fctx.stroke();
            } else if (p.k === 'w') {
                var ew = easeOut(u);
                fctx.shadowColor = p.gl; fctx.shadowBlur = glow ? 18 : 10;
                fctx.globalAlpha = Math.min(1, (1 - u) * 1.4) * 0.9;
                fctx.strokeStyle = p.c;
                fctx.lineWidth = 3 * (1 - u * 0.6) + 0.5;
                fctx.beginPath(); fctx.arc(p.x, p.y, p.R * ew, 0, TAU); fctx.stroke();
            } else if (p.k === 'k') {
                if (p.delay > 0) { p.delay -= ms; p.born = 0; continue; }
                p.x += p.vx * dt; p.y += p.vy * dt;
                var tw = 0.5 + 0.5 * Math.sin(p.ph + p.born * 0.03);
                if (glow) { fctx.shadowColor = col.glow; fctx.shadowBlur = 6; }
                drawCross(p.x, p.y, p.size * (0.6 + 0.6 * tw), (1 - u) * (0.4 + 0.6 * tw), p.c || col.frag);
            }
        }
        fctx.globalAlpha = 1; fctx.shadowBlur = 0;
        parts = alive;
        if (parts.length) fxRaf = requestAnimationFrame(fxFrame);
        else { fxLast = 0; fctx.clearRect(0, 0, W, H); }
    }

    function startFx() {
        if (!fxRaf) { fxLast = 0; fxRaf = requestAnimationFrame(fxFrame); }
    }

    // ---------- Click bursts ----------
    function loadingVisible() {
        var l = document.getElementById('loading-screen');
        if (!l) return false;
        var cs = getComputedStyle(l);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.05;
    }
    document.addEventListener('pointerdown', function (e) {
        if (e.button !== 0 || e.isPrimary === false) return;
        if (isEditable(e.target)) return;
        if (loadingVisible()) return;
        burst(e.clientX, e.clientY);
    }, { passive: true });

    // ---------- Theme + reduced-motion sync ----------
    document.addEventListener('winter:themechange', readColors);
    new MutationObserver(readColors).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    var onMq = function () { reduced = mqReduce.matches; snowSync(); };
    if (mqReduce.addEventListener) mqReduce.addEventListener('change', onMq);
    else if (mqReduce.addListener) mqReduce.addListener(onMq);

    // ---------- Init ----------
    try { snowOn = localStorage.getItem('snow') !== 'off'; } catch (e) { snowOn = true; }
    readColors();
    size();
    syncButtons();
    snowSync();

    window.winter = { burst: burst, themeWave: themeWave, setSnow: setSnow };
})();
