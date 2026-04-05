/* ===================================================
   SANGYUG SOLAR SELECTOR v2
   =================================================== */

/* ---------- state ---------- */
const state = {
    company: '',
    inverter: null,
    battery: null,
    panels: 0,
    step: 'company',
    needs: {},
    totalWatts: 0,
    compareList: []
};

const pricingState = {
    usdToKesRaw: 130,
    usdToKesAdjusted: 132,
    source: 'fallback',
    lastUpdated: null
};

/* ---------- needs assessment appliances ---------- */
const APPLIANCES = [
    { id: 'bulbs',   name: 'LED Lights (\u00d710)', watts: 100,  icon: 'fa-lightbulb' },
    { id: 'tv',      name: 'Television',            watts: 120,  icon: 'fa-tv' },
    { id: 'fridge',  name: 'Fridge',                watts: 150,  icon: 'fa-temperature-low' },
    { id: 'fan',     name: 'Fans (\u00d72)',         watts: 150,  icon: 'fa-fan' },
    { id: 'laptop',  name: 'Laptop',                watts: 65,   icon: 'fa-laptop' },
    { id: 'router',  name: 'WiFi Router',           watts: 15,   icon: 'fa-wifi' },
    { id: 'phone',   name: 'Phone Charging',        watts: 25,   icon: 'fa-mobile-screen' },
    { id: 'micro',   name: 'Microwave',             watts: 1200, icon: 'fa-fire' },
    { id: 'iron',    name: 'Iron',                  watts: 1000, icon: 'fa-shirt' },
    { id: 'washer',  name: 'Washing Machine',       watts: 500,  icon: 'fa-soap' },
    { id: 'pump',    name: 'Water Pump',            watts: 1000, icon: 'fa-faucet' },
    { id: 'blender', name: 'Blender',               watts: 400,  icon: 'fa-blender' }
];

/* ---------- product data ---------- */
const kstarInverters = [
    {
        kva: 3.6, voltage: 24, maxWatts: 3600,
        bestFor: 'Medium home (2\u20133 bedrooms)',
        usdPrice: 423.076923, usdLabour: 267.692308,
        price: 0, labour: 0,
        img: 'images/kstarinverter.png',
        specsLink: 'https://drive.google.com/file/d/1VVXGcq5FHHTslH-GWH8VSz9-jWaDOZWg/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 10 }, { name: 'Fans', count: 2 },
            { name: 'Fridge (150W)', count: 1 }, { name: 'TV (up to 80")', count: 1 },
            { name: 'Laptop', count: 2 }, { name: 'Router', count: 1 },
            { name: 'Microwave (short bursts)', count: 1 },
            { name: 'Blender (up to 1500W, briefly)', count: 1 },
            { name: 'Phone Charging', count: 3 }
        ],
        details: {
            efficiency: '97.5%',
            batteryCompatibility: 'Tubular, Lead-acid (no Lithium)',
            features: ['Pure sine wave output', 'Wide input voltage range', 'Overcurrent protection', 'Parallel up to 6 units']
        }
    },
    {
        kva: 3.6, voltage: 48, maxWatts: 3600,
        bestFor: 'Medium-large home (3\u20134 bedrooms)',
        usdPrice: 484.615385, usdLabour: 267.692308,
        price: 0, labour: 0,
        img: 'images/kstarinverter.png',
        specsLink: 'https://drive.google.com/file/d/1VVXGcq5FHHTslH-GWH8VSz9-jWaDOZWg/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 10 }, { name: 'Fans', count: 2 },
            { name: 'Fridge (150W)', count: 1 }, { name: 'TV (up to 80")', count: 1 },
            { name: 'Laptop', count: 2 }, { name: 'Router', count: 1 },
            { name: 'Microwave (short bursts)', count: 1 },
            { name: 'Blender (up to 1500W, briefly)', count: 1 },
            { name: 'Phone Charging', count: 3 }
        ],
        details: {
            efficiency: '97.5%',
            batteryCompatibility: 'Tubular, Lead-acid, Lithium',
            features: ['Pure sine wave output', 'Wide input voltage range', 'Overcurrent protection', 'Parallel up to 6 units']
        }
    },
    {
        kva: 6.0, voltage: 48, maxWatts: 6000,
        bestFor: 'Large home / Small office',
        usdPrice: 576.923077, usdLabour: 356.923077,
        price: 0, labour: 0,
        img: 'images/kstarinverter.png',
        specsLink: 'https://drive.google.com/file/d/1VVXGcq5FHHTslH-GWH8VSz9-jWaDOZWg/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 20 }, { name: 'Fans', count: 2 },
            { name: 'Fridge (150W)', count: 2 }, { name: 'TV (up to 100")', count: 2 },
            { name: 'Laptop', count: 3 }, { name: 'Router', count: 1 },
            { name: 'Microwave (short bursts)', count: 1 },
            { name: 'Blender (up to 1500W, briefly)', count: 1 },
            { name: 'Phone Charging', count: 3 }
        ],
        details: {
            efficiency: '97.5%',
            batteryCompatibility: 'Tubular, Lead-acid, Lithium',
            features: ['High power capacity', 'Pure sine wave output', 'Wide input voltage range', 'Overcurrent protection', 'Parallel up to 6 units']
        }
    }
];

const fortunerInverters = [
    {
        kva: 0.7, watts: 450, voltage: 12, maxWatts: 450,
        bestFor: 'Small office / Security lighting',
        usdPrice: 120.192308, usdLabour: 115.384615,
        price: 0, labour: 0,
        img: 'images/fortunerinverter.png',
        specsLink: 'https://drive.google.com/file/d/1CYns0tOUy0iRoS5m_WMMs_Ms2ti_-dIS/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 5 }, { name: 'Phone Charging', count: 3 },
            { name: 'Router', count: 1 }, { name: 'Laptop', count: 1 }
        ],
        details: {
            efficiency: '90%',
            batteryCompatibility: 'Tubular, Lead-acid',
            features: ['Compact design', 'Pure sine wave output', 'Cold start function', 'Overcurrent protection']
        }
    },
    {
        kva: 1.5, watts: 1200, voltage: 24, maxWatts: 1200,
        bestFor: '1\u20132 bedroom apartment',
        usdPrice: 153.846154, usdLabour: 115.384615,
        price: 0, labour: 0,
        outOfStock: true,
        img: 'images/fortunerinverter.png',
        specsLink: 'https://drive.google.com/file/d/1tADpzqTfynzL2vwvpaCsV0THI7UmEOuz/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 6 }, { name: 'Fan', count: 1 },
            { name: 'TV (up to 60")', count: 1 }, { name: 'Router', count: 1 },
            { name: 'Phone Charging', count: 3 }, { name: 'Laptop', count: 1 }
        ],
        details: {
            efficiency: '90%',
            batteryCompatibility: 'Tubular, Lead-acid',
            features: ['Mid-range household', 'Pure sine wave output', 'Cold start function', 'Overcurrent protection']
        }
    },
    {
        kva: 2.2, watts: 1400, voltage: 24, maxWatts: 1400,
        bestFor: '2\u20133 bedroom home',
        usdPrice: 201.923077, usdLabour: 138.461538,
        price: 0, labour: 0,
        img: 'images/fortunerinverter.png',
        specsLink: 'https://drive.google.com/file/d/1tADpzqTfynzL2vwvpaCsV0THI7UmEOuz/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 10 }, { name: 'Fan', count: 1 },
            { name: 'Fridge', count: 1 }, { name: 'TV (up to 80")', count: 1 },
            { name: 'Router', count: 1 }, { name: 'Phone Charging', count: 3 },
            { name: 'Laptop', count: 1 }
        ],
        details: {
            efficiency: '90%',
            batteryCompatibility: 'Tubular, Lead-acid',
            features: ['Supports larger fridges', 'Pure sine wave output', 'Cold start function', 'Overcurrent protection']
        }
    },
    {
        kva: 10.0, voltage: 48, maxWatts: 10000,
        bestFor: 'Large home / Small business',
        usdPrice: 1009.615385, usdLabour: 192.307692,
        price: 0, labour: 0,
        outOfStock: true,
        img: 'images/fortunerinverter.png',
        specsLink: 'https://drive.google.com/file/d/1iCFsxqr2xB7p50QH4s4en1VPrdQ_-nY0/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 30 }, { name: 'Fans', count: 2 },
            { name: 'Fridge', count: 3 }, { name: 'TV (up to 100")', count: 3 },
            { name: 'Laptop', count: 3 }, { name: 'Washing Machine (500W)', count: 1 },
            { name: 'Water Pump (1000W)', count: 1 },
            { name: 'Blender (up to 1500W, briefly)', count: 1 },
            { name: 'Microwave (short bursts)', count: 1 },
            { name: 'Phone Charging', count: 10 }
        ],
        details: {
            efficiency: '92%',
            batteryCompatibility: 'Tubular, Lead-acid',
            features: ['High capacity', 'Pure sine wave output', 'Cold start function', 'Robust overcurrent protection']
        }
    }
];

const batteries = [
    {
        id: 'tubular',
        name: 'Tubular 200AH',
        shortDesc: 'Affordable & reliable. Needs topping up every 3\u20136 months.',
        usdPrice: 173.076923,
        price: 0,
        img: 'images/battery-200ah-tubular.png',
        specsLink: 'https://drive.google.com/file/d/17stgG0eX-rTGS8QR9KdDVZ08OXjWJH47/view?usp=sharing',
        capacityWh: 2400, dod: 0.8, backupHours: 8.6, warranty: '1 year',
        voltagePerUnit: 12, type: 'lead-acid'
    },
    {
        id: 'mf',
        name: 'Maintenance Free 200AH',
        shortDesc: 'Sealed & zero maintenance. Great for indoor installation.',
        usdPrice: 280.769231,
        price: 0,
        img: 'images/battery-200ah-mf.png',
        specsLink: 'https://drive.google.com/file/d/1IiygyBHcx85JLY5W7wFI6gQBflkKHNh9/view?usp=sharing',
        capacityWh: 2400, dod: 0.8, backupHours: 8.6, warranty: '1 year',
        voltagePerUnit: 12, type: 'lead-acid'
    },
    {
        id: 'lithium',
        name: 'Lithium LFP 51.2V 100Ah',
        shortDesc: 'Premium. 10-year warranty. 90% usable capacity.',
        usdPrice: 923.076923,
        price: 0,
        img: 'images/battery-100ah-lithium.png',
        specsLink: 'https://drive.google.com/file/d/194rpm8gHCgehwTyFhx35o35G-JwXVgCS/view?usp=sharing',
        capacityWh: 5120, dod: 0.9, backupHours: 20.7, warranty: '10 years',
        voltagePerUnit: 51.2, type: 'lithium'
    }
];

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const fmt = n => Number(n).toLocaleString();
const EXCHANGE_RATE_API_KEY = '13f783aa03f37bceb9f21476';
const USD_PRICES = {
    panel: 88.461538,
    changeOverSwitch: 38.461538,
    acCable: 24.038462,
    accessories: {
        dcMccb: 38.461538,
        avs30Amps: 38.461538
    },
    mounting: {
        default: 211.538462,
        kstar6kva48v: 384.615385,
        fortuner1_5or2_2: 43.269231,
        fortuner10kva: 524.038462
    }
};

let PANEL_PRICE = 0;
let CHANGE_OVER_SWITCH_PRICE = 0;
let AC_CABLE_PRICE = 0;

function getAdjustedUsdToKes(rawRate) {
    return Math.round(rawRate) + 2;
}

function usdToKes(usdAmount) {
    return Math.round(usdAmount * pricingState.usdToKesAdjusted);
}

function applyExchangeRatePricing() {
    kstarInverters.forEach(function(inv) {
        inv.price = usdToKes(inv.usdPrice);
        inv.labour = usdToKes(inv.usdLabour);
    });

    fortunerInverters.forEach(function(inv) {
        inv.price = usdToKes(inv.usdPrice);
        inv.labour = usdToKes(inv.usdLabour);
    });

    batteries.forEach(function(bat) {
        bat.price = usdToKes(bat.usdPrice);
    });

    PANEL_PRICE = usdToKes(USD_PRICES.panel);
    CHANGE_OVER_SWITCH_PRICE = usdToKes(USD_PRICES.changeOverSwitch);
    AC_CABLE_PRICE = usdToKes(USD_PRICES.acCable);
}

function syncSelectedItemsWithLatestPricing() {
    if (state.company && state.inverter) {
        var invCatalog = state.company === 'Kstar' ? kstarInverters : fortunerInverters;
        var refreshedInv = invCatalog.find(function(inv) {
            return inv.kva === state.inverter.kva && inv.voltage === state.inverter.voltage;
        });
        if (refreshedInv) state.inverter = refreshedInv;
    }

    if (state.battery) {
        var refreshedBat = batteries.find(function(bat) { return bat.id === state.battery.id; });
        if (refreshedBat) {
            state.battery = {
                name: refreshedBat.name,
                id: refreshedBat.id,
                shortDesc: refreshedBat.shortDesc,
                price: refreshedBat.price,
                img: refreshedBat.img,
                specsLink: refreshedBat.specsLink,
                capacityWh: refreshedBat.capacityWh,
                dod: refreshedBat.dod,
                backupHours: refreshedBat.backupHours,
                warranty: refreshedBat.warranty,
                voltagePerUnit: refreshedBat.voltagePerUnit,
                type: refreshedBat.type,
                count: state.battery.count
            };
        }
    }
}

function renderAccessoryStaticPrices() {
    var changeOverEl = $('#acc-changeover-price');
    if (changeOverEl) changeOverEl.textContent = fmt(CHANGE_OVER_SWITCH_PRICE) + ' Ksh';

    var dcMccbEl = $('#acc-dc-mccb-price');
    if (dcMccbEl) dcMccbEl.textContent = fmt(usdToKes(USD_PRICES.accessories.dcMccb)) + ' Ksh';

    var avsEl = $('#acc-avs-price');
    if (avsEl) avsEl.textContent = fmt(usdToKes(USD_PRICES.accessories.avs30Amps)) + ' Ksh';
}

function getBrandInverterRange(companyName) {
    var data = companyName === 'Kstar' ? kstarInverters : fortunerInverters;
    var values = data.map(function(inv) { return inv.price; });
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    return 'Systems from KSH ' + fmt(min) + ' - ' + fmt(max);
}

function refreshUiForLatestPricing() {
    syncSelectedItemsWithLatestPricing();
    renderAccessoryStaticPrices();
    renderFxRatePill();
    renderStep(state.step);
    updateRunningTotal();
}

function renderFxRatePill() {
    var fxEl = $('#fx-rate-pill');
    if (!fxEl) return;
    fxEl.textContent = 'USD/KSH Exchange Rate: ' + pricingState.usdToKesRaw.toFixed(2);
    fxEl.classList.toggle('live', pricingState.source !== 'fallback');
}

async function fetchUsdToKesRate() {
    var endpoint = 'https://v6.exchangerate-api.com/v6/' + EXCHANGE_RATE_API_KEY + '/latest/USD';
    var response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error('FX request failed: ' + response.status);
    var data = await response.json();
    var rate = data && data.conversion_rates ? Number(data.conversion_rates.KES) : NaN;
    if (!Number.isFinite(rate) || rate <= 0) throw new Error('Invalid FX rate from ExchangeRate-API');

    pricingState.usdToKesRaw = rate;
    pricingState.usdToKesAdjusted = getAdjustedUsdToKes(rate);
    pricingState.source = 'exchangerate-api';
    pricingState.lastUpdated = new Date().toISOString();
}

async function refreshExchangeRateAndPricing() {
    try {
        await fetchUsdToKesRate();
    } catch (e) {
        pricingState.source = 'fallback';
    }

    applyExchangeRatePricing();
    refreshUiForLatestPricing();
    saveState();
}

function getAccessoryCost() {
    const base = usdToKes(USD_PRICES.changeOverSwitch) + usdToKes(USD_PRICES.accessories.dcMccb) + usdToKes(USD_PRICES.accessories.avs30Amps);
    return base + getMountingCost();
}

function getMountingCost() {
    if (!state.inverter) return 0;
    if (state.company === 'Fortuner') {
        if (state.inverter.kva === 1.5 || state.inverter.kva === 2.2) return usdToKes(USD_PRICES.mounting.fortuner1_5or2_2);
        if (state.inverter.kva === 10.0) return usdToKes(USD_PRICES.mounting.fortuner10kva);
        return usdToKes(USD_PRICES.mounting.default);
    }
    if (state.inverter.kva === 6.0 && state.inverter.voltage === 48) return usdToKes(USD_PRICES.mounting.kstar6kva48v);
    return usdToKes(USD_PRICES.mounting.default);
}

function getTotal() {
    if (!state.inverter || !state.battery) return 0;
    return state.inverter.price + state.inverter.labour +
           (state.battery.price * state.battery.count) +
           (state.panels * PANEL_PRICE) +
           getAccessoryCost();
}

function getNoSolarBreakdown() {
    if (!state.inverter || !state.battery) return null;
    var invCost = state.inverter.price;
    var batCost = state.battery.price * state.battery.count;
    var labourCost = Math.round(state.inverter.labour * 0.6);
    var total = invCost + batCost + CHANGE_OVER_SWITCH_PRICE + AC_CABLE_PRICE + labourCost;
    return {
        inverter: invCost,
        battery: batCost,
        changeOver: CHANGE_OVER_SWITCH_PRICE,
        acCable: AC_CABLE_PRICE,
        labour: labourCost,
        total: total
    };
}

function saveState() {
    try { localStorage.setItem('solarState', JSON.stringify(state)); } catch (e) { /* quota */ }
}
function clearState() {
    try { localStorage.removeItem('solarState'); } catch (e) { /* noop */ }
}

/* ---------- toast system ---------- */
function toast(message, type, duration) {
    type = type || 'info';
    duration = duration || 3000;
    var container = $('#toast-container');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'toast toast-' + type;
    var icons = { info: 'fa-circle-info', success: 'fa-circle-check', warning: 'fa-triangle-exclamation', error: 'fa-circle-xmark' };
    el.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i><span>' + message + '</span>';
    container.appendChild(el);
    requestAnimationFrame(function() { el.classList.add('show'); });
    setTimeout(function() {
        el.classList.remove('show');
        el.addEventListener('transitionend', function() { el.remove(); });
    }, duration);
}

/* ---------- navigation ---------- */
var STEPS = ['company', 'inverter', 'battery', 'summary'];

function resolveAccessibleStep(step) {
    if (step === 'summary' && state.battery) return 'summary';
    if (step === 'battery' && state.inverter) return 'battery';
    if (step === 'inverter' && state.company) return 'inverter';
    return 'company';
}

function renderStep(step) {
    if (step === 'company') renderCompanies();
    else if (step === 'inverter' && state.company) renderInverters();
    else if (step === 'battery' && state.inverter) renderBatteries();
    else if (step === 'summary' && state.battery) renderSummary();
}

function goTo(step) {
    step = resolveAccessibleStep(step);

    renderStep(step);

    var target = $('#' + step + '-section');

    $$('.panel').forEach(function(panel) {
        panel.classList.remove('visible', 'enter-right', 'enter-left', 'exit-left', 'exit-right');
        panel.style.position = '';
        panel.style.width = '';
    });

    if (!target) return;
    target.classList.add('visible');

    state.step = step;
    updatePills();
    updateRunningTotal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#' + step);
}

function goBack() {
    var i = STEPS.indexOf(state.step);
    if (i > 0) goTo(STEPS[i - 1]);
}

function updatePills() {
    var ci = STEPS.indexOf(state.step);
    $$('.step-pill').forEach(function(p, i) {
        p.classList.remove('active', 'done');
        if (i < ci) p.classList.add('done');
        else if (i === ci) p.classList.add('active');
    });
    $$('.step-connector').forEach(function(c, i) {
        c.classList.toggle('lit', i < ci);
    });
}

function updateRunningTotal() {
    var el = $('#running-total');
    if (!el) return;
    var total = getTotal();
    el.textContent = total > 0 ? 'KSH ' + fmt(total) : 'KSH 0';
    var wrap = el.parentElement;
    if (wrap) wrap.classList.toggle('has-value', total > 0);
}

/* ---------- needs assessment ---------- */
function renderNeeds() {
    var grid = $('#needs-grid');
    if (!grid) return;
    grid.innerHTML = '';
    APPLIANCES.forEach(function(app) {
        var checked = state.needs[app.id] || false;
        var el = document.createElement('label');
        el.className = 'needs-item' + (checked ? ' active' : '');
        el.innerHTML =
            '<input type="checkbox" ' + (checked ? 'checked' : '') + ' data-appliance="' + app.id + '" hidden>' +
            '<i class="fas ' + app.icon + '"></i>' +
            '<span class="needs-item-name">' + app.name + '</span>' +
            '<span class="needs-item-watts">' + app.watts + 'W</span>';
        el.addEventListener('click', function(e) {
            e.preventDefault();
            state.needs[app.id] = !state.needs[app.id];
            el.classList.toggle('active');
            el.querySelector('input').checked = state.needs[app.id];
            updateNeedsResult();
        });
        grid.appendChild(el);
    });
    updateNeedsResult();
}

function calcTotalWatts() {
    var total = 0;
    APPLIANCES.forEach(function(app) {
        if (state.needs[app.id]) total += app.watts;
    });
    return total;
}

function updateNeedsResult() {
    var watts = calcTotalWatts();
    state.totalWatts = watts;
    var wattEl = $('#needs-wattage');
    var recEl = $('#needs-rec');
    var resultEl = $('#needs-result');

    if (wattEl) wattEl.textContent = watts + 'W';

    if (watts === 0) {
        if (resultEl) resultEl.classList.add('hidden');
        return;
    }
    if (resultEl) resultEl.classList.remove('hidden');

    var rec = '';
    if (watts <= 450) {
        rec = 'A <strong>Fortuner 0.7kVA</strong> can handle this load. Budget-friendly choice.';
    } else if (watts <= 1200) {
        rec = 'A <strong>Fortuner 0.7kVA</strong> can work, or go to <strong>Fortuner 2.2kVA</strong> for more headroom.';
    } else if (watts <= 1400) {
        rec = 'Consider a <strong>Fortuner 2.2kVA</strong> or <strong>Kstar 3.6kVA</strong> for headroom.';
    } else if (watts <= 3600) {
        rec = 'A <strong>Kstar 3.6kVA</strong> is the sweet spot for this load.';
    } else if (watts <= 6000) {
        rec = 'You need at least a <strong>Kstar 6.0kVA</strong> for this kind of load.';
    } else {
        rec = 'Heavy usage \u2014 consider a <strong>Kstar 6.0kVA</strong> system for reliable high-load support.';
    }
    if (recEl) recEl.innerHTML = rec;
}

/* ---------- renderers ---------- */
function renderCompanies() {
    var wrap = $('#company-options');
    wrap.innerHTML = '';
    var brands = [
        { name: 'Kstar', img: 'images/kstar-logo.png', tagline: 'Premium efficiency, proven reliability', range: getBrandInverterRange('Kstar') },
        { name: 'Fortuner', img: 'images/fortuner-logo.png', tagline: 'Great value across all budgets', range: getBrandInverterRange('Fortuner') }
    ];
    brands.forEach(function(c) {
        var el = document.createElement('div');
        el.className = 'brand-card' + (state.company === c.name ? ' selected' : '');
        el.innerHTML =
            '<div class="brand-check"><i class="fas fa-check"></i></div>' +
            '<img src="' + c.img + '" alt="' + c.name + '" class="brand-img" loading="lazy">' +
            '<span class="brand-name">' + c.name + '</span>' +
            '<span class="brand-tagline">' + c.tagline + '</span>' +
            '<span class="brand-range">' + c.range + '</span>';
        el.addEventListener('click', function() { selectCompany(c.name); });
        wrap.appendChild(el);
    });
}

function renderInverters() {
    var inverters = state.company === 'Kstar' ? kstarInverters : fortunerInverters;
    var wrap = $('#inverter-options');
    wrap.innerHTML = '';
    state.compareList = [];
    updateCompareBar();

    $$('.kstar-only').forEach(function(l) { l.style.display = state.company === 'Kstar' ? '' : 'none'; });
    $$('.fortuner-only').forEach(function(l) { l.style.display = state.company === 'Fortuner' ? '' : 'none'; });

    var userWatts = state.totalWatts;

    // Determine best value (lowest price per watt)
    var sorted = inverters.slice().sort(function(a, b) { return (a.price / a.maxWatts) - (b.price / b.maxWatts); });
    var bestValueIdx = inverters.indexOf(sorted[0]);

    // Determine recommended (smallest inverter that covers user needs)
    var recommendedIdx = -1;
    if (userWatts > 0) {
        for (var i = 0; i < inverters.length; i++) {
            if (inverters[i].maxWatts >= userWatts) { recommendedIdx = i; break; }
        }
        if (recommendedIdx === -1) recommendedIdx = inverters.length - 1;
    }

    inverters.forEach(function(inv, idx) {
        var sel = state.inverter && state.inverter.kva === inv.kva && state.inverter.voltage === inv.voltage;
        var w = inv.watts ? ' (' + inv.watts + 'W)' : '';
        var outOfStock = !!inv.outOfStock;

        var badge = '';
        if (idx === recommendedIdx && userWatts > 0 && !outOfStock) {
            badge = '<span class="card-badge badge-rec"><i class="fas fa-star"></i> Recommended</span>';
        } else if (idx === bestValueIdx && !outOfStock) {
            badge = '<span class="card-badge badge-value"><i class="fas fa-tags"></i> Best Value</span>';
        }
        if (outOfStock) badge = '<span class="card-badge badge-out"><i class="fas fa-ban"></i> Out of Stock</span>';

        var matchBar = '';
        if (userWatts > 0) {
            var pct = Math.min(Math.round((inv.maxWatts / userWatts) * 100), 200);
            var enough = inv.maxWatts >= userWatts;
            matchBar =
                '<div class="capacity-match">' +
                    '<div class="match-bar"><div class="match-fill ' + (enough ? 'enough' : 'short') + '" style="width:' + Math.min(pct, 100) + '%"></div></div>' +
                    '<span class="match-text ' + (enough ? 'enough' : 'short') + '">' + (enough ? '\u2713 Covers your ' + userWatts + 'W' : '\u26a0 Under your ' + userWatts + 'W needs') + '</span>' +
                '</div>';
        }

        var el = document.createElement('div');
        el.className = 'product-card' + (sel ? ' selected' : '') + (outOfStock ? ' out-of-stock' : '');
        el.innerHTML =
            badge +
            '<div class="card-check"><i class="fas fa-check"></i></div>' +
            '<div class="card-thumb"><img src="' + inv.img + '" alt="Inverter" loading="lazy"></div>' +
            '<div class="card-body">' +
                '<span class="card-title">' + state.company + ' ' + inv.kva + 'kVA' + w + ' \u2013 ' + inv.voltage + 'V</span>' +
                '<span class="card-subtitle">' + inv.bestFor + '</span>' +
                '<span class="card-price">' + fmt(inv.price) + ' Ksh</span>' +
                (outOfStock ? '<span class="card-meta stock-meta">Currently unavailable</span>' : '') +
                '<span class="card-meta">Efficiency: ' + inv.details.efficiency + ' \u00b7 Max: ' + fmt(inv.maxWatts) + 'W</span>' +
                matchBar +
                '<div class="card-actions">' +
                    '<a href="' + inv.specsLink + '" target="_blank" rel="noopener" class="card-link"><i class="fas fa-external-link-alt"></i> Specs</a>' +
                    (outOfStock ? '<span class="card-link stock-meta"><i class="fas fa-lock"></i> Disabled</span>' : '<button class="card-link compat-btn" data-idx="' + idx + '"><i class="fas fa-plug"></i> What it powers</button><label class="card-link compare-check"><input type="checkbox" data-compare="' + idx + '"> Compare</label>') +
                '</div>' +
            '</div>';

        el.addEventListener('click', function(e) {
            if (outOfStock) return;
            if (!e.target.closest('a') && !e.target.closest('.compat-btn') && !e.target.closest('.compare-check')) {
                selectInverter(inv);
            }
        });
        wrap.appendChild(el);
    });

    $$('.compat-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            showApplianceModal(inverters[parseInt(btn.dataset.idx)]);
        });
    });

    $$('.compare-check input').forEach(function(cb) {
        cb.addEventListener('change', function() {
            var idx = parseInt(cb.dataset.compare);
            if (cb.checked) {
                if (state.compareList.length < 3) {
                    state.compareList.push(idx);
                } else {
                    cb.checked = false;
                    toast('You can compare up to 3 inverters', 'warning');
                }
            } else {
                state.compareList = state.compareList.filter(function(i) { return i !== idx; });
            }
            updateCompareBar();
        });
    });
}

function updateCompareBar() {
    var bar = $('#compare-bar');
    var count = $('#compare-count');
    if (!bar) return;
    if (state.compareList.length >= 2) {
        bar.classList.remove('hidden');
        if (count) count.textContent = state.compareList.length;
    } else {
        bar.classList.add('hidden');
    }
}

function showComparison() {
    var inverters = state.company === 'Kstar' ? kstarInverters : fortunerInverters;
    var selected = state.compareList.map(function(i) { return inverters[i]; });
    var body = $('#compare-body');
    if (!body) return;

    var specs = ['kVA Rating', 'Voltage', 'Max Output', 'Efficiency', 'Price', 'Installation (+VAT)', 'Best For'];
    var colCount = selected.length;

    var html = '<div class="compare-table" style="grid-template-columns:120px repeat(' + colCount + ',1fr)">';
    html += '<div class="compare-row compare-header"><div class="compare-cell"></div>';
    selected.forEach(function(inv) {
        var w = inv.watts ? ' (' + inv.watts + 'W)' : '';
        html += '<div class="compare-cell"><img src="' + inv.img + '" alt="" class="compare-img"><strong>' + inv.kva + 'kVA' + w + '</strong></div>';
    });
    html += '</div>';

    var rows = selected.map(function(inv) {
        return [
            inv.kva + ' kVA',
            inv.voltage + 'V',
            fmt(inv.maxWatts) + 'W',
            inv.details.efficiency,
            fmt(inv.price) + ' Ksh',
            fmt(inv.labour) + ' Ksh',
            inv.bestFor
        ];
    });

    specs.forEach(function(spec, si) {
        html += '<div class="compare-row"><div class="compare-cell compare-label">' + spec + '</div>';
        rows.forEach(function(r) {
            html += '<div class="compare-cell">' + r[si] + '</div>';
        });
        html += '</div>';
    });
    html += '</div>';

    body.innerHTML = html;
    $('#compare-modal').classList.remove('hidden');
}

function renderBatteries() {
    var wrap = $('#battery-options');
    wrap.innerHTML = '';
    var inv = state.inverter;
    if (!inv) return;

    var bestValueBat = null;
    var bestCostPerKwh = Infinity;
    batteries.forEach(function(bat) {
        var info = getBatteryCompat(bat);
        if (info && info.compatible) {
            var costPerKwh = (bat.price * info.count) / (bat.capacityWh * bat.dod * info.count / 1000);
            if (costPerKwh < bestCostPerKwh) {
                bestCostPerKwh = costPerKwh;
                bestValueBat = bat.id;
            }
        }
    });

    batteries.forEach(function(bat) {
        var info = getBatteryCompat(bat);
        if (!info) return;

        var count = info.count;
        var compatible = info.compatible;
        var reason = info.reason;

        var sel = state.battery && state.battery.name === bat.name && state.battery.count === count;
        var el = document.createElement('div');

        if (!compatible) {
            el.className = 'product-card incompatible';
            el.innerHTML =
                '<div class="card-thumb"><img src="' + bat.img + '" alt="Battery" loading="lazy"></div>' +
                '<div class="card-body">' +
                    '<span class="card-title">' + bat.name + '</span>' +
                    '<span class="card-price">' + fmt(bat.price) + ' Ksh/unit</span>' +
                    '<div class="incompat-reason">' +
                        '<i class="fas fa-ban"></i>' +
                        '<span>' + reason + '</span>' +
                    '</div>' +
                '</div>';
        } else {
            var backup = (bat.backupHours * count).toFixed(1);
            var totalCost = bat.price * count;
            var costPerKwh = ((bat.price * count) / (bat.capacityWh * bat.dod * count / 1000)).toFixed(0);

            var badge = '';
            if (bat.id === bestValueBat && bat.type !== 'lithium') {
                badge = '<span class="card-badge badge-value"><i class="fas fa-tags"></i> Best Value</span>';
            }
            if (bat.type === 'lithium') {
                badge = '<span class="card-badge badge-premium"><i class="fas fa-gem"></i> Premium</span>';
            }

            el.className = 'product-card' + (sel ? ' selected' : '');
            el.innerHTML =
                badge +
                '<div class="card-check"><i class="fas fa-check"></i></div>' +
                '<div class="card-thumb"><img src="' + bat.img + '" alt="Battery" loading="lazy"></div>' +
                '<div class="card-body">' +
                    '<span class="card-title">' + bat.name + '</span>' +
                    '<span class="card-subtitle">' + bat.shortDesc + '</span>' +
                    '<span class="card-price">' + fmt(bat.price) + ' Ksh <small>\u00d7 ' + count + ' = ' + fmt(totalCost) + ' Ksh</small></span>' +
                    '<span class="card-meta">~' + backup + ' hrs backup \u00b7 ' + bat.warranty + ' warranty</span>' +
                    '<span class="card-meta">' + fmt(costPerKwh) + ' Ksh/kWh \u00b7 ' + reason + '</span>' +
                    '<div class="card-actions">' +
                        '<a href="' + bat.specsLink + '" target="_blank" rel="noopener" class="card-link"><i class="fas fa-external-link-alt"></i> Specs</a>' +
                    '</div>' +
                '</div>';
            el.addEventListener('click', function(e) {
                if (!e.target.closest('a')) selectBattery(bat, count);
            });
        }

        wrap.appendChild(el);
    });
}

/* ---------- battery compatibility ---------- */
function getBatteryCompat(bat) {
    var inv = state.inverter;
    if (!inv) return null;

    if (state.company === 'Kstar') {
        if (inv.kva === 3.6 && inv.voltage === 24) {
            if (bat.type === 'lithium') return { count: 0, compatible: false, reason: 'Not compatible \u2014 this 24V inverter doesn\u2019t support lithium batteries' };
            return { count: 2, compatible: true, reason: '2 units in series for 24V system' };
        }
        if (inv.kva === 3.6 && inv.voltage === 48) {
            if (bat.type === 'lithium') return { count: 1, compatible: true, reason: '51.2V lithium matches your 48V system directly' };
            return { count: 4, compatible: true, reason: '4 units in series for 48V system' };
        }
        if (inv.kva === 6.0 && inv.voltage === 48) {
            if (bat.type === 'lithium') return { count: 2, compatible: true, reason: '2 lithium units for extended capacity' };
            return { count: 4, compatible: true, reason: '4 units in series for 48V system' };
        }
    } else {
        if (inv.kva === 0.7 && inv.voltage === 12) {
            if (bat.type === 'lithium') return { count: 0, compatible: false, reason: 'Not compatible \u2014 12V system can\u2019t use 51.2V lithium' };
            return { count: 1, compatible: true, reason: '1 unit for 12V system' };
        }
        if ((inv.kva === 1.5 || inv.kva === 2.2) && inv.voltage === 24) {
            if (bat.type === 'lithium') return { count: 0, compatible: false, reason: 'Not compatible \u2014 this inverter doesn\u2019t support lithium chemistry' };
            return { count: 2, compatible: true, reason: '2 units in series for 24V system' };
        }
        if (inv.kva === 10.0 && inv.voltage === 48) {
            if (bat.type === 'lithium') return { count: 0, compatible: false, reason: 'Not compatible \u2014 this inverter doesn\u2019t support lithium chemistry' };
            return { count: 4, compatible: true, reason: '4 units in series for 48V system' };
        }
    }
    return null;
}

/* ---------- selections ---------- */
function selectCompany(name) {
    state.company = name;
    state.inverter = null;
    state.battery = null;
    state.compareList = [];
    renderCompanies();
    toast(name + ' selected', 'success');
    setTimeout(function() {
        goTo('inverter');
    }, 250);
    saveState();
}

function selectInverter(inv) {
    if (inv.outOfStock) {
        toast(inv.kva + 'kVA is currently out of stock', 'warning');
        return;
    }
    state.inverter = inv;
    state.battery = null;
    state.compareList = [];
    renderInverters();
    var w = inv.watts ? ' (' + inv.watts + 'W)' : '';
    toast(inv.kva + 'kVA' + w + ' inverter selected', 'success');
    setTimeout(function() {
        goTo('battery');
    }, 250);
    saveState();
}

function selectBattery(bat, count) {
    state.battery = { name: bat.name, id: bat.id, shortDesc: bat.shortDesc, price: bat.price, img: bat.img, specsLink: bat.specsLink, capacityWh: bat.capacityWh, dod: bat.dod, backupHours: bat.backupHours, warranty: bat.warranty, voltagePerUnit: bat.voltagePerUnit, type: bat.type, count: count };
    renderBatteries();
    calcPanels();
    toast(bat.name + ' \u00d7 ' + count + ' selected', 'success');
    setTimeout(function() {
        goTo('summary');
    }, 250);
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
    renderSelectionOverview();
    renderPanelInfo();
    renderMountingCost();
    renderCostBreakdown();
    renderFinancing();
    renderEnvironmentalImpact();
    updateRunningTotal();
}

function renderSelectionOverview() {
    var cards = $('#selection-cards');
    if (!cards) return;
    var inv = state.inverter;
    var bat = state.battery;
    var w = inv.watts ? ' (' + inv.watts + 'W)' : '';

    cards.innerHTML =
        '<div class="sel-card">' +
            '<div class="sel-card-icon"><i class="fas fa-building"></i></div>' +
            '<div class="sel-card-info">' +
                '<span class="sel-card-label">Brand</span>' +
                '<span class="sel-card-val">' + state.company + '</span>' +
            '</div>' +
            '<button class="sel-card-edit" data-goto="company"><i class="fas fa-pen"></i></button>' +
        '</div>' +
        '<div class="sel-card">' +
            '<div class="sel-card-icon"><i class="fas fa-bolt"></i></div>' +
            '<div class="sel-card-info">' +
                '<span class="sel-card-label">Inverter</span>' +
                '<span class="sel-card-val">' + inv.kva + 'kVA' + w + ' \u2013 ' + inv.voltage + 'V</span>' +
            '</div>' +
            '<button class="sel-card-edit" data-goto="inverter"><i class="fas fa-pen"></i></button>' +
        '</div>' +
        '<div class="sel-card">' +
            '<div class="sel-card-icon"><i class="fas fa-car-battery"></i></div>' +
            '<div class="sel-card-info">' +
                '<span class="sel-card-label">Battery</span>' +
                '<span class="sel-card-val">' + bat.name + ' \u00d7 ' + bat.count + '</span>' +
            '</div>' +
            '<button class="sel-card-edit" data-goto="battery"><i class="fas fa-pen"></i></button>' +
        '</div>';

    cards.querySelectorAll('.sel-card-edit').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var step = btn.dataset.goto;
            goTo(step);
        });
    });
}

function renderPanelInfo() {
    var panelInfo = $('#panel-info');
    var panelImages = $('#panel-images');
    if (state.panels > 0) {
        panelInfo.innerHTML =
            '<p><strong>' + state.panels + '</strong> \u00d7 600W solar panels</p>' +
            '<p class="price">' + fmt(PANEL_PRICE) + ' Ksh each \u00b7 Total: ' + fmt(state.panels * PANEL_PRICE) + ' Ksh</p>' +
            '<a href="https://drive.google.com/file/d/14w98znycd4Y4-quOsoSItp4ulKUkpoCv/view?usp=sharing" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Panel Specs</a>';
    } else {
        panelInfo.innerHTML = '<p>No solar panels needed for this configuration.</p>';
    }
    panelImages.innerHTML = '';
    for (var i = 0; i < state.panels; i++) {
        var img = document.createElement('img');
        img.src = 'images/solar-panel.png';
        img.loading = 'lazy';
        img.alt = 'Solar Panel';
        panelImages.appendChild(img);
    }
}

function renderMountingCost() {
    var mc = $('#mounting-cost');
    if (mc) mc.querySelector('.acc-price').textContent = fmt(getMountingCost()) + ' Ksh';
}

function renderCostBreakdown() {
    var inv = state.inverter;
    var bat = state.battery;
    var invCost = inv.price;
    var labCost = inv.labour;
    var batCost = bat.price * bat.count;
    var panCost = state.panels * PANEL_PRICE;
    var accCost = getAccessoryCost();
    var total = invCost + labCost + batCost + panCost + accCost;
    var w = inv.watts ? ' (' + inv.watts + 'W)' : '';

    $('#summary').innerHTML =
        '<div class="row"><span>Inverter: ' + state.company + ' ' + inv.kva + 'kVA' + w + ' \u2013 ' + inv.voltage + 'V</span><span class="row-val">' + fmt(invCost) + ' Ksh</span></div>' +
        '<div class="row"><span>Installation & Labour (+VAT)</span><span class="row-val">' + fmt(labCost) + ' Ksh</span></div>' +
        '<div class="row"><span>Batteries: ' + bat.name + ' \u00d7 ' + bat.count + '</span><span class="row-val">' + fmt(batCost) + ' Ksh</span></div>' +
        '<div class="row"><span>Solar Panels: ' + state.panels + ' panels</span><span class="row-val">' + fmt(panCost) + ' Ksh</span></div>' +
        '<div class="row"><span>Accessories (included)</span><span class="row-val">' + fmt(accCost) + ' Ksh</span></div>';

    $('#total-cost').textContent = fmt(total) + ' KSH';

    var noSolar = getNoSolarBreakdown();
    var noSolarEl = $('#no-solar-summary');
    if (noSolarEl && noSolar) {
        noSolarEl.innerHTML =
            '<h3>Without Solar Panels Option</h3>' +
            '<div class="row"><span>Inverter</span><span class="row-val">' + fmt(noSolar.inverter) + ' Ksh</span></div>' +
            '<div class="row"><span>Batteries</span><span class="row-val">' + fmt(noSolar.battery) + ' Ksh</span></div>' +
            '<div class="row"><span>Change Over Switch</span><span class="row-val">' + fmt(noSolar.changeOver) + ' Ksh</span></div>' +
            '<div class="row"><span>AC Cable</span><span class="row-val">' + fmt(noSolar.acCable) + ' Ksh</span></div>' +
            '<div class="row"><span>Installation & Labour</span><span class="row-val">' + fmt(noSolar.labour) + ' Ksh</span></div>' +
            '<div class="no-solar-total"><span>Total Without Solar Panels</span><span>' + fmt(noSolar.total) + ' KSH</span></div>';
    }
}

function renderFinancing() {
    var total = getTotal();
    if (total <= 0) return;
    var el6 = $('#fin-6'), el12 = $('#fin-12'), el24 = $('#fin-24');
    if (el6) el6.textContent = 'KSH ' + fmt(Math.round(total / 6));
    if (el12) el12.textContent = 'KSH ' + fmt(Math.round(total / 12));
    if (el24) el24.textContent = 'KSH ' + fmt(Math.round(total * 1.1 / 24));
}

/* ---------- savings calculator ---------- */
function initSavingsCalc() {
    var input = $('#monthly-bill');
    if (!input) return;
    var debounce;
    input.addEventListener('input', function() {
        clearTimeout(debounce);
        debounce = setTimeout(calculateSavings, 300);
    });
}

function calculateSavings() {
    var billInput = $('#monthly-bill');
    var results = $('#savings-results');
    if (!billInput || !results) return;

    var bill = parseFloat(billInput.value) || 0;
    if (bill <= 0 || state.panels === 0) {
        results.classList.add('hidden');
        return;
    }

    results.classList.remove('hidden');

    var ratePerKwh = 25;
    var impact = calcImpact();
    var monthlyGen = impact.kwh / 12;
    var monthlyGenValue = monthlyGen * ratePerKwh;
    var offsetFactor = 0.85;
    var monthlySaving = Math.min(monthlyGenValue * offsetFactor, bill * offsetFactor);
    var yearlySaving = monthlySaving * 12;
    var totalCost = getTotal();
    var paybackYears = yearlySaving > 0 ? totalCost / yearlySaving : 0;
    var tenYearNet = (yearlySaving * 10) - totalCost;

    $('#monthly-savings').textContent = 'KSH ' + fmt(Math.round(monthlySaving));
    $('#yearly-savings').textContent = 'KSH ' + fmt(Math.round(yearlySaving));
    $('#payback-period').textContent = paybackYears > 0 ? paybackYears.toFixed(1) + ' years' : '\u2014';
    var tenYrEl = $('#ten-year-savings');
    tenYrEl.textContent = tenYearNet > 0 ? 'KSH ' + fmt(Math.round(tenYearNet)) : '\u2014';
    tenYrEl.classList.toggle('positive', tenYearNet > 0);
    tenYrEl.classList.toggle('negative', tenYearNet <= 0);
}

/* ---------- environmental impact ---------- */
function calcImpact() {
    var pw = 600, sunHrs = 4.1, eff = 0.9, co2Factor = 0.7, treeFactor = 22, householdCo2 = 5000;
    var kwh = state.panels * pw * sunHrs * 365 * eff / 1000;
    var co2 = kwh * co2Factor;
    var trees = co2 / treeFactor;
    var pct = Math.min((co2 / householdCo2) * 100, 100);
    return { kwh: Math.round(kwh), co2: Math.round(co2), trees: Math.round(trees), pct: Math.round(pct) };
}

function renderEnvironmentalImpact() {
    var envBlock = $('#env-block');
    if (state.panels === 0) {
        if (envBlock) envBlock.style.display = 'none';
        return;
    }
    if (envBlock) envBlock.style.display = '';

    var impact = calcImpact();
    var cards = $$('#env-grid .env-card');
    var data = [
        { el: 'energy-produced', val: impact.kwh, suf: ' kWh/yr' },
        { el: 'co2-reduced', val: impact.co2, suf: ' kg/yr' },
        { el: 'trees-planted', val: impact.trees, suf: ' trees/yr' },
        { el: 'co2-percentage', val: impact.pct, suf: '%' }
    ];

    data.forEach(function(d, i) {
        setTimeout(function() {
            if (cards[i]) cards[i].classList.add('show');
            countUp(d.el, d.val, d.suf, 800);
            if (d.el === 'co2-percentage') {
                var circ = 2 * Math.PI * 34;
                setTimeout(function() {
                    var prog = $('#co2-progress');
                    if (prog) prog.style.strokeDashoffset = String(circ - (d.val / 100) * circ);
                }, 150);
            }
        }, 200 + i * 250);
    });
}

function countUp(id, end, suffix, dur) {
    var el = document.getElementById(id);
    if (!el) return;
    var start = null;
    function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var ease = 1 - (1 - p) * (1 - p);
        el.textContent = Math.round(ease * end) + suffix;
        if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

/* ---------- appliance modal ---------- */
function showApplianceModal(inv) {
    var w = inv.watts ? ' (' + inv.watts + 'W)' : '';
    $('#modal-title').textContent = state.company + ' ' + inv.kva + 'kVA' + w + ' \u2013 Compatible Appliances';

    var featureList = inv.details.features.map(function(f) { return '<li><i class="fas fa-check"></i> ' + f + '</li>'; }).join('');

    $('#modal-body').innerHTML =
        '<ul class="compat-list">' + inv.appliances.map(function(a) {
            return '<li><i class="fas fa-check-circle"></i> <strong>' + a.count + '\u00d7</strong> ' + a.name + '</li>';
        }).join('') + '</ul>' +
        '<div class="detail-box">' +
            '<p><strong>Efficiency:</strong> ' + inv.details.efficiency + '</p>' +
            '<p><strong>Battery Support:</strong> ' + inv.details.batteryCompatibility + '</p>' +
            '<p><strong>Max Output:</strong> ' + fmt(inv.maxWatts) + 'W continuous</p>' +
        '</div>' +
        '<div class="detail-box" style="margin-top:12px">' +
            '<p><strong>Features:</strong></p>' +
            '<ul class="feature-list">' + featureList + '</ul>' +
        '</div>';

    $('#appliance-modal').classList.remove('hidden');
}

function closeModal(modal) { modal.classList.add('hidden'); }

/* ---------- form validation ---------- */
function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validatePhone(p, len) { var d = p.replace(/\D/g, ''); return d.length === len && /^\d+$/.test(d); }

function validateForm() {
    var name = $('#user-name').value.trim();
    var email = $('#user-email').value.trim();
    var phone = $('#user-phone').value.trim();
    var cc = $('#country-code');
    var pLen = parseInt(cc.options[cc.selectedIndex].dataset.length);
    var ok = true;

    if (!name) { $('#name-error').textContent = 'Name is required'; ok = false; } else { $('#name-error').textContent = ''; }
    if (!email) { $('#email-error').textContent = 'Email is required'; ok = false; }
    else if (!validateEmail(email)) { $('#email-error').textContent = 'Enter a valid email'; ok = false; }
    else { $('#email-error').textContent = ''; }
    if (phone && !validatePhone(phone, pLen)) { $('#phone-error').textContent = 'Must be ' + pLen + ' digits'; ok = false; }
    else { $('#phone-error').textContent = ''; }

    if (!ok) toast('Please fill in the required fields', 'error');
    return ok;
}

/* ---------- share / export ---------- */
function buildText() {
    var name  = $('#user-name').value || 'Customer';
    var email = $('#user-email').value || '';
    var phone = $('#user-phone').value ? $('#country-code').value + $('#user-phone').value : 'Not provided';
    var inv   = state.inverter;
    var bat   = state.battery;
    var w     = inv.watts ? ' (' + inv.watts + 'W)' : '';
    var invTxt = state.company + ' ' + inv.kva + 'kVA' + w + ' \u2013 ' + inv.voltage + 'V';
    var total  = $('#total-cost').textContent;
    var noSolar = getNoSolarBreakdown();
    return { name: name, email: email, phone: phone, invTxt: invTxt, total: total, bat: bat, inv: inv, noSolar: noSolar };
}

function shareSummary() {
    if (!validateForm()) return;
    var d = buildText();
    var subj = encodeURIComponent('Sangyug Solar Quote for ' + d.name);
    var body = encodeURIComponent(
        'Solar System Quote for ' + d.name + '\n\n' +
        'Email: ' + d.email + '\n' +
        'Phone: ' + d.phone + '\n\n' +
        'INVERTER\n' +
        'Model: ' + d.invTxt + '\n' +
        'Price: ' + fmt(d.inv.price) + ' Ksh\n' +
        'Installation (+VAT): ' + fmt(d.inv.labour) + ' Ksh\n\n' +
        'BATTERY\n' +
        'Type: ' + d.bat.name + ' \u00d7' + d.bat.count + '\n' +
        'Price: ' + fmt(d.bat.price * d.bat.count) + ' Ksh\n' +
        'Backup: ~' + (d.bat.backupHours * d.bat.count).toFixed(1) + ' hrs (200 W load)\n\n' +
        'SOLAR PANELS\n' +
        'Quantity: ' + state.panels + ' panels\n' +
        'Price: ' + fmt(state.panels * PANEL_PRICE) + ' Ksh\n\n' +
        'ACCESSORIES\n' +
        'Included: ' + fmt(getAccessoryCost()) + ' Ksh\n\n' +
        'TOTAL: ' + d.total + '\n\n' +
        'WITHOUT SOLAR PANELS OPTION\n' +
        'Inverter: ' + fmt(d.noSolar.inverter) + ' Ksh\n' +
        'Batteries: ' + fmt(d.noSolar.battery) + ' Ksh\n' +
        'Change Over Switch: ' + fmt(d.noSolar.changeOver) + ' Ksh\n' +
        'AC Cable: ' + fmt(d.noSolar.acCable) + ' Ksh\n' +
        'Installation & Labour: ' + fmt(d.noSolar.labour) + ' Ksh\n' +
        'Total Without Solar Panels: ' + fmt(d.noSolar.total) + ' KSH\n\n' +
        'Quote includes solar mounting/structure.\n' +
        'Final pricing confirmed after site survey.\n\n' +
        'Contact: +254723984559 | info@sangyug.com\n' +
        'Thank you for choosing Sangyug Solar!'
    );
    window.open('mailto:?subject=' + subj + '&body=' + body, '_blank');
    toast('Opening email client\u2026', 'info');
}

function shareWhatsApp() {
    if (!validateForm()) return;
    var d = buildText();
    var txt = encodeURIComponent(
        '*Solar System Quote for ' + d.name + '*\n\n' +
        'Email: ' + d.email + '\n' +
        'Phone: ' + d.phone + '\n\n' +
        '*INVERTER*\n' +
        'Model: ' + d.invTxt + '\n' +
        'Price: ' + fmt(d.inv.price) + ' Ksh\n' +
        'Installation (+VAT): ' + fmt(d.inv.labour) + ' Ksh\n\n' +
        '*BATTERY*\n' +
        'Type: ' + d.bat.name + ' \u00d7' + d.bat.count + '\n' +
        'Price: ' + fmt(d.bat.price * d.bat.count) + ' Ksh\n' +
        'Backup: ~' + (d.bat.backupHours * d.bat.count).toFixed(1) + ' hrs (200 W load)\n\n' +
        '*SOLAR PANELS*\n' +
        'Quantity: ' + state.panels + ' panels\n' +
        'Price: ' + fmt(state.panels * PANEL_PRICE) + ' Ksh\n\n' +
        '*ACCESSORIES*\n' +
        'Included: ' + fmt(getAccessoryCost()) + ' Ksh\n\n' +
        '*TOTAL: ' + d.total + '*\n\n' +
        'Quote includes solar mounting/structure.\n' +
        'Final pricing confirmed after site survey.\n\n' +
        'Contact: +254723984559 | info@sangyug.com\n' +
        'Thank you for choosing Sangyug Solar!'
    );
    window.open('https://wa.me/?text=' + txt, '_blank');
    toast('Opening WhatsApp\u2026', 'success');
}

function downloadPDF() {
    if (!validateForm()) return;
    if (!window.jspdf) { toast('PDF library still loading. Try again in a moment.', 'warning'); return; }

    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF();
    var blue = [30, 120, 220];
    var dark = [40, 40, 40];
    var gray = [100, 100, 100];
    var y = 20;
    var d = buildText();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22); doc.setTextColor(blue[0], blue[1], blue[2]);
    doc.text('SANGYUG SOLAR', 105, y, { align: 'center' }); y += 8;
    doc.setFontSize(11); doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text('SYSTEM QUOTATION', 105, y, { align: 'center' }); y += 6;
    doc.setDrawColor(blue[0], blue[1], blue[2]); doc.setLineWidth(0.8);
    doc.line(15, y, 195, y); y += 14;

    doc.setFontSize(10); doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('PREPARED FOR', 20, y); y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text('Name: ' + d.name, 20, y); y += 5;
    doc.text('Email: ' + d.email, 20, y); y += 5;
    doc.text('Phone: ' + d.phone, 20, y);
    doc.text('Date: ' + new Date().toLocaleDateString('en-GB'), 150, y - 10); y += 12;

    doc.setDrawColor(230, 230, 230); doc.setLineWidth(0.3); doc.line(20, y, 190, y); y += 8;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.setTextColor(blue[0], blue[1], blue[2]);
    doc.text('SYSTEM BREAKDOWN', 20, y); y += 10;

    doc.setFillColor(240, 245, 255);
    doc.rect(20, y - 4, 170, 8, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.text('Item', 22, y);
    doc.text('Amount (Ksh)', 168, y, { align: 'right' }); y += 10;

    doc.setFont('helvetica', 'normal');
    var inv = state.inverter;
    var bat = state.battery;
    var w = inv.watts ? ' (' + inv.watts + 'W)' : '';

    var pdfRows = [
        ['Inverter: ' + state.company + ' ' + inv.kva + 'kVA' + w + ' \u2013 ' + inv.voltage + 'V', fmt(inv.price)],
        ['Installation & Labour (+VAT)', fmt(inv.labour)],
        ['Batteries: ' + bat.name + ' \u00d7 ' + bat.count, fmt(bat.price * bat.count)],
        ['Solar Panels: ' + state.panels + ' \u00d7 600W', fmt(state.panels * PANEL_PRICE)],
        ['Accessories (included)', fmt(getAccessoryCost())]
    ];

    pdfRows.forEach(function(r, i) {
        if (i % 2 === 1) { doc.setFillColor(248, 248, 252); doc.rect(20, y - 4, 170, 8, 'F'); }
        doc.text(r[0], 22, y);
        doc.text(r[1], 168, y, { align: 'right' }); y += 8;
    });

    y += 4;
    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.rect(20, y - 5, 170, 12, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL ESTIMATED COST', 22, y + 2);
    doc.text(d.total, 168, y + 2, { align: 'right' }); y += 20;

    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.setTextColor(blue[0], blue[1], blue[2]);
    doc.text('WITHOUT SOLAR PANELS OPTION', 20, y); y += 8;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.setTextColor(dark[0], dark[1], dark[2]);
    var noSolar = d.noSolar;
    var noSolarRows = [
        ['Inverter', fmt(noSolar.inverter)],
        ['Batteries', fmt(noSolar.battery)],
        ['Change Over Switch', fmt(noSolar.changeOver)],
        ['AC Cable', fmt(noSolar.acCable)],
        ['Installation & Labour', fmt(noSolar.labour)]
    ];
    noSolarRows.forEach(function(r, i) {
        if (i % 2 === 1) { doc.setFillColor(248, 248, 252); doc.rect(20, y - 4, 170, 8, 'F'); }
        doc.text(r[0], 22, y);
        doc.text(r[1], 168, y, { align: 'right' }); y += 8;
    });

    doc.setFillColor(220, 235, 255);
    doc.rect(20, y - 4, 170, 9, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.setTextColor(blue[0], blue[1], blue[2]);
    doc.text('Total Without Solar Panels', 22, y + 2);
    doc.text(fmt(noSolar.total) + ' KSH', 168, y + 2, { align: 'right' });
    y += 14;

    if (state.panels > 0) {
        doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
        doc.setTextColor(blue[0], blue[1], blue[2]);
        doc.text('ENVIRONMENTAL IMPACT', 20, y); y += 8;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
        doc.setTextColor(dark[0], dark[1], dark[2]);
        var impact = calcImpact();
        doc.text('Energy Production: ' + fmt(impact.kwh) + ' kWh/year', 22, y); y += 6;
        doc.text('CO2 Reduction: ' + fmt(impact.co2) + ' kg/year', 22, y); y += 6;
        doc.text('Equivalent to planting ' + fmt(impact.trees) + ' trees per year', 22, y); y += 14;
    }

    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.setTextColor(blue[0], blue[1], blue[2]);
    doc.text('IMPORTANT NOTES', 20, y); y += 8;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.text('1. Quote includes solar mounting structure and all listed accessories.', 22, y); y += 6;
    doc.text('2. Final pricing confirmed after site survey by our technical team.', 22, y); y += 6;
    doc.text('3. Installation typically completed within 2\u20135 business days.', 22, y); y += 16;

    doc.setDrawColor(blue[0], blue[1], blue[2]); doc.setLineWidth(0.5);
    doc.line(15, y, 195, y); y += 8;
    doc.setFontSize(9); doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text('Thank you for choosing Sangyug Solar!', 105, y, { align: 'center' }); y += 5;
    doc.text('+254 723 984 559 | info@sangyug.com | www.sangyug.com', 105, y, { align: 'center' }); y += 5;
    doc.text('The Big Bang \u2014 Ngara, Opp. Rainbow Plaza, Nairobi', 105, y, { align: 'center' });

    var safeName = d.name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
    doc.save('Sangyug_Solar_Quote_' + safeName + '_' + new Date().toISOString().slice(0, 10) + '.pdf');
    toast('PDF downloaded', 'success');
}

/* ---------- reset ---------- */
function resetAll() {
    state.company = ''; state.inverter = null; state.battery = null;
    state.panels = 0; state.compareList = [];
    clearState();
    var fields = ['user-name', 'user-email', 'user-phone'];
    fields.forEach(function(id) { var el = $('#' + id); if (el) el.value = ''; });
    var errors = ['name-error', 'email-error', 'phone-error'];
    errors.forEach(function(id) { var el = $('#' + id); if (el) el.textContent = ''; });
    var billInput = $('#monthly-bill');
    if (billInput) billInput.value = '';
    var savingsResults = $('#savings-results');
    if (savingsResults) savingsResults.classList.add('hidden');
    renderCompanies();
    goTo('company');
    toast('Starting fresh', 'info');
}

/* ---------- ambient canvas ---------- */
function initCanvas() {
    var c = document.getElementById('ambient-canvas');
    if (!c) return;
    var ctx = c.getContext('2d');
    var w, h;
    var particles = [];

    function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * (w || 1000), y: Math.random() * (h || 800),
            r: 1 + Math.random() * 2.5,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            o: 0.15 + Math.random() * 0.35
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (var j = 0; j < particles.length; j++) {
            var p = particles[j];
            p.x += p.dx; p.y += p.dy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'hsla(210,80%,70%,' + p.o + ')';
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }
    draw();
}

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', function() {
    pricingState.usdToKesAdjusted = getAdjustedUsdToKes(pricingState.usdToKesRaw);
    applyExchangeRatePricing();

    initCanvas();
    renderFxRatePill();
    renderAccessoryStaticPrices();
    renderCompanies();
    renderNeeds();
    initSavingsCalc();

    // Restore saved state
    try {
        var saved = localStorage.getItem('solarState');
        if (saved) {
            var s = JSON.parse(saved);
            Object.assign(state, s);
            if (state.battery) calcPanels();
        }
    } catch (e) { /* ignore corrupt state */ }

    // Startup navigation: hash takes priority, then saved step; both are access-checked
    var hash = location.hash.slice(1);
    var requestedStep = (hash && STEPS.indexOf(hash) !== -1) ? hash : (state.step || 'company');
    goTo(requestedStep);

    refreshExchangeRateAndPricing();

    // Back buttons
    $('#back-from-inverter').addEventListener('click', goBack);
    $('#back-from-battery').addEventListener('click', goBack);
    $('#back-from-summary').addEventListener('click', goBack);

    // Step pills
    $$('.step-pill').forEach(function(p) {
        p.addEventListener('click', function() {
            goTo(p.dataset.step);
        });
    });

    // Needs toggle
    var needsToggle = $('#needs-toggle');
    var needsPanel = $('#needs-panel');
    if (needsToggle && needsPanel) {
        needsToggle.addEventListener('click', function() {
            needsPanel.classList.toggle('open');
            needsToggle.classList.toggle('open');
        });
    }

    // CTA buttons
    $('#share-summary').addEventListener('click', shareSummary);
    $('#share-whatsapp').addEventListener('click', shareWhatsApp);
    $('#download-pdf').addEventListener('click', downloadPDF);
    $('#reset-selection').addEventListener('click', resetAll);

    // Comparison
    var compareBtn = $('#compare-btn');
    if (compareBtn) compareBtn.addEventListener('click', showComparison);
    var compareClear = $('#compare-clear');
    if (compareClear) compareClear.addEventListener('click', function() {
        state.compareList = [];
        $$('.compare-check input').forEach(function(cb) { cb.checked = false; });
        updateCompareBar();
    });

    // Modals
    $$('.overlay-close').forEach(function(btn) {
        btn.addEventListener('click', function() { closeModal(btn.closest('.overlay')); });
    });
    $$('.overlay').forEach(function(m) {
        m.addEventListener('click', function(e) { if (e.target === m) closeModal(m); });
    });

    // Financing buttons
    $$('.fin-opt').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var months = btn.dataset.months;
            toast('Contact us at +254 723 984 559 for ' + months + '-month payment plans', 'info', 4000);
        });
    });

    // Scroll to top
    var fab = $('#scroll-to-top');
    window.addEventListener('scroll', function() { fab.classList.toggle('visible', window.scrollY > 300); });
    fab.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // Brand home reset
    $('#brand-home').addEventListener('click', function(e) { e.preventDefault(); resetAll(); });

    // Live form validation
    $('#user-name').addEventListener('input', function() {
        $('#name-error').textContent = this.value.trim() ? '' : 'Name is required';
    });
    $('#user-email').addEventListener('input', function() {
        var v = this.value.trim();
        $('#email-error').textContent = !v ? 'Email is required' : !validateEmail(v) ? 'Enter a valid email' : '';
    });
    var phoneCheck = function() {
        var cc = $('#country-code');
        var pLen = parseInt(cc.options[cc.selectedIndex].dataset.length);
        var v = $('#user-phone').value.trim();
        $('#phone-error').textContent = v && !validatePhone(v, pLen) ? 'Must be ' + pLen + ' digits' : '';
    };
    $('#user-phone').addEventListener('input', phoneCheck);
    $('#country-code').addEventListener('change', phoneCheck);

    // Escape closes modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            $$('.overlay:not(.hidden)').forEach(function(m) { closeModal(m); });
        }
    });
});
