/* ===================================================
   SANGYUG SOLAR — CASE STUDIES JS
   =================================================== */

var CASE_STUDIES = [
    {
        id: 1,
        title: 'The Kamau Residence',
        location: 'Karen, Nairobi',
        type: 'residential',
        img: 'images/solar-background.jpg',
        excerpt: 'A 4-bedroom home that cut their KPLC bill by 85% with a 5kVA hybrid system and lithium storage.',
        systemSize: '5 kVA',
        panels: '10 x 600W',
        battery: '2 x LFP 100Ah',
        inverter: 'Kstar Night 5kVA',
        brand: 'Kstar',
        monthlySavings: 'KES 18,000',
        completionDate: 'March 2025',
        challenge: 'The Kamau family was spending over KES 22,000 monthly on electricity, mostly driven by two large fridges, an AC unit in the master bedroom, and general household use. They needed a system that could handle heavy evening loads when the family is home — TVs, lighting, cooking — without grid dependency.',
        solution: 'We installed a 5kVA Kstar Night Series hybrid inverter paired with 10 x 600W solar panels on their south-facing roof. Two 51.2V 100Ah lithium batteries provide roughly 10kWh of storage, enough to carry them from 6pm through to sunrise. The system prioritizes solar during the day and switches to battery at night, only pulling from the grid as a last resort.',
        results: [
            'Monthly bill dropped from KES 22,000 to roughly KES 3,500',
            'Full backup through typical evening hours (6pm to 6am)',
            'AC runs comfortably on solar during daytime',
            'System paid for itself within 14 months'
        ],
        quote: 'We barely notice the electricity bill anymore. The system just works — even during outages our neighbors are in the dark and we have everything running.',
        quoteAuthor: 'James Kamau, Homeowner'
    },
    {
        id: 2,
        title: 'Mombasa Road Auto Parts',
        location: 'Industrial Area, Nairobi',
        type: 'commercial',
        img: 'images/inverterbg.png',
        excerpt: 'A busy auto parts warehouse running welding equipment, compressors, and lighting on a 20kW three-phase system.',
        systemSize: '20 kW',
        panels: '25 x 600W',
        battery: '4 x H-PACK 5.1A',
        inverter: 'Kstar 20kW 3-Phase',
        brand: 'Kstar',
        monthlySavings: 'KES 65,000',
        completionDate: 'January 2025',
        challenge: 'This warehouse runs heavy three-phase equipment — welders, air compressors, and industrial lighting across 800 sqm. Power cuts were costing them roughly 3 hours of productivity daily, and their generator was burning through KES 40,000/month in diesel alone.',
        solution: 'We deployed a Kstar 20kW outdoor three-phase inverter with 25 x 600W panels mounted on the warehouse roof. Four H-PACK 5.1A lithium battery modules (20.48kWh total) handle surge loads from the compressors and maintain operations during grid outages. The system feeds excess power back during weekends when the warehouse is closed.',
        results: [
            'Eliminated generator dependency entirely',
            'Zero downtime from KPLC outages during business hours',
            'Monthly energy costs dropped by KES 65,000',
            'Peak demand shaving reduced their commercial tariff bracket'
        ],
        quote: 'The generator used to run 3 hours a day. Now it sits there collecting dust. Best investment we made this year.',
        quoteAuthor: 'David Omondi, Operations Manager'
    },
    {
        id: 3,
        title: 'Greenhouse & Irrigation — Thika Farm',
        location: 'Thika, Kiambu County',
        type: 'agricultural',
        img: 'images/summarybg.png',
        excerpt: 'A 2-acre flower farm running two borehole pumps and greenhouse ventilation entirely off-grid.',
        systemSize: '15 kW',
        panels: '20 x 600W',
        battery: '3 x H-PACK 5.1A',
        inverter: 'ATESS 15kW 3-Phase',
        brand: 'ATESS',
        monthlySavings: 'KES 42,000',
        completionDate: 'November 2024',
        challenge: 'The farm is 2km from the nearest transformer. Getting a grid connection quoted at KES 1.8 million. Meanwhile, they were running diesel pumps at enormous cost to irrigate roses and maintain greenhouse temperature during hot months.',
        solution: 'An ATESS 15kW three-phase hybrid system with 20 panels provides the grunt needed for two 1.5HP borehole pumps (with 3x starting surge). Three H-PACK battery modules keep the irrigation timer-based system running through cloudy days. We added a manual bypass for the rare extended overcast period.',
        results: [
            'Avoided KES 1.8M grid connection cost',
            'Diesel spend went from KES 55,000/month to zero',
            'Pumps run on automated timers with no manual intervention',
            'Greenhouse fans maintain temperature even during peak heat'
        ],
        quote: 'We were quoted almost 2 million for a grid connection. This system cost less than that and produces our own power. It was an obvious decision.',
        quoteAuthor: 'Mary Wanjiru, Farm Director'
    },
    {
        id: 4,
        title: 'Ngong Road Dental Clinic',
        location: 'Ngong Road, Nairobi',
        type: 'commercial',
        img: 'images/companybg.png',
        excerpt: 'A dental practice that needed uninterrupted power for sterilization equipment and patient comfort.',
        systemSize: '5 kVA',
        panels: '10 x 600W',
        battery: '2 x LFP 100Ah',
        inverter: 'Kstar Night 5kVA',
        brand: 'Kstar',
        monthlySavings: 'KES 15,000',
        completionDate: 'February 2025',
        challenge: 'Dental procedures can\'t be interrupted mid-treatment. The clinic\'s autoclave sterilizer, dental chair compressor, and X-ray unit all need continuous, clean power. They were losing 2-3 patients per week to rescheduling due to outages, costing them roughly KES 30,000 in lost revenue weekly.',
        solution: 'We installed a 5kVA hybrid system with seamless switchover (under 10ms). The lithium batteries ensure the autoclave completes every cycle, and the compressor\'s surge draw is well within the inverter\'s peak rating. An automatic transfer switch handles the grid-to-battery handoff invisibly.',
        results: [
            'Zero procedure interruptions since installation',
            'Recovered roughly KES 120,000/month in avoided rescheduling',
            'Staff morale improved — no more scrambling during outages',
            'Waiting room stays cool and lit regardless of grid status'
        ],
        quote: 'A patient in the chair with an open cavity and the power goes out — that used to be my nightmare. Not anymore.',
        quoteAuthor: 'Dr. Aisha Hassan, Lead Dentist'
    },
    {
        id: 5,
        title: 'The Ochieng Family Home',
        location: 'Kisumu',
        type: 'residential',
        img: 'images/batterybg.png',
        excerpt: 'Budget-conscious 3-bedroom setup using a Fortuner inverter and tubular batteries for essential backup.',
        systemSize: '2.2 kVA',
        panels: '6 x 600W',
        battery: '2 x Tubular 200Ah',
        inverter: 'Fortuner 2.2kVA',
        brand: 'Fortuner',
        monthlySavings: 'KES 8,000',
        completionDate: 'December 2024',
        challenge: 'The Ochieng family wanted solar but had a limited budget. Their main concern was keeping essential items running during outages: lights, phone charging, the TV, and the fridge. They weren\'t looking for full off-grid — just reliable backup for the basics.',
        solution: 'We spec\'d a Fortuner 2.2kVA inverter — a solid workhorse at a fraction of the premium brands. Six 600W panels provide more than enough daytime generation. Two tubular 200Ah batteries handle the evening essentials. Total cost came under KES 180,000 installed.',
        results: [
            'Fridge, lights, TV, and charging run all night on battery',
            'Monthly bill dropped from KES 12,000 to roughly KES 4,000',
            'System handles 3-4 hour outages without any interruption',
            'Total cost was under KES 180,000 — payback in under 2 years'
        ],
        quote: 'I told them our budget and they didn\'t try to upsell us. They gave us exactly what we needed. Honest people.',
        quoteAuthor: 'Peter Ochieng, Homeowner'
    },
    {
        id: 6,
        title: 'Nakuru Poultry Farm',
        location: 'Nakuru',
        type: 'agricultural',
        img: 'images/solar-background.jpg',
        excerpt: 'Lighting and ventilation for 3 poultry houses — 4,000 birds kept comfortable around the clock.',
        systemSize: '10 kW',
        panels: '15 x 600W',
        battery: '2 x H-PACK 5.1A',
        inverter: 'ATESS 10kW 3-Phase',
        brand: 'ATESS',
        monthlySavings: 'KES 28,000',
        completionDate: 'August 2024',
        challenge: 'Poultry farming demands precise lighting schedules and constant ventilation. Temperature spikes kill birds fast — the farmer lost 200 chickens in a single outage event when fans stopped overnight. The farm is in a rural area with notoriously unreliable grid supply.',
        solution: 'We installed an ATESS 10kW system powering 14 ventilation fans, automated lighting controllers, and water pumping. The dual H-PACK batteries ensure fans run continuously through the night. Lighting timers are programmed to the birds\' laying schedule — 16 hours on, 8 off.',
        results: [
            'Zero bird losses from power-related events since installation',
            'Egg production up 12% due to consistent lighting schedule',
            'Farm no longer needs a night watchman to manually restart generators',
            'Ventilation runs 24/7 regardless of grid status'
        ],
        quote: 'I lost 200 birds in one night before this system. That\'s KES 100,000 gone. The solar system paid for itself on the first day it prevented that from happening again.',
        quoteAuthor: 'Joseph Maina, Farm Owner'
    }
];

/* ── RENDER GRID ── */
function renderGrid(filter) {
    var grid = document.getElementById('cs-grid');
    if (!grid) return;

    var studies = filter === 'all'
        ? CASE_STUDIES
        : CASE_STUDIES.filter(function(s) { return s.type === filter; });

    grid.innerHTML = studies.map(function(s) {
        return '<div class="cs-card" data-id="' + s.id + '">' +
            '<img class="cs-card-img" src="' + s.img + '" alt="' + s.title + '" loading="lazy">' +
            '<div class="cs-card-body">' +
                '<div class="cs-card-tags">' +
                    '<span class="cs-card-tag ' + s.type + '">' + s.type + '</span>' +
                '</div>' +
                '<h3 class="cs-card-title">' + s.title + '</h3>' +
                '<div class="cs-card-location"><i class="fas fa-location-dot"></i> ' + s.location + '</div>' +
                '<p class="cs-card-excerpt">' + s.excerpt + '</p>' +
                '<div class="cs-card-specs">' +
                    '<div class="cs-card-spec"><span class="cs-card-spec-label">System</span><span class="cs-card-spec-val">' + s.systemSize + '</span></div>' +
                    '<div class="cs-card-spec"><span class="cs-card-spec-label">Inverter</span><span class="cs-card-spec-val">' + s.brand + '</span></div>' +
                    '<div class="cs-card-spec"><span class="cs-card-spec-label">Panels</span><span class="cs-card-spec-val">' + s.panels + '</span></div>' +
                    '<div class="cs-card-spec"><span class="cs-card-spec-label">Saving</span><span class="cs-card-spec-val">' + s.monthlySavings + '/mo</span></div>' +
                '</div>' +
                '<div class="cs-card-read">Read full study <i class="fas fa-arrow-right"></i></div>' +
            '</div>' +
        '</div>';
    }).join('');

    // Card click handlers
    grid.querySelectorAll('.cs-card').forEach(function(card) {
        card.addEventListener('click', function() {
            var id = parseInt(card.dataset.id);
            openDetail(id);
        });
    });
}

/* ── DETAIL VIEW ── */
function openDetail(id) {
    var study = CASE_STUDIES.find(function(s) { return s.id === id; });
    if (!study) return;

    var overlay = document.getElementById('cs-detail-overlay');
    var body = document.getElementById('cs-detail-body');

    body.innerHTML =
        '<img class="cs-detail-hero-img" src="' + study.img + '" alt="' + study.title + '">' +
        '<div class="cs-detail-content">' +
            '<div class="cs-detail-tags">' +
                '<span class="cs-card-tag ' + study.type + '">' + study.type + '</span>' +
            '</div>' +
            '<h2 class="cs-detail-title">' + study.title + '</h2>' +
            '<div class="cs-detail-location"><i class="fas fa-location-dot"></i> ' + study.location + ' &middot; Completed ' + study.completionDate + '</div>' +

            '<div class="cs-detail-stats">' +
                '<div class="cs-detail-stat"><div class="cs-detail-stat-label">System Size</div><div class="cs-detail-stat-val accent">' + study.systemSize + '</div></div>' +
                '<div class="cs-detail-stat"><div class="cs-detail-stat-label">Inverter</div><div class="cs-detail-stat-val">' + study.inverter + '</div></div>' +
                '<div class="cs-detail-stat"><div class="cs-detail-stat-label">Solar Panels</div><div class="cs-detail-stat-val">' + study.panels + '</div></div>' +
                '<div class="cs-detail-stat"><div class="cs-detail-stat-label">Battery</div><div class="cs-detail-stat-val">' + study.battery + '</div></div>' +
                '<div class="cs-detail-stat"><div class="cs-detail-stat-label">Monthly Savings</div><div class="cs-detail-stat-val green">' + study.monthlySavings + '</div></div>' +
            '</div>' +

            '<div class="cs-detail-section">' +
                '<h3>The Challenge</h3>' +
                '<p>' + study.challenge + '</p>' +
            '</div>' +

            '<div class="cs-detail-section">' +
                '<h3>Our Solution</h3>' +
                '<p>' + study.solution + '</p>' +
            '</div>' +

            '<div class="cs-detail-section">' +
                '<h3>Results</h3>' +
                '<ul>' + study.results.map(function(r) {
                    return '<li><i class="fas fa-check-circle"></i> ' + r + '</li>';
                }).join('') + '</ul>' +
            '</div>' +

            '<div class="cs-detail-quote">' +
                '<p>"' + study.quote + '"</p>' +
                '<cite>— ' + study.quoteAuthor + '</cite>' +
            '</div>' +
        '</div>';

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeDetail() {
    var overlay = document.getElementById('cs-detail-overlay');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

/* ── FILTERS ── */
function initFilters() {
    document.querySelectorAll('.cs-filter').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.cs-filter').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            renderGrid(btn.dataset.filter);
        });
    });
}

/* ── STAT COUNTER ANIMATION ── */
function animateStats() {
    var stats = document.querySelectorAll('.cs-stat-num[data-target]');
    var observed = false;

    var observer = new IntersectionObserver(function(entries) {
        if (observed) return;
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                observed = true;
                stats.forEach(function(el) {
                    var target = parseInt(el.dataset.target);
                    var duration = 1600;
                    var start = 0;
                    var startTime = null;

                    function step(timestamp) {
                        if (!startTime) startTime = timestamp;
                        var progress = Math.min((timestamp - startTime) / duration, 1);
                        // Ease out cubic
                        var eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.round(eased * target);
                        if (progress < 1) requestAnimationFrame(step);
                    }
                    requestAnimationFrame(step);
                });
            }
        });
    }, { threshold: 0.3 });

    if (stats.length > 0) observer.observe(stats[0].closest('.cs-stats'));
}

/* ── CLOSE DETAIL HANDLERS ── */
function initDetailClose() {
    document.getElementById('cs-detail-close').addEventListener('click', closeDetail);
    document.getElementById('cs-detail-overlay').addEventListener('click', function(e) {
        if (e.target === this) closeDetail();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeDetail();
    });
}

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded', function() {
    renderGrid('all');
    initFilters();
    initDetailClose();
    animateStats();
});
