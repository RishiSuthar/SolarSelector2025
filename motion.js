/* ===================================================
   SANGYUG SOLAR — live system stage + motion layer
   Reads the configurator's state and draws the system being built:
   panels -> inverter -> batteries + home, with energy flows that
   follow the real sun over Nairobi.
   =================================================== */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var SVGNS = 'http://www.w3.org/2000/svg';

    /* ---------- sun over Nairobi (UTC+3, ~1.3°S: 06:30 to 18:40 all year) ---------- */
    var SUNRISE = 6.5, SUNSET = 18 + 40 / 60, DAY = SUNSET - SUNRISE;
    function nairobiHours(d) {
        d = d || new Date();
        return ((d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600) + 3) % 24;
    }
    function dayFrac(h) { return Math.max(0, Math.min(1, (h - SUNRISE) / DAY)); }
    function sunLevel(h) { var f = dayFrac(h); return f <= 0 || f >= 1 ? 0 : Math.sin(Math.PI * f); }
    function clock(h) { var a = Math.floor(h), b = Math.floor((h - a) * 60); return (a < 10 ? '0' : '') + a + ':' + (b < 10 ? '0' : '') + b; }

    /* ---------- helpers ---------- */
    function num(n, dp) { return Number(n).toLocaleString(undefined, { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 }); }
    function trimNum(n) { return (Math.round(n * 10) / 10).toString(); }
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function el(tag, attrs, parent) {
        var e = document.createElementNS(SVGNS, tag);
        for (var k in attrs) e.setAttribute(k, attrs[k]);
        if (parent) parent.appendChild(e);
        return e;
    }
    function tween(node, to, fmtFn, dur) {
        if (!node) return;
        var from = parseFloat(node.getAttribute('data-v') || '0');
        node.setAttribute('data-v', to);
        if (reduceMotion || from === to || !isFinite(from)) { node.textContent = fmtFn(to); return; }
        var start = null; dur = dur || 650;
        if (node._raf) cancelAnimationFrame(node._raf);
        var step = function (ts) {
            if (start === null) start = ts;
            var t = Math.min(1, (ts - start) / dur);
            node.textContent = fmtFn(from + (to - from) * ease(t));
            if (t < 1) node._raf = requestAnimationFrame(step);
        };
        node._raf = requestAnimationFrame(step);
    }

    /* ---------- model ---------- */
    function safe(fn, fallback) { try { return fn(); } catch (e) { return fallback; } }

    function liveModel() {
        var m = { panels: 0, panelW: 0, inv: null, bat: null, loadW: 0, peakW: 0, total: 0, guided: false };
        if (typeof state === 'undefined') return m;
        var inv = state.inverter;
        m.guided = state.mode === 'guided';
        m.loadW = m.guided ? (state.guidedRunningWatts || 0) : 0;
        m.peakW = m.guided ? (state.guidedPeakWatts || 0) : 0;
        if (inv) {
            m.panels = state.panels || 0;
            m.panelW = state.panelType ? state.panelType.watts : 600;
            if (state.phase === 'three') {
                m.inv = { img: inv.img, cap: trimNum((inv.watts || 0) / 1000) + ' kW', name: state.company + ' ' + (inv.model || ''), capW: inv.watts || 0 };
                if (state.company === 'Kstar' && inv.batteries) {
                    m.bat = { count: inv.batteries.count, name: inv.batteries.name, kwh: parseFloat(inv.batteries.totalCapacity) || 0 };
                } else if (state.company === 'ATESS' && inv.battery) {
                    var cfg = inv.battery.configs[(state.atessMasterCount || 3) - 1];
                    m.bat = { count: cfg.totalUnits, name: inv.battery.name, kwh: parseFloat(cfg.capacity) || 0 };
                }
            } else {
                var units = inv.series === 'Knight Series' ? (state.knightUnits || 1) : 1;
                var series = inv.series ? inv.series.replace(' Series', '') : '';
                m.inv = {
                    img: inv.img,
                    cap: trimNum(inv.kva * units) + ' kVA',
                    name: state.company + (series ? ' ' + series : '') + (units > 1 ? ' ×' + units : ''),
                    capW: (inv.maxWatts || 0) * units
                };
                if (inv.essBattery) {
                    m.bat = { count: inv.essBattery.count, name: inv.essBattery.name, kwh: parseFloat(inv.essBattery.totalCapacity) || 0 };
                } else if (state.battery) {
                    m.bat = { count: state.battery.count, name: state.battery.name, kwh: (state.battery.capacityWh || 0) * state.battery.count / 1000 };
                }
            }
            m.total = safe(function () { return getTotal(); }, 0);
        }
        return m;
    }

    function demoModel() {
        var inv = safe(function () { return kstarSingleInverters.filter(function (i) { return i.series === 'Knight Series' && i.kva === 6; })[0]; }, null);
        return {
            demo: true, panels: 10, panelW: 600,
            inv: { img: inv ? inv.img : 'images/kstarinverter.png', cap: '6 kVA', name: 'Kstar Knight', capW: 6000 },
            bat: { count: 2, name: 'Lithium 100Ah', kwh: 10.24 },
            loadW: 1840, peakW: 2900, total: 0, guided: true
        };
    }

    /* ---------- stage ---------- */
    function Stage(root, opts) {
        this.root = root;
        this.demo = !!opts.demo;
        this.hour = nairobiHours();
        this.build();
    }

    Stage.prototype.build = function () {
        var r = this.root;
        r.innerHTML =
            '<button class="stage-toggle" type="button" aria-expanded="false">' +
                '<span class="stage-toggle-label">Your system</span>' +
                '<span class="stage-toggle-total" data-k="ttotal">Add parts to see a price</span>' +
                '<i data-lucide="chevron-down"></i>' +
            '</button>' +
            '<div class="stage-body">' +
                '<div class="stage-head">' +
                    '<span class="stage-title">' + (this.demo ? 'Example: 3-bedroom home' : 'Your system') + '</span>' +
                    '<span class="stage-status" data-k="status"><span class="stage-led"></span><span data-k="statusText"></span></span>' +
                '</div>' +
                '<div class="stage-canvas"></div>' +
                '<dl class="stage-stats">' +
                    '<div class="st st-solar"><dt>Solar array</dt><dd data-k="solar">Sized next</dd></div>' +
                    '<div class="st st-store"><dt>Storage</dt><dd data-k="store">Sized next</dd></div>' +
                    '<div class="st st-load"><dt data-k="loadLabel">Your load</dt><dd data-k="load">0 W</dd></div>' +
                '</dl>' +
                (this.demo ? '' :
                '<div class="stage-total">' +
                    '<span class="stage-total-label">Estimated total</span>' +
                    '<strong class="stage-total-val" data-k="total">KSH 0</strong>' +
                    '<span class="stage-total-sub" data-k="monthly">Pick an inverter to see a price.</span>' +
                '</div>') +
            '</div>';
        this.k = {};
        var self = this;
        r.querySelectorAll('[data-k]').forEach(function (n) { self.k[n.getAttribute('data-k')] = n; });

        var toggle = r.querySelector('.stage-toggle');
        toggle.addEventListener('click', function () {
            var open = r.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        this.buildSvg(r.querySelector('.stage-canvas'));
    };

    Stage.prototype.buildSvg = function (host) {
        var svg = el('svg', { viewBox: '0 0 400 468', class: 'stage-svg', 'aria-hidden': 'true' });
        var defs = el('defs', {}, svg);
        var uid = this.demo ? 'd' : 'l';
        var pat = el('pattern', { id: 'pv-' + uid, width: 6, height: 6, patternUnits: 'userSpaceOnUse' }, defs);
        el('rect', { width: 6, height: 6, class: 'pv-cell-bg' }, pat);
        el('path', { d: 'M6 0H0V6', class: 'pv-cell-line' }, pat);
        var glow = el('radialGradient', { id: 'sun-' + uid }, defs);
        el('stop', { offset: '0', 'stop-color': '#FFD36B', 'stop-opacity': '.85' }, glow);
        el('stop', { offset: '1', 'stop-color': '#F2A516', 'stop-opacity': '0' }, glow);

        // sky
        var sky = el('g', { class: 'sky' }, svg);
        this.arc = el('path', { d: 'M28 176 A172 150 0 0 1 372 176', class: 'sky-arc' }, sky);
        this.arcLit = el('path', { d: 'M28 176 A172 150 0 0 1 372 176', class: 'sky-arc-lit', pathLength: 1 }, sky);
        el('line', { x1: 8, y1: 176, x2: 392, y2: 176, class: 'horizon' }, sky);
        this.sun = el('g', { class: 'sun' }, sky);
        el('circle', { r: 30, fill: 'url(#sun-' + uid + ')' }, this.sun);
        el('circle', { r: 8, class: 'sun-core' }, this.sun);

        // array
        this.arrayG = el('g', { class: 'array' }, svg);
        this.arrayEmpty = el('g', { class: 'array-empty' }, svg);
        el('rect', { x: 110, y: 120, width: 180, height: 50, rx: 8, class: 'ghost' }, this.arrayEmpty);
        el('text', { x: 200, y: 150, 'text-anchor': 'middle', class: 'ghost-text' }, this.arrayEmpty).textContent = 'Panels are sized to your inverter';
        this.arrayMore = el('text', { x: 200, y: 98, 'text-anchor': 'middle', class: 'array-more' }, svg);
        this.patId = 'pv-' + uid;

        // flows: track + animated dash
        function flow(d, cls) {
            var g = el('g', { class: 'flow ' + cls });
            el('path', { d: d, class: 'flow-track' }, g);
            el('path', { d: d, class: 'flow-dash' }, g);
            svg.appendChild(g);
            return g;
        }
        this.fSolar = flow('M200 182 V 230', 'flow-solar');
        this.fStore = flow('M150 326 C150 356 110 350 110 380', 'flow-store');
        this.fLoad = flow('M250 326 C250 356 290 350 290 380', 'flow-load');

        // inverter node
        this.nInv = el('g', { class: 'node node-inv' }, svg);
        el('rect', { x: 96, y: 230, width: 208, height: 96, rx: 16, class: 'node-box' }, this.nInv);
        el('rect', { x: 108, y: 242, width: 72, height: 72, rx: 10, class: 'node-well' }, this.nInv);
        this.invImg = el('image', { x: 112, y: 246, width: 64, height: 64, preserveAspectRatio: 'xMidYMid meet', class: 'inv-img' }, this.nInv);
        this.invQ = el('text', { x: 144, y: 284, 'text-anchor': 'middle', class: 'node-q' }, this.nInv);
        this.invQ.textContent = '?';
        this.invCap = el('text', { x: 194, y: 276, class: 'node-val' }, this.nInv);
        this.invName = el('text', { x: 194, y: 296, class: 'node-cap' }, this.nInv);

        // battery node
        this.nBat = el('g', { class: 'node node-bat' }, svg);
        el('rect', { x: 30, y: 380, width: 160, height: 80, rx: 16, class: 'node-box' }, this.nBat);
        this.cellsG = el('g', { class: 'cells' }, this.nBat);
        this.batVal = el('text', { x: 46, y: 432, class: 'node-val sm' }, this.nBat);
        this.batCap = el('text', { x: 46, y: 449, class: 'node-cap' }, this.nBat);

        // home node
        this.nHome = el('g', { class: 'node node-home' }, svg);
        el('rect', { x: 210, y: 380, width: 160, height: 80, rx: 16, class: 'node-box' }, this.nHome);
        el('path', { d: 'M226 408 L238 397 L250 408 V418 H226 Z M234 418 V411 H242 V418', class: 'home-ic' }, this.nHome);
        this.loadBar = el('rect', { x: 260, y: 405, width: 0, height: 6, rx: 3, class: 'load-fill' }, this.nHome);
        el('rect', { x: 260, y: 405, width: 94, height: 6, rx: 3, class: 'load-track' }, this.nHome).parentNode.insertBefore(this.nHome.lastChild, this.loadBar);
        this.homeVal = el('text', { x: 226, y: 438, class: 'node-val sm' }, this.nHome);
        this.homeCap = el('text', { x: 226, y: 453, class: 'node-cap' }, this.nHome);

        host.appendChild(svg);
        this.svg = svg;
        this.lastPanels = -1;
        this.lastImg = null;
    };

    Stage.prototype.drawPanels = function (n) {
        var g = this.arrayG;
        while (g.firstChild) g.removeChild(g.firstChild);
        this.arrayMore.textContent = '';
        if (!n) return;
        var shown = Math.min(n, 20);
        var cols = Math.min(shown, 10);
        var rows = Math.ceil(shown / cols);
        var gap = 5, maxW = 30;
        var w = Math.min(maxW, (250 - (cols - 1) * gap) / cols);
        var h = Math.min(w * 1.4, rows > 1 ? 30 : 42);
        var totalW = cols * w + (cols - 1) * gap;
        var x0 = 200 - totalW / 2;
        var yBottom = 172;
        for (var i = 0; i < shown; i++) {
            var row = Math.floor(i / cols), col = i % cols;
            var x = x0 + col * (w + gap);
            var y = yBottom - (row + 1) * h - row * gap;
            var p = el('g', { class: 'pv' }, g);
            p.style.animationDelay = reduceMotion ? '0s' : (i * 0.045) + 's';
            var sk = w * 0.16;
            var d = 'M' + (x + sk) + ' ' + y + 'H' + (x + w + sk) + 'L' + (x + w) + ' ' + (y + h) + 'H' + x + 'Z';
            el('path', { d: d, fill: 'url(#' + this.patId + ')', class: 'pv-face' }, p);
            el('path', { d: d, class: 'pv-sheen' }, p);
        }
        if (n > shown) {
            this.arrayMore.setAttribute('y', yBottom - rows * h - (rows - 1) * gap - 10);
            this.arrayMore.textContent = '+' + (n - shown) + ' more panels';
        }
    };

    Stage.prototype.drawCells = function (count) {
        var g = this.cellsG;
        while (g.firstChild) g.removeChild(g.firstChild);
        var shown = Math.min(count || 0, 8);
        for (var i = 0; i < shown; i++) {
            var c = el('g', { class: 'cell' }, g);
            c.style.animationDelay = reduceMotion ? '0s' : (i * 0.06) + 's';
            el('rect', { x: 46 + i * 16, y: 394, width: 11, height: 18, rx: 2.5, class: 'cell-body' }, c);
            el('rect', { x: 49 + i * 16, y: 391, width: 5, height: 3, rx: 1, class: 'cell-cap' }, c);
            el('rect', { x: 48 + i * 16, y: 399, width: 7, height: 11, rx: 1.5, class: 'cell-charge' }, c);
        }
        if (!shown) {
            el('rect', { x: 46, y: 394, width: 11, height: 18, rx: 2.5, class: 'ghost' }, g);
            el('rect', { x: 62, y: 394, width: 11, height: 18, rx: 2.5, class: 'ghost' }, g);
        }
    };

    Stage.prototype.setSun = function (h) {
        this.hour = h;
        var f = dayFrac(h);
        var len = this.arc.getTotalLength();
        var p = this.arc.getPointAtLength(len * f);
        this.sun.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')');
        this.arcLit.style.strokeDashoffset = String(1 - f);
        this.applyEnergy();
    };

    Stage.prototype.applyEnergy = function () {
        var m = this.model || {};
        var level = sunLevel(this.hour);
        var night = level === 0;
        var hasArray = m.panels > 0;
        var hasInv = !!m.inv;
        var hasBat = !!m.bat;
        var hasLoad = m.loadW > 0 || m.demo || (hasInv && hasBat);
        var kwp = (m.panels * m.panelW) / 1000;
        var producing = hasArray ? kwp * 0.8 * level : 0;

        this.root.classList.toggle('is-night', night);
        this.svg.style.setProperty('--sheen', (0.06 + level * 0.9).toFixed(2));

        var solarOn = hasArray && hasInv && level > 0.02;
        var dur = function (strength) { return (2.6 - Math.min(1, strength) * 1.8).toFixed(2) + 's'; };
        this.fSolar.classList.toggle('on', solarOn);
        this.fSolar.style.setProperty('--dur', dur(level));
        this.fStore.classList.toggle('on', hasBat && hasInv);
        this.fStore.classList.toggle('rev', night);           // night: battery feeds the inverter
        this.fStore.style.setProperty('--dur', dur(0.55));
        this.fLoad.classList.toggle('on', hasInv && hasLoad);
        this.fLoad.style.setProperty('--dur', dur(Math.min(1, (m.loadW || 600) / 3000) + 0.2));

        if (this.k.statusText) {
            var txt;
            if (!hasArray) txt = 'Nairobi ' + clock(this.hour);
            else if (night) txt = 'Night in Nairobi, running on batteries';
            else txt = 'Producing ' + trimNum(producing) + ' kW now';
            this.k.statusText.textContent = txt;
            this.k.status.classList.toggle('live', hasArray && !night);
        }
    };

    Stage.prototype.update = function (m) {
        this.model = m;
        var k = this.k;

        // array
        if (m.panels !== this.lastPanels) { this.drawPanels(m.panels); this.lastPanels = m.panels; }
        this.arrayEmpty.style.display = m.panels ? 'none' : '';

        // inverter
        this.nInv.classList.toggle('off', !m.inv);
        if (m.inv) {
            if (m.inv.img !== this.lastImg) {
                this.invImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', m.inv.img);
                this.invImg.setAttribute('href', m.inv.img);
                this.nInv.classList.remove('pop'); void this.nInv.getBoundingClientRect(); this.nInv.classList.add('pop');
                this.lastImg = m.inv.img;
            }
            this.invCap.textContent = m.inv.cap;
            this.invName.textContent = m.inv.name.length > 18 ? m.inv.name.slice(0, 17) + '…' : m.inv.name;
        } else {
            this.lastImg = null;
            this.invImg.removeAttribute('href');
            this.invCap.textContent = 'Inverter';
            this.invName.textContent = m.guided ? 'Matched to your load' : 'Not chosen yet';
        }

        // battery
        this.nBat.classList.toggle('off', !m.bat);
        var cellsKey = m.bat ? m.bat.count : 0;
        if (cellsKey !== this.lastCells) { this.drawCells(cellsKey); this.lastCells = cellsKey; }
        if (m.bat) {
            this.batVal.textContent = trimNum(m.bat.kwh) + ' kWh';
            var bn = m.bat.count + ' × ' + m.bat.name;
            this.batCap.textContent = bn.length > 22 ? bn.slice(0, 21) + '…' : bn;
        } else {
            this.batVal.textContent = 'Batteries';
            this.batCap.textContent = 'Not chosen yet';
        }

        // home / load
        var cap = m.inv ? m.inv.capW : 0;
        var loadKnown = m.loadW > 0;
        this.nHome.classList.toggle('off', !loadKnown && !m.inv);
        if (loadKnown) {
            this.homeVal.textContent = num(m.loadW) + ' W';
            this.homeCap.textContent = cap ? Math.round(m.loadW / cap * 100) + '% of capacity' : 'Running load';
            this.loadBar.setAttribute('width', (94 * Math.min(1, cap ? m.loadW / cap : Math.min(1, m.loadW / 6000))).toFixed(1));
            this.nHome.classList.toggle('over', cap > 0 && m.loadW > cap);
        } else if (m.inv) {
            this.homeVal.textContent = 'Up to ' + num(cap) + ' W';
            this.homeCap.textContent = 'Inverter capacity';
            this.loadBar.setAttribute('width', 0);
            this.nHome.classList.remove('over');
        } else {
            this.homeVal.textContent = 'Your home';
            this.homeCap.textContent = m.guided ? 'Add appliances' : 'Load not set';
            this.loadBar.setAttribute('width', 0);
            this.nHome.classList.remove('over');
        }

        // stats
        var kwp = (m.panels * m.panelW) / 1000;
        if (m.panels) k.solar.innerHTML = trimNum(kwp) + ' kWp<small>' + m.panels + ' × ' + m.panelW + ' W</small>'; else k.solar.textContent = 'Sized next';
        if (m.bat) k.store.innerHTML = trimNum(m.bat.kwh) + ' kWh<small>' + m.bat.count + (m.bat.count > 1 ? ' units' : ' unit') + '</small>'; else k.store.textContent = m.inv ? 'Choose next' : 'Sized next';
        if (loadKnown) { k.loadLabel.textContent = 'Your load'; k.load.innerHTML = num(m.loadW) + ' W' + (m.peakW ? '<small>' + num(m.peakW) + ' W at start-up</small>' : ''); }
        else if (m.inv) { k.loadLabel.textContent = 'Inverter'; k.load.innerHTML = m.inv.cap + '<small>Up to ' + num(m.inv.capW) + ' W</small>'; }
        else { k.loadLabel.textContent = 'Your load'; k.load.textContent = m.guided ? '0 W' : 'Not set'; }
        this.root.classList.toggle('has-solar', !!m.panels);
        this.root.classList.toggle('has-store', !!m.bat);

        // total
        if (k.total) {
            tween(k.total, m.total, function (v) { return 'KSH ' + num(Math.round(v)); });
            k.monthly.textContent = m.total > 0
                ? 'or about KSH ' + num(Math.round(m.total * 1.1 / 24)) + ' a month over 24 months'
                : (m.inv ? 'Choose a battery to complete the price.' : 'Pick an inverter to see a price.');
            k.ttotal.textContent = m.total > 0 ? 'KSH ' + num(Math.round(m.total)) : (m.inv ? 'Choose a battery' : 'Add parts to see a price');
            this.root.classList.toggle('has-total', m.total > 0);
        }

        this.applyEnergy();
    };

    /* ---------- wiring ---------- */
    var live = null, hero = null, lastSig = '';

    function signature() {
        if (typeof state === 'undefined') return '';
        var i = state.inverter;
        return [state.step, state.mode, state.phase, state.company,
            i ? (i.id || '') + i.kva + (i.series || '') + i.voltage + (i.model || '') : '-',
            state.knightUnits, state.battery ? state.battery.id + state.battery.count : '-',
            state.atessMasterCount, state.panels, state.guidedRunningWatts,
            safe(function () { return getTotal(); }, 0)].join('|');
    }

    function refresh(force) {
        if (!live) return;
        var sig = signature();
        if (!force && sig === lastSig) return;
        lastSig = sig;
        live.update(liveModel());
        if (state.step !== 'landing' && typeof updateRunningTotal === 'function') updateRunningTotal();
    }

    function wrap(name) {
        var orig = window[name];
        if (typeof orig !== 'function') return;
        window[name] = function () {
            var out = orig.apply(this, arguments);
            refresh();
            return out;
        };
    }

    /* ---------- meter-style running total in the top bar ---------- */
    var meterVal = 0, meterRaf = 0;
    function meter(node, total) {
        var from = meterVal; meterVal = total;
        var wrapEl = node.closest('.topbar-total');
        if (wrapEl) wrapEl.classList.toggle('has-value', total > 0);
        if (reduceMotion || from === total) { node.textContent = 'KSH ' + num(Math.round(total)); return; }
        cancelAnimationFrame(meterRaf);
        if (wrapEl) { wrapEl.classList.remove('is-ticking'); void wrapEl.offsetWidth; wrapEl.classList.add('is-ticking'); }
        var start = null;
        var step = function (ts) {
            if (start === null) start = ts;
            var t = Math.min(1, (ts - start) / 700);
            node.textContent = 'KSH ' + num(Math.round(from + (total - from) * ease(t)));
            if (t < 1) meterRaf = requestAnimationFrame(step);
        };
        meterRaf = requestAnimationFrame(step);
    }
    window.SolarMotion = { meter: meter, refresh: function () { refresh(true); } };

    function init() {
        var liveRoot = document.getElementById('stage');
        var heroRoot = document.getElementById('hero-stage');

        if (liveRoot) { live = new Stage(liveRoot, {}); live.setSun(nairobiHours()); }
        if (heroRoot) {
            hero = new Stage(heroRoot, { demo: true });
            var dm = demoModel();
            var now = nairobiHours();
            var target = (now < SUNRISE || now >= SUNSET) ? now : now;
            var playTo = (now < SUNRISE || now >= SUNSET) ? SUNSET : now;
            if (reduceMotion) {
                hero.update(dm); hero.setSun(target);
            } else {
                // Orchestrated load: sunrise, then the array installs, then the rest connects.
                hero.update({ demo: true, panels: 0, panelW: 600, inv: null, bat: null, loadW: 0, guided: true });
                hero.setSun(SUNRISE);
                setTimeout(function () {
                    hero.update(dm);
                    var start = null;
                    var step = function (ts) {
                        if (start === null) start = ts;
                        var t = Math.min(1, (ts - start) / 2400);
                        hero.setSun(t === 1 ? target : SUNRISE + (playTo - SUNRISE) * ease(t));
                        if (t < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }, 450);
            }
        }

        ['goTo', 'recalcGuidedLoad', 'selectBattery', 'selectInverter', 'selectPackage',
         'selectAtessBatteryConfig', 'guidedSelectInverter', 'guidedSelectPackage', 'resetAll'].forEach(wrap);
        refresh(true);
        if (window.lucide) lucide.createIcons();

        // Catch any state change made outside the wrapped functions.
        setInterval(function () { refresh(); }, 400);
        // Keep the sun honest.
        setInterval(function () {
            var h = nairobiHours();
            if (live) live.setSun(h);
            if (hero) hero.setSun(h);
        }, 60000);

        // Closing CTA on the landing page
        document.querySelectorAll('[data-start="guided"]').forEach(function (b) {
            b.addEventListener('click', function () { var g = document.getElementById('mode-guided'); if (g) g.click(); });
        });

        // Quote date
        var qd = document.getElementById('quote-date');
        if (qd) qd.textContent = 'Prepared ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
