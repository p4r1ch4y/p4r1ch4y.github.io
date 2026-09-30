/* ==========================================================================
   Circular theme-switch reveal — View Transitions API.
   The incoming theme is clipped into a circle that grows out from the toggle
   button. We stash the button's centre + the reach-the-corner radius as CSS
   variables (--vt-x / --vt-y / --vt-r) on <html>, then let a CSS keyframe
   (theme-circle, in style.css / winter.css) animate ::view-transition-new.
   Also fires the winter frost wave (winter.js) and syncs meta theme-color.
   Falls back to an instant switch when the API is unsupported or the user
   prefers reduced motion. Shared by index.html, portfolio.html, blog.html,
   404.html and every blog post page — call window.themeSwitch(button, applyFn).
   ========================================================================== */
(function () {
    var COLORS = { dark: '#000000', light: '#f8f9fb' };

    function finish(root) {
        root.classList.remove('winter-switching');
        var theme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        if (window.winter && window.winter.syncMeta) window.winter.syncMeta();
        else {
            var meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', COLORS[theme]);
        }
        document.dispatchEvent(new CustomEvent('winter:themechange', { detail: { theme: theme } }));
    }

    window.themeSwitch = function (originEl, apply) {
        var root = document.documentElement;
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

        if (reduce) { apply(); finish(root); return; }

        // Origin = centre of the toggle button (fallback: top-right corner)
        var x = window.innerWidth - 40, y = 40;
        try {
            var r = originEl && originEl.getBoundingClientRect();
            if (r && r.width) { x = r.left + r.width / 2; y = r.top + r.height / 2; }
        } catch (e) { /* keep fallback */ }

        // Radius that reaches the farthest screen corner from the origin
        var endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

        root.style.setProperty('--vt-x', x + 'px');
        root.style.setProperty('--vt-y', y + 'px');
        root.style.setProperty('--vt-r', endRadius + 'px');

        root.classList.add('winter-switching');
        if (window.winter && window.winter.themeWave) window.winter.themeWave(x, y, next);

        if (typeof document.startViewTransition !== 'function') {
            apply();
            finish(root);
            return;
        }
        var t = document.startViewTransition(apply);
        var done = function () { finish(root); };
        if (t && t.finished) t.finished.then(done, done); else done();
    };
})();
