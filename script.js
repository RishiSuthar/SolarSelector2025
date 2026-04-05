/* ===================================================
   SANGYUG SOLAR SELECTOR v4 — Guided + Custom Builder
   =================================================== */

/* ---------- state ---------- */
const state = {
    mode: '',          // 'guided' or 'custom'
    phase: '',
    company: '',
    inverter: null,
    battery: null,
    panels: 0,
    panelType: null,
    step: 'landing',
    needs: {},
    totalWatts: 0,
    compareList: [],
    atessMasterCount: 3,
    // guided mode state
    guidedSpace: 'home',
    guidedAppliances: {},    // { applianceId: [ { variantIdx: 0, qty: 1 }, ... ] }
    guidedCustomDevices: [],  // [ { name, watts, qty } ]
    guidedRunningWatts: 0,
    guidedPeakWatts: 0,
    guidedCatIdx: 0
};

const pricingState = {
    usdToKesRaw: 130,
    usdToKesAdjusted: 132,
    source: 'fallback',
    lastUpdated: null
};

/* ---------- appliances (legacy — kept for custom mode needs assessment) ---------- */
const APPLIANCES = [
    { id: 'bulbs', name: 'LED Lights (×10)', watts: 100, icon: 'fa-lightbulb' },
    { id: 'tv', name: 'Television', watts: 120, icon: 'fa-tv' },
    { id: 'fridge', name: 'Fridge', watts: 150, icon: 'fa-temperature-low' },
    { id: 'fan', name: 'Fans (×2)', watts: 150, icon: 'fa-fan' },
    { id: 'laptop', name: 'Laptop', watts: 65, icon: 'fa-laptop' },
    { id: 'router', name: 'WiFi Router', watts: 15, icon: 'fa-wifi' },
    { id: 'phone', name: 'Phone Charging', watts: 25, icon: 'fa-mobile-screen' },
    { id: 'micro', name: 'Microwave', watts: 1200, icon: 'fa-fire' },
    { id: 'iron', name: 'Iron', watts: 1000, icon: 'fa-shirt' },
    { id: 'washer', name: 'Washing Machine', watts: 500, icon: 'fa-soap' },
    { id: 'pump', name: 'Water Pump', watts: 1000, icon: 'fa-faucet' },
    { id: 'blender', name: 'Blender', watts: 400, icon: 'fa-blender' }
];

/* ---------- rich appliance database (guided mode) ---------- */
const APPLIANCE_CATEGORIES = [
    { id: 'lighting', name: 'Lighting', icon: 'fa-lightbulb',
      greeting: 'Lighting',
      subtext: 'Most homes have 5–15 bulbs. LEDs are the cheapest to run — don\'t forget outdoor lights.' },
    { id: 'entertainment', name: 'Entertainment', icon: 'fa-tv',
      greeting: 'Entertainment',
      subtext: 'TVs are relatively light on power. A 43" TV uses less than a single light bulb used to.' },
    { id: 'kitchen', name: 'Kitchen', icon: 'fa-utensils',
      greeting: 'Kitchen',
      subtext: 'Your fridge runs 24/7 — it\'s usually your biggest kitchen draw. Kettles and cookers are power-hungry but used briefly.' },
    { id: 'cooling', name: 'Cooling & Heating', icon: 'fa-fan',
      greeting: 'Cooling & Heating',
      subtext: 'ACs need 3-4x their rated watts to start up. This heavily affects which inverter you need.' },
    { id: 'laundry', name: 'Laundry', icon: 'fa-soap',
      greeting: 'Laundry',
      subtext: 'Washing machines have a motor surge on startup. Irons are heavy but used in short sessions.' },
    { id: 'office', name: 'Office & Tech', icon: 'fa-laptop',
      greeting: 'Office & Tech',
      subtext: 'Laptops are very efficient. Desktops draw more. Don\'t forget your router — it runs all day.' },
    { id: 'water', name: 'Water & Pumps', icon: 'fa-faucet',
      greeting: 'Water & Pumps',
      subtext: 'Pumps need 3x power to start and can push you into a bigger inverter. Instant water heaters are rarely practical on solar.' },
    { id: 'security', name: 'Security', icon: 'fa-shield-halved',
      greeting: 'Security',
      subtext: 'CCTV and alarms are low-power but run 24/7. Good candidates for solar backup.' },
    { id: 'other', name: 'Other', icon: 'fa-plug',
      greeting: 'Other Devices',
      subtext: 'Anything we missed? You can add custom devices with their wattage below.' }
];

const RICH_APPLIANCES = [
    // LIGHTING
    {
        id: 'led-bulb', name: 'LED Bulb', category: 'lighting', icon: 'fa-lightbulb',
        desc: 'Energy-efficient LED light',
        variants: [
            { label: '7W LED', watts: 7, startMultiplier: 1 },
            { label: '10W LED', watts: 10, startMultiplier: 1 },
            { label: '15W LED', watts: 15, startMultiplier: 1 },
            { label: '20W LED', watts: 20, startMultiplier: 1 }
        ],
        maxQty: 50, defaultQty: 5, spaces: ['home', 'office', 'commercial'],
        popular: true
    },
    {
        id: 'fluorescent', name: 'Fluorescent Tube', category: 'lighting', icon: 'fa-lightbulb',
        desc: 'Standard fluorescent tube light',
        variants: [
            { label: '18W (2ft)', watts: 18, startMultiplier: 1.5 },
            { label: '36W (4ft)', watts: 36, startMultiplier: 1.5 },
            { label: '58W (5ft)', watts: 58, startMultiplier: 1.5 }
        ],
        maxQty: 30, defaultQty: 2, spaces: ['office', 'commercial']
    },
    {
        id: 'spotlight', name: 'Spotlight / Downlight', category: 'lighting', icon: 'fa-sun',
        desc: 'Recessed or surface-mount spotlight',
        variants: [
            { label: '5W LED Spot', watts: 5, startMultiplier: 1 },
            { label: '10W LED Spot', watts: 10, startMultiplier: 1 },
            { label: '20W LED Flood', watts: 20, startMultiplier: 1 }
        ],
        maxQty: 20, defaultQty: 4, spaces: ['home', 'office', 'commercial']
    },
    // ENTERTAINMENT
    {
        id: 'tv', name: 'Television', category: 'entertainment', icon: 'fa-tv',
        desc: 'Flat screen TV — power depends on size',
        variants: [
            { label: '24" – 32" (Small)', watts: 40, startMultiplier: 1 },
            { label: '40" – 43" (Medium)', watts: 70, startMultiplier: 1 },
            { label: '50" – 55" (Large)', watts: 110, startMultiplier: 1 },
            { label: '65" (Extra Large)', watts: 150, startMultiplier: 1 },
            { label: '75" – 85" (Premium)', watts: 200, startMultiplier: 1 },
            { label: '85"+ (Massive)', watts: 280, startMultiplier: 1 }
        ],
        maxQty: 5, defaultQty: 1, spaces: ['home', 'office', 'commercial'],
        popular: true
    },
    {
        id: 'decoder', name: 'Decoder / Set-Top Box', category: 'entertainment', icon: 'fa-satellite-dish',
        desc: 'DStv, StarTimes, Zuku etc.',
        variants: [
            { label: 'Standard Decoder', watts: 25, startMultiplier: 1 },
            { label: 'HD / PVR Decoder', watts: 40, startMultiplier: 1 }
        ],
        maxQty: 3, defaultQty: 1, spaces: ['home']
    },
    {
        id: 'sound-system', name: 'Sound System', category: 'entertainment', icon: 'fa-volume-high',
        desc: 'Speakers, soundbar, or home theatre',
        variants: [
            { label: 'Soundbar', watts: 50, startMultiplier: 1 },
            { label: 'Bookshelf Speakers', watts: 80, startMultiplier: 1 },
            { label: 'Home Theatre System', watts: 200, startMultiplier: 1 },
            { label: 'PA / DJ System', watts: 500, startMultiplier: 1 }
        ],
        maxQty: 3, defaultQty: 1, spaces: ['home', 'commercial']
    },
    {
        id: 'gaming', name: 'Gaming Console', category: 'entertainment', icon: 'fa-gamepad',
        desc: 'PlayStation, Xbox, Nintendo',
        variants: [
            { label: 'Nintendo Switch', watts: 40, startMultiplier: 1 },
            { label: 'PlayStation / Xbox', watts: 200, startMultiplier: 1 }
        ],
        maxQty: 2, defaultQty: 1, spaces: ['home']
    },
    // KITCHEN
    {
        id: 'fridge', name: 'Refrigerator', category: 'kitchen', icon: 'fa-temperature-low',
        desc: 'Running watts + high starting surge',
        variants: [
            { label: 'Bar Fridge (90L)', watts: 80, startMultiplier: 3 },
            { label: 'Single Door (180–250L)', watts: 150, startMultiplier: 3 },
            { label: 'Double Door (300–450L)', watts: 200, startMultiplier: 3 },
            { label: 'Side-by-Side (500L+)', watts: 300, startMultiplier: 3.5 },
            { label: 'Chest Freezer', watts: 200, startMultiplier: 3.5 }
        ],
        maxQty: 3, defaultQty: 1, spaces: ['home', 'office', 'commercial'],
        note: 'Fridges draw 3–4× watts on startup',
        popular: true
    },
    {
        id: 'microwave', name: 'Microwave', category: 'kitchen', icon: 'fa-fire',
        desc: 'Countertop microwave oven',
        variants: [
            { label: 'Small (700W)', watts: 700, startMultiplier: 1 },
            { label: 'Medium (900W)', watts: 900, startMultiplier: 1 },
            { label: 'Large (1200W)', watts: 1200, startMultiplier: 1 }
        ],
        maxQty: 2, defaultQty: 1, spaces: ['home', 'office', 'commercial'],
        note: 'Heavy draw — best used in short bursts'
    },
    {
        id: 'kettle', name: 'Electric Kettle', category: 'kitchen', icon: 'fa-mug-hot',
        desc: 'Boils water quickly — very high wattage',
        variants: [
            { label: 'Small (1500W)', watts: 1500, startMultiplier: 1 },
            { label: 'Standard (2000W)', watts: 2000, startMultiplier: 1 },
            { label: 'Large (3000W)', watts: 3000, startMultiplier: 1 }
        ],
        maxQty: 2, defaultQty: 1, spaces: ['home', 'office', 'commercial'],
        note: 'Very heavy draw — use briefly'
    },
    {
        id: 'blender', name: 'Blender / Mixer', category: 'kitchen', icon: 'fa-blender',
        desc: 'Blender, food processor, or mixer',
        variants: [
            { label: 'Small Blender (300W)', watts: 300, startMultiplier: 2 },
            { label: 'Standard Blender (500W)', watts: 500, startMultiplier: 2 },
            { label: 'Heavy-Duty / Nutribullet (900W)', watts: 900, startMultiplier: 2 },
            { label: 'Food Processor (600W)', watts: 600, startMultiplier: 2 }
        ],
        maxQty: 2, defaultQty: 1, spaces: ['home', 'commercial']
    },
    {
        id: 'toaster', name: 'Toaster / Sandwich Maker', category: 'kitchen', icon: 'fa-bread-slice',
        desc: 'Bread toaster or sandwich press',
        variants: [
            { label: '2-Slice Toaster (800W)', watts: 800, startMultiplier: 1 },
            { label: '4-Slice Toaster (1400W)', watts: 1400, startMultiplier: 1 },
            { label: 'Sandwich Maker (700W)', watts: 700, startMultiplier: 1 }
        ],
        maxQty: 2, defaultQty: 1, spaces: ['home', 'office']
    },
    {
        id: 'cooker', name: 'Electric Cooker / Hotplate', category: 'kitchen', icon: 'fa-fire-burner',
        desc: 'Single or double hotplate',
        variants: [
            { label: 'Single Hotplate (1000W)', watts: 1000, startMultiplier: 1 },
            { label: 'Double Hotplate (2000W)', watts: 2000, startMultiplier: 1 },
            { label: 'Induction Cooker (1800W)', watts: 1800, startMultiplier: 1 }
        ],
        maxQty: 2, defaultQty: 1, spaces: ['home', 'commercial'],
        note: 'Very heavy draw'
    },
    // COOLING & HEATING
    {
        id: 'fan', name: 'Fan', category: 'cooling', icon: 'fa-fan',
        desc: 'Standing, ceiling, or desk fan',
        variants: [
            { label: 'Desk Fan (35W)', watts: 35, startMultiplier: 1.5 },
            { label: 'Standing Fan (55W)', watts: 55, startMultiplier: 1.5 },
            { label: 'Ceiling Fan (75W)', watts: 75, startMultiplier: 2 },
            { label: 'Industrial Fan (150W)', watts: 150, startMultiplier: 2 }
        ],
        maxQty: 10, defaultQty: 2, spaces: ['home', 'office', 'commercial'],
        popular: true
    },
    {
        id: 'ac', name: 'Air Conditioner', category: 'cooling', icon: 'fa-snowflake',
        desc: 'Split-unit AC — heavy starting surge',
        variants: [
            { label: '9000 BTU / 1HP (900W)', watts: 900, startMultiplier: 3.5 },
            { label: '12000 BTU / 1.5HP (1200W)', watts: 1200, startMultiplier: 3.5 },
            { label: '18000 BTU / 2HP (1800W)', watts: 1800, startMultiplier: 3.5 },
            { label: '24000 BTU / 3HP (2500W)', watts: 2500, startMultiplier: 3.5 }
        ],
        maxQty: 5, defaultQty: 1, spaces: ['home', 'office', 'commercial'],
        note: 'ACs require 3–4× wattage to start. Needs a powerful inverter.'
    },
    {
        id: 'heater', name: 'Space Heater', category: 'cooling', icon: 'fa-temperature-arrow-up',
        desc: 'Electric room heater',
        variants: [
            { label: 'Small (800W)', watts: 800, startMultiplier: 1 },
            { label: 'Medium (1500W)', watts: 1500, startMultiplier: 1 },
            { label: 'Large (2000W)', watts: 2000, startMultiplier: 1 }
        ],
        maxQty: 3, defaultQty: 1, spaces: ['home', 'office']
    },
    // LAUNDRY
    {
        id: 'washer', name: 'Washing Machine', category: 'laundry', icon: 'fa-soap',
        desc: 'Top-load or front-load washer',
        variants: [
            { label: 'Top Load (400W)', watts: 400, startMultiplier: 2.5 },
            { label: 'Front Load (500W)', watts: 500, startMultiplier: 2.5 },
            { label: 'Twin Tub (350W)', watts: 350, startMultiplier: 2 }
        ],
        maxQty: 2, defaultQty: 1, spaces: ['home', 'commercial'],
        note: 'Motor draw is higher on startup'
    },
    {
        id: 'iron', name: 'Iron', category: 'laundry', icon: 'fa-shirt',
        desc: 'Clothes iron — dry or steam',
        variants: [
            { label: 'Dry Iron (1000W)', watts: 1000, startMultiplier: 1 },
            { label: 'Steam Iron (1400W)', watts: 1400, startMultiplier: 1 },
            { label: 'Heavy Steam Iron (2000W)', watts: 2000, startMultiplier: 1 }
        ],
        maxQty: 2, defaultQty: 1, spaces: ['home', 'commercial']
    },
    {
        id: 'dryer', name: 'Hair Dryer', category: 'laundry', icon: 'fa-wind',
        desc: 'Hair dryer / blow dryer',
        variants: [
            { label: 'Travel (800W)', watts: 800, startMultiplier: 1 },
            { label: 'Standard (1500W)', watts: 1500, startMultiplier: 1 },
            { label: 'Professional (2200W)', watts: 2200, startMultiplier: 1 }
        ],
        maxQty: 2, defaultQty: 1, spaces: ['home', 'commercial']
    },
    // OFFICE & TECH
    {
        id: 'laptop', name: 'Laptop', category: 'office', icon: 'fa-laptop',
        desc: 'Laptop computer with charger',
        variants: [
            { label: 'Ultrabook / Light (45W)', watts: 45, startMultiplier: 1 },
            { label: 'Standard Laptop (65W)', watts: 65, startMultiplier: 1 },
            { label: 'Gaming / Workstation (120W)', watts: 120, startMultiplier: 1 },
            { label: 'Heavy Gaming (200W)', watts: 200, startMultiplier: 1 }
        ],
        maxQty: 10, defaultQty: 1, spaces: ['home', 'office', 'commercial'],
        popular: true
    },
    {
        id: 'desktop', name: 'Desktop Computer', category: 'office', icon: 'fa-desktop',
        desc: 'Desktop PC + monitor',
        variants: [
            { label: 'Basic PC + Monitor (200W)', watts: 200, startMultiplier: 1 },
            { label: 'Office PC + Monitor (300W)', watts: 300, startMultiplier: 1 },
            { label: 'Gaming PC + Monitor (500W)', watts: 500, startMultiplier: 1 }
        ],
        maxQty: 10, defaultQty: 1, spaces: ['home', 'office', 'commercial']
    },
    {
        id: 'printer', name: 'Printer', category: 'office', icon: 'fa-print',
        desc: 'Inkjet or laser printer',
        variants: [
            { label: 'Inkjet (30W)', watts: 30, startMultiplier: 1 },
            { label: 'Laser Printer (500W)', watts: 500, startMultiplier: 2 },
            { label: 'Large Format / Copier (1200W)', watts: 1200, startMultiplier: 2 }
        ],
        maxQty: 5, defaultQty: 1, spaces: ['office', 'commercial']
    },
    {
        id: 'router', name: 'WiFi Router / Switch', category: 'office', icon: 'fa-wifi',
        desc: 'Internet router or network switch',
        variants: [
            { label: 'Home Router (12W)', watts: 12, startMultiplier: 1 },
            { label: 'Dual-Band Router (18W)', watts: 18, startMultiplier: 1 },
            { label: 'Enterprise Router / Switch (30W)', watts: 30, startMultiplier: 1 }
        ],
        maxQty: 5, defaultQty: 1, spaces: ['home', 'office', 'commercial'],
        popular: true
    },
    {
        id: 'phone-charge', name: 'Phone Charger', category: 'office', icon: 'fa-mobile-screen',
        desc: 'Smartphone charging',
        variants: [
            { label: 'Standard (10W)', watts: 10, startMultiplier: 1 },
            { label: 'Fast Charger (25W)', watts: 25, startMultiplier: 1 },
            { label: 'Super Fast (45W)', watts: 45, startMultiplier: 1 }
        ],
        maxQty: 20, defaultQty: 3, spaces: ['home', 'office', 'commercial'],
        popular: true
    },
    {
        id: 'projector', name: 'Projector', category: 'office', icon: 'fa-chalkboard',
        desc: 'Presentation or home theatre projector',
        variants: [
            { label: 'Mini / Portable (50W)', watts: 50, startMultiplier: 1 },
            { label: 'Standard (200W)', watts: 200, startMultiplier: 1 },
            { label: 'Professional (350W)', watts: 350, startMultiplier: 1 }
        ],
        maxQty: 3, defaultQty: 1, spaces: ['home', 'office', 'commercial']
    },
    // WATER & PUMPS
    {
        id: 'pump', name: 'Water Pump', category: 'water', icon: 'fa-faucet',
        desc: 'Booster or borehole pump',
        variants: [
            { label: '0.5 HP (370W)', watts: 370, startMultiplier: 3 },
            { label: '1 HP (750W)', watts: 750, startMultiplier: 3 },
            { label: '1.5 HP (1100W)', watts: 1100, startMultiplier: 3 },
            { label: '2 HP (1500W)', watts: 1500, startMultiplier: 3 }
        ],
        maxQty: 3, defaultQty: 1, spaces: ['home', 'commercial'],
        note: 'Pumps require 3× wattage to start'
    },
    {
        id: 'water-heater', name: 'Water Heater (Instant)', category: 'water', icon: 'fa-hot-tub-person',
        desc: 'Instant / tankless water heater',
        variants: [
            { label: 'Small (3000W)', watts: 3000, startMultiplier: 1 },
            { label: 'Large (4500W)', watts: 4500, startMultiplier: 1 }
        ],
        maxQty: 2, defaultQty: 1, spaces: ['home', 'commercial'],
        note: 'Extremely heavy draw — often impractical with inverter'
    },
    // SECURITY
    {
        id: 'cctv', name: 'CCTV System', category: 'security', icon: 'fa-video',
        desc: 'Cameras + DVR/NVR',
        variants: [
            { label: '4-Camera + DVR (60W)', watts: 60, startMultiplier: 1 },
            { label: '8-Camera + NVR (100W)', watts: 100, startMultiplier: 1 },
            { label: '16-Camera + NVR (180W)', watts: 180, startMultiplier: 1 }
        ],
        maxQty: 3, defaultQty: 1, spaces: ['home', 'office', 'commercial'],
        popular: true
    },
    {
        id: 'alarm', name: 'Alarm System', category: 'security', icon: 'fa-bell',
        desc: 'Security alarm panel + sensors',
        variants: [
            { label: 'Basic Panel (15W)', watts: 15, startMultiplier: 1 },
            { label: 'Full System (30W)', watts: 30, startMultiplier: 1 }
        ],
        maxQty: 2, defaultQty: 1, spaces: ['home', 'office', 'commercial']
    },
    {
        id: 'electric-fence', name: 'Electric Fence', category: 'security', icon: 'fa-shield-halved',
        desc: 'Perimeter electric fence energizer',
        variants: [
            { label: 'Small Property (20W)', watts: 20, startMultiplier: 1 },
            { label: 'Large Property (50W)', watts: 50, startMultiplier: 1 }
        ],
        maxQty: 2, defaultQty: 1, spaces: ['home', 'commercial']
    },
    // OTHER
    {
        id: 'pos', name: 'POS / Cash Register', category: 'other', icon: 'fa-cash-register',
        desc: 'Point-of-sale terminal',
        variants: [
            { label: 'Tablet POS (30W)', watts: 30, startMultiplier: 1 },
            { label: 'Full POS System (100W)', watts: 100, startMultiplier: 1 }
        ],
        maxQty: 5, defaultQty: 1, spaces: ['commercial']
    },
    {
        id: 'sewing', name: 'Sewing Machine', category: 'other', icon: 'fa-gears',
        desc: 'Electric sewing machine',
        variants: [
            { label: 'Home (100W)', watts: 100, startMultiplier: 2 },
            { label: 'Industrial (400W)', watts: 400, startMultiplier: 2.5 }
        ],
        maxQty: 5, defaultQty: 1, spaces: ['home', 'commercial']
    },
    {
        id: 'vacuum', name: 'Vacuum Cleaner', category: 'other', icon: 'fa-broom',
        desc: 'Upright or handheld vacuum',
        variants: [
            { label: 'Handheld / Stick (200W)', watts: 200, startMultiplier: 1.5 },
            { label: 'Standard Upright (800W)', watts: 800, startMultiplier: 2 },
            { label: 'Heavy-Duty (1400W)', watts: 1400, startMultiplier: 2 }
        ],
        maxQty: 2, defaultQty: 1, spaces: ['home', 'office', 'commercial']
    }
];

/* ---------- panel types ---------- */
const PANEL_180W = {
    watts: 180, usdPrice: 48,
    specsLink: 'https://drive.google.com/file/d/1RJgy3w_LLnalE5Mf1eh13oB0Z1Gi1EIP/view?usp=sharing',
    warranty: '15 years'
};
const PANEL_600W = {
    watts: 600, usdPrice: 88.461538,
    specsLink: 'https://drive.google.com/file/d/14w98znycd4Y4-quOsoSItp4ulKUkpoCv/view?usp=sharing',
    warranty: '15 years'
};
const PANEL_600W_ATESS = {
    watts: 600, usdPrice: 89,
    specsLink: 'https://drive.google.com/file/d/14w98znycd4Y4-quOsoSItp4ulKUkpoCv/view?usp=sharing',
    warranty: '15 years'
};

/* ---------- pricing constants ---------- */
const EXCHANGE_RATE_API_KEY = '13f783aa03f37bceb9f21476';
const USD_PRICES = {
    changeOverSwitch: 38.461538,
    acCable: 24.038462,
    mountingPerPanel: 35,
    accessories: {
        dcMccb: 38.461538,
        avs30Amps: 38.461538
    }
};

/* ---------- product data: single phase Kstar ---------- */
const kstarSingleInverters = [
    /* --- Night Series --- */
    {
        series: 'Night Series', kva: 3.6, voltage: 24, maxWatts: 3600,
        bestFor: 'Medium home (2–3 bedrooms)',
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
        series: 'Night Series', kva: 3.6, voltage: 48, maxWatts: 3600,
        bestFor: 'Medium-large home (3–4 bedrooms)',
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
        series: 'Night Series', kva: 6.0, voltage: 48, maxWatts: 6000,
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
    },
    /* --- Sky Series --- */
    {
        series: 'Sky Series', kva: 1.0, watts: 900, voltage: 12, maxWatts: 900,
        bestFor: 'Small home / Basic lighting',
        usdPrice: 138, usdLabour: 360,
        price: 0, labour: 0,
        img: 'images/kstarskyseries.png',
        specsLink: 'https://drive.google.com/file/d/1pajnFqcUG5AezxWMGE1Ic4lyKYe4NKyK/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 5 }, { name: 'Phone Charging', count: 3 },
            { name: 'Router', count: 1 }, { name: 'Laptop', count: 1 },
            { name: 'TV (up to 40")', count: 1 }
        ],
        details: {
            efficiency: '93%',
            batteryCompatibility: 'Tubular, Maintenance Free',
            features: ['Compact design', 'Pure sine wave output', 'Cold start function', 'Overcurrent protection']
        }
    },
    {
        series: 'Sky Series', kva: 2.0, watts: 1600, voltage: 24, maxWatts: 1600,
        bestFor: '1–2 bedroom apartment',
        usdPrice: 158, usdLabour: 360,
        price: 0, labour: 0,
        img: 'images/kstarskyseries.png',
        specsLink: 'https://drive.google.com/file/d/1pajnFqcUG5AezxWMGE1Ic4lyKYe4NKyK/view?usp=sharing',
        appliances: [
            { name: 'LED Bulbs (10W)', count: 8 }, { name: 'Fan', count: 1 },
            { name: 'Phone Charging', count: 3 }, { name: 'Router', count: 1 },
            { name: 'Laptop', count: 1 }, { name: 'TV (up to 60")', count: 1 },
            { name: 'Fridge (150W)', count: 1 }
        ],
        details: {
            efficiency: '93%',
            batteryCompatibility: 'Tubular, Maintenance Free',
            features: ['Compact design', 'Pure sine wave output', 'Cold start function', 'Overcurrent protection']
        }
    },
    /* --- Residential ESS --- */
    {
        series: 'Residential ESS', kva: 10, model: 'HH10KS', watts: 10000, voltage: 48, maxWatts: 10000,
        bestFor: 'Large home / Premium energy storage',
        usdPrice: 884, usdLabour: 400,
        price: 0, labour: 0,
        img: 'images/kstarresidential.png',
        specsLink: 'https://drive.google.com/file/d/1dBxgMwq7zowUCbcrv9SonuRn3xfDZL6a/view?usp=sharing',
        essBattery: {
            name: 'H-PACK-5.1A',
            usdPrice: 841.50,
            count: 4,
            capacityEach: '5.12KWH',
            totalCapacity: '20.48KWH',
            warranty: '10 years',
            specsLink: 'https://drive.google.com/file/d/1dBxgMwq7zowUCbcrv9SonuRn3xfDZL6a/view?usp=sharing',
            notes: ['5.12KWH lithium battery pack, EVE grade A cell', '6000 times cycle life, 10 years performance warranty', 'Floor stand, Wall attach, Rack mount', 'Up to 8pcs connected in parallel']
        },
        appliances: [
            { name: 'LED Bulbs (10W)', count: 30 }, { name: 'Fans', count: 4 },
            { name: 'Fridge (150W)', count: 2 }, { name: 'TV (up to 100")', count: 3 },
            { name: 'Laptop', count: 3 }, { name: 'Router', count: 1 },
            { name: 'Microwave', count: 1 }, { name: 'Washing Machine', count: 1 },
            { name: 'Water Pump', count: 1 }, { name: 'Phone Charging', count: 5 }
        ],
        details: {
            efficiency: '97%',
            batteryCompatibility: 'H-PACK-5.1A Lithium (included)',
            features: ['10KW 48V hybrid inverter with CT', '4.3 inch touch color screen', '5 years warranty', 'PV voltage 120-500VDC, 2 MPPT', 'Up to 6pcs connected in parallel']
        }
    }
];

/* ---------- product data: single phase Fortuner ---------- */
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
        bestFor: '1–2 bedroom apartment',
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
        bestFor: '2–3 bedroom home',
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

/* ---------- product data: three phase Kstar packages ---------- */
const kstarThreePhasePackages = [
    {
        id: 'e12kt-d22',
        name: '12KW Outdoor System',
        model: 'E12KT-D22',
        watts: 12000,
        bestFor: 'Medium commercial / Large residential',
        usdPackagePrice: 6630,
        packagePrice: 0,
        usdLabour: 700,
        labour: 0,
        img: 'images/kstar12kwoutdoor.png',
        specsLink: 'https://drive.google.com/file/d/1p6HgHgYygmONaS1qNxSOMYtnST8WAqgU/view?usp=sharing',
        panelCount: 25,
        panelUsd: 88.461538,
        inverterNotes: [
            '3-phase 12KW hybrid inverter with CT built-in',
            'Connect with 48V battery, 400VAC',
            '200% DC/AC ratio, 100% unbalanced output',
            'IP66 protection, 10 years warranty',
            'Plug and play, wireless connection',
            'MAX Charge/discharge current 200A/240A',
            'Up to 4pcs in parallel'
        ],
        batteries: {
            name: 'BP48100P1-G2',
            count: 4,
            capacityEach: '5.12KWH',
            totalCapacity: '20.48KWH',
            warranty: '10 years',
            specsLink: 'https://drive.google.com/file/d/1p6HgHgYygmONaS1qNxSOMYtnST8WAqgU/view?usp=sharing',
            notes: ['5.12KWH lithium battery pack, EVE grade A cell', '6000 times cycle life, 10 years performance warranty', 'Stackable design, no wiring required', 'Up to 8pcs in parallel for three phase, IP66 protection']
        }
    },
    {
        id: 'kstar-50kw',
        name: '50KW Commercial System',
        model: '50KW Inverter',
        watts: 50000,
        bestFor: 'Large commercial / Industrial',
        usdPackagePrice: 30000,
        packagePrice: 0,
        usdLabour: 2000,
        labour: 0,
        img: 'images/kstar50kwoutdoor.png',
        specsLink: 'https://drive.google.com/file/d/1BL0VGGz-oEFnJTpK7EMf_yfYzfCYdymt/view?usp=sharing',
        panelCount: 60,
        panelUsd: 88.461538,
        inverterNotes: [
            'Integrated with 75KWp MPPT Charge',
            'Cloud control with 24/7 monitoring',
            'Inverter 5 years warranty'
        ],
        batteries: {
            name: '107KWH CATL Cell Cabinet',
            count: 1,
            capacityEach: '107KWH',
            totalCapacity: '107KWH',
            warranty: '10 years',
            specsLink: 'https://drive.google.com/file/d/1Br2-ss9G3djLK8DT0LMNvgBjfVyQyHXj/view?usp=sharing',
            notes: ['LFP Cabinet PN-1035G0045', '280Ah large capacity', 'Double Fire Suppression System Design', '1+1 Redundancy Design', 'Battery cycle ≥8000, 10 years warranty']
        }
    }
];

/* ---------- product data: three phase ATESS packages ---------- */
const atessThreePhasePackages = [
    {
        id: 'atess-30kw',
        name: '30KW + 30KWH Indoor System',
        subtitle: 'Support work with Digital Generator',
        model: 'HPS30000TL',
        watts: 30000,
        bestFor: 'Large commercial / Industrial',
        usdInverterPrice: 5300,
        inverterPrice: 0,
        usdLabour: 2000,
        labour: 0,
        inverterWarranty: '10 years',
        img: 'images/atess30kw.png',
        specsLink: 'https://drive.google.com/file/d/1NscCT6E6tA1oUVTwkFvkLYvVxUsSPhS3/view?usp=sharing',
        panelCount: 60,
        panelUsd: 89,
        accessories: [
            { name: 'ATS-S (Auto Transfer Switch)', usdPrice: 650, qty: 1, warranty: '3 years', specsLink: 'https://drive.google.com/file/d/1DNHwkw-DQ2CbwWrNnOgpn61k36ZAvQLt/view?usp=sharing' },
            { name: 'MBMS With Screen (E222ZT0112700)', usdPrice: 590, qty: 1, warranty: '3 years', specsLink: 'https://drive.google.com/file/d/1njrux6z0ZGJfMECuQpp93I6Rv_02alIq/view?usp=sharing' },
            { name: 'Master Battery Rack BR30C', usdPrice: 1700, qty: 1, warranty: '1 year' },
            { name: 'Enerlog Monitoring Data Logger', usdPrice: 850, qty: 1, warranty: '1 year', specsLink: 'https://drive.google.com/file/d/1fVoy19wtn806HB2vOKH_rTBbFKiibguY/view?usp=sharing' },
            { name: 'EnerWIFI (WiFi Logger)', usdPrice: 180, qty: 1, warranty: '1 year', specsLink: 'https://drive.google.com/file/d/1s3147FwQGOTXn55oFId-ukMSBu6DtVFE/view?usp=sharing' }
        ],
        battery: {
            name: 'ESS-BM-51.2-100RPB',
            usdPricePerUnit: 820,
            warranty: '10 years',
            specsLink: 'https://drive.google.com/file/d/16DJHPJGiJjE5gkqzzKsJT26x4XIzWb-0/view?usp=sharing',
            configs: [
                { masters: 1, totalUnits: 2, capacity: '10.24KWH' },
                { masters: 2, totalUnits: 4, capacity: '20.48KWH' },
                { masters: 3, totalUnits: 6, capacity: '30.72KWH' }
            ]
        },
        inverterNotes: ['30KW hybrid inverter, indoor unit', '10 year warranty', 'Works with Digital Generator (DG)']
    },
    {
        id: 'atess-20kw',
        name: '20KW + 30KWH Indoor System',
        subtitle: 'Support work with Digital Generator',
        model: 'HPS20000TL',
        watts: 20000,
        bestFor: 'Medium-large commercial',
        usdInverterPrice: 4000,
        inverterPrice: 0,
        usdLabour: 2000,
        labour: 0,
        inverterWarranty: '10 years',
        img: 'images/atess20kw.png',
        specsLink: 'https://drive.google.com/file/d/1BWgGx_P3Y6cWLG1lJi1CjXVev8UCAkuA/view?usp=sharing',
        panelCount: 34,
        panelUsd: 89,
        accessories: [
            { name: 'ATS-S (Auto Transfer Switch)', usdPrice: 650, qty: 1, warranty: '3 years', specsLink: 'https://drive.google.com/file/d/1DNHwkw-DQ2CbwWrNnOgpn61k36ZAvQLt/view?usp=sharing' },
            { name: 'MBMS With Screen (E222ZT0112700)', usdPrice: 590, qty: 1, warranty: '3 years', specsLink: 'https://drive.google.com/file/d/1njrux6z0ZGJfMECuQpp93I6Rv_02alIq/view?usp=sharing' },
            { name: 'Master Battery Rack BR30C', usdPrice: 1700, qty: 1, warranty: '1 year' },
            { name: 'Enerlog Monitoring Data Logger', usdPrice: 850, qty: 1, warranty: '1 year', specsLink: 'https://drive.google.com/file/d/1fVoy19wtn806HB2vOKH_rTBbFKiibguY/view?usp=sharing' },
            { name: 'EnerWIFI (WiFi Logger)', usdPrice: 180, qty: 1, warranty: '1 year', specsLink: 'https://drive.google.com/file/d/1s3147FwQGOTXn55oFId-ukMSBu6DtVFE/view?usp=sharing' }
        ],
        battery: {
            name: 'ESS-BM-51.2-100RPB',
            usdPricePerUnit: 820,
            warranty: '10 years',
            specsLink: 'https://drive.google.com/file/d/16DJHPJGiJjE5gkqzzKsJT26x4XIzWb-0/view?usp=sharing',
            configs: [
                { masters: 1, totalUnits: 2, capacity: '10.24KWH' },
                { masters: 2, totalUnits: 4, capacity: '20.48KWH' },
                { masters: 3, totalUnits: 6, capacity: '30.72KWH' }
            ]
        },
        inverterNotes: ['20KW hybrid inverter, indoor unit', '10 year warranty', 'Works with Digital Generator (DG)']
    },
    {
        id: 'atess-15kw',
        name: '15KW + 30KWH Indoor System',
        subtitle: 'Support work with Digital Generator',
        model: 'HPS15000TL',
        watts: 15000,
        bestFor: 'Small-medium commercial',
        usdInverterPrice: 3660,
        inverterPrice: 0,
        usdLabour: 2000,
        labour: 0,
        inverterWarranty: '10 years',
        img: 'images/atess15kw.png',
        specsLink: 'https://drive.google.com/file/d/1BWgGx_P3Y6cWLG1lJi1CjXVev8UCAkuA/view?usp=sharing',
        panelCount: 26,
        panelUsd: 89,
        accessories: [
            { name: 'ATS-S (Auto Transfer Switch)', usdPrice: 650, qty: 1, warranty: '3 years', specsLink: 'https://drive.google.com/file/d/1DNHwkw-DQ2CbwWrNnOgpn61k36ZAvQLt/view?usp=sharing' },
            { name: 'MBMS With Screen (E222ZT0112700)', usdPrice: 590, qty: 1, warranty: '3 years', specsLink: 'https://drive.google.com/file/d/1njrux6z0ZGJfMECuQpp93I6Rv_02alIq/view?usp=sharing' },
            { name: 'Master Battery Rack BR30C', usdPrice: 1700, qty: 1, warranty: '1 year' },
            { name: 'EnerWIFI (WiFi Logger)', usdPrice: 180, qty: 1, warranty: '1 year', specsLink: 'https://drive.google.com/file/d/1s3147FwQGOTXn55oFId-ukMSBu6DtVFE/view?usp=sharing' }
        ],
        battery: {
            name: 'ESS-BM-51.2-100RPB',
            usdPricePerUnit: 820,
            warranty: '10 years',
            specsLink: 'https://drive.google.com/file/d/16DJHPJGiJjE5gkqzzKsJT26x4XIzWb-0/view?usp=sharing',
            configs: [
                { masters: 1, totalUnits: 2, capacity: '10.24KWH' },
                { masters: 2, totalUnits: 4, capacity: '20.48KWH' },
                { masters: 3, totalUnits: 6, capacity: '30.72KWH' }
            ]
        },
        inverterNotes: ['15KW hybrid inverter, indoor unit', '10 year warranty', 'Works with Digital Generator (DG)']
    }
];

/* ---------- batteries (single phase) ---------- */
const batteries = [
    {
        id: 'tubular', name: 'Tubular 200AH',
        shortDesc: 'Affordable & reliable. Needs topping up every 3–6 months.',
        usdPrice: 173.076923, price: 0,
        img: 'images/battery-200ah-tubular.png',
        specsLink: 'https://drive.google.com/file/d/17stgG0eX-rTGS8QR9KdDVZ08OXjWJH47/view?usp=sharing',
        capacityWh: 2400, dod: 0.8, backupHours: 8.6, warranty: '1 year',
        voltagePerUnit: 12, type: 'lead-acid'
    },
    {
        id: 'mf', name: 'Maintenance Free 200AH',
        shortDesc: 'Sealed & zero maintenance. Great for indoor installation.',
        usdPrice: 280.769231, price: 0,
        img: 'images/battery-200ah-mf.png',
        specsLink: 'https://drive.google.com/file/d/1IiygyBHcx85JLY5W7wFI6gQBflkKHNh9/view?usp=sharing',
        capacityWh: 2400, dod: 0.8, backupHours: 8.6, warranty: '1 year',
        voltagePerUnit: 12, type: 'lead-acid'
    },
    {
        id: 'lithium', name: 'Lithium LFP 51.2V 100Ah',
        shortDesc: 'Premium. 10-year warranty. 90% usable capacity.',
        usdPrice: 923.076923, price: 0,
        img: 'images/battery-100ah-lithium.png',
        specsLink: 'https://drive.google.com/file/d/194rpm8gHCgehwTyFhx35o35G-JwXVgCS/view?usp=sharing',
        capacityWh: 5120, dod: 0.9, backupHours: 20.7, warranty: '10 years',
        voltagePerUnit: 51.2, type: 'lithium'
    }
];

/* ---------- helpers ---------- */
var $ = function(s) { return document.querySelector(s); };
var $$ = function(s) { return document.querySelectorAll(s); };
var fmt = function(n) { return Number(n).toLocaleString(); };

/* ---------- pricing ---------- */
function getAdjustedUsdToKes(rawRate) {
    return Math.round(rawRate) + 2;
}

function usdToKes(usdAmount) {
    return Math.round(usdAmount * pricingState.usdToKesAdjusted);
}

function applyExchangeRatePricing() {
    kstarSingleInverters.forEach(function(inv) {
        inv.price = usdToKes(inv.usdPrice);
        inv.labour = usdToKes(inv.usdLabour);
    });
    fortunerInverters.forEach(function(inv) {
        inv.price = usdToKes(inv.usdPrice);
        inv.labour = usdToKes(inv.usdLabour);
    });
    kstarThreePhasePackages.forEach(function(pkg) {
        pkg.packagePrice = usdToKes(pkg.usdPackagePrice);
        pkg.labour = usdToKes(pkg.usdLabour);
    });
    atessThreePhasePackages.forEach(function(pkg) {
        pkg.inverterPrice = usdToKes(pkg.usdInverterPrice);
        pkg.labour = usdToKes(pkg.usdLabour);
    });
    batteries.forEach(function(bat) {
        bat.price = usdToKes(bat.usdPrice);
    });
}

function getPanelPrice() {
    if (!state.panelType) return usdToKes(PANEL_600W.usdPrice);
    return usdToKes(state.panelType.usdPrice);
}

function getMountingCost() {
    return usdToKes(USD_PRICES.mountingPerPanel) * state.panels;
}

function getSinglePhaseAccessoryCost() {
    var base = usdToKes(USD_PRICES.changeOverSwitch) + usdToKes(USD_PRICES.accessories.dcMccb) + usdToKes(USD_PRICES.accessories.avs30Amps);
    return base + getMountingCost();
}

function getAtessAccessoryCost() {
    if (!state.inverter || !state.inverter.accessories) return 0;
    var total = 0;
    state.inverter.accessories.forEach(function(acc) {
        total += usdToKes(acc.usdPrice) * acc.qty;
    });
    return total;
}

function getAtessBatteryCost() {
    if (!state.inverter || !state.inverter.battery) return 0;
    var cfg = state.inverter.battery.configs[state.atessMasterCount - 1];
    return usdToKes(state.inverter.battery.usdPricePerUnit) * cfg.totalUnits;
}

function getEssBatteryCost() {
    if (!state.inverter || !state.inverter.essBattery) return 0;
    return usdToKes(state.inverter.essBattery.usdPrice) * state.inverter.essBattery.count;
}

function getTotal() {
    if (state.phase === 'three') return getThreePhaseTotal();
    return getSinglePhaseTotal();
}

function getSinglePhaseTotal() {
    if (!state.inverter) return 0;
    var inv = state.inverter;
    var invCost = inv.price;
    var labCost = inv.labour;
    var panCost = state.panels * getPanelPrice();
    var accCost = getSinglePhaseAccessoryCost();

    if (inv.series === 'Residential ESS') {
        var batCost = getEssBatteryCost();
        return invCost + labCost + batCost + panCost + accCost;
    }
    if (!state.battery) return 0;
    var batCost2 = state.battery.price * state.battery.count;
    return invCost + labCost + batCost2 + panCost + accCost;
}

function getThreePhaseTotal() {
    if (!state.inverter) return 0;
    if (state.company === 'Kstar') {
        var pkg = state.inverter;
        return pkg.packagePrice + (state.panels * getPanelPrice()) + getMountingCost() + pkg.labour;
    }
    if (state.company === 'ATESS') {
        var inv = state.inverter;
        return inv.inverterPrice + getAtessAccessoryCost() + getAtessBatteryCost() + (state.panels * getPanelPrice()) + getMountingCost() + inv.labour;
    }
    return 0;
}

function getNoSolarBreakdown() {
    if (!state.inverter || state.phase === 'three') return null;
    if (state.inverter.series === 'Residential ESS') return null;
    if (!state.battery) return null;
    var invCost = state.inverter.price;
    var batCost = state.battery.price * state.battery.count;
    var labourCost = Math.round(state.inverter.labour * 0.6);
    var total = invCost + batCost + usdToKes(USD_PRICES.changeOverSwitch) + usdToKes(USD_PRICES.acCable) + labourCost;
    return { inverter: invCost, battery: batCost, changeOver: usdToKes(USD_PRICES.changeOverSwitch), acCable: usdToKes(USD_PRICES.acCable), labour: labourCost, total: total };
}

function renderAccessoryStaticPrices() {
    var el;
    el = $('#acc-changeover-price');
    if (el) el.textContent = fmt(usdToKes(USD_PRICES.changeOverSwitch)) + ' Ksh';
    el = $('#acc-dc-mccb-price');
    if (el) el.textContent = fmt(usdToKes(USD_PRICES.accessories.dcMccb)) + ' Ksh';
    el = $('#acc-avs-price');
    if (el) el.textContent = fmt(usdToKes(USD_PRICES.accessories.avs30Amps)) + ' Ksh';
}

function getBrandInverterRange(companyName) {
    var data;
    if (state.phase === 'three') {
        if (companyName === 'Kstar') data = kstarThreePhasePackages.map(function(p) { return p.packagePrice; });
        else data = atessThreePhasePackages.map(function(p) { return p.inverterPrice; });
    } else {
        data = (companyName === 'Kstar' ? kstarSingleInverters : fortunerInverters).map(function(inv) { return inv.price; });
    }
    if (!data || !data.length) return '';
    var min = Math.min.apply(null, data);
    var max = Math.max.apply(null, data);
    return 'Systems from KSH ' + fmt(min) + ' – ' + fmt(max);
}

function syncSelectedItemsWithLatestPricing() {
    if (!state.inverter) return;
    if (state.phase === 'three') {
        if (state.company === 'Kstar') {
            var match = kstarThreePhasePackages.find(function(p) { return p.id === state.inverter.id; });
            if (match) state.inverter = match;
        } else if (state.company === 'ATESS') {
            var match2 = atessThreePhasePackages.find(function(p) { return p.id === state.inverter.id; });
            if (match2) state.inverter = match2;
        }
    } else {
        if (state.company === 'Kstar') {
            var match3 = kstarSingleInverters.find(function(inv) { return inv.kva === state.inverter.kva && inv.voltage === state.inverter.voltage && inv.series === state.inverter.series; });
            if (match3) state.inverter = match3;
        } else {
            var match4 = fortunerInverters.find(function(inv) { return inv.kva === state.inverter.kva && inv.voltage === state.inverter.voltage; });
            if (match4) state.inverter = match4;
        }
    }
    if (state.battery && state.battery.id) {
        var br = batteries.find(function(b) { return b.id === state.battery.id; });
        if (br) {
            state.battery.price = br.price;
        }
    }
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
    fxEl.textContent = 'USD/KSH: ' + pricingState.usdToKesRaw.toFixed(2);
    fxEl.classList.toggle('live', pricingState.source !== 'fallback');
}

async function fetchUsdToKesRate() {
    var endpoint = 'https://v6.exchangerate-api.com/v6/' + EXCHANGE_RATE_API_KEY + '/latest/USD';
    var response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error('FX request failed: ' + response.status);
    var data = await response.json();
    var rate = data && data.conversion_rates ? Number(data.conversion_rates.KES) : NaN;
    if (!Number.isFinite(rate) || rate <= 0) throw new Error('Invalid FX rate');
    pricingState.usdToKesRaw = rate;
    pricingState.usdToKesAdjusted = getAdjustedUsdToKes(rate);
    pricingState.source = 'exchangerate-api';
    pricingState.lastUpdated = new Date().toISOString();
}

async function refreshExchangeRateAndPricing() {
    try { await fetchUsdToKesRate(); } catch (e) { pricingState.source = 'fallback'; }
    applyExchangeRatePricing();
    refreshUiForLatestPricing();
    saveState();
}

/* ---------- state persistence ---------- */
function saveState() {
    try {
        var s = Object.assign({}, state);
        delete s.guidedAppliances; // too complex for localStorage, rebuild on load
        delete s.guidedCustomDevices;
        localStorage.setItem('solarState', JSON.stringify(s));
    } catch (e) {}
}
function clearState() {
    try { localStorage.removeItem('solarState'); } catch (e) {}
}

/* ---------- toast ---------- */
function toast(message, type, duration) {
    type = type || 'info'; duration = duration || 3000;
    var container = $('#toast-container');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'toast toast-' + type;
    var icons = { info: 'fa-circle-info', success: 'fa-circle-check', warning: 'fa-triangle-exclamation', error: 'fa-circle-xmark' };
    el.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i><span>' + message + '</span>';
    container.appendChild(el);
    requestAnimationFrame(function() { el.classList.add('show'); });
    setTimeout(function() { el.classList.remove('show'); el.addEventListener('transitionend', function() { el.remove(); }); }, duration);
}

/* ---------- navigation ---------- */
function getStepConfig() {
    if (state.mode === 'guided') {
        var gSteps = [
            { id: 'appliances', label: 'Appliances' },
            { id: 'recommend', label: 'System' }
        ];
        // If selected inverter is single-phase non-ESS non-3phase Kstar, show battery
        if (state.inverter) {
            var needsBattery = !(state.phase === 'three') &&
                !(state.inverter.series === 'Residential ESS') &&
                !(state.phase === 'three' && state.company === 'Kstar');
            if (state.phase === 'three' && state.company === 'ATESS') needsBattery = true;
            if (needsBattery) gSteps.push({ id: 'guided-battery', label: 'Battery' });
        }
        gSteps.push({ id: 'summary', label: 'Quote' });
        return gSteps;
    }

    // Custom mode (original)
    if (!state.phase) {
        return [
            { id: 'phase', label: 'Phase' }, { id: 'company', label: 'Brand' },
            { id: 'inverter', label: 'System' }, { id: 'battery', label: 'Battery' },
            { id: 'summary', label: 'Quote' }
        ];
    }
    if (state.phase === 'three') {
        var steps = [
            { id: 'phase', label: 'Phase' }, { id: 'company', label: 'Brand' },
            { id: 'inverter', label: 'Package' }
        ];
        if (state.company === 'ATESS') steps.push({ id: 'battery', label: 'Battery' });
        steps.push({ id: 'summary', label: 'Quote' });
        return steps;
    }
    var steps2 = [
        { id: 'phase', label: 'Phase' }, { id: 'company', label: 'Brand' },
        { id: 'inverter', label: 'Inverter' }
    ];
    if (!(state.inverter && state.inverter.series === 'Residential ESS')) {
        steps2.push({ id: 'battery', label: 'Battery' });
    }
    steps2.push({ id: 'summary', label: 'Quote' });
    return steps2;
}

function getCurrentSteps() {
    return getStepConfig().map(function(s) { return s.id; });
}

function resolveAccessibleStep(step) {
    if (step === 'landing') return 'landing';
    var steps = getCurrentSteps();
    if (steps.indexOf(step) === -1) step = steps[0];

    if (state.mode === 'guided') {
        if (step === 'summary') {
            if (!state.inverter) return 'recommend';
            if (steps.indexOf('guided-battery') !== -1 && !state.battery) return 'guided-battery';
            return 'summary';
        }
        if (step === 'guided-battery') return state.inverter ? 'guided-battery' : 'recommend';
        if (step === 'recommend') return state.guidedRunningWatts > 0 ? 'recommend' : 'appliances';
        return step;
    }

    // Custom mode (original)
    if (step === 'summary') {
        if (state.phase === 'three' && state.company === 'Kstar') return state.inverter ? 'summary' : 'inverter';
        if (state.phase === 'single' && state.inverter && state.inverter.series === 'Residential ESS') return state.inverter ? 'summary' : 'inverter';
        if (state.phase === 'three' && state.company === 'ATESS') return state.inverter ? 'summary' : 'inverter';
        return state.battery ? 'summary' : 'battery';
    }
    if (step === 'battery') {
        if (steps.indexOf('battery') === -1) return 'summary';
        return state.inverter ? 'battery' : 'inverter';
    }
    if (step === 'inverter') return state.company ? 'inverter' : 'company';
    if (step === 'company') return state.phase ? 'company' : 'phase';
    return 'phase';
}

function renderStep(step) {
    if (step === 'landing') return; // static HTML
    if (step === 'appliances') renderApplianceBuilder();
    else if (step === 'recommend') renderRecommendations();
    else if (step === 'guided-battery') renderGuidedBatteries();
    else if (step === 'phase') renderPhaseSelection();
    else if (step === 'company') renderCompanies();
    else if (step === 'inverter') renderInverters();
    else if (step === 'battery') renderBatteries();
    else if (step === 'summary') renderSummary();
}

function goTo(step) {
    step = resolveAccessibleStep(step);
    renderStep(step);
    $$('.panel').forEach(function(p) {
        p.classList.remove('visible', 'enter-right', 'enter-left', 'exit-left', 'exit-right');
    });
    // Map step to section id
    var sectionId = step + '-section';
    if (step === 'guided-battery') sectionId = 'guided-battery-section';
    var target = $('#' + sectionId);
    if (target) target.classList.add('visible');
    state.step = step;
    // Show/hide guided load summary (fixed bar) only on appliances step
    var loadBar = $('#guided-load-summary');
    if (loadBar) loadBar.style.display = step === 'appliances' ? '' : 'none';
    updatePills();
    if (step !== 'landing') {
        updateRunningTotal();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#' + step);
}

function goBack() {
    var steps = getCurrentSteps();
    var i = steps.indexOf(state.step);
    if (i > 0) goTo(steps[i - 1]);
}

function updatePills() {
    var config = getStepConfig();
    var steps = config.map(function(s) { return s.id; });
    var ci = steps.indexOf(state.step);
    var container = $('#topbar-steps');
    var bar = document.getElementById('step-progress-bar');
    if (!container) return;

    // Hide the progress bar on landing
    if (bar) {
        bar.style.display = (state.step === 'landing') ? 'none' : 'flex';
    }

    container.innerHTML = '';
    config.forEach(function(s, i) {
        if (i > 0) {
            var conn = document.createElement('span');
            conn.className = 'step-connector' + (i <= ci ? ' lit' : '');
            container.appendChild(conn);
        }
        var pill = document.createElement('button');
        pill.className = 'step-pill' + (i < ci ? ' done' : (i === ci ? ' active' : ''));
        pill.dataset.step = s.id;
        pill.innerHTML = '<span class="pill-num">' + (i + 1) + '</span><span class="pill-label">' + s.label + '</span>';
        pill.addEventListener('click', function() { goTo(s.id); });
        container.appendChild(pill);
    });
}

function updateRunningTotal() {
    var el = $('#running-total');
    if (!el) return;
    var total = getTotal();
    el.textContent = total > 0 ? 'KSH ' + fmt(total) : 'KSH 0';
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
    APPLIANCES.forEach(function(app) { if (state.needs[app.id]) total += app.watts; });
    return total;
}

function updateNeedsResult() {
    var watts = calcTotalWatts();
    state.totalWatts = watts;
    var wattEl = $('#needs-wattage');
    var recEl = $('#needs-rec');
    var resultEl = $('#needs-result');
    if (wattEl) wattEl.textContent = watts + 'W';
    if (watts === 0) { if (resultEl) resultEl.classList.add('hidden'); return; }
    if (resultEl) resultEl.classList.remove('hidden');
    var rec = '';
    if (watts <= 450) rec = 'A <strong>Fortuner 0.7kVA</strong> or <strong>Kstar Sky 1kVA</strong> can handle this load.';
    else if (watts <= 900) rec = 'A <strong>Kstar Sky 1kVA</strong> is ideal for this load.';
    else if (watts <= 1200) rec = 'A <strong>Kstar Sky 2kVA</strong> is the sweet spot, or <strong>Fortuner 2.2kVA</strong>.';
    else if (watts <= 1600) rec = 'Consider a <strong>Kstar Sky 2kVA</strong> or <strong>Kstar Night 3.6kVA</strong>.';
    else if (watts <= 3600) rec = 'A <strong>Kstar Night 3.6kVA</strong> is the sweet spot for this load.';
    else if (watts <= 6000) rec = 'You need at least a <strong>Kstar Night 6.0kVA</strong>.';
    else if (watts <= 10000) rec = 'A <strong>Kstar Residential ESS 10KW</strong> is ideal for this heavy load.';
    else rec = 'Heavy usage — consider a <strong>Three Phase</strong> system for reliable high-load support.';
    if (recEl) recEl.innerHTML = rec;
}

/* ---------- renderers ---------- */
function renderPhaseSelection() {
    var wrap = $('#phase-options');
    if (!wrap) return;
    wrap.innerHTML = '';
    var phases = [
        { id: 'single', name: 'Single Phase', icon: 'fa-house', tagline: 'For homes & small offices', desc: 'Kstar & Fortuner inverters with flexible battery options' },
        { id: 'three', name: 'Three Phase', icon: 'fa-building', tagline: 'For commercial & industrial', desc: 'Kstar & ATESS complete power packages' }
    ];
    phases.forEach(function(p) {
        var el = document.createElement('div');
        el.className = 'brand-card' + (state.phase === p.id ? ' selected' : '');
        el.innerHTML =
            '<div class="brand-check"><i class="fas fa-check"></i></div>' +
            '<div class="phase-icon-wrap"><i class="fas ' + p.icon + '"></i></div>' +
            '<span class="brand-name">' + p.name + '</span>' +
            '<span class="brand-tagline">' + p.tagline + '</span>' +
            '<span class="brand-range">' + p.desc + '</span>';
        el.addEventListener('click', function() { selectPhase(p.id); });
        wrap.appendChild(el);
    });
}

function renderCompanies() {
    var wrap = $('#company-options');
    if (!wrap) return;
    wrap.innerHTML = '';
    var brands;
    if (state.phase === 'three') {
        brands = [
            { name: 'Kstar', img: 'images/kstar-logo.png', tagline: 'Premium 3-phase packages', range: getBrandInverterRange('Kstar') },
            { name: 'ATESS', img: 'images/atess-logo.png', tagline: 'Industrial-grade indoor systems', range: getBrandInverterRange('ATESS') }
        ];
    } else {
        brands = [
            { name: 'Kstar', img: 'images/kstar-logo.png', tagline: 'Premium efficiency, proven reliability', range: getBrandInverterRange('Kstar') },
            { name: 'Fortuner', img: 'images/fortuner-logo.png', tagline: 'Great value across all budgets', range: getBrandInverterRange('Fortuner') }
        ];
    }
    brands.forEach(function(c) {
        var el = document.createElement('div');
        el.className = 'brand-card' + (state.company === c.name ? ' selected' : '');
        el.innerHTML =
            '<div class="brand-check"><i class="fas fa-check"></i></div>' +
            '<img src="' + c.img + '" alt="' + c.name + '" class="brand-img" loading="lazy" onerror="this.style.display=\'none\'">' +
            '<span class="brand-name">' + c.name + '</span>' +
            '<span class="brand-tagline">' + c.tagline + '</span>' +
            '<span class="brand-range">' + c.range + '</span>';
        el.addEventListener('click', function() { selectCompany(c.name); });
        wrap.appendChild(el);
    });
}

function renderInverters() {
    if (state.phase === 'three') { renderThreePhasePackages(); return; }
    renderSinglePhaseInverters();
}

function renderSinglePhaseInverters() {
    var inverters = state.company === 'Kstar' ? kstarSingleInverters : fortunerInverters;
    var wrap = $('#inverter-options');
    if (!wrap) return;
    wrap.innerHTML = '';
    state.compareList = [];
    updateCompareBar();

    var linksEl = $('#inverter-links');
    if (linksEl) linksEl.style.display = (state.company === 'Kstar' || state.company === 'Fortuner') ? '' : 'none';
    $$('.kstar-only').forEach(function(l) { l.style.display = state.company === 'Kstar' ? '' : 'none'; });
    $$('.fortuner-only').forEach(function(l) { l.style.display = state.company === 'Fortuner' ? '' : 'none'; });

    var userWatts = state.totalWatts;
    var currentSeries = '';

    inverters.forEach(function(inv, idx) {
        // Series group header for Kstar
        if (state.company === 'Kstar' && inv.series && inv.series !== currentSeries) {
            currentSeries = inv.series;
            var hdr = document.createElement('div');
            hdr.className = 'series-header';
            var seriesDesc = '';
            if (currentSeries === 'Night Series') seriesDesc = 'High-efficiency hybrid inverters';
            else if (currentSeries === 'Sky Series') seriesDesc = 'Compact & affordable';
            else if (currentSeries === 'Residential ESS') seriesDesc = 'Premium energy storage system';
            hdr.innerHTML = '<h3>' + currentSeries + '</h3><p>' + seriesDesc + '</p>';
            wrap.appendChild(hdr);
        }

        var sel = state.inverter && state.inverter.kva === inv.kva && state.inverter.voltage === inv.voltage && (inv.series ? inv.series === state.inverter.series : true);
        var w = inv.watts ? ' (' + inv.watts + 'W)' : '';
        var outOfStock = !!inv.outOfStock;
        var badge = '';
        if (outOfStock) badge = '<span class="card-badge badge-out"><i class="fas fa-ban"></i> Out of Stock</span>';
        else if (inv.series === 'Residential ESS') badge = '<span class="card-badge badge-premium"><i class="fas fa-gem"></i> Premium ESS</span>';

        var matchBar = '';
        if (userWatts > 0 && !outOfStock) {
            var pct = Math.min(Math.round((inv.maxWatts / userWatts) * 100), 200);
            var enough = inv.maxWatts >= userWatts;
            matchBar =
                '<div class="capacity-match"><div class="match-bar"><div class="match-fill ' + (enough ? 'enough' : 'short') + '" style="width:' + Math.min(pct, 100) + '%"></div></div>' +
                '<span class="match-text ' + (enough ? 'enough' : 'short') + '">' + (enough ? '✓ Covers your ' + userWatts + 'W' : '⚠ Under your ' + userWatts + 'W needs') + '</span></div>';
        }

        var title = state.company + ' ' + (inv.series ? inv.series + ' ' : '') + inv.kva + 'kVA' + w + ' – ' + inv.voltage + 'V';
        if (inv.model) title = state.company + ' ' + inv.series + ' ' + inv.model + ' ' + (inv.watts / 1000) + 'KW';

        var el = document.createElement('div');
        el.className = 'product-card' + (sel ? ' selected' : '') + (outOfStock ? ' out-of-stock' : '');
        el.innerHTML =
            badge +
            '<div class="card-check"><i class="fas fa-check"></i></div>' +
            '<div class="card-thumb"><img src="' + inv.img + '" alt="Inverter" loading="lazy"></div>' +
            '<div class="card-body">' +
                '<span class="card-title">' + title + '</span>' +
                '<span class="card-subtitle">' + inv.bestFor + '</span>' +
                '<span class="card-price">' + fmt(inv.price) + ' Ksh</span>' +
                (outOfStock ? '<span class="card-meta stock-meta">Currently unavailable</span>' : '') +
                '<span class="card-meta">Efficiency: ' + inv.details.efficiency + ' · Max: ' + fmt(inv.maxWatts) + 'W</span>' +
                (inv.essBattery ? '<div class="ess-battery-banner"><i class="fas fa-car-battery"></i> Includes ' + inv.essBattery.count + '× ' + inv.essBattery.name + ' (' + inv.essBattery.totalCapacity + ') — no battery selection needed</div>' : '') +
                matchBar +
                '<div class="card-actions">' +
                    '<a href="' + inv.specsLink + '" target="_blank" rel="noopener" class="card-link card-btn"><i class="fas fa-external-link-alt"></i> Specs</a>' +
                    (inv.essBattery ? '<a href="' + inv.essBattery.specsLink + '" target="_blank" rel="noopener" class="card-link card-btn"><i class="fas fa-car-battery"></i> Battery Specs</a>' : '') +
                    (outOfStock ? '<span class="card-link stock-meta"><i class="fas fa-lock"></i> Disabled</span>' : '<button class="card-link card-btn compat-btn" data-idx="' + idx + '"><i class="fas fa-info-circle"></i> More Info</button>') +
                '</div>' +
            '</div>';
        el.addEventListener('click', function(e) {
            if (outOfStock) return;
            if (!e.target.closest('a') && !e.target.closest('.compat-btn')) selectInverter(inv);
        });
        wrap.appendChild(el);
    });

    $$('.compat-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            showApplianceModal(inverters[parseInt(btn.dataset.idx)]);
        });
    });
}

function renderThreePhasePackages() {
    var wrap = $('#inverter-options');
    if (!wrap) return;
    wrap.innerHTML = '';
    state.compareList = [];
    updateCompareBar();

    var linksEl = $('#inverter-links');
    if (linksEl) linksEl.style.display = 'none';

    var packages = state.company === 'Kstar' ? kstarThreePhasePackages : atessThreePhasePackages;

    packages.forEach(function(pkg) {
        var sel = state.inverter && state.inverter.id === pkg.id;
        var pkgPrice = state.company === 'Kstar' ? pkg.packagePrice : pkg.inverterPrice;
        var priceLabel = state.company === 'Kstar' ? 'Package (Inverter + Battery)' : 'Inverter';

        var features = '';
        if (pkg.inverterNotes) {
            features = '<div class="pkg-features"><ul>' + pkg.inverterNotes.map(function(n) { return '<li><i class="fas fa-check"></i> ' + n + '</li>'; }).join('') + '</ul></div>';
        }

        var batInfo = '';
        if (state.company === 'Kstar' && pkg.batteries) {
            batInfo = '<span class="card-meta"><i class="fas fa-car-battery"></i> Includes ' + pkg.batteries.count + '× ' + pkg.batteries.name + ' (' + pkg.batteries.totalCapacity + ')</span>';
        }
        if (state.company === 'ATESS' && pkg.battery) {
            batInfo = '<span class="card-meta"><i class="fas fa-car-battery"></i> ' + pkg.battery.name + ' — configurable 1–3 master pairs</span>';
        }

        var el = document.createElement('div');
        el.className = 'product-card pkg-card' + (sel ? ' selected' : '');
        el.innerHTML =
            '<span class="card-badge badge-premium"><i class="fas fa-bolt"></i> 3-Phase</span>' +
            '<div class="card-check"><i class="fas fa-check"></i></div>' +
            '<div class="card-thumb"><img src="' + pkg.img + '" alt="Package" loading="lazy"></div>' +
            '<div class="card-body">' +
                '<span class="card-title">' + state.company + ' ' + pkg.name + '</span>' +
                '<span class="card-subtitle">' + pkg.bestFor + '</span>' +
                '<span class="card-price">' + fmt(pkgPrice) + ' Ksh <small>(' + priceLabel + ')</small></span>' +
                '<span class="card-meta"><i class="fas fa-solar-panel"></i> ' + pkg.panelCount + '× 600W Solar Panels</span>' +
                batInfo +
                features +
                '<div class="card-actions">' +
                    '<a href="' + pkg.specsLink + '" target="_blank" rel="noopener" class="card-link card-btn"><i class="fas fa-external-link-alt"></i> Specs</a>' +
                    (pkg.batteries && pkg.batteries.specsLink ? '<a href="' + pkg.batteries.specsLink + '" target="_blank" rel="noopener" class="card-link card-btn"><i class="fas fa-car-battery"></i> Battery Specs</a>' : '') +
                '</div>' +
            '</div>';
        el.addEventListener('click', function(e) {
            if (!e.target.closest('a')) selectPackage(pkg);
        });
        wrap.appendChild(el);
    });
}

function renderBatteries() {
    if (state.phase === 'three' && state.company === 'ATESS') { renderAtessBatteryConfig(); return; }
    renderSinglePhaseBatteries();
}

function renderSinglePhaseBatteries() {
    var wrap = $('#battery-options');
    if (!wrap) return;
    wrap.innerHTML = '';
    var inv = state.inverter;
    if (!inv) return;

    batteries.forEach(function(bat) {
        var info = getBatteryCompat(bat);
        if (!info) return;
        var count = info.count;
        var compatible = info.compatible;
        var reason = info.reason;
        var sel = state.battery && state.battery.id === bat.id && state.battery.count === count;

        var el = document.createElement('div');
        if (!compatible) {
            el.className = 'product-card incompatible';
            el.innerHTML =
                '<div class="card-thumb"><img src="' + bat.img + '" alt="Battery" loading="lazy"></div>' +
                '<div class="card-body">' +
                    '<span class="card-title">' + bat.name + '</span>' +
                    '<span class="card-price">' + fmt(bat.price) + ' Ksh/unit</span>' +
                    '<div class="incompat-reason"><i class="fas fa-ban"></i><span>' + reason + '</span></div>' +
                '</div>';
        } else {
            var totalCost = bat.price * count;
            var badge = '';
            if (bat.type === 'lithium') badge = '<span class="card-badge badge-premium"><i class="fas fa-gem"></i> Premium</span>';
            el.className = 'product-card' + (sel ? ' selected' : '');
            el.innerHTML =
                badge +
                '<div class="card-check"><i class="fas fa-check"></i></div>' +
                '<div class="card-thumb"><img src="' + bat.img + '" alt="Battery" loading="lazy"></div>' +
                '<div class="card-body">' +
                    '<span class="card-title">' + bat.name + '</span>' +
                    '<span class="card-subtitle">' + bat.shortDesc + '</span>' +
                    '<span class="card-price">' + fmt(bat.price) + ' Ksh <small>× ' + count + ' = ' + fmt(totalCost) + ' Ksh</small></span>' +
                    '<span class="card-meta">~' + (bat.backupHours * count).toFixed(1) + ' hrs backup · ' + bat.warranty + ' warranty</span>' +
                    '<span class="card-meta">' + reason + '</span>' +
                    '<div class="card-actions"><a href="' + bat.specsLink + '" target="_blank" rel="noopener" class="card-link"><i class="fas fa-external-link-alt"></i> Specs</a></div>' +
                '</div>';
            el.addEventListener('click', function(e) {
                if (!e.target.closest('a')) selectBattery(bat, count);
            });
        }
        wrap.appendChild(el);
    });
}

function renderAtessBatteryConfig() {
    var wrap = $('#battery-options');
    if (!wrap) return;
    wrap.innerHTML = '';
    var inv = state.inverter;
    if (!inv || !inv.battery) return;

    var header = document.createElement('div');
    header.className = 'battery-config-header';
    header.innerHTML = '<p>Configure your battery storage. Each master pairs with one slave unit.</p>';
    wrap.appendChild(header);

    inv.battery.configs.forEach(function(cfg) {
        var sel = state.atessMasterCount === cfg.masters;
        var unitPrice = usdToKes(inv.battery.usdPricePerUnit);
        var totalPrice = unitPrice * cfg.totalUnits;
        var el = document.createElement('div');
        el.className = 'product-card' + (sel ? ' selected' : '');
        el.innerHTML =
            (cfg.masters === 3 ? '<span class="card-badge badge-rec"><i class="fas fa-star"></i> Maximum</span>' : '') +
            '<div class="card-check"><i class="fas fa-check"></i></div>' +
            '<div class="card-thumb"><img src="images/atessbatteries.png" alt="Battery" loading="lazy"></div>' +
            '<div class="card-body">' +
                '<span class="card-title">' + cfg.masters + ' Master + ' + cfg.masters + ' Slave</span>' +
                '<span class="card-subtitle">' + cfg.totalUnits + ' batteries total · ' + cfg.capacity + '</span>' +
                '<span class="card-price">' + fmt(unitPrice) + ' Ksh <small>× ' + cfg.totalUnits + ' = ' + fmt(totalPrice) + ' Ksh</small></span>' +
                '<span class="card-meta">' + inv.battery.warranty + ' warranty · ' + inv.battery.name + '</span>' +
                '<div class="card-actions"><a href="' + inv.battery.specsLink + '" target="_blank" rel="noopener" class="card-link"><i class="fas fa-external-link-alt"></i> Specs</a></div>' +
            '</div>';
        el.addEventListener('click', function(e) {
            if (!e.target.closest('a')) selectAtessBatteryConfig(cfg.masters);
        });
        wrap.appendChild(el);
    });
}

/* ---------- battery compatibility (single phase) ---------- */
function getBatteryCompat(bat) {
    var inv = state.inverter;
    if (!inv) return null;

    if (state.company === 'Kstar') {
        // Sky Series
        if (inv.series === 'Sky Series') {
            if (bat.type === 'lithium') return { count: 0, compatible: false, reason: 'Not compatible — Sky Series does not support lithium' };
            if (inv.kva === 1.0) return { count: 1, compatible: true, reason: '1 unit for 12V system' };
            if (inv.kva === 2.0) return { count: 2, compatible: true, reason: '2 units in series for 24V system' };
        }
        // Night Series
        if (inv.series === 'Night Series') {
            if (inv.kva === 3.6 && inv.voltage === 24) {
                if (bat.type === 'lithium') return { count: 0, compatible: false, reason: 'Not compatible — 24V inverter doesn\'t support lithium' };
                return { count: 2, compatible: true, reason: '2 units in series for 24V system' };
            }
            if (inv.kva === 3.6 && inv.voltage === 48) {
                if (bat.type === 'lithium') return { count: 1, compatible: true, reason: '51.2V lithium matches your 48V system' };
                return { count: 4, compatible: true, reason: '4 units in series for 48V system' };
            }
            if (inv.kva === 6.0 && inv.voltage === 48) {
                if (bat.type === 'lithium') return { count: 2, compatible: true, reason: '2 lithium units for extended capacity' };
                return { count: 4, compatible: true, reason: '4 units in series for 48V system' };
            }
        }
        // ESS handled separately (no battery step)
        return null;
    }

    // Fortuner
    if (inv.kva === 0.7 && inv.voltage === 12) {
        if (bat.type === 'lithium') return { count: 0, compatible: false, reason: 'Not compatible — 12V system can\'t use 51.2V lithium' };
        return { count: 1, compatible: true, reason: '1 unit for 12V system' };
    }
    if ((inv.kva === 1.5 || inv.kva === 2.2) && inv.voltage === 24) {
        if (bat.type === 'lithium') return { count: 0, compatible: false, reason: 'Not compatible — doesn\'t support lithium' };
        return { count: 2, compatible: true, reason: '2 units in series for 24V system' };
    }
    if (inv.kva === 10.0 && inv.voltage === 48) {
        if (bat.type === 'lithium') return { count: 0, compatible: false, reason: 'Not compatible — doesn\'t support lithium' };
        return { count: 4, compatible: true, reason: '4 units in series for 48V system' };
    }
    return null;
}

/* ---------- selections ---------- */
function selectPhase(id) {
    state.phase = id;
    state.company = '';
    state.inverter = null;
    state.battery = null;
    state.panels = 0;
    state.panelType = null;
    state.compareList = [];
    state.atessMasterCount = 3;
    renderPhaseSelection();
    toast((id === 'single' ? 'Single Phase' : 'Three Phase') + ' selected', 'success');
    setTimeout(function() { goTo('company'); }, 250);
    saveState();
}

function selectCompany(name) {
    state.company = name;
    state.inverter = null;
    state.battery = null;
    state.panels = 0;
    state.panelType = null;
    state.compareList = [];
    state.atessMasterCount = 3;
    renderCompanies();
    toast(name + ' selected', 'success');
    setTimeout(function() { goTo('inverter'); }, 250);
    saveState();
}

function selectInverter(inv) {
    if (inv.outOfStock) { toast(inv.kva + 'kVA is currently out of stock', 'warning'); return; }
    state.inverter = inv;
    state.battery = null;
    state.compareList = [];
    calcPanels();

    if (inv.series === 'Residential ESS') {
        toast('ESS ' + inv.model + ' selected with 4× H-PACK-5.1A batteries', 'success');
        setTimeout(function() { goTo('summary'); }, 250);
    } else {
        var w = inv.watts ? ' (' + inv.watts + 'W)' : '';
        toast(inv.kva + 'kVA' + w + ' inverter selected', 'success');
        setTimeout(function() { goTo('battery'); }, 250);
    }
    saveState();
}

function selectPackage(pkg) {
    state.inverter = pkg;
    state.battery = null;
    state.compareList = [];
    calcPanels();

    if (state.company === 'Kstar') {
        toast(pkg.name + ' package selected', 'success');
        setTimeout(function() { goTo('summary'); }, 250);
    } else {
        state.atessMasterCount = 3;
        toast(pkg.name + ' selected — configure your battery', 'success');
        setTimeout(function() { goTo('battery'); }, 250);
    }
    saveState();
}

function selectBattery(bat, count) {
    state.battery = {
        name: bat.name, id: bat.id, shortDesc: bat.shortDesc,
        price: bat.price, img: bat.img, specsLink: bat.specsLink,
        capacityWh: bat.capacityWh, dod: bat.dod, backupHours: bat.backupHours,
        warranty: bat.warranty, voltagePerUnit: bat.voltagePerUnit, type: bat.type,
        count: count
    };
    renderBatteries();
    toast(bat.name + ' × ' + count + ' selected', 'success');
    setTimeout(function() { goTo('summary'); }, 250);
    saveState();
}

function selectAtessBatteryConfig(masters) {
    state.atessMasterCount = masters;
    renderAtessBatteryConfig();
    var cfg = state.inverter.battery.configs[masters - 1];
    toast(cfg.totalUnits + ' batteries (' + cfg.capacity + ') selected', 'success');
    setTimeout(function() { goTo('summary'); }, 250);
    saveState();
}

/* ---------- panel calc ---------- */
function calcPanels() {
    if (state.phase === 'three') {
        var pkg = state.inverter;
        state.panels = pkg.panelCount;
        if (state.company === 'ATESS') state.panelType = PANEL_600W_ATESS;
        else state.panelType = PANEL_600W;
        return;
    }
    if (state.company === 'Fortuner') {
        if (state.inverter.kva === 0.7) { state.panels = 3; state.panelType = PANEL_180W; }
        else if (state.inverter.kva === 1.5 || state.inverter.kva === 2.2) { state.panels = 2; state.panelType = PANEL_600W; }
        else if (state.inverter.kva === 10.0) { state.panels = 16; state.panelType = PANEL_600W; }
    } else {
        if (state.inverter.series === 'Sky Series') {
            state.panels = state.inverter.kva === 1.0 ? 3 : 6;
            state.panelType = PANEL_180W;
        } else if (state.inverter.series === 'Residential ESS') {
            state.panels = 20;
            state.panelType = PANEL_600W;
        } else {
            state.panels = (state.inverter.kva === 6.0 && state.inverter.voltage === 48) ? 10 : 6;
            state.panelType = PANEL_600W;
        }
    }
}

/* ---------- compare ---------- */
function updateCompareBar() {
    var bar = $('#compare-bar');
    if (!bar) return;
    bar.classList.toggle('hidden', state.compareList.length < 2);
    var count = $('#compare-count');
    if (count) count.textContent = state.compareList.length;
}

function showComparison() {
    if (state.phase === 'three') return;
    var inverters = state.company === 'Kstar' ? kstarSingleInverters : fortunerInverters;
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
        return [inv.kva + ' kVA', inv.voltage + 'V', fmt(inv.maxWatts) + 'W', inv.details.efficiency, fmt(inv.price) + ' Ksh', fmt(inv.labour) + ' Ksh', inv.bestFor];
    });
    specs.forEach(function(spec, si) {
        html += '<div class="compare-row"><div class="compare-cell compare-label">' + spec + '</div>';
        rows.forEach(function(r) { html += '<div class="compare-cell">' + r[si] + '</div>'; });
        html += '</div>';
    });
    html += '</div>';
    body.innerHTML = html;
    $('#compare-modal').classList.remove('hidden');
}

/* ---------- guided mode: appliance builder ---------- */
function getFilteredAppliances() {
    return RICH_APPLIANCES.filter(function(a) {
        return a.spaces.indexOf(state.guidedSpace) !== -1;
    });
}

function getVisibleCategories() {
    var appliances = getFilteredAppliances();
    var used = [];
    appliances.forEach(function(a) {
        if (used.indexOf(a.category) === -1) used.push(a.category);
    });
    return APPLIANCE_CATEGORIES.filter(function(cat) {
        return used.indexOf(cat.id) !== -1;
    });
}

function renderApplianceBuilder() {
    var cats = getVisibleCategories();
    if (state.guidedCatIdx >= cats.length) state.guidedCatIdx = cats.length - 1;
    if (state.guidedCatIdx < 0) state.guidedCatIdx = 0;
    var cat = cats[state.guidedCatIdx];
    var appliances = getFilteredAppliances().filter(function(a) { return a.category === cat.id; });
    var isFirst = state.guidedCatIdx === 0;
    var isLast = state.guidedCatIdx === cats.length - 1;

    // ── Header ──
    var headerEl = $('#ab-wizard-header');
    if (headerEl) {
        var spaceButtons =
            '<div class="guided-space-toggle">' +
                '<button class="space-btn' + (state.guidedSpace === 'home' ? ' active' : '') + '" data-space="home"><i class="fas fa-house"></i> Home</button>' +
                '<button class="space-btn' + (state.guidedSpace === 'office' ? ' active' : '') + '" data-space="office"><i class="fas fa-briefcase"></i> Office</button>' +
                '<button class="space-btn' + (state.guidedSpace === 'commercial' ? ' active' : '') + '" data-space="commercial"><i class="fas fa-building"></i> Commercial</button>' +
            '</div>';
        headerEl.innerHTML =
            '<div class="ab-wiz-head">' +
                (isFirst ? spaceButtons : '') +
                '<div class="ab-wiz-greeting">' +
                    '<div class="ab-wiz-icon"><i class="fas ' + cat.icon + '"></i></div>' +
                    '<h2>' + cat.greeting + '</h2>' +
                    '<p>' + cat.subtext + '</p>' +
                '</div>' +
            '</div>';
        // Re-attach space button listeners
        headerEl.querySelectorAll('.space-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                state.guidedSpace = btn.dataset.space;
                state.guidedCatIdx = 0;
                renderApplianceBuilder();
            });
        });
    }

    // ── Category progress dots ──
    var progEl = $('#ab-cat-progress');
    if (progEl) {
        var dots = cats.map(function(c, i) {
            var hasItems = false;
            getFilteredAppliances().filter(function(a) { return a.category === c.id; }).forEach(function(a) {
                if (state.guidedAppliances[a.id] && state.guidedAppliances[a.id].length > 0) hasItems = true;
            });
            if (c.id === 'other' && state.guidedCustomDevices.length > 0) hasItems = true;
            var cls = 'ab-dot';
            if (i === state.guidedCatIdx) cls += ' current';
            else if (hasItems) cls += ' has-items';
            return '<button class="' + cls + '" data-idx="' + i + '" title="' + c.name + '"><i class="fas ' + c.icon + '"></i></button>';
        }).join('');
        progEl.innerHTML = '<div class="ab-progress-bar">' + dots + '</div>';
        progEl.querySelectorAll('.ab-dot').forEach(function(dot) {
            dot.addEventListener('click', function() {
                state.guidedCatIdx = parseInt(dot.dataset.idx);
                renderApplianceBuilder();
            });
        });
    }

    // ── Appliance cards (one category) ──
    var container = $('#appliance-builder');
    if (!container) return;
    container.innerHTML = '';

    var grid = document.createElement('div');
    grid.className = 'ab-grid';

    appliances.forEach(function(app) {
        var instances = state.guidedAppliances[app.id] || [];
        var isActive = instances.length > 0;

        var card = document.createElement('div');
        card.className = 'ab-card' + (isActive ? ' active' : '');
        card.dataset.appId = app.id;

        // Build instances HTML
        var instancesHtml = '';
        instances.forEach(function(inst, idx) {
            var v = app.variants[inst.variantIdx];
            var total = v.watts * inst.qty;
            var startW = Math.round(v.watts * v.startMultiplier);
            var variantOptions = app.variants.map(function(vv, vi) {
                return '<option value="' + vi + '"' + (vi === inst.variantIdx ? ' selected' : '') + '>' + vv.label + ' — ' + vv.watts + 'W</option>';
            }).join('');

            instancesHtml +=
                '<div class="ab-instance" data-idx="' + idx + '">' +
                    (instances.length > 1 ? '<div class="ab-instance-label"><span>#' + (idx + 1) + '</span><button class="ab-instance-remove" data-idx="' + idx + '" type="button"><i class="fas fa-times"></i></button></div>' : '') +
                    '<div class="ab-select-row">' +
                        '<label>Type / Size</label>' +
                        '<select class="ab-variant-select" data-idx="' + idx + '">' + variantOptions + '</select>' +
                    '</div>' +
                    '<div class="ab-qty-row">' +
                        '<label>Quantity</label>' +
                        '<div class="ab-qty-ctrl">' +
                            '<button class="ab-qty-btn ab-qty-minus" data-idx="' + idx + '" type="button"><i class="fas fa-minus"></i></button>' +
                            '<span class="ab-qty-val" data-idx="' + idx + '">' + inst.qty + '</span>' +
                            '<button class="ab-qty-btn ab-qty-plus" data-idx="' + idx + '" type="button"><i class="fas fa-plus"></i></button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ab-watts-row">' +
                        '<span class="ab-watts-label">Running: <strong>' + v.watts + 'W</strong> × ' + inst.qty + ' = <strong>' + total + 'W</strong></span>' +
                        (v.startMultiplier > 1 ? '<span class="ab-watts-peak">Starting surge: <strong>' + startW + 'W</strong> each</span>' : '') +
                    '</div>' +
                '</div>';
        });

        card.innerHTML =
            '<div class="ab-card-top">' +
                '<div class="ab-card-icon"><i class="fas ' + app.icon + '"></i></div>' +
                '<div class="ab-card-info">' +
                    '<span class="ab-card-name">' + app.name + (app.popular ? '<span class="ab-popular-tag">Common</span>' : '') + '</span>' +
                    '<span class="ab-card-desc">' + app.desc + '</span>' +
                '</div>' +
                '<label class="ab-toggle"><input type="checkbox" ' + (isActive ? 'checked' : '') + '><span class="ab-toggle-slider"></span></label>' +
            '</div>' +
            '<div class="ab-card-config' + (isActive ? ' open' : '') + '">' +
                (app.note ? '<div class="ab-note"><i class="fas fa-info-circle"></i> ' + app.note + '</div>' : '') +
                '<div class="ab-instances-wrap">' + instancesHtml + '</div>' +
                (isActive ? '<button class="ab-add-another" type="button"><i class="fas fa-plus"></i> Add another ' + app.name + '</button>' : '') +
            '</div>';

        // Toggle handler
        var toggle = card.querySelector('.ab-toggle input');
        toggle.addEventListener('change', function() {
            if (toggle.checked) {
                state.guidedAppliances[app.id] = [{ variantIdx: 0, qty: app.defaultQty }];
            } else {
                delete state.guidedAppliances[app.id];
            }
            renderApplianceBuilder();
        });

        // Instance event handlers
        if (isActive) {
            // Variant selects
            card.querySelectorAll('.ab-variant-select').forEach(function(sel) {
                sel.addEventListener('change', function() {
                    var idx = parseInt(sel.dataset.idx);
                    state.guidedAppliances[app.id][idx].variantIdx = parseInt(sel.value);
                    renderApplianceBuilder();
                });
            });
            // Qty minus
            card.querySelectorAll('.ab-qty-minus').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var idx = parseInt(btn.dataset.idx);
                    var inst = state.guidedAppliances[app.id][idx];
                    inst.qty = Math.max(1, inst.qty - 1);
                    renderApplianceBuilder();
                });
            });
            // Qty plus
            card.querySelectorAll('.ab-qty-plus').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var idx = parseInt(btn.dataset.idx);
                    var inst = state.guidedAppliances[app.id][idx];
                    inst.qty = Math.min(app.maxQty, inst.qty + 1);
                    renderApplianceBuilder();
                });
            });
            // Remove instance
            card.querySelectorAll('.ab-instance-remove').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var idx = parseInt(btn.dataset.idx);
                    state.guidedAppliances[app.id].splice(idx, 1);
                    if (state.guidedAppliances[app.id].length === 0) delete state.guidedAppliances[app.id];
                    renderApplianceBuilder();
                });
            });
            // Add another
            var addBtn = card.querySelector('.ab-add-another');
            if (addBtn) addBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                state.guidedAppliances[app.id].push({ variantIdx: 0, qty: 1 });
                renderApplianceBuilder();
            });
        }

        grid.appendChild(card);
    });

    container.appendChild(grid);

    // ── Custom device entry (only on "Other" category) ──
    if (cat.id === 'other') {
        renderCustomDeviceSection(container);
    }

    // ── Navigation buttons ──
    var navEl = $('#ab-wizard-nav');
    if (navEl) {
        var leftBtn = '';
        if (isFirst) {
            leftBtn = '<button class="ab-nav-btn ab-nav-back" id="ab-nav-back-landing"><i class="fas fa-arrow-left"></i> Back to Start</button>';
        } else {
            leftBtn = '<button class="ab-nav-btn ab-nav-back" id="ab-nav-prev"><i class="fas fa-arrow-left"></i> ' + cats[state.guidedCatIdx - 1].name + '</button>';
        }
        var rightBtn = '';
        if (isLast) {
            rightBtn = '<button class="ab-nav-btn ab-nav-skip" id="ab-nav-finish">Review All <i class="fas fa-list-check"></i></button>';
        } else {
            rightBtn =
                '<button class="ab-nav-btn ab-nav-skip" id="ab-nav-skip">Skip <i class="fas fa-forward"></i></button>' +
                '<button class="ab-nav-btn ab-nav-next" id="ab-nav-next">' + cats[state.guidedCatIdx + 1].name + ' <i class="fas fa-arrow-right"></i></button>';
        }
        navEl.innerHTML = '<div class="ab-nav-row">' + leftBtn + '<div class="ab-nav-right">' + rightBtn + '</div></div>';

        var prevBtn = navEl.querySelector('#ab-nav-prev');
        if (prevBtn) prevBtn.addEventListener('click', function() {
            state.guidedCatIdx--;
            renderApplianceBuilder();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        var nextBtn = navEl.querySelector('#ab-nav-next');
        if (nextBtn) nextBtn.addEventListener('click', function() {
            state.guidedCatIdx++;
            renderApplianceBuilder();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        var skipBtn = navEl.querySelector('#ab-nav-skip');
        if (skipBtn) skipBtn.addEventListener('click', function() {
            state.guidedCatIdx++;
            renderApplianceBuilder();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        var backLanding = navEl.querySelector('#ab-nav-back-landing');
        if (backLanding) backLanding.addEventListener('click', function() { goTo('landing'); });
        var finishBtn = navEl.querySelector('#ab-nav-finish');
        if (finishBtn) finishBtn.addEventListener('click', function() { showApplianceReview(); });
    }

    recalcGuidedLoad();
}

function showApplianceReview() {
    var container = $('#appliance-builder');
    var headerEl = $('#ab-wizard-header');
    var progEl = $('#ab-cat-progress');
    var navEl = $('#ab-wizard-nav');
    if (!container) return;

    var selectedIds = Object.keys(state.guidedAppliances);
    var hasCustom = state.guidedCustomDevices.length > 0;
    var hasAnything = selectedIds.length > 0 || hasCustom;

    if (headerEl) {
        headerEl.innerHTML =
            '<div class="ab-wiz-head">' +
                '<div class="ab-wiz-icon review"><i class="fas fa-clipboard-check"></i></div>' +
                '<h2>Here\'s your full list!</h2>' +
                '<p>' + (!hasAnything ? 'You haven\'t selected any appliances yet. Go back and pick some!' : 'Review everything you\'ve selected. Toggle items off if you change your mind.') + '</p>' +
            '</div>';
    }
    if (progEl) progEl.innerHTML = '';

    container.innerHTML = '';
    if (!hasAnything) {
        container.innerHTML = '<div class="ab-empty"><i class="fas fa-box-open"></i><p>No appliances selected yet</p><button class="ab-nav-btn ab-nav-next" id="ab-go-back-first">Start Selecting <i class="fas fa-arrow-right"></i></button></div>';
        var goBackBtn = container.querySelector('#ab-go-back-first');
        if (goBackBtn) goBackBtn.addEventListener('click', function() {
            state.guidedCatIdx = 0;
            renderApplianceBuilder();
        });
        if (navEl) navEl.innerHTML = '';
        return;
    }

    // Group selected by category
    var grouped = {};
    selectedIds.forEach(function(id) {
        var app = RICH_APPLIANCES.find(function(a) { return a.id === id; });
        if (!app) return;
        if (!grouped[app.category]) grouped[app.category] = [];
        var instances = state.guidedAppliances[id];
        instances.forEach(function(inst, idx) {
            grouped[app.category].push({ app: app, inst: inst, instIdx: idx });
        });
    });

    APPLIANCE_CATEGORIES.forEach(function(cat) {
        if (!grouped[cat.id] && !(cat.id === 'other' && hasCustom)) return;
        var section = document.createElement('div');
        section.className = 'ab-review-cat';
        section.innerHTML = '<div class="ab-category-header"><i class="fas ' + cat.icon + '"></i><h3>' + cat.name + '</h3></div>';

        if (grouped[cat.id]) {
            grouped[cat.id].forEach(function(item) {
                var v = item.app.variants[item.inst.variantIdx];
                var total = v.watts * item.inst.qty;
                var row = document.createElement('div');
                row.className = 'ab-review-row';
                row.innerHTML =
                    '<div class="ab-review-info">' +
                        '<i class="fas ' + item.app.icon + '"></i>' +
                        '<div><strong>' + item.app.name + '</strong><span>' + v.label + ' × ' + item.inst.qty + '</span></div>' +
                    '</div>' +
                    '<div class="ab-review-watts">' + fmt(total) + 'W</div>' +
                    '<button class="ab-review-remove" data-app-id="' + item.app.id + '" data-inst-idx="' + item.instIdx + '" title="Remove"><i class="fas fa-times"></i></button>';
                row.querySelector('.ab-review-remove').addEventListener('click', function() {
                    state.guidedAppliances[item.app.id].splice(item.instIdx, 1);
                    if (state.guidedAppliances[item.app.id].length === 0) delete state.guidedAppliances[item.app.id];
                    showApplianceReview();
                    recalcGuidedLoad();
                });
                section.appendChild(row);
            });
        }

        // Custom devices in the "other" section
        if (cat.id === 'other') {
            state.guidedCustomDevices.forEach(function(dev, di) {
                var total = dev.watts * dev.qty;
                var row = document.createElement('div');
                row.className = 'ab-review-row';
                row.innerHTML =
                    '<div class="ab-review-info">' +
                        '<i class="fas fa-plug"></i>' +
                        '<div><strong>' + dev.name + '</strong><span>' + dev.watts + 'W × ' + dev.qty + '</span></div>' +
                    '</div>' +
                    '<div class="ab-review-watts">' + fmt(total) + 'W</div>' +
                    '<button class="ab-review-remove" data-custom-idx="' + di + '" title="Remove"><i class="fas fa-times"></i></button>';
                row.querySelector('.ab-review-remove').addEventListener('click', function() {
                    state.guidedCustomDevices.splice(di, 1);
                    showApplianceReview();
                    recalcGuidedLoad();
                });
                section.appendChild(row);
            });
        }

        container.appendChild(section);
    });

    if (navEl) {
        navEl.innerHTML =
            '<div class="ab-nav-row">' +
                '<button class="ab-nav-btn ab-nav-back" id="ab-review-back"><i class="fas fa-arrow-left"></i> Add More</button>' +
                '<div class="ab-nav-right"></div>' +
            '</div>';
        navEl.querySelector('#ab-review-back').addEventListener('click', function() {
            state.guidedCatIdx = 0;
            renderApplianceBuilder();
        });
    }
}

function renderCustomDeviceSection(container) {
    var wrap = document.createElement('div');
    wrap.className = 'ab-custom-section';
    wrap.innerHTML =
        '<div class="ab-custom-header"><i class="fas fa-plus-circle"></i><h3>Add a Custom Device</h3></div>' +
        '<p class="ab-custom-desc">Have something we didn\'t list? Enter it here.</p>' +
        '<div class="ab-custom-form">' +
            '<input type="text" class="ab-custom-input" id="custom-dev-name" placeholder="Device name (e.g. Fish Pond Pump)" maxlength="60">' +
            '<input type="number" class="ab-custom-input ab-custom-watts" id="custom-dev-watts" placeholder="Watts" min="1" max="50000">' +
            '<div class="ab-qty-ctrl">' +
                '<button class="ab-qty-btn" id="custom-dev-qty-minus" type="button"><i class="fas fa-minus"></i></button>' +
                '<span class="ab-qty-val" id="custom-dev-qty">1</span>' +
                '<button class="ab-qty-btn" id="custom-dev-qty-plus" type="button"><i class="fas fa-plus"></i></button>' +
            '</div>' +
            '<button class="ab-nav-btn ab-nav-next ab-custom-add-btn" id="custom-dev-add" type="button"><i class="fas fa-plus"></i> Add</button>' +
        '</div>';

    // Existing custom devices list
    if (state.guidedCustomDevices.length > 0) {
        var listHtml = '<div class="ab-custom-list">';
        state.guidedCustomDevices.forEach(function(dev, di) {
            var total = dev.watts * dev.qty;
            listHtml +=
                '<div class="ab-review-row">' +
                    '<div class="ab-review-info"><i class="fas fa-plug"></i>' +
                        '<div><strong>' + dev.name + '</strong><span>' + dev.watts + 'W × ' + dev.qty + '</span></div>' +
                    '</div>' +
                    '<div class="ab-review-watts">' + fmt(total) + 'W</div>' +
                    '<button class="ab-custom-remove ab-review-remove" data-idx="' + di + '" title="Remove"><i class="fas fa-times"></i></button>' +
                '</div>';
        });
        listHtml += '</div>';
        wrap.innerHTML += listHtml;
    }

    container.appendChild(wrap);

    // Event listeners
    var qtyVal = wrap.querySelector('#custom-dev-qty');
    wrap.querySelector('#custom-dev-qty-minus').addEventListener('click', function() {
        var q = Math.max(1, parseInt(qtyVal.textContent) - 1);
        qtyVal.textContent = q;
    });
    wrap.querySelector('#custom-dev-qty-plus').addEventListener('click', function() {
        var q = Math.min(50, parseInt(qtyVal.textContent) + 1);
        qtyVal.textContent = q;
    });
    wrap.querySelector('#custom-dev-add').addEventListener('click', function() {
        var nameEl = wrap.querySelector('#custom-dev-name');
        var wattsEl = wrap.querySelector('#custom-dev-watts');
        var name = nameEl.value.trim();
        var watts = parseInt(wattsEl.value);
        var qty = parseInt(qtyVal.textContent);
        if (!name) { nameEl.focus(); toast('Enter a device name', 'warning'); return; }
        if (!watts || watts < 1) { wattsEl.focus(); toast('Enter the wattage', 'warning'); return; }
        state.guidedCustomDevices.push({ name: name, watts: watts, qty: qty });
        recalcGuidedLoad();
        renderApplianceBuilder();
    });
    wrap.querySelectorAll('.ab-custom-remove').forEach(function(btn) {
        btn.addEventListener('click', function() {
            state.guidedCustomDevices.splice(parseInt(btn.dataset.idx), 1);
            recalcGuidedLoad();
            renderApplianceBuilder();
        });
    });
}

function recalcGuidedLoad() {
    var running = 0;
    var peak = 0;
    var count = 0;
    Object.keys(state.guidedAppliances).forEach(function(id) {
        var instances = state.guidedAppliances[id];
        var app = RICH_APPLIANCES.find(function(a) { return a.id === id; });
        if (!app) return;
        instances.forEach(function(inst) {
            var v = app.variants[inst.variantIdx];
            running += v.watts * inst.qty;
            peak += Math.round(v.watts * v.startMultiplier) * inst.qty;
            count += inst.qty;
        });
    });
    // Custom devices
    state.guidedCustomDevices.forEach(function(dev) {
        running += dev.watts * dev.qty;
        peak += dev.watts * dev.qty;  // no start multiplier for custom
        count += dev.qty;
    });
    state.guidedRunningWatts = running;
    state.guidedPeakWatts = peak;

    var rEl = $('#running-watts');
    var pEl = $('#peak-watts');
    var cEl = $('#appliance-count');
    var nextBtn = $('#guided-next-from-appliances');
    if (rEl) rEl.textContent = fmt(running) + 'W';
    if (pEl) pEl.textContent = fmt(peak) + 'W';
    if (cEl) cEl.textContent = count;
    if (nextBtn) nextBtn.disabled = running === 0;

    // Human-readable system size indicator
    var badgeEl = $('#load-size-badge');
    var textEl = $('#load-size-text');
    if (badgeEl && textEl) {
        var tier;
        if (running === 0)       tier = { label: 'Add appliances to begin', cls: 'empty', icon: 'fa-bolt' };
        else if (running <= 800) tier = { label: 'Light use — a small inverter will do', cls: 'tiny', icon: 'fa-seedling' };
        else if (running <= 1500) tier = { label: 'Small system — basic home backup', cls: 'small', icon: 'fa-house' };
        else if (running <= 3500) tier = { label: 'Medium system — covers most homes', cls: 'medium', icon: 'fa-house-chimney' };
        else if (running <= 6000) tier = { label: 'Large system — full home or small office', cls: 'large', icon: 'fa-building' };
        else if (running <= 10000) tier = { label: 'Heavy system — large property or business', cls: 'heavy', icon: 'fa-industry' };
        else                       tier = { label: 'Commercial grade — three-phase territory', cls: 'commercial', icon: 'fa-warehouse' };
        textEl.textContent = tier.label;
        badgeEl.className = 'load-size-badge ' + tier.cls;
        badgeEl.querySelector('i').className = 'fas ' + tier.icon;
    }
}

/* ---------- guided mode: recommendations ---------- */
function renderRecommendations() {
    var watts = state.guidedRunningWatts;
    var peakWatts = state.guidedPeakWatts;
    var recWattsEl = $('#rec-watts-display');
    if (recWattsEl) recWattsEl.textContent = fmt(watts) + 'W';

    var phaseInfo = $('#rec-phase-info');
    var wrap = $('#rec-inverter-options');
    if (!wrap) return;
    wrap.innerHTML = '';

    // Determine recommended phase
    var recommendThreePhase = watts > 10000 || peakWatts > 15000;

    if (recommendThreePhase) {
        state.phase = 'three';
        if (phaseInfo) phaseInfo.innerHTML =
            '<div class="rec-phase-badge three">' +
                '<i class="fas fa-building"></i>' +
                '<div><strong>Three Phase Recommended</strong><p>Your ' + fmt(watts) + 'W load needs a commercial-grade 3-phase system.</p></div>' +
            '</div>';

        // Show Kstar 3-phase packages first, then ATESS
        var allPackages = [];
        kstarThreePhasePackages.forEach(function(pkg) {
            if (pkg.watts >= watts * 0.8) allPackages.push({ pkg: pkg, brand: 'Kstar' });
        });
        atessThreePhasePackages.forEach(function(pkg) {
            if (pkg.watts >= watts * 0.6) allPackages.push({ pkg: pkg, brand: 'ATESS' });
        });

        if (allPackages.length === 0) {
            // Show all anyway
            kstarThreePhasePackages.forEach(function(pkg) { allPackages.push({ pkg: pkg, brand: 'Kstar' }); });
            atessThreePhasePackages.forEach(function(pkg) { allPackages.push({ pkg: pkg, brand: 'ATESS' }); });
        }

        allPackages.forEach(function(item) {
            var pkg = item.pkg;
            var brand = item.brand;
            var sel = state.inverter && state.inverter.id === pkg.id;
            var enough = pkg.watts >= watts;
            var pct = Math.min(Math.round((pkg.watts / watts) * 100), 200);
            var pkgPrice = brand === 'Kstar' ? pkg.packagePrice : pkg.inverterPrice;
            var priceLabel = brand === 'Kstar' ? 'Package (Inverter + Battery)' : 'Inverter only';

            var batInfo = '';
            if (brand === 'Kstar' && pkg.batteries) {
                batInfo = '<span class="card-meta"><i class="fas fa-car-battery"></i> Includes ' + pkg.batteries.count + '× ' + pkg.batteries.name + ' (' + pkg.batteries.totalCapacity + ')</span>';
            }
            if (brand === 'ATESS' && pkg.battery) {
                batInfo = '<span class="card-meta"><i class="fas fa-car-battery"></i> ' + pkg.battery.name + ' — configurable 1–3 master pairs</span>';
            }

            var matchBar =
                '<div class="capacity-match"><div class="match-bar"><div class="match-fill ' + (enough ? 'enough' : 'short') + '" style="width:' + Math.min(pct, 100) + '%"></div></div>' +
                '<span class="match-text ' + (enough ? 'enough' : 'short') + '">' + (enough ? '✓ Covers your ' + fmt(watts) + 'W' : '⚠ Under your ' + fmt(watts) + 'W needs') + '</span></div>';

            var el = document.createElement('div');
            el.className = 'product-card pkg-card' + (sel ? ' selected' : '');
            el.innerHTML =
                '<span class="card-badge badge-premium"><i class="fas fa-bolt"></i> ' + brand + ' 3-Phase</span>' +
                '<div class="card-check"><i class="fas fa-check"></i></div>' +
                '<div class="card-thumb"><img src="' + pkg.img + '" alt="Package" loading="lazy"></div>' +
                '<div class="card-body">' +
                    '<span class="card-title">' + brand + ' ' + pkg.name + '</span>' +
                    '<span class="card-subtitle">' + pkg.bestFor + '</span>' +
                    '<span class="card-price">' + fmt(pkgPrice) + ' Ksh <small>(' + priceLabel + ')</small></span>' +
                    '<span class="card-meta"><i class="fas fa-solar-panel"></i> ' + pkg.panelCount + '× 600W Solar Panels</span>' +
                    batInfo +
                    matchBar +
                '</div>';
            el.addEventListener('click', function() { guidedSelectPackage(pkg, brand); });
            wrap.appendChild(el);
        });
    } else {
        state.phase = 'single';
        if (phaseInfo) phaseInfo.innerHTML =
            '<div class="rec-phase-badge single">' +
                '<i class="fas fa-house"></i>' +
                '<div><strong>Single Phase — Perfect for Your Home</strong><p>Your ' + fmt(watts) + 'W load is well-suited for a single-phase inverter system.</p></div>' +
            '</div>';

        // Combine Kstar + Fortuner, sorted by capacity fit
        var allInverters = [];
        kstarSingleInverters.forEach(function(inv) {
            if (!inv.outOfStock) allInverters.push({ inv: inv, brand: 'Kstar' });
        });
        fortunerInverters.forEach(function(inv) {
            if (!inv.outOfStock) allInverters.push({ inv: inv, brand: 'Fortuner' });
        });

        // Sort: best fit first (smallest that covers the load)
        allInverters.sort(function(a, b) {
            var aFit = a.inv.maxWatts >= watts ? 0 : 1;
            var bFit = b.inv.maxWatts >= watts ? 0 : 1;
            if (aFit !== bFit) return aFit - bFit;
            return a.inv.maxWatts - b.inv.maxWatts;
        });

        // Add recommended badge to the best fit
        var bestIdx = -1;
        allInverters.forEach(function(item, i) {
            if (bestIdx === -1 && item.inv.maxWatts >= watts) bestIdx = i;
        });

        allInverters.forEach(function(item, idx) {
            var inv = item.inv;
            var brand = item.brand;
            var sel = state.inverter && state.inverter.kva === inv.kva && state.inverter.voltage === inv.voltage && (inv.series ? inv.series === state.inverter.series : true);
            var enough = inv.maxWatts >= watts;
            var pct = Math.min(Math.round((inv.maxWatts / watts) * 100), 200);

            var matchBar = '';
            if (watts > 0) {
                matchBar =
                    '<div class="capacity-match"><div class="match-bar"><div class="match-fill ' + (enough ? 'enough' : 'short') + '" style="width:' + Math.min(pct, 100) + '%"></div></div>' +
                    '<span class="match-text ' + (enough ? 'enough' : 'short') + '">' + (enough ? '✓ Covers your ' + fmt(watts) + 'W' : '⚠ Under your ' + fmt(watts) + 'W needs') + '</span></div>';
            }

            var badge = '';
            if (idx === bestIdx) badge = '<span class="card-badge badge-rec"><i class="fas fa-thumbs-up"></i> Best Match</span>';
            else if (inv.series === 'Residential ESS') badge = '<span class="card-badge badge-premium"><i class="fas fa-gem"></i> Premium ESS</span>';

            var w = inv.watts ? ' (' + inv.watts + 'W)' : '';
            var title = brand + ' ' + (inv.series ? inv.series + ' ' : '') + inv.kva + 'kVA' + w + ' – ' + inv.voltage + 'V';
            if (inv.model) title = brand + ' ' + inv.series + ' ' + inv.model + ' ' + (inv.watts / 1000) + 'KW';

            var el = document.createElement('div');
            el.className = 'product-card' + (sel ? ' selected' : '');
            el.innerHTML =
                badge +
                '<div class="card-check"><i class="fas fa-check"></i></div>' +
                '<div class="card-thumb"><img src="' + inv.img + '" alt="Inverter" loading="lazy"></div>' +
                '<div class="card-body">' +
                    '<span class="card-title">' + title + '</span>' +
                    '<span class="card-subtitle">' + inv.bestFor + '</span>' +
                    '<span class="card-price">' + fmt(inv.price) + ' Ksh</span>' +
                    '<span class="card-meta">Efficiency: ' + inv.details.efficiency + ' · Max: ' + fmt(inv.maxWatts) + 'W</span>' +
                    (inv.essBattery ? '<div class="ess-battery-banner"><i class="fas fa-car-battery"></i> Includes ' + inv.essBattery.count + '× ' + inv.essBattery.name + ' (' + inv.essBattery.totalCapacity + ') — no battery selection needed</div>' : '') +
                    matchBar +
                '</div>';
            el.addEventListener('click', function() { guidedSelectInverter(inv, brand); });
            wrap.appendChild(el);
        });
    }
}

function guidedSelectInverter(inv, brand) {
    state.company = brand;
    state.inverter = inv;
    state.battery = null;
    state.compareList = [];
    calcPanels();

    if (inv.series === 'Residential ESS') {
        toast('ESS ' + inv.model + ' selected with included batteries', 'success');
        setTimeout(function() { goTo('summary'); }, 250);
    } else {
        var w = inv.watts ? ' (' + inv.watts + 'W)' : '';
        toast(inv.kva + 'kVA' + w + ' selected — now pick your battery', 'success');
        setTimeout(function() { goTo('guided-battery'); }, 250);
    }
    saveState();
}

function guidedSelectPackage(pkg, brand) {
    state.company = brand;
    state.inverter = pkg;
    state.battery = null;
    state.compareList = [];
    calcPanels();

    if (brand === 'Kstar') {
        toast(pkg.name + ' package selected', 'success');
        setTimeout(function() { goTo('summary'); }, 250);
    } else {
        state.atessMasterCount = 3;
        toast(pkg.name + ' selected — configure your battery', 'success');
        setTimeout(function() { goTo('guided-battery'); }, 250);
    }
    saveState();
}

/* ---------- guided mode: battery selection ---------- */
function renderGuidedBatteries() {
    var wrap = $('#guided-battery-options');
    var reminderEl = $('#guided-inverter-reminder');
    if (!wrap) return;
    wrap.innerHTML = '';

    var inv = state.inverter;
    if (!inv) return;

    // Show what they picked
    if (reminderEl) {
        var w = inv.watts ? ' (' + inv.watts + 'W)' : '';
        var invLabel = state.company + ' ' + (inv.series ? inv.series + ' ' : '') + inv.kva + 'kVA' + w;
        if (inv.model) invLabel = state.company + ' ' + (inv.series ? inv.series + ' ' : '') + inv.model;
        reminderEl.innerHTML =
            '<div class="guided-reminder-card"><i class="fas fa-bolt"></i>' +
            '<div><strong>Your Inverter:</strong> ' + invLabel + '</div></div>';
    }

    if (state.phase === 'three' && state.company === 'ATESS') {
        renderAtessBatteryConfig();
        // Move ATESS battery config HTML into guided wrap
        var atessWrap = $('#battery-options');
        if (atessWrap && atessWrap.innerHTML) {
            wrap.innerHTML = atessWrap.innerHTML;
            // Re-attach click listeners
            wrap.querySelectorAll('.product-card').forEach(function(card) {
                var masters = parseInt(card.dataset.masters);
                if (!isNaN(masters)) {
                    card.addEventListener('click', function(e) {
                        if (!e.target.closest('a')) selectAtessBatteryConfig(masters);
                    });
                }
            });
        }
        return;
    }

    // Single-phase batteries
    batteries.forEach(function(bat) {
        var info = getBatteryCompat(bat);
        if (!info) return;
        var count = info.count;
        var compatible = info.compatible;
        var reason = info.reason;
        var sel = state.battery && state.battery.id === bat.id && state.battery.count === count;

        var el = document.createElement('div');
        if (!compatible) {
            el.className = 'product-card incompatible';
            el.innerHTML =
                '<div class="card-thumb"><img src="' + bat.img + '" alt="Battery" loading="lazy"></div>' +
                '<div class="card-body">' +
                    '<span class="card-title">' + bat.name + '</span>' +
                    '<span class="card-price">' + fmt(bat.price) + ' Ksh/unit</span>' +
                    '<div class="incompat-reason"><i class="fas fa-ban"></i><span>' + reason + '</span></div>' +
                '</div>';
        } else {
            var totalCost = bat.price * count;
            var badge = '';
            if (bat.type === 'lithium') badge = '<span class="card-badge badge-premium"><i class="fas fa-gem"></i> Premium</span>';
            el.className = 'product-card' + (sel ? ' selected' : '');
            el.innerHTML =
                badge +
                '<div class="card-check"><i class="fas fa-check"></i></div>' +
                '<div class="card-thumb"><img src="' + bat.img + '" alt="Battery" loading="lazy"></div>' +
                '<div class="card-body">' +
                    '<span class="card-title">' + bat.name + '</span>' +
                    '<span class="card-subtitle">' + bat.shortDesc + '</span>' +
                    '<span class="card-price">' + fmt(bat.price) + ' Ksh/unit</span>' +
                    '<span class="card-meta">' + count + ' units needed · Total: ' + fmt(totalCost) + ' Ksh</span>' +
                    '<span class="card-meta"><i class="fas fa-clock"></i> Backup: ~' + bat.backupHours + ' hrs · ' + bat.warranty + ' warranty</span>' +
                    '<div class="card-actions">' +
                        '<a href="' + bat.specsLink + '" target="_blank" rel="noopener" class="card-link card-btn"><i class="fas fa-external-link-alt"></i> Specs</a>' +
                    '</div>' +
                '</div>';
            el.addEventListener('click', function(e) {
                if (!e.target.closest('a')) selectBattery(bat, count);
            });
        }
        wrap.appendChild(el);
    });
}

/* ---------- summary ---------- */
function renderSummary() {
    renderSelectionOverview();
    renderPanelInfo();
    renderAccessoriesBlock();
    renderCostBreakdown();
    renderFinancing();
    renderEnvironmentalImpact();
    initSavingsCalc();
    updateRunningTotal();
}

function renderSelectionOverview() {
    var cards = $('#selection-cards');
    if (!cards) return;
    var html = '';

    html += '<div class="sel-card">' +
        '<div class="sel-card-icon"><i class="fas fa-wave-square"></i></div>' +
        '<div class="sel-card-info"><span class="sel-card-label">Phase</span><span class="sel-card-val">' + (state.phase === 'single' ? 'Single Phase' : 'Three Phase') + '</span></div>' +
        '<button class="sel-card-edit" data-goto="phase"><i class="fas fa-pen"></i></button></div>';

    html += '<div class="sel-card">' +
        '<div class="sel-card-icon"><i class="fas fa-building"></i></div>' +
        '<div class="sel-card-info"><span class="sel-card-label">Brand</span><span class="sel-card-val">' + state.company + '</span></div>' +
        '<button class="sel-card-edit" data-goto="company"><i class="fas fa-pen"></i></button></div>';

    if (state.phase === 'three') {
        html += '<div class="sel-card">' +
            '<div class="sel-card-icon"><i class="fas fa-bolt"></i></div>' +
            '<div class="sel-card-info"><span class="sel-card-label">Package</span><span class="sel-card-val">' + state.company + ' ' + state.inverter.name + '</span></div>' +
            '<button class="sel-card-edit" data-goto="inverter"><i class="fas fa-pen"></i></button></div>';
        if (state.company === 'ATESS') {
            var cfg = state.inverter.battery.configs[state.atessMasterCount - 1];
            html += '<div class="sel-card">' +
                '<div class="sel-card-icon"><i class="fas fa-car-battery"></i></div>' +
                '<div class="sel-card-info"><span class="sel-card-label">Battery Config</span><span class="sel-card-val">' + cfg.totalUnits + '× ' + state.inverter.battery.name + ' (' + cfg.capacity + ')</span></div>' +
                '<button class="sel-card-edit" data-goto="battery"><i class="fas fa-pen"></i></button></div>';
        } else {
            var bat = state.inverter.batteries;
            html += '<div class="sel-card">' +
                '<div class="sel-card-icon"><i class="fas fa-car-battery"></i></div>' +
                '<div class="sel-card-info"><span class="sel-card-label">Battery (Included)</span><span class="sel-card-val">' + bat.count + '× ' + bat.name + ' (' + bat.totalCapacity + ')</span></div></div>';
        }
    } else {
        var inv = state.inverter;
        var w = inv.watts ? ' (' + inv.watts + 'W)' : '';
        var invLabel = inv.series ? inv.series + ' ' + inv.kva + 'kVA' + w : inv.kva + 'kVA' + w;
        html += '<div class="sel-card">' +
            '<div class="sel-card-icon"><i class="fas fa-bolt"></i></div>' +
            '<div class="sel-card-info"><span class="sel-card-label">Inverter</span><span class="sel-card-val">' + invLabel + ' – ' + inv.voltage + 'V</span></div>' +
            '<button class="sel-card-edit" data-goto="inverter"><i class="fas fa-pen"></i></button></div>';

        if (inv.series === 'Residential ESS') {
            html += '<div class="sel-card">' +
                '<div class="sel-card-icon"><i class="fas fa-car-battery"></i></div>' +
                '<div class="sel-card-info"><span class="sel-card-label">Battery (Included)</span><span class="sel-card-val">' + inv.essBattery.count + '× ' + inv.essBattery.name + ' (' + inv.essBattery.totalCapacity + ')</span></div></div>';
        } else if (state.battery) {
            html += '<div class="sel-card">' +
                '<div class="sel-card-icon"><i class="fas fa-car-battery"></i></div>' +
                '<div class="sel-card-info"><span class="sel-card-label">Battery</span><span class="sel-card-val">' + state.battery.name + ' × ' + state.battery.count + '</span></div>' +
                '<button class="sel-card-edit" data-goto="battery"><i class="fas fa-pen"></i></button></div>';
        }
    }

    cards.innerHTML = html;
    cards.querySelectorAll('.sel-card-edit').forEach(function(btn) {
        btn.addEventListener('click', function() { goTo(btn.dataset.goto); });
    });
}

function renderPanelInfo() {
    var panelInfo = $('#panel-info');
    var panelImages = $('#panel-images');
    if (!panelInfo) return;
    var pw = state.panelType ? state.panelType.watts : 600;
    var pp = getPanelPrice();
    if (state.panels > 0) {
        panelInfo.innerHTML =
            '<p><strong>' + state.panels + '</strong> × ' + pw + 'W solar panels</p>' +
            '<p class="price">' + fmt(pp) + ' Ksh each · Total: ' + fmt(state.panels * pp) + ' Ksh</p>' +
            '<a href="' + (state.panelType ? state.panelType.specsLink : '#') + '" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Panel Specs</a>';
    } else {
        panelInfo.innerHTML = '<p>No solar panels needed for this configuration.</p>';
    }
    if (panelImages) {
        panelImages.innerHTML = '';
        var showCount = Math.min(state.panels, 20);
        for (var i = 0; i < showCount; i++) {
            var img = document.createElement('img');
            img.src = 'images/solar-panel.png';
            img.loading = 'lazy';
            img.alt = 'Solar Panel';
            panelImages.appendChild(img);
        }
        if (state.panels > 20) {
            var more = document.createElement('span');
            more.className = 'panel-more';
            more.textContent = '+' + (state.panels - 20) + ' more';
            panelImages.appendChild(more);
        }
    }
}

function renderAccessoriesBlock() {
    var block = $('#accessory-block');
    if (!block) return;

    if (state.phase === 'three') {
        if (state.company === 'ATESS') {
            var accHtml = '<div class="quote-block-header"><span class="qb-num">3</span><div><h2>Package Accessories</h2><p class="qb-hint">Equipment included with your system</p></div></div><div class="acc-grid">';
            state.inverter.accessories.forEach(function(acc) {
                accHtml += '<div class="acc-card">' +
                    '<i class="fas fa-microchip"></i>' +
                    '<span class="acc-name">' + acc.name + '</span>' +
                    '<span class="acc-price">' + fmt(usdToKes(acc.usdPrice)) + ' Ksh</span>' +
                    '<span class="acc-warranty">' + acc.warranty + '</span>' +
                    (acc.specsLink ? '<a href="' + acc.specsLink + '" target="_blank" rel="noopener" class="acc-specs-link"><i class="fas fa-external-link-alt"></i> Specs</a>' : '') +
                '</div>';
            });
            accHtml += '<div class="acc-card"><i class="fas fa-solar-panel"></i><span class="acc-name">Mounting & Cables</span><span class="acc-price">' + fmt(getMountingCost()) + ' Ksh</span><span class="acc-warranty">' + state.panels + ' panels × ' + fmt(usdToKes(USD_PRICES.mountingPerPanel)) + ' Ksh</span></div>';
            accHtml += '</div>';
            block.innerHTML = accHtml;
        } else {
            block.innerHTML =
                '<div class="quote-block-header"><span class="qb-num">3</span><div><h2>Included Items</h2><p class="qb-hint">Equipment included with your system</p></div></div>' +
                '<div class="acc-grid">' +
                    '<div class="acc-card"><i class="fas fa-solar-panel"></i><span class="acc-name">Mounting & Cables</span><span class="acc-price">' + fmt(getMountingCost()) + ' Ksh</span><span class="acc-warranty">' + state.panels + ' panels × ' + fmt(usdToKes(USD_PRICES.mountingPerPanel)) + ' Ksh</span></div>' +
                '</div>';
        }
    } else {
        block.innerHTML =
            '<div class="quote-block-header"><span class="qb-num">3</span><div><h2>Included Accessories</h2><p class="qb-hint">Standard items bundled with your inverter</p></div></div>' +
            '<div class="acc-grid">' +
                '<div class="acc-card"><i class="fas fa-toggle-on"></i><span class="acc-name">Change Over Switch</span><span class="acc-price" id="acc-changeover-price">' + fmt(usdToKes(USD_PRICES.changeOverSwitch)) + ' Ksh</span></div>' +
                '<div class="acc-card"><i class="fas fa-plug"></i><span class="acc-name">DC MCCB</span><span class="acc-price" id="acc-dc-mccb-price">' + fmt(usdToKes(USD_PRICES.accessories.dcMccb)) + ' Ksh</span></div>' +
                '<div class="acc-card"><i class="fas fa-sliders-h"></i><span class="acc-name">AVS 30 AMPS</span><span class="acc-price" id="acc-avs-price">' + fmt(usdToKes(USD_PRICES.accessories.avs30Amps)) + ' Ksh</span></div>' +
                '<div class="acc-card" id="mounting-cost"><i class="fas fa-solar-panel"></i><span class="acc-name">Mounting & Cables</span><span class="acc-price">' + fmt(getMountingCost()) + ' Ksh</span><span class="acc-warranty">' + state.panels + ' panels × ' + fmt(usdToKes(USD_PRICES.mountingPerPanel)) + ' Ksh</span></div>' +
            '</div>';
    }
}

function renderCostBreakdown() {
    var summaryEl = $('#summary');
    var totalEl = $('#total-cost');
    var noSolarEl = $('#no-solar-summary');
    if (!summaryEl) return;

    if (state.phase === 'three') {
        renderThreePhaseCostBreakdown(summaryEl, totalEl, noSolarEl);
    } else {
        renderSinglePhaseCostBreakdown(summaryEl, totalEl, noSolarEl);
    }
}

function renderSinglePhaseCostBreakdown(summaryEl, totalEl, noSolarEl) {
    var inv = state.inverter;
    var w = inv.watts ? ' (' + inv.watts + 'W)' : '';
    var invLabel = (inv.series ? inv.series + ' ' : '') + inv.kva + 'kVA' + w + ' – ' + inv.voltage + 'V';
    var invCost = inv.price;
    var labCost = inv.labour;
    var panCost = state.panels * getPanelPrice();
    var accCost = getSinglePhaseAccessoryCost();
    var batCost, batLabel;

    if (inv.series === 'Residential ESS') {
        batCost = getEssBatteryCost();
        batLabel = inv.essBattery.name + ' × ' + inv.essBattery.count;
    } else {
        batCost = state.battery.price * state.battery.count;
        batLabel = state.battery.name + ' × ' + state.battery.count;
    }

    var total = invCost + labCost + batCost + panCost + accCost;
    var pw = state.panelType ? state.panelType.watts : 600;

    summaryEl.innerHTML =
        '<div class="row"><span>Inverter: ' + state.company + ' ' + invLabel + '</span><span class="row-val">' + fmt(invCost) + ' Ksh</span></div>' +
        '<div class="row"><span>Installation & Labour (+VAT)</span><span class="row-val">' + fmt(labCost) + ' Ksh</span></div>' +
        '<div class="row"><span>Batteries: ' + batLabel + '</span><span class="row-val">' + fmt(batCost) + ' Ksh</span></div>' +
        '<div class="row"><span>Solar Panels: ' + state.panels + ' × ' + pw + 'W</span><span class="row-val">' + fmt(panCost) + ' Ksh</span></div>' +
        '<div class="row"><span>Accessories & Mounting</span><span class="row-val">' + fmt(accCost) + ' Ksh</span></div>';

    if (totalEl) totalEl.textContent = fmt(total) + ' KSH';

    if (noSolarEl) {
        var noSolar = getNoSolarBreakdown();
        if (noSolar) {
            noSolarEl.innerHTML =
                '<h3>Without Solar Panels Option</h3>' +
                '<div class="row"><span>Inverter</span><span class="row-val">' + fmt(noSolar.inverter) + ' Ksh</span></div>' +
                '<div class="row"><span>Batteries</span><span class="row-val">' + fmt(noSolar.battery) + ' Ksh</span></div>' +
                '<div class="row"><span>Change Over Switch</span><span class="row-val">' + fmt(noSolar.changeOver) + ' Ksh</span></div>' +
                '<div class="row"><span>AC Cable</span><span class="row-val">' + fmt(noSolar.acCable) + ' Ksh</span></div>' +
                '<div class="row"><span>Installation & Labour</span><span class="row-val">' + fmt(noSolar.labour) + ' Ksh</span></div>' +
                '<div class="no-solar-total"><span>Total Without Solar Panels</span><span>' + fmt(noSolar.total) + ' KSH</span></div>';
            noSolarEl.style.display = '';
        } else {
            noSolarEl.innerHTML = '';
            noSolarEl.style.display = 'none';
        }
    }
}

function renderThreePhaseCostBreakdown(summaryEl, totalEl, noSolarEl) {
    var inv = state.inverter;
    var panCost = state.panels * getPanelPrice();
    var mountCost = getMountingCost();
    var labCost = inv.labour;
    var html = '';

    if (state.company === 'Kstar') {
        var pkgCost = inv.packagePrice;
        var total = pkgCost + panCost + mountCost + labCost;
        html =
            '<div class="row"><span>Package: ' + inv.name + ' (Inverter + ' + inv.batteries.count + '× ' + inv.batteries.name + ')</span><span class="row-val">' + fmt(pkgCost) + ' Ksh</span></div>' +
            '<div class="row"><span>Solar Panels: ' + state.panels + ' × 600W</span><span class="row-val">' + fmt(panCost) + ' Ksh</span></div>' +
            '<div class="row"><span>Mounting & Cables</span><span class="row-val">' + fmt(mountCost) + ' Ksh</span></div>' +
            '<div class="row"><span>Installation & Labour (+VAT)</span><span class="row-val">' + fmt(labCost) + ' Ksh</span></div>';
        if (totalEl) totalEl.textContent = fmt(total) + ' KSH';
    } else {
        var invCost = inv.inverterPrice;
        var accCost = getAtessAccessoryCost();
        var batCost = getAtessBatteryCost();
        var cfg = inv.battery.configs[state.atessMasterCount - 1];
        var total2 = invCost + accCost + batCost + panCost + mountCost + labCost;

        html =
            '<div class="row"><span>Inverter: ATESS ' + inv.model + '</span><span class="row-val">' + fmt(invCost) + ' Ksh</span></div>';
        inv.accessories.forEach(function(acc) {
            html += '<div class="row"><span>' + acc.name + '</span><span class="row-val">' + fmt(usdToKes(acc.usdPrice)) + ' Ksh</span></div>';
        });
        html +=
            '<div class="row"><span>Batteries: ' + cfg.totalUnits + '× ' + inv.battery.name + ' (' + cfg.capacity + ')</span><span class="row-val">' + fmt(batCost) + ' Ksh</span></div>' +
            '<div class="row"><span>Solar Panels: ' + state.panels + ' × 600W</span><span class="row-val">' + fmt(panCost) + ' Ksh</span></div>' +
            '<div class="row"><span>Mounting & Cables</span><span class="row-val">' + fmt(mountCost) + ' Ksh</span></div>' +
            '<div class="row"><span>Installation & Labour (+VAT)</span><span class="row-val">' + fmt(labCost) + ' Ksh</span></div>';
        if (totalEl) totalEl.textContent = fmt(total2) + ' KSH';
    }

    summaryEl.innerHTML = html;
    if (noSolarEl) { noSolarEl.innerHTML = ''; noSolarEl.style.display = 'none'; }
}

function renderFinancing() {
    var total = getTotal();
    if (total <= 0) return;
    var el6 = $('#fin-6'), el12 = $('#fin-12'), el24 = $('#fin-24');
    if (el6) el6.textContent = 'KSH ' + fmt(Math.round(total / 6));
    if (el12) el12.textContent = 'KSH ' + fmt(Math.round(total / 12));
    if (el24) el24.textContent = 'KSH ' + fmt(Math.round(total * 1.1 / 24));
}

/* ---------- environmental impact ---------- */
function calcImpact() {
    var pw = state.panelType ? state.panelType.watts : 600;
    var sunHrs = 4.1, eff = 0.9, co2Factor = 0.7, treeFactor = 22, householdCo2 = 5000;
    var kwh = state.panels * pw * sunHrs * 365 * eff / 1000;
    var co2 = kwh * co2Factor;
    var trees = co2 / treeFactor;
    var pct = Math.min((co2 / householdCo2) * 100, 100);
    return { kwh: Math.round(kwh), co2: Math.round(co2), trees: Math.round(trees), pct: Math.round(pct) };
}

function renderEnvironmentalImpact() {
    var envBlock = $('#env-block');
    if (state.panels === 0) { if (envBlock) envBlock.style.display = 'none'; return; }
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

/* ---------- savings ---------- */
function initSavingsCalc() {
    var input = $('#monthly-bill');
    if (!input) return;
    input.value = '';
    var results = $('#savings-results');
    if (results) results.classList.add('hidden');
    var debounce;
    input.removeEventListener('input', input._savingsHandler);
    input._savingsHandler = function() { clearTimeout(debounce); debounce = setTimeout(calculateSavings, 300); };
    input.addEventListener('input', input._savingsHandler);
}

function calculateSavings() {
    var billInput = $('#monthly-bill');
    var results = $('#savings-results');
    if (!billInput || !results) return;
    var bill = parseFloat(billInput.value) || 0;
    if (bill <= 0 || state.panels === 0) { results.classList.add('hidden'); return; }
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
    $('#payback-period').textContent = paybackYears > 0 ? paybackYears.toFixed(1) + ' years' : '—';
    var tenYrEl = $('#ten-year-savings');
    tenYrEl.textContent = tenYearNet > 0 ? 'KSH ' + fmt(Math.round(tenYearNet)) : '—';
    tenYrEl.classList.toggle('positive', tenYearNet > 0);
    tenYrEl.classList.toggle('negative', tenYearNet <= 0);
}

/* ---------- appliance modal ---------- */
function showApplianceModal(inv) {
    var w = inv.watts ? ' (' + inv.watts + 'W)' : '';
    var seriesLabel = inv.series ? inv.series + ' ' : '';
    $('#modal-title').textContent = state.company + ' ' + seriesLabel + inv.kva + 'kVA' + w + ' – Compatible Appliances';
    var featureList = inv.details.features.map(function(f) { return '<li><i class="fas fa-check"></i> ' + f + '</li>'; }).join('');
    $('#modal-body').innerHTML =
        '<ul class="compat-list">' + inv.appliances.map(function(a) {
            return '<li><i class="fas fa-check-circle"></i> <strong>' + a.count + '×</strong> ' + a.name + '</li>';
        }).join('') + '</ul>' +
        '<div class="detail-box"><p><strong>Efficiency:</strong> ' + inv.details.efficiency + '</p><p><strong>Battery Support:</strong> ' + inv.details.batteryCompatibility + '</p><p><strong>Max Output:</strong> ' + fmt(inv.maxWatts) + 'W continuous</p></div>' +
        '<div class="detail-box" style="margin-top:12px"><p><strong>Features:</strong></p><ul class="feature-list">' + featureList + '</ul></div>';
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

/* ---------- share / export helpers ---------- */
function buildText() {
    var name = $('#user-name').value || 'Customer';
    var email = $('#user-email').value || '';
    var phone = $('#user-phone').value ? $('#country-code').value + $('#user-phone').value : 'Not provided';
    var total = $('#total-cost').textContent;
    return { name: name, email: email, phone: phone, total: total };
}

function buildQuoteLines() {
    var lines = [];
    var pw = state.panelType ? state.panelType.watts : 600;

    if (state.phase === 'three') {
        if (state.company === 'Kstar') {
            var pkg = state.inverter;
            lines.push({ label: 'Package: Kstar ' + pkg.name, value: fmt(pkg.packagePrice) + ' Ksh' });
            lines.push({ label: '  Includes: ' + pkg.batteries.count + '× ' + pkg.batteries.name + ' (' + pkg.batteries.totalCapacity + ')', value: '' });
            lines.push({ label: 'Solar Panels: ' + state.panels + ' × 600W', value: fmt(state.panels * getPanelPrice()) + ' Ksh' });
            lines.push({ label: 'Mounting & Cables', value: fmt(getMountingCost()) + ' Ksh' });
            lines.push({ label: 'Installation & Labour (+VAT)', value: fmt(pkg.labour) + ' Ksh' });
        } else {
            var inv = state.inverter;
            var cfg = inv.battery.configs[state.atessMasterCount - 1];
            lines.push({ label: 'Inverter: ATESS ' + inv.model, value: fmt(inv.inverterPrice) + ' Ksh' });
            inv.accessories.forEach(function(acc) {
                lines.push({ label: acc.name, value: fmt(usdToKes(acc.usdPrice)) + ' Ksh' });
            });
            lines.push({ label: 'Batteries: ' + cfg.totalUnits + '× ' + inv.battery.name + ' (' + cfg.capacity + ')', value: fmt(getAtessBatteryCost()) + ' Ksh' });
            lines.push({ label: 'Solar Panels: ' + state.panels + ' × 600W', value: fmt(state.panels * getPanelPrice()) + ' Ksh' });
            lines.push({ label: 'Mounting & Cables', value: fmt(getMountingCost()) + ' Ksh' });
            lines.push({ label: 'Installation & Labour (+VAT)', value: fmt(inv.labour) + ' Ksh' });
        }
    } else {
        var inv2 = state.inverter;
        var w = inv2.watts ? ' (' + inv2.watts + 'W)' : '';
        var ser = inv2.series ? inv2.series + ' ' : '';
        lines.push({ label: 'Inverter: ' + state.company + ' ' + ser + inv2.kva + 'kVA' + w + ' – ' + inv2.voltage + 'V', value: fmt(inv2.price) + ' Ksh' });
        lines.push({ label: 'Installation & Labour (+VAT)', value: fmt(inv2.labour) + ' Ksh' });

        if (inv2.series === 'Residential ESS') {
            lines.push({ label: 'Batteries: ' + inv2.essBattery.count + '× ' + inv2.essBattery.name, value: fmt(getEssBatteryCost()) + ' Ksh' });
        } else if (state.battery) {
            lines.push({ label: 'Batteries: ' + state.battery.name + ' × ' + state.battery.count, value: fmt(state.battery.price * state.battery.count) + ' Ksh' });
        }
        lines.push({ label: 'Solar Panels: ' + state.panels + ' × ' + pw + 'W', value: fmt(state.panels * getPanelPrice()) + ' Ksh' });
        lines.push({ label: 'Accessories & Mounting', value: fmt(getSinglePhaseAccessoryCost()) + ' Ksh' });
    }
    return lines;
}

function shareSummary() {
    if (!validateForm()) return;
    var d = buildText();
    var lines = buildQuoteLines();
    var body = 'Solar System Quote for ' + d.name + '\n\nEmail: ' + d.email + '\nPhone: ' + d.phone + '\n\nSYSTEM BREAKDOWN\n';
    lines.forEach(function(l) { body += l.label + (l.value ? ': ' + l.value : '') + '\n'; });
    body += '\nTOTAL: ' + d.total + '\n\nFinal pricing confirmed after site survey.\nContact: +254723984559 | info@sangyug.com\nThank you for choosing Sangyug Solar!';
    var subj = encodeURIComponent('Sangyug Solar Quote for ' + d.name);
    window.open('mailto:?subject=' + subj + '&body=' + encodeURIComponent(body), '_blank');
    toast('Opening email client…', 'info');
}

function shareWhatsApp() {
    if (!validateForm()) return;
    var d = buildText();
    var lines = buildQuoteLines();
    var txt = '*Solar System Quote for ' + d.name + '*\n\nEmail: ' + d.email + '\nPhone: ' + d.phone + '\n\n*SYSTEM BREAKDOWN*\n';
    lines.forEach(function(l) { txt += l.label + (l.value ? ': ' + l.value : '') + '\n'; });
    txt += '\n*TOTAL: ' + d.total + '*\n\nFinal pricing confirmed after site survey.\nContact: +254723984559 | info@sangyug.com\nThank you for choosing Sangyug Solar!';
    window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
    toast('Opening WhatsApp…', 'success');
}

/* ---------- PDF generation ---------- */
function downloadPDF() {
    if (!validateForm()) return;
    if (!window.jspdf) { toast('PDF library still loading. Try again in a moment.', 'warning'); return; }

    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF();
    var blue = [30, 120, 220], dark = [40, 40, 40], gray = [100, 100, 100];
    var y = 20;
    var d = buildText();
    var pw = state.panelType ? state.panelType.watts : 600;

    function checkPage(needed) { if (y + needed > 275) { doc.addPage(); y = 20; } }

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22); doc.setTextColor(blue[0], blue[1], blue[2]);
    doc.text('SANGYUG SOLAR', 105, y, { align: 'center' }); y += 8;
    doc.setFontSize(11); doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text('SYSTEM QUOTATION', 105, y, { align: 'center' }); y += 6;
    doc.setDrawColor(blue[0], blue[1], blue[2]); doc.setLineWidth(0.8);
    doc.line(15, y, 195, y); y += 14;

    // Customer
    doc.setFontSize(10); doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('PREPARED FOR', 20, y); y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text('Name: ' + d.name, 20, y); y += 5;
    doc.text('Email: ' + d.email, 20, y); y += 5;
    doc.text('Phone: ' + d.phone, 20, y);
    doc.text('Date: ' + new Date().toLocaleDateString('en-GB'), 150, y - 10); y += 5;
    doc.text('System: ' + (state.phase === 'single' ? 'Single Phase' : 'Three Phase') + ' — ' + state.company, 20, y); y += 12;

    // Divider
    doc.setDrawColor(230, 230, 230); doc.setLineWidth(0.3); doc.line(20, y, 190, y); y += 8;

    // System breakdown header
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.setTextColor(blue[0], blue[1], blue[2]);
    doc.text('SYSTEM BREAKDOWN', 20, y); y += 10;

    // Table header
    doc.setFillColor(240, 245, 255); doc.rect(20, y - 4, 170, 8, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.text('Item', 22, y);
    doc.text('Amount (Ksh)', 168, y, { align: 'right' }); y += 10;

    // Build rows
    var pdfRows = buildQuoteLines();
    doc.setFont('helvetica', 'normal');
    pdfRows.forEach(function(r, i) {
        checkPage(10);
        if (i % 2 === 1) { doc.setFillColor(248, 248, 252); doc.rect(20, y - 4, 170, 8, 'F'); }
        doc.text(r.label.substring(0, 70), 22, y);
        if (r.value) doc.text(r.value, 168, y, { align: 'right' });
        y += 8;
    });

    // Total
    y += 4; checkPage(20);
    doc.setFillColor(blue[0], blue[1], blue[2]); doc.rect(20, y - 5, 170, 12, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL ESTIMATED COST', 22, y + 2);
    doc.text(d.total, 168, y + 2, { align: 'right' }); y += 20;

    // No Solar option (single phase only)
    var noSolar = getNoSolarBreakdown();
    if (noSolar) {
        checkPage(60);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
        doc.setTextColor(blue[0], blue[1], blue[2]);
        doc.text('WITHOUT SOLAR PANELS OPTION', 20, y); y += 8;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
        doc.setTextColor(dark[0], dark[1], dark[2]);
        var nsRows = [
            ['Inverter', fmt(noSolar.inverter)], ['Batteries', fmt(noSolar.battery)],
            ['Change Over Switch', fmt(noSolar.changeOver)], ['AC Cable', fmt(noSolar.acCable)],
            ['Installation & Labour', fmt(noSolar.labour)]
        ];
        nsRows.forEach(function(r, i) {
            if (i % 2 === 1) { doc.setFillColor(248, 248, 252); doc.rect(20, y - 4, 170, 8, 'F'); }
            doc.text(r[0], 22, y); doc.text(r[1], 168, y, { align: 'right' }); y += 8;
        });
        doc.setFillColor(220, 235, 255); doc.rect(20, y - 4, 170, 9, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
        doc.setTextColor(blue[0], blue[1], blue[2]);
        doc.text('Total Without Solar Panels', 22, y + 2);
        doc.text(fmt(noSolar.total) + ' KSH', 168, y + 2, { align: 'right' }); y += 14;
    }

    // System details for three phase
    if (state.phase === 'three') {
        checkPage(50);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
        doc.setTextColor(blue[0], blue[1], blue[2]);
        doc.text('SYSTEM DETAILS', 20, y); y += 8;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
        doc.setTextColor(dark[0], dark[1], dark[2]);

        if (state.company === 'Kstar') {
            var pkg = state.inverter;
            doc.setFont('helvetica', 'bold');
            doc.text('Inverter:', 22, y); y += 6;
            doc.setFont('helvetica', 'normal');
            pkg.inverterNotes.forEach(function(note) {
                checkPage(8);
                doc.text('• ' + note, 26, y); y += 5;
            });
            y += 4;
            doc.setFont('helvetica', 'bold');
            doc.text('Battery: ' + pkg.batteries.count + '× ' + pkg.batteries.name, 22, y); y += 6;
            doc.setFont('helvetica', 'normal');
            pkg.batteries.notes.forEach(function(note) {
                checkPage(8);
                doc.text('• ' + note, 26, y); y += 5;
            });
            y += 8;
        } else {
            var inv = state.inverter;
            doc.setFont('helvetica', 'bold');
            doc.text('Inverter: ATESS ' + inv.model, 22, y); y += 6;
            doc.setFont('helvetica', 'normal');
            inv.inverterNotes.forEach(function(note) {
                checkPage(8);
                doc.text('• ' + note, 26, y); y += 5;
            });
            y += 3;
            doc.setFont('helvetica', 'bold');
            doc.text('Accessories:', 22, y); y += 6;
            doc.setFont('helvetica', 'normal');
            inv.accessories.forEach(function(acc) {
                checkPage(8);
                doc.text('• ' + acc.name + ' — ' + fmt(usdToKes(acc.usdPrice)) + ' Ksh (' + acc.warranty + ')', 26, y); y += 5;
            });
            y += 3;
            var cfg = inv.battery.configs[state.atessMasterCount - 1];
            doc.setFont('helvetica', 'bold');
            doc.text('Battery: ' + cfg.totalUnits + '× ' + inv.battery.name + ' (' + cfg.capacity + ')', 22, y); y += 6;
            doc.setFont('helvetica', 'normal');
            doc.text('• 51.2V, 100Ah lithium modules', 26, y); y += 5;
            doc.text('• ' + cfg.masters + ' Master + ' + cfg.masters + ' Slave configuration', 26, y); y += 5;
            doc.text('• ' + inv.battery.warranty + ' warranty', 26, y); y += 8;
        }
    }

    // ESS details
    if (state.phase === 'single' && state.inverter.series === 'Residential ESS') {
        checkPage(50);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
        doc.setTextColor(blue[0], blue[1], blue[2]);
        doc.text('SYSTEM DETAILS', 20, y); y += 8;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
        doc.setTextColor(dark[0], dark[1], dark[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('Inverter: Kstar HH10KS', 22, y); y += 6;
        doc.setFont('helvetica', 'normal');
        state.inverter.details.features.forEach(function(f) {
            checkPage(8);
            doc.text('• ' + f, 26, y); y += 5;
        });
        y += 3;
        doc.setFont('helvetica', 'bold');
        doc.text('Battery: ' + state.inverter.essBattery.count + '× ' + state.inverter.essBattery.name, 22, y); y += 6;
        doc.setFont('helvetica', 'normal');
        state.inverter.essBattery.notes.forEach(function(n) {
            checkPage(8);
            doc.text('• ' + n, 26, y); y += 5;
        });
        y += 8;
    }

    // Environmental Impact
    if (state.panels > 0) {
        checkPage(40);
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

    // Notes
    checkPage(40);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.setTextColor(blue[0], blue[1], blue[2]);
    doc.text('IMPORTANT NOTES', 20, y); y += 8;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.text('1. Quote includes solar mounting structure and all listed accessories.', 22, y); y += 6;
    doc.text('2. Final pricing confirmed after site survey by our technical team.', 22, y); y += 6;
    doc.text('3. Installation typically completed within 2–5 business days.', 22, y); y += 6;
    if (state.phase === 'three') {
        doc.text('4. Cable accessories and additional wiring quoted after site survey.', 22, y); y += 6;
    }
    y += 10;

    // Footer
    checkPage(25);
    doc.setDrawColor(blue[0], blue[1], blue[2]); doc.setLineWidth(0.5);
    doc.line(15, y, 195, y); y += 8;
    doc.setFontSize(9); doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text('Thank you for choosing Sangyug Solar!', 105, y, { align: 'center' }); y += 5;
    doc.text('+254 723 984 559 | info@sangyug.com | www.sangyug.com', 105, y, { align: 'center' }); y += 5;
    doc.text('The Big Bang — Ngara, Opp. Rainbow Plaza, Nairobi', 105, y, { align: 'center' });

    var safeName = d.name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
    doc.save('Sangyug_Solar_Quote_' + safeName + '_' + new Date().toISOString().slice(0, 10) + '.pdf');
    toast('PDF downloaded', 'success');
}

/* ---------- reset ---------- */
function resetAll() {
    state.mode = '';
    state.phase = ''; state.company = ''; state.inverter = null;
    state.battery = null; state.panels = 0; state.panelType = null;
    state.compareList = []; state.atessMasterCount = 3;
    state.needs = {}; state.totalWatts = 0;
    state.guidedSpace = 'home'; state.guidedAppliances = {};
    state.guidedCustomDevices = [];
    state.guidedRunningWatts = 0; state.guidedPeakWatts = 0;
    state.guidedCatIdx = 0;
    clearState();
    ['user-name', 'user-email', 'user-phone'].forEach(function(id) { var el = $('#' + id); if (el) el.value = ''; });
    ['name-error', 'email-error', 'phone-error'].forEach(function(id) { var el = $('#' + id); if (el) el.textContent = ''; });
    var billInput = $('#monthly-bill');
    if (billInput) billInput.value = '';
    var savingsResults = $('#savings-results');
    if (savingsResults) savingsResults.classList.add('hidden');
    goTo('landing');
    toast('Starting fresh', 'info');
}

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', function() {
    pricingState.usdToKesAdjusted = getAdjustedUsdToKes(pricingState.usdToKesRaw);
    applyExchangeRatePricing();

    renderFxRatePill();
    renderPhaseSelection();
    renderNeeds();

    // Restore state
    try {
        var saved = localStorage.getItem('solarState');
        if (saved) {
            var s = JSON.parse(saved);
            if (!s.phase) s.phase = 'single';
            Object.assign(state, s);
            if (state.inverter && !state.panelType) calcPanels();
        }
    } catch (e) {}

    var hash = location.hash.slice(1);
    var validLanding = ['landing', 'phase', 'company', 'inverter', 'battery', 'summary', 'appliances', 'recommend', 'guided-battery'];
    var requestedStep;
    if (hash && validLanding.indexOf(hash) !== -1) {
        requestedStep = hash;
    } else if (state.mode) {
        requestedStep = state.step || (state.mode === 'guided' ? 'appliances' : 'phase');
    } else {
        requestedStep = 'landing';
    }
    goTo(requestedStep);

    refreshExchangeRateAndPricing();

    // ── Mode selection (landing page) ──
    var modeGuided = $('#mode-guided');
    if (modeGuided) modeGuided.addEventListener('click', function() {
        state.mode = 'guided';
        state.guidedSpace = 'home';
        state.guidedAppliances = {};
        saveState();
        goTo('appliances');
    });
    var modeCustom = $('#mode-custom');
    if (modeCustom) modeCustom.addEventListener('click', function() {
        state.mode = 'custom';
        saveState();
        goTo('phase');
    });

    // ── Guided nav buttons ──
    var guidedNext = $('#guided-next-from-appliances');
    if (guidedNext) guidedNext.addEventListener('click', function() {
        if (state.guidedRunningWatts > 0) goTo('recommend');
    });
    var backRec = $('#back-from-recommend');
    if (backRec) backRec.addEventListener('click', function() { goTo('appliances'); });
    var backGBat = $('#back-from-guided-battery');
    if (backGBat) backGBat.addEventListener('click', function() { goTo('recommend'); });

    // Back buttons
    var backInv = $('#back-from-inverter');
    if (backInv) backInv.addEventListener('click', goBack);
    var backBat = $('#back-from-battery');
    if (backBat) backBat.addEventListener('click', goBack);
    var backSum = $('#back-from-summary');
    if (backSum) backSum.addEventListener('click', goBack);

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
    var shareBtn = $('#share-summary');
    if (shareBtn) shareBtn.addEventListener('click', shareSummary);
    var waBtn = $('#share-whatsapp');
    if (waBtn) waBtn.addEventListener('click', shareWhatsApp);
    var pdfBtn = $('#download-pdf');
    if (pdfBtn) pdfBtn.addEventListener('click', downloadPDF);
    var resetBtn = $('#reset-selection');
    if (resetBtn) resetBtn.addEventListener('click', resetAll);

    // Compare
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

    // Financing
    $$('.fin-opt').forEach(function(btn) {
        btn.addEventListener('click', function() {
            toast('Contact us at +254 723 984 559 for ' + btn.dataset.months + '-month payment plans', 'info', 4000);
        });
    });

    // Scroll to top
    var fab = $('#scroll-to-top');
    if (fab) {
        window.addEventListener('scroll', function() { fab.classList.toggle('visible', window.scrollY > 300); });
        fab.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    // Brand home reset
    var brandHome = $('#brand-home');
    if (brandHome) brandHome.addEventListener('click', function(e) { e.preventDefault(); resetAll(); });
    var topbarHome = $('#topbar-home');
    if (topbarHome) topbarHome.addEventListener('click', function() { goTo('landing'); });

    // Live form validation
    var nameInput = $('#user-name');
    if (nameInput) nameInput.addEventListener('input', function() { $('#name-error').textContent = this.value.trim() ? '' : 'Name is required'; });
    var emailInput = $('#user-email');
    if (emailInput) emailInput.addEventListener('input', function() { var v = this.value.trim(); $('#email-error').textContent = !v ? 'Email is required' : !validateEmail(v) ? 'Enter a valid email' : ''; });
    var phoneCheck = function() {
        var cc = $('#country-code');
        var pLen = parseInt(cc.options[cc.selectedIndex].dataset.length);
        var v = $('#user-phone').value.trim();
        $('#phone-error').textContent = v && !validatePhone(v, pLen) ? 'Must be ' + pLen + ' digits' : '';
    };
    var phoneInput = $('#user-phone');
    if (phoneInput) phoneInput.addEventListener('input', phoneCheck);
    var ccSelect = $('#country-code');
    if (ccSelect) ccSelect.addEventListener('change', phoneCheck);

    // Escape closes modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') $$('.overlay:not(.hidden)').forEach(function(m) { closeModal(m); });
    });
});
