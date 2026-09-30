/* ==========================================================================
   External-link warning modal (site-wide).
   Intercepts clicks on links that point to another domain and shows a small
   confirmation dialog before leaving the site. Self-contained: injects its own
   styles and markup, and is theme-aware via [data-theme]. Include this script
   on every page. Opt a link out with data-no-external-warning.
   ========================================================================== */
(function () {
    'use strict';

    var CSS = [
        '.elm-overlay{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:1.25rem;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);}',
        '.elm-overlay.open{display:flex;animation:elm-fade .18s ease;}',
        '@keyframes elm-fade{from{opacity:0}to{opacity:1}}',
        '.elm-modal{width:100%;max-width:460px;background:#ffffff;color:#1c1917;border:1px solid rgba(28,25,23,.12);border-radius:14px;padding:1.5rem;box-shadow:0 20px 60px rgba(0,0,0,.4);font-family:"Outfit",system-ui,-apple-system,BlinkMacSystemFont,sans-serif;position:relative;animation:elm-pop .2s cubic-bezier(.2,.8,.3,1);}',
        '@keyframes elm-pop{from{transform:translateY(10px) scale(.97);opacity:0}to{transform:none;opacity:1}}',
        '.elm-close{position:absolute;top:.9rem;right:1rem;background:none;border:none;font-size:1.5rem;line-height:1;color:#78716c;cursor:pointer;padding:0;}',
        '.elm-close:hover{color:#1c1917;}',
        '.elm-head{display:flex;align-items:center;gap:.55rem;font-size:1.05rem;font-weight:600;margin-bottom:.75rem;padding-right:1.5rem;}',
        '.elm-head i{color:#e0a500;}',
        '.elm-body{color:#57534e;font-size:.95rem;line-height:1.55;margin:0 0 1rem;}',
        '.elm-url{background:#f3efe7;color:#57534e;border-radius:8px;padding:.7rem .9rem;font-family:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.8rem;word-break:break-all;margin-bottom:1.4rem;max-height:5.5rem;overflow:auto;}',
        '.elm-actions{display:flex;gap:.5rem;justify-content:flex-end;align-items:center;flex-wrap:wrap;}',
        '.elm-stay{background:none;border:none;color:#57534e;font-size:.9rem;font-weight:500;cursor:pointer;padding:.65rem .75rem;border-radius:9px;font-family:inherit;}',
        '.elm-stay:hover{color:#1c1917;background:rgba(28,25,23,.05);}',
        '.elm-continue{display:inline-flex;align-items:center;gap:.5rem;background:#8a5a15;color:#fff;text-decoration:none;font-size:.9rem;font-weight:600;padding:.65rem 1.15rem;border-radius:9px;font-family:inherit;transition:background .2s;}',
        '.elm-continue:hover{background:#734a10;color:#fff;}',
        ':root[data-theme="dark"] .elm-modal{background:#1a1713;color:#f0ece4;border-color:rgba(240,236,228,.14);box-shadow:0 20px 60px rgba(0,0,0,.65);}',
        ':root[data-theme="dark"] .elm-close{color:#8a8175;}',
        ':root[data-theme="dark"] .elm-close:hover{color:#f0ece4;}',
        ':root[data-theme="dark"] .elm-body{color:#b3aa9c;}',
        ':root[data-theme="dark"] .elm-url{background:#221d18;color:#b3aa9c;}',
        ':root[data-theme="dark"] .elm-stay{color:#b3aa9c;}',
        ':root[data-theme="dark"] .elm-stay:hover{color:#f0ece4;background:rgba(240,236,228,.06);}',
        ':root[data-theme="dark"] .elm-continue{background:#e0ab4f;color:#17130c;}',
        ':root[data-theme="dark"] .elm-continue:hover{background:#f0c876;color:#17130c;}',
        '@media (prefers-reduced-motion: reduce){.elm-overlay.open,.elm-modal{animation:none;}}'
    ].join('');

    var overlay, urlBox, continueLink, lastFocus;
    var inertSet = [];

    function bareHost(h) { return String(h || '').toLowerCase().replace(/^www\./, ''); }

    function setBackgroundInert(on) {
        if (!on) {
            inertSet.forEach(function (el) { try { el.inert = false; } catch (e) { /* ignore */ } });
            inertSet = [];
            return;
        }
        if (!('inert' in HTMLElement.prototype)) return;
        Array.prototype.forEach.call(document.body.children, function (el) {
            if (el === overlay || el.inert) return;
            var t = el.tagName;
            if (t === 'SCRIPT' || t === 'STYLE' || t === 'LINK') return;
            el.inert = true;
            inertSet.push(el);
        });
    }

    function build() {
        if (overlay) return;
        var style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        overlay = document.createElement('div');
        overlay.className = 'elm-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'elm-title');
        overlay.innerHTML =
            '<div class="elm-modal">' +
                '<button class="elm-close" type="button" aria-label="Close">&times;</button>' +
                '<div class="elm-head"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i><span id="elm-title">External Link</span></div>' +
                '<p class="elm-body">This link is an external link and it will open in a new window or tab.</p>' +
                '<div class="elm-url"></div>' +
                '<div class="elm-actions">' +
                    '<button class="elm-stay" type="button">Stay on this site</button>' +
                    '<a class="elm-continue" data-no-external-warning target="_blank" rel="noopener noreferrer">Continue <i class="fas fa-up-right-from-square" aria-hidden="true"></i></a>' +
                '</div>' +
            '</div>';
        document.body.appendChild(overlay);

        urlBox = overlay.querySelector('.elm-url');
        continueLink = overlay.querySelector('.elm-continue');
        overlay.querySelector('.elm-close').addEventListener('click', hide);
        overlay.querySelector('.elm-stay').addEventListener('click', hide);
        continueLink.addEventListener('click', function () { setTimeout(hide, 40); });
        overlay.addEventListener('click', function (e) { if (e.target === overlay) hide(); });
        document.addEventListener('keydown', function (e) {
            if (!overlay.classList.contains('open')) return;
            if (e.key === 'Escape') { hide(); return; }
            if (e.key === 'Tab') { trapFocus(e); }
        });
    }

    function focusables() { return [overlay.querySelector('.elm-close'), overlay.querySelector('.elm-stay'), continueLink]; }
    function trapFocus(e) {
        var f = focusables(), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    function show(url) {
        if (!overlay) build();
        urlBox.textContent = url;
        continueLink.href = url;
        lastFocus = document.activeElement;
        overlay.classList.add('open');
        setBackgroundInert(true);
        continueLink.focus();
    }
    function hide() {
        if (!overlay) return;
        overlay.classList.remove('open');
        setBackgroundInert(false);
        if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* ignore */ } }
    }

    function isExternal(a) {
        if (!a || !a.getAttribute('href')) return false;
        if (a.protocol !== 'http:' && a.protocol !== 'https:') return false; // skip mailto:, tel:, #anchors, javascript:
        if (a.hostname === '' || bareHost(a.hostname) === bareHost(location.hostname)) return false;
        if (a.hasAttribute('data-no-external-warning')) return false;
        return true;
    }

    document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var a = e.target.closest ? e.target.closest('a') : null;
        if (!a || (a.closest && a.closest('.elm-overlay'))) return;
        if (!isExternal(a)) return;
        e.preventDefault();
        show(a.href);
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
    else build();
})();
