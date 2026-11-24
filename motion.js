/* ===================================================
   SANGYUG SOLAR — motion layer
   Live Nairobi sun path (hero) + meter-style running total
   =================================================== */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Nairobi sits ~1.3° south of the equator: the sun rises around 06:30
       and sets around 18:40 all year. Times below are in hours, local (EAT, UTC+3). */
    var SUNRISE = 6.5;
    var SUNSET = 18 + 40 / 60;
    var DAY = SUNSET - SUNRISE;
    var PEAK_KW = 2.4;           // realistic peak for a 3 kW array after losses

    function nairobiHours(date) {
        var utc = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
        return (utc + 3) % 24;
    }
    function fmtClock(h) {
        var hh = Math.floor(h), mm = Math.floor((h - hh) * 60);
        return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
    }
    function dayFraction(h) { return Math.max(0, Math.min(1, (h - SUNRISE) / DAY)); }
    function outputKw(f) { return f <= 0 || f >= 1 ? 0 : PEAK_KW * Math.sin(Math.PI * f); }
    function harvestKwh(f) { return PEAK_KW * DAY / Math.PI * (1 - Math.cos(Math.PI * f)); }
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    /* ---------- hero sun path ---------- */
    function initSunPath() {
        var fig = document.getElementById('sunpath');
        if (!fig) return;
        var track = document.getElementById('sp-track');
        var trail = document.getElementById('sp-trail');
        var sun = document.getElementById('sp-sun');
        var ticks = document.getElementById('sp-ticks');
        var glints = fig.querySelectorAll('.sp-glint');
        var kwEl = document.getElementById('sr-kw');
        var kwhEl = document.getElementById('sr-kwh');
        var meterEl = document.getElementById('sr-meter');
        var clockEl = document.getElementById('sr-clock');
        var stateEl = document.getElementById('sr-state');
        if (!track || !sun) return;

        var len = track.getTotalLength();

        // hourly ticks along the arc
        if (ticks) {
            var html = '';
            for (var hr = 7; hr <= 18; hr++) {
                var p = track.getPointAtLength(len * dayFraction(hr));
                html += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + (hr === 12 ? 3 : 2) + '"/>';
            }
            ticks.innerHTML = html;
        }

        function paint(h) {
            var f = dayFraction(h);
            var night = h < SUNRISE || h >= SUNSET;
            var p = track.getPointAtLength(len * f);
            sun.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')');
            trail.style.strokeDashoffset = String(1 - f);
            var kw = outputKw(f);
            var level = kw / PEAK_KW;
            for (var i = 0; i < glints.length; i++) glints[i].style.opacity = (0.08 + level * 0.92).toFixed(3);
            fig.classList.toggle('is-night', night);
            if (kwEl) kwEl.textContent = kw.toFixed(1);
            if (meterEl) meterEl.style.transform = 'scaleX(' + level.toFixed(3) + ')';
            var kwh = h < SUNRISE ? 0 : harvestKwh(f);
            if (kwhEl) kwhEl.textContent = kwh.toFixed(1) + ' kWh';
            if (clockEl) clockEl.textContent = 'Nairobi, ' + fmtClock(h);
            if (stateEl) {
                stateEl.textContent = night
                    ? (h < SUNRISE ? 'Before sunrise, batteries are carrying the load' : 'After sunset, batteries take over')
                    : 'A 3 kW array is producing';
            }
        }

        var now = nairobiHours(new Date());
        var target = now;
        // At night, play the whole day so the arc still tells its story.
        var playTo = (now < SUNRISE || now >= SUNSET) ? SUNSET : now;

        if (reduceMotion) {
            paint(target);
        } else {
            var start = null, dur = 2600;
            var from = SUNRISE;
            var step = function (ts) {
                if (start === null) start = ts;
                var t = Math.min(1, (ts - start) / dur);
                var h = from + (playTo - from) * easeOutCubic(t);
                paint(t === 1 ? target : h);
                if (t < 1) requestAnimationFrame(step);
            };
            paint(from);
            // Begin once the hero is visible (fonts + layout settled)
            setTimeout(function () { requestAnimationFrame(step); }, 350);
        }

        // Keep it live while the page is open
        setInterval(function () {
            if (document.body.getAttribute('data-step') !== 'landing') return;
            paint(nairobiHours(new Date()));
        }, 60000);
    }

    /* ---------- meter-style running total ---------- */
    var meterState = { value: 0, raf: 0 };
    function fmtK(n) { return Number(Math.round(n)).toLocaleString(); }

    function meter(el, total) {
        var from = meterState.value;
        meterState.value = total;
        var wrap = el.closest('.topbar-total');
        if (reduceMotion || from === total) {
            el.textContent = 'KSH ' + fmtK(total);
            return;
        }
        cancelAnimationFrame(meterState.raf);
        if (wrap) {
            wrap.classList.remove('is-ticking');
            void wrap.offsetWidth;
            wrap.classList.add('is-ticking');
        }
        var start = null, dur = 700;
        var step = function (ts) {
            if (start === null) start = ts;
            var t = Math.min(1, (ts - start) / dur);
            el.textContent = 'KSH ' + fmtK(from + (total - from) * easeOutCubic(t));
            if (t < 1) meterState.raf = requestAnimationFrame(step);
        };
        meterState.raf = requestAnimationFrame(step);
    }

    window.SolarMotion = { meter: meter };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSunPath);
    else initSunPath();
})();
