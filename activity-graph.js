/* ==========================================================================
   Shared contribution heatmaps (GitHub + OpenForge).
   Renders into #gh-graph / #gh-count / #gh-legend and #of-graph / #of-count /
   #of-legend when those elements exist on the page. Used by the single-page
   card (index.html) and the full portfolio (portfolio.html).
   Update the OpenForge activity numbers in OPENFORGE below (single source).
   ========================================================================== */
(function () {
    var OPENFORGE = {"2026-01-02":5,"2026-01-22":1,"2026-01-23":3,"2026-01-27":4,"2026-01-28":1,"2026-01-29":5,"2026-01-30":4,"2026-02-03":2,"2026-02-04":3,"2026-02-05":5,"2026-02-06":5,"2026-02-08":1,"2026-02-09":3,"2026-02-10":2,"2026-02-11":3,"2026-02-12":1,"2026-02-13":2,"2026-02-16":1,"2026-02-17":2,"2026-02-18":1,"2026-02-19":3,"2026-02-20":1,"2026-02-23":2,"2026-02-24":2,"2026-02-25":3,"2026-02-26":3,"2026-02-27":3,"2026-03-02":5,"2026-03-03":3,"2026-03-05":2,"2026-03-06":1,"2026-03-08":1,"2026-03-09":2,"2026-03-10":4,"2026-03-11":4,"2026-03-12":3,"2026-03-13":1,"2026-03-16":2,"2026-03-17":1,"2026-03-18":4,"2026-03-19":3,"2026-03-20":4,"2026-03-23":2,"2026-03-24":1,"2026-03-25":2,"2026-03-27":3,"2026-03-30":1,"2026-03-31":1,"2026-04-01":1,"2026-04-02":2,"2026-04-06":3,"2026-04-07":2,"2026-04-08":5,"2026-04-09":5,"2026-04-10":5,"2026-04-11":1,"2026-04-12":1,"2026-04-13":1,"2026-04-15":4,"2026-04-16":3,"2026-04-17":4,"2026-04-20":2,"2026-04-21":4,"2026-04-22":2,"2026-04-24":1,"2026-04-27":4,"2026-04-28":5,"2026-04-29":5,"2026-04-30":4,"2026-05-04":6,"2026-05-05":4,"2026-05-06":1,"2026-05-07":1,"2026-05-08":1,"2026-05-11":3,"2026-05-12":1,"2026-05-13":10,"2026-05-14":3,"2026-05-15":1,"2026-05-18":1,"2026-05-19":2,"2026-05-20":1,"2026-05-21":1,"2026-05-22":1,"2026-05-23":1,"2026-05-24":1,"2026-05-25":1,"2026-05-26":5,"2026-05-27":1,"2026-05-28":1,"2026-05-29":1,"2026-06-01":4,"2026-06-02":5,"2026-06-03":1,"2026-06-04":1,"2026-06-05":1,"2026-06-06":1,"2026-06-07":1,"2026-06-08":1,"2026-06-09":3,"2026-06-10":1,"2026-06-11":11,"2026-06-12":1,"2026-06-15":1,"2026-06-16":1,"2026-06-17":1,"2026-06-18":3,"2026-06-19":3,"2026-06-20":7,"2026-06-21":1,"2026-06-22":1,"2026-06-23":1,"2026-06-24":4,"2026-06-25":4,"2026-06-29":2,"2026-06-30":2,"2026-07-01":1,"2026-07-02":3,"2026-07-03":2,"2026-07-04":2,"2026-07-05":5,"2026-07-06":4,"2026-07-07":5,"2026-07-08":3,"2026-07-09":13,"2026-07-10":4,"2026-07-11":9,"2026-07-12":5,"2026-07-13":6,"2026-07-14":9,"2026-07-15":3,"2026-07-18":6,"2026-07-20":2,"2026-07-21":1,"2026-07-22":9,"2026-07-23":13,"2026-07-24":7,"2026-07-27":4,"2026-07-28":4,"2026-07-29":19,"2026-07-30":12,"2026-07-31":3,"2026-08-02":2,"2026-08-03":3,"2026-08-04":1,"2026-08-05":1};

    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };

    // Last ~53 weeks (columns of 7 days, Sun->Sat), ending today.
    function buildWeeks() {
        var today = new Date(); today.setHours(0, 0, 0, 0);
        var start = new Date(today);
        start.setDate(start.getDate() - 364);
        start.setDate(start.getDate() - start.getDay());
        var weeks = []; var cur = new Date(start);
        while (cur <= today) {
            var wk = [];
            for (var i = 0; i < 7; i++) { wk.push(cur <= today ? iso(cur) : null); cur.setDate(cur.getDate() + 1); }
            weeks.push(wk);
        }
        return weeks;
    }

    // byDate: { 'YYYY-MM-DD': { c: count, l: level 0-4 } }
    function renderHeatmap(el, byDate) {
        var weeks = buildWeeks();
        var months = document.createElement('div'); months.className = 'hm-months';
        var grid = document.createElement('div'); grid.className = 'hm-grid';
        var lastMonth = -1;
        weeks.forEach(function (wk) {
            var firstIso = wk.find(Boolean);
            var label = document.createElement('span'); label.className = 'hm-mlabel';
            if (firstIso) {
                var mo = new Date(firstIso + 'T00:00:00').getMonth();
                if (mo !== lastMonth) { label.textContent = MONTHS[mo]; lastMonth = mo; }
            }
            months.appendChild(label);
            var col = document.createElement('div'); col.className = 'hm-col';
            wk.forEach(function (day) {
                var cell = document.createElement('span'); cell.className = 'hm-cell';
                if (day) { var d = byDate[day]; cell.dataset.l = d ? d.l : 0; cell.title = (d ? d.c : 0) + ' on ' + day; }
                else { cell.style.visibility = 'hidden'; }
                col.appendChild(cell);
            });
            grid.appendChild(col);
        });
        el.innerHTML = '';
        el.appendChild(months); el.appendChild(grid);
        var sc = el.closest('.hm-scroll');
        if (sc) sc.scrollLeft = sc.scrollWidth; // show most recent weeks first on mobile
    }

    function legend(el) {
        if (!el) return;
        el.innerHTML = 'Less' + [0, 1, 2, 3, 4].map(function (l) { return '<span class="hm-cell" data-l="' + l + '"></span>'; }).join('') + 'More';
    }

    function renderOpenForge() {
        var graph = document.getElementById('of-graph'); if (!graph) return;
        var ofLevel = function (c) { return c >= 7 ? 4 : c >= 4 ? 3 : c >= 2 ? 2 : c >= 1 ? 1 : 0; };
        var byDate = {}; var total = 0;
        for (var k in OPENFORGE) { byDate[k] = { c: OPENFORGE[k], l: ofLevel(OPENFORGE[k]) }; total += OPENFORGE[k]; }
        var count = document.getElementById('of-count'); if (count) count.innerHTML = '<b>' + total + '</b> contributions in 2026';
        renderHeatmap(graph, byDate);
        legend(document.getElementById('of-legend'));
    }

    function renderGitHub() {
        var graph = document.getElementById('gh-graph'); if (!graph) return;
        var count = document.getElementById('gh-count');
        fetch('https://github-contributions-api.jogruber.de/v4/p4r1ch4y?y=last')
            .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(function (data) {
                var byDate = {};
                (data.contributions || []).forEach(function (c) { byDate[c.date] = { c: c.count, l: c.level }; });
                renderHeatmap(graph, byDate);
                legend(document.getElementById('gh-legend'));
                var t = (data.total && (data.total.lastYear != null ? data.total.lastYear : Object.values(data.total)[0])) || 0;
                if (count) count.innerHTML = '<b>' + t + '</b> contributions in the last year';
            })
            .catch(function () {
                if (count) count.textContent = 'GitHub activity';
                graph.innerHTML = '<a class="hm-loading" href="https://github.com/p4r1ch4y" target="_blank" rel="noopener" style="color:var(--primary-color,var(--accent))">View on GitHub \u2192</a>';
            });
    }

    function init() { renderOpenForge(); renderGitHub(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
