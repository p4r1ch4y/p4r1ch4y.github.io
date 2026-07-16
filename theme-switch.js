/* ==========================================================================
   Circular theme-switch reveal — View Transitions API.
   The incoming theme is clipped into a circle that grows out from the toggle
   button. We stash the button's centre + the reach-the-corner radius as CSS
   variables (--vt-x / --vt-y / --vt-r) on <html>, then let a CSS keyframe
   (theme-circle, in style.css / landing.html) animate ::view-transition-new.
   Falls back to an instant switch when the API is unsupported or the user
   prefers reduced motion. Shared by index.html, blog.html, landing.html and
   every blog post page — call window.themeSwitch(button, applyFn).
   ========================================================================== */
(function () {
    window.themeSwitch = function (originEl, apply) {
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (typeof document.startViewTransition !== 'function' || reduce) { apply(); return; }

        // Origin = centre of the toggle button (fallback: top-right corner)
        var x = window.innerWidth - 40, y = 40;
        try {
            var r = originEl && originEl.getBoundingClientRect();
            if (r && r.width) { x = r.left + r.width / 2; y = r.top + r.height / 2; }
        } catch (e) { /* keep fallback */ }

        // Radius that reaches the farthest screen corner from the origin
        var endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

        var root = document.documentElement;
        root.style.setProperty('--vt-x', x + 'px');
        root.style.setProperty('--vt-y', y + 'px');
        root.style.setProperty('--vt-r', endRadius + 'px');

        document.startViewTransition(apply);
    };
})();
