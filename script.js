/* ===================================================
   SANGYUG SOLAR — Full Redesign  (script.js)
   =================================================== */

/* ---------- state ---------- */
const state = {
    company: '',
    inverter: null,
    battery: null,
    panels: 0,
    step: 'company'
};

/* ---------- product data (prices = base * 1.25) ---------- */
const kstarInverters = [
    {
        kva: 3.6, voltage: 24,
        price: Math.round(48000 * 1.25), labour: 20000,
        img: 'images/kstarinverter.png',
        specsLink: 'https://drive.google.com/file/d/1VVXGcq5FHHTslH-GWH8VSz9-jWaDOZWg/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 10 }, { name: 'Fans', count: 2 },
            { name: 'Fridge (150W)', count: 1 }, { name: 'TV (upto 80 inch)', count: 1 },
            { name: 'Laptop', count: 2 }, { name: 'Router', count: 1 },
            { name: 'Microwave (recommended for short duration)', count: 1 },
            { name: 'Mixer Blender (upto 1500W for short duration)', count: 1 },
            { name: 'Mobile Charging Sockets', count: 3 }
        ],
        details: {
            efficiency: '97.5%',
            batteryCompatibility: 'Tubular (Semi-Maintenance), Lead-acid (Maintenance Free)',
            features: ['Pure sine wave output', 'Wide input voltage range', 'Overcurrent protection', 'Parallel up to 6 units']
        }
    },
    {
        kva: 3.6, voltage: 48,
        price: Math.round(63000 * 1.25), labour: 20000,
        img: 'images/kstarinverter.png',
        specsLink: 'https://drive.google.com/file/d/1VVXGcq5FHHTslH-GWH8VSz9-jWaDOZWg/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 10 }, { name: 'Fans', count: 2 },
            { name: 'Fridge (150W)', count: 1 }, { name: 'TV (upto 80 inch)', count: 1 },
            { name: 'Laptop', count: 2 }, { name: 'Router', count: 1 },
            { name: 'Microwave (recommended for short duration)', count: 1 },
            { name: 'Mixer Blender (upto 1500W for short duration)', count: 1 },
            { name: 'Mobile Charging Sockets', count: 3 }
        ],
        details: {
            efficiency: '97.5%',
            batteryCompatibility: 'Tubular (Semi-Maintenance), Lead-acid (Maintenance Free), Lithium-ion',
            features: ['Pure sine wave output', 'Wide input voltage range', 'Overcurrent protection', 'Parallel up to 6 units']
        }
    },
    {
        kva: 6.0, voltage: 48,
        price: Math.round(80000 * 1.25), labour: 25000,
        img: 'images/kstarinverter.png',
        specsLink: 'https://drive.google.com/file/d/1VVXGcq5FHHTslH-GWH8VSz9-jWaDOZWg/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 20 }, { name: 'Fans', count: 2 },
            { name: 'Fridge (150W)', count: 2 }, { name: 'TV (upto 100 inch)', count: 2 },
            { name: 'Laptop', count: 3 }, { name: 'Router', count: 1 },
            { name: 'Microwave (recommended for short duration)', count: 1 },
            { name: 'Mixer Blender (upto 1500W for short duration)', count: 1 },
            { name: 'Mobile Charging Sockets', count: 3 }
        ],
        details: {
            efficiency: '97.5%',
            batteryCompatibility: 'Tubular (Semi-Maintenance), Lead-acid (Maintenance Free), Lithium-ion',
            features: ['High power capacity', 'Pure sine wave output', 'Wide input voltage range', 'Overcurrent protection', 'Parallel up to 6 units']
        }
    }
];

const fortunerInverters = [
    {
        kva: 0.7, watts: 450, voltage: 12,
        price: Math.round(12500 * 1.25), labour: 15000,
        img: 'images/fortunerinverter.png',
        specsLink: 'https://drive.google.com/file/d/1CYns0tOUy0iRoS5m_WMMs_Ms2ti_-dIS/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 5 }, { name: 'Mobile Charging Sockets', count: 3 },
            { name: 'Router', count: 1 }, { name: 'Laptop', count: 1 }
        ],
        details: {
            efficiency: '90%',
            batteryCompatibility: 'Tubular (Semi-Maintenance), Lead-acid (Maintenance Free)',
            features: ['Compact design', 'Pure sine wave output', 'Cold start function', 'Overcurrent protection']
        }
    },
    {
        kva: 1.5, watts: 1200, voltage: 24,
        price: Math.round(16000 * 1.25), labour: 15000,
        img: 'images/fortunerinverter.png',
        specsLink: 'https://drive.google.com/file/d/1tADpzqTfynzL2vwvpaCsV0THI7UmEOuz/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 6 }, { name: 'Fans', count: 1 },
            { name: 'TV (upto 60 inch)', count: 1 }, { name: 'Router', count: 1 },
            { name: 'Mobile Charging Sockets', count: 3 }, { name: 'Laptop', count: 1 }
        ],
        details: {
            efficiency: '90%',
            batteryCompatibility: 'Tubular (Semi-Maintenance), Lead-acid (Maintenance Free)',
            features: ['Medium household', 'Pure sine wave output', 'Cold start function', 'Overcurrent protection']
        }
    },
    {
        kva: 2.2, watts: 1400, voltage: 24,
        price: Math.round(21000 * 1.25), labour: 18000,
        img: 'images/fortunerinverter.png',
        specsLink: 'https://drive.google.com/file/d/1tADpzqTfynzL2vwvpaCsV0THI7UmEOuz/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 10 }, { name: 'Fans', count: 1 },
            { name: 'Fridge', count: 1 }, { name: 'TV (upto 80 inch)', count: 1 },
            { name: 'Router', count: 1 }, { name: 'Mobile Charging Sockets', count: 3 },
            { name: 'Laptop', count: 1 }
        ],
        details: {
            efficiency: '90%',
            batteryCompatibility: 'Tubular (Semi-Maintenance), Lead-acid (Maintenance Free)',
            features: ['Supports larger fridges', 'Pure sine wave output', 'Cold start function', 'Overcurrent protection']
        }
    },
    {
        kva: 10.0, voltage: 48,
        price: Math.round(105000 * 1.25), labour: 25000,
        img: 'images/fortunerinverter.png',
        specsLink: 'https://drive.google.com/file/d/1iCFsxqr2xB7p50QH4s4en1VPrdQ_-nY0/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 30 }, { name: 'Fans', count: 2 },
            { name: 'Fridge', count: 3 }, { name: 'TV (upto 100 inch)', count: 3 },
            { name: 'Laptop', count: 3 }, { name: 'Washing Machine (Maximum 500W)', count: 1 },
            { name: 'Water Pump (Maximum 1000W)', count: 1 },
            { name: 'Mixer Blender (upto 1500W for short duration)', count: 1 },
            { name: 'Microwave (recommended for short duration)', count: 1 },
            { name: 'Mobile Charging Sockets', count: 10 }
        ],
        details: {
            efficiency: '92%',
            batteryCompatibility: 'Tubular (Semi-Maintenance), Lead-acid (Maintenance Free)',
            features: ['High capacity', 'Pure sine wave output', 'Cold start function', 'Robust overcurrent protection']
        }
    }
];

const batteries = [
    {
        name: 'Tubular 200AH',
        price: Math.round(23500 * 1.25),
        img: 'images/battery-200ah-tubular.png',
        specsLink: 'https://drive.google.com/file/d/17stgG0eX-rTGS8QR9KdDVZ08OXjWJH47/view?usp=sharing',
        capacityWh: 2400, dod: 0.8, backupHours: 8.6, warranty: '1 year'
    },
    {
        name: 'Maintenance Free KM12 12V 200AH',
        price: Math.round(35500 * 1.25),
        img: 'images/battery-200ah-mf.png',
        specsLink: 'https://drive.google.com/file/d/1IiygyBHcx85JLY5W7wFI6gQBflkKHNh9/view?usp=sharing',
        capacityWh: 2400, dod: 0.8, backupHours: 8.6, warranty: '1 year'
    },
    {
        name: 'Lithium LFP 51.2-100W',
        price: Math.round(125000 * 1.25),
        img: 'images/battery-100ah-lithium.png',
        specsLink: 'https://drive.google.com/file/d/194rpm8gHCgehwTyFhx35o35G-JwXVgCS/view?usp=sharing',
        capacityWh: 5120, dod: 0.9, backupHours: 20.7, warranty: '10 years'
    }
];

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function fmt(n) { return Number(n).toLocaleString(); }

function getAccessoryCost() {
    const base = Math.round(4000 * 1.25) + Math.round(2500 * 1.25) + Math.round(4000 * 1.25);
    if (state.company === 'Fortuner') {
        if (state.inverter.kva === 1.5 || state.inverter.kva === 2.2) return base + Math.round(4500 * 1.25);
        if (state.inverter.kva === 10.0) return base + Math.round(54500 * 1.25);
        return base + Math.round(22000 * 1.25);
    }
    if (state.inverter.kva === 6.0 && state.inverter.voltage === 48) return base + Math.round(40000 * 1.25);
    return base + Math.round(22000 * 1.25);
}

function getMountingCost() {
    if (state.company === 'Fortuner') {
        if (state.inverter.kva === 1.5 || state.inverter.kva === 2.2) return Math.round(4500 * 1.25);
        if (state.inverter.kva === 10.0) return Math.round(54500 * 1.25);
        return Math.round(22000 * 1.25);
    }
    if (state.inverter.kva === 6.0 && state.inverter.voltage === 48) return Math.round(40000 * 1.25);
    return Math.round(22000 * 1.25);
}

function saveState() { localStorage.setItem('solarState', JSON.stringify(state)); }
function clearState() { localStorage.removeItem('solarState'); }

/* ---------- navigation ---------- */
const STEPS = ['company', 'inverter', 'battery', 'summary'];

function goTo(step) {
    state.step = step;
    $$('.panel').forEach(p => p.classList.remove('visible'));
    $(`#${step}-section`).classList.add('visible');
    updatePills();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
    const i = STEPS.indexOf(state.step);
    if (i > 0) goTo(STEPS[i - 1]);
}

function updatePills() {
    const ci = STEPS.indexOf(state.step);
    const pills = $$('.step-pill');
    const connectors = $$('.step-connector');
    pills.forEach((p, i) => {
        p.classList.remove('active', 'done');
        if (i < ci) p.classList.add('done');
        else if (i === ci) p.classList.add('active');
    });
    connectors.forEach((c, i) => {
        c.classList.toggle('lit', i < ci);
    });
}

/* ---------- renderers ---------- */
function renderCompanies() {
    const wrap = $('#company-options');
    wrap.innerHTML = '';
    [{ name: 'Kstar', img: 'images/kstar-logo.png' },
     { name: 'Fortuner', img: 'images/fortuner-logo.png' }].forEach(c => {
        const el = document.createElement('div');
        el.className = 'brand-card' + (state.company === c.name ? ' selected' : '');
        el.innerHTML = `
            <div class="brand-check"><i class="fas fa-check"></i></div>
            <img src="${c.img}" alt="${c.name}" class="brand-img">
            <span class="brand-name">${c.name}</span>`;
        el.addEventListener('click', () => selectCompany(c.name));
        wrap.appendChild(el);
    });
}

function renderInverters() {
    const inverters = state.company === 'Kstar' ? kstarInverters : fortunerInverters;
    const wrap = $('#inverter-options');
    wrap.innerHTML = '';

    // show/hide resource links
    $$('.kstar-only').forEach(l => l.style.display = state.company === 'Kstar' ? '' : 'none');
    $$('.fortuner-only').forEach(l => l.style.display = state.company === 'Fortuner' ? '' : 'none');

    inverters.forEach((inv, idx) => {
        const sel = state.inverter && state.inverter.kva === inv.kva && state.inverter.voltage === inv.voltage;
        const w = inv.watts ? ` (${inv.watts}W)` : '';
        const el = document.createElement('div');
        el.className = 'product-card' + (sel ? ' selected' : '');
        el.innerHTML = `
            <div class="card-check"><i class="fas fa-check"></i></div>
            <div class="card-thumb"><img src="${inv.img}" alt="Inverter"></div>
            <div class="card-body">
                <span class="card-title">${state.company} ${inv.kva}kVA${w} – ${inv.voltage}V</span>
                <span class="card-price">${fmt(inv.price)} Ksh</span>
                <div class="card-links">
                    <a href="${inv.specsLink}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Specs</a>
                    <button class="compat-btn" data-idx="${idx}"><i class="fas fa-plug"></i> Compatibility</button>
                </div>
            </div>`;
        el.addEventListener('click', e => {
            if (!e.target.closest('a') && !e.target.closest('.compat-btn')) selectInverter(inv);
        });
        wrap.appendChild(el);
    });

    // compat buttons
    $$('.compat-btn').forEach(btn => btn.addEventListener('click', () => {
        showApplianceModal(inverters[btn.dataset.idx]);
    }));
}

function renderBatteries() {
    const wrap = $('#battery-options');
    wrap.innerHTML = '';
    batteries.forEach(bat => {
        const info = getBatteryCompat(bat);
        if (!info) return;
        const { count } = info;
        const sel = state.battery && state.battery.name === bat.name && state.battery.count === count;
        const backup = (bat.backupHours * count).toFixed(1);
        const el = document.createElement('div');
        el.className = 'product-card' + (sel ? ' selected' : '');
        el.innerHTML = `
            <div class="card-check"><i class="fas fa-check"></i></div>
            <div class="card-thumb"><img src="${bat.img}" alt="Battery"></div>
            <div class="card-body">
                <span class="card-title">${bat.name}</span>
                <span class="card-price">${fmt(bat.price)} Ksh  <small>x${count}</small></span>
                <span class="card-meta">~${backup} hrs backup (200 W) · ${bat.warranty} warranty</span>
                <div class="card-links">
                    <a href="${bat.specsLink}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Specs</a>
                </div>
            </div>`;
        el.addEventListener('click', e => {
            if (!e.target.closest('a')) selectBattery(bat, count);
        });
        wrap.appendChild(el);
    });
}

function getBatteryCompat(bat) {
    const inv = state.inverter;
    if (!inv) return null;
    if (state.company === 'Kstar') {
        if (inv.kva === 3.6 && inv.voltage === 24) {
            if (bat.name !== 'Lithium LFP 51.2-100W') return { count: 2 };
        } else if (inv.kva === 3.6 && inv.voltage === 48) {
            if (bat.name === 'Lithium LFP 51.2-100W') return { count: 1 };
            return { count: 4 };
        } else if (inv.kva === 6.0 && inv.voltage === 48) {
            if (bat.name === 'Lithium LFP 51.2-100W') return { count: 2 };
            return { count: 4 };
        }
    } else {
        if (inv.kva === 0.7 && inv.voltage === 12) {
            if (bat.name !== 'Lithium LFP 51.2-100W') return { count: 1 };
        } else if ((inv.kva === 1.5 || inv.kva === 2.2) && inv.voltage === 24) {
            if (bat.name !== 'Lithium LFP 51.2-100W') return { count: 2 };
        } else if (inv.kva === 10.0 && inv.voltage === 48) {
            if (bat.name !== 'Lithium LFP 51.2-100W') return { count: 4 };
        }
    }
    return null;
}

/* ---------- selections ---------- */
function selectCompany(name) {
    state.company = name;
    state.inverter = null;
    state.battery = null;
    renderCompanies();
    goTo('inverter');
    renderInverters();
    saveState();
}

function selectInverter(inv) {
    state.inverter = inv;
    state.battery = null;
    renderInverters();
    goTo('battery');
    renderBatteries();
    saveState();
}

function selectBattery(bat, count) {
    state.battery = { ...bat, count };
    renderBatteries();
    calcPanels();
    goTo('summary');
    renderSummary();
    saveState();
}

/* ---------- panel calc ---------- */
function calcPanels() {
    if (state.company === 'Fortuner') {
        if (state.inverter.kva === 0.7) state.panels = 0;
        else if (state.inverter.kva === 1.5 || state.inverter.kva === 2.2) state.panels = 2;
        else if (state.inverter.kva === 10.0) state.panels = 16;
    } else {
        state.panels = (state.inverter.kva === 6.0 && state.inverter.voltage === 48) ? 10 : 6;
    }
}

/* ---------- summary ---------- */
function renderSummary() {
    /* panels */
    const panelInfo = $('#panel-info');
    const panelImages = $('#panel-images');
    if (state.panels > 0) {
        panelInfo.innerHTML = `
            <p>You need <strong>${state.panels}</strong> solar panels</p>
            <p class="price">${fmt(Math.round(8300 * 1.25))} Ksh each</p>
            <a href="https://drive.google.com/file/d/14w98znycd4Y4-quOsoSItp4ulKUkpoCv/view?usp=sharing" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> View Specifications</a>`;
    } else {
        panelInfo.innerHTML = '<p>No solar panels required for this configuration</p>';
    }
    panelImages.innerHTML = '';
    for (let i = 0; i < state.panels; i++) {
        const img = document.createElement('img');
        img.src = 'images/solar-panel.png';
        img.loading = 'lazy';
        img.alt = 'Solar Panel';
        panelImages.appendChild(img);
    }

    /* mounting cost card */
    const mc = $('#mounting-cost');
    if (mc) mc.querySelector('.acc-price').textContent = fmt(getMountingCost()) + ' Ksh';

    /* breakdown */
    const inv = state.inverter;
    const bat = state.battery;
    const invCost = inv.price;
    const labourCost = inv.labour;
    const batCost = bat.price * bat.count;
    const panelCost = state.panels * Math.round(8300 * 1.25);
    const accCost = getAccessoryCost();
    const total = invCost + labourCost + batCost + panelCost + accCost;
    const w = inv.watts ? ` (${inv.watts}W)` : '';

    $('#summary').innerHTML = `
        <div class="row"><span>Inverter: ${state.company} ${inv.kva}kVA${w} – ${inv.voltage}V</span><span class="row-val">${fmt(invCost)} Ksh</span></div>
        <div class="row"><span>Installation / Labour</span><span class="row-val">${fmt(labourCost)} Ksh</span></div>
        <div class="row"><span>Batteries: ${bat.name} x${bat.count}</span><span class="row-val">${fmt(batCost)} Ksh</span></div>
        <div class="row"><span>Solar Panels: ${state.panels} panels</span><span class="row-val">${fmt(panelCost)} Ksh</span></div>
        <div class="row"><span>Accessories (included)</span><span class="row-val">${fmt(accCost)} Ksh</span></div>`;

    $('#total-cost').textContent = fmt(total) + ' KSH';

    /* reset env impact */
    resetImpactUI();
}

/* ---------- environmental impact ---------- */
function calcImpact() {
    const pw = 400, sun = 4.1, eff = 0.9, co2k = 0.7, treeK = 22, hh = 5000;
    const kwh = state.panels * pw * sun * 365 * eff / 1000;
    const co2 = kwh * co2k;
    const trees = co2 / treeK;
    const pct = Math.min((co2 / hh) * 100, 100);
    return { kwh: Math.round(kwh), co2: Math.round(co2), trees: Math.round(trees), pct: Math.round(pct) };
}

function resetImpactUI() {
    $('#energy-produced').textContent = '0 kWh/year';
    $('#co2-reduced').textContent = '0 kg/year';
    $('#trees-planted').textContent = '0 trees/year';
    $('#co2-percentage').textContent = '0%';
    $('#co2-progress').style.strokeDashoffset = '213.63';
    const grid = $('#env-grid');
    grid.classList.add('hidden');
    grid.querySelectorAll('.env-card').forEach(c => c.classList.remove('show'));
    $('#show-impact').style.display = '';
}

function revealImpact() {
    $('#show-impact').style.display = 'none';
    const grid = $('#env-grid');
    grid.classList.remove('hidden');
    const { kwh, co2, trees, pct } = calcImpact();
    const cards = grid.querySelectorAll('.env-card');
    const data = [
        { el: 'energy-produced', val: kwh, suf: ' kWh/year' },
        { el: 'co2-reduced',     val: co2, suf: ' kg/year' },
        { el: 'trees-planted',   val: trees, suf: ' trees/year' },
        { el: 'co2-percentage',  val: pct, suf: '%' }
    ];
    data.forEach((d, i) => {
        setTimeout(() => {
            cards[i].classList.add('show');
            countUp(d.el, d.val, d.suf, 1000);
            if (d.el === 'co2-percentage') {
                const circ = 2 * Math.PI * 34; // 213.63
                setTimeout(() => {
                    $('#co2-progress').style.strokeDashoffset = String(circ - (d.val / 100) * circ);
                }, 200);
            }
        }, i * 500);
    });
}

function countUp(id, end, suffix, dur) {
    const el = document.getElementById(id);
    let start = null;
    function tick(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const ease = 1 - (1 - p) * (1 - p);
        el.textContent = Math.round(ease * end) + suffix;
        if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

/* ---------- appliance modal ---------- */
function showApplianceModal(inv) {
    const w = inv.watts ? ` (${inv.watts}W)` : '';
    $('#modal-title').textContent = `${state.company} ${inv.kva}kVA${w} – ${inv.voltage}V Compatibility`;
    $('#modal-body').innerHTML = `
        <ul>${inv.appliances.map(a => `<li><i class="fas fa-check-circle"></i> ${a.count}x ${a.name}</li>`).join('')}</ul>
        <div class="detail-box">
            <p><strong>Efficiency:</strong> ${inv.details.efficiency}</p>
            <p><strong>Battery Compatibility:</strong> ${inv.details.batteryCompatibility}</p>
        </div>`;
    const modal = $('#appliance-modal');
    modal.classList.remove('hidden');
}

function closeModal(modal) { modal.classList.add('hidden'); }

/* ---------- form validation ---------- */
function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validatePhone(p, len) { const d = p.replace(/\D/g, ''); return d.length === len && /^\d+$/.test(d); }

function validateForm() {
    const name = $('#user-name').value.trim();
    const email = $('#user-email').value.trim();
    const phone = $('#user-phone').value.trim();
    const cc = $('#country-code');
    const pLen = parseInt(cc.options[cc.selectedIndex].dataset.length);
    let ok = true;
    if (!name)  { $('#name-error').textContent = 'Name is required'; ok = false; } else { $('#name-error').textContent = ''; }
    if (!email) { $('#email-error').textContent = 'Email is required'; ok = false; }
    else if (!validateEmail(email)) { $('#email-error').textContent = 'Enter a valid email'; ok = false; }
    else { $('#email-error').textContent = ''; }
    if (phone && !validatePhone(phone, pLen)) { $('#phone-error').textContent = `Must be ${pLen} digits`; ok = false; }
    else { $('#phone-error').textContent = ''; }
    return ok;
}

/* ---------- share / export ---------- */
function buildText() {
    const name  = $('#user-name').value || 'Customer';
    const email = $('#user-email').value || '';
    const phone = $('#user-phone').value ? $('#country-code').value + $('#user-phone').value : 'Not provided';
    const inv   = state.inverter;
    const bat   = state.battery;
    const w     = inv.watts ? ` (${inv.watts}W)` : '';
    const invTxt = `${state.company} ${inv.kva}kVA${w} – ${inv.voltage}V`;
    const total  = $('#total-cost').textContent;
    return {name, email, phone, invTxt, total, bat, inv};
}

function shareSummary() {
    if (!validateForm()) return;
    const d = buildText();
    const subj = encodeURIComponent(`Sangyug Solar Quote for ${d.name}`);
    const body = encodeURIComponent(
`Solar System Quote for ${d.name}

Email: ${d.email}
Phone: ${d.phone}

INVERTER
Model: ${d.invTxt}
Price: ${fmt(d.inv.price)} Ksh
Installation: ${fmt(d.inv.labour)} Ksh

BATTERY
Type: ${d.bat.name} x${d.bat.count}
Price: ${fmt(d.bat.price * d.bat.count)} Ksh
Backup: ~${(d.bat.backupHours * d.bat.count).toFixed(1)} hrs (200 W load)

SOLAR PANELS
Quantity: ${state.panels} panels
Price: ${fmt(state.panels * Math.round(8300 * 1.25))} Ksh

ACCESSORIES
Included: ${fmt(getAccessoryCost())} Ksh

TOTAL: ${d.total}

Quote includes solar mounting/structure.
Final pricing confirmed after site survey.

Contact: +254723984559 | info@sangyug.com
Thank you for choosing Sangyug Solar!`);
    window.open(`mailto:?subject=${subj}&body=${body}`, '_blank');
}

function shareWhatsApp() {
    if (!validateForm()) return;
    const d = buildText();
    const txt = encodeURIComponent(
`*Solar System Quote for ${d.name}*

Email: ${d.email}
Phone: ${d.phone}

*INVERTER*
Model: ${d.invTxt}
Price: ${fmt(d.inv.price)} Ksh
Installation: ${fmt(d.inv.labour)} Ksh

*BATTERY*
Type: ${d.bat.name} x${d.bat.count}
Price: ${fmt(d.bat.price * d.bat.count)} Ksh
Backup: ~${(d.bat.backupHours * d.bat.count).toFixed(1)} hrs (200 W load)

*SOLAR PANELS*
Quantity: ${state.panels} panels
Price: ${fmt(state.panels * Math.round(8300 * 1.25))} Ksh

*ACCESSORIES*
Included: ${fmt(getAccessoryCost())} Ksh

*TOTAL: ${d.total}*

Quote includes solar mounting/structure.
Final pricing confirmed after site survey.

Contact: +254723984559 | info@sangyug.com
Thank you for choosing Sangyug Solar!`);
    window.open(`https://wa.me/?text=${txt}`, '_blank');
}

function downloadPDF() {
    if (!validateForm()) return;
    if (!window.jspdf) { alert('PDF library not loaded. Try again.'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const blue = [30, 120, 220];
    const dark = [40, 40, 40];
    let y = 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18); doc.setTextColor(...blue);
    doc.text('SANGYUG SOLAR QUOTATION', 105, y, { align: 'center' }); y += 8;
    doc.setDrawColor(...blue); doc.setLineWidth(0.5); doc.line(15, y, 195, y); y += 12;
    doc.setFontSize(10); doc.setTextColor(100, 100, 100);
    const d = buildText();
    doc.text(`Prepared for: ${d.name}`, 20, y); doc.text('Date: ' + new Date().toLocaleDateString(), 160, y); y += 5;
    doc.text(`Email: ${d.email}`, 20, y); y += 5;
    doc.text(`Phone: ${d.phone}`, 20, y); y += 12;
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(...blue);
    doc.text('SYSTEM DETAILS', 20, y); y += 8;
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...dark);
    const rows = [
        [`Inverter: ${d.invTxt}`, `${fmt(d.inv.price)} Ksh`],
        ['Installation / Labour', `${fmt(d.inv.labour)} Ksh`],
        [`Batteries: ${d.bat.name} x${d.bat.count}`, `${fmt(d.bat.price * d.bat.count)} Ksh`],
        [`Solar Panels: ${state.panels} panels`, `${fmt(state.panels * Math.round(8300 * 1.25))} Ksh`],
        ['Accessories (included)', `${fmt(getAccessoryCost())} Ksh`]
    ];
    rows.forEach(r => { doc.text(r[0], 20, y); doc.text(r[1], 160, y); y += 7; });
    y += 6;
    doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
    doc.text('TOTAL COST', 20, y); doc.text(d.total, 160, y); y += 14;
    doc.setFont('helvetica', 'bold'); doc.setTextColor(...blue);
    doc.text('IMPORTANT NOTES', 20, y); y += 8;
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...dark);
    doc.text('1. Above quote includes solar mounting/structure.', 20, y); y += 6;
    doc.text('2. Final quote will be provided after site survey.', 20, y); y += 16;
    doc.setFontSize(10); doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing Sangyug!', 105, y, { align: 'center' }); y += 5;
    doc.text('Contact: +254723984559 | info@sangyug.com', 105, y, { align: 'center' });
    doc.save(`Sangyug_Solar_Quote_${new Date().toISOString().slice(0,10)}.pdf`);
}

/* ---------- reset ---------- */
function resetAll() {
    state.company = ''; state.inverter = null; state.battery = null; state.panels = 0;
    clearState();
    $('#user-name').value = ''; $('#user-email').value = ''; $('#user-phone').value = '';
    $('#name-error').textContent = ''; $('#email-error').textContent = ''; $('#phone-error').textContent = '';
    renderCompanies();
    goTo('company');
}

/* ---------- ambient canvas ---------- */
function initCanvas() {
    const c = document.getElementById('ambient-canvas');
    const ctx = c.getContext('2d');
    let w, h, particles = [];
    function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * w, y: Math.random() * h,
            r: 1 + Math.random() * 2.5,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            o: 0.15 + Math.random() * 0.35
        });
    }
    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.dx; p.y += p.dy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(210,80%,70%,${p.o})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    renderCompanies();

    /* try restore state */
    try {
        const saved = localStorage.getItem('solarState');
        if (saved) {
            const s = JSON.parse(saved);
            Object.assign(state, s);
            renderCompanies();
            if (state.company) renderInverters();
            if (state.inverter) renderBatteries();
            if (state.battery) { calcPanels(); renderSummary(); }
            goTo(state.step);
        }
    } catch (_) { /* ignore corrupt state */ }

    /* back buttons */
    $('#back-from-inverter').addEventListener('click', goBack);
    $('#back-from-battery').addEventListener('click', goBack);
    $('#back-from-summary').addEventListener('click', goBack);

    /* step pills click */
    $$('.step-pill').forEach(p => {
        p.addEventListener('click', () => {
            const s = p.dataset.step;
            if (s === 'company') goTo('company');
            else if (s === 'inverter' && state.company) { renderInverters(); goTo('inverter'); }
            else if (s === 'battery' && state.inverter) { renderBatteries(); goTo('battery'); }
            else if (s === 'summary' && state.battery) { goTo('summary'); renderSummary(); }
        });
    });

    /* env impact */
    $('#show-impact').addEventListener('click', revealImpact);

    /* CTA buttons */
    $('#share-summary').addEventListener('click', shareSummary);
    $('#share-whatsapp').addEventListener('click', shareWhatsApp);
    $('#download-pdf').addEventListener('click', downloadPDF);
    $('#reset-selection').addEventListener('click', resetAll);

    /* modals */
    $$('.overlay-close').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.closest('.overlay')));
    });
    $$('.overlay').forEach(m => {
        m.addEventListener('click', e => { if (e.target === m) closeModal(m); });
    });

    /* welcome */
    if (!sessionStorage.getItem('welcomeShown')) {
        $('#welcome-modal').classList.remove('hidden');
        $('#welcome-close').addEventListener('click', () => {
            closeModal($('#welcome-modal'));
            sessionStorage.setItem('welcomeShown', '1');
        });
    }

    /* scroll-to-top */
    const fab = $('#scroll-to-top');
    window.addEventListener('scroll', () => {
        fab.classList.toggle('visible', window.scrollY > 300);
    });
    fab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* live form validation */
    $('#user-name').addEventListener('input', function () {
        $('#name-error').textContent = this.value.trim() ? '' : 'Name is required';
    });
    $('#user-email').addEventListener('input', function () {
        const v = this.value.trim();
        $('#email-error').textContent = !v ? 'Email is required' : !validateEmail(v) ? 'Enter a valid email' : '';
    });
    const phoneCheck = () => {
        const cc = $('#country-code');
        const pLen = parseInt(cc.options[cc.selectedIndex].dataset.length);
        const v = $('#user-phone').value.trim();
        $('#phone-error').textContent = v && !validatePhone(v, pLen) ? `Must be ${pLen} digits` : '';
    };
    $('#user-phone').addEventListener('input', phoneCheck);
    $('#country-code').addEventListener('change', phoneCheck);

    /* brand home reset */
    $('#brand-home').addEventListener('click', e => { e.preventDefault(); resetAll(); });
});