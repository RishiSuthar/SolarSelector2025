const state = {
    selectedCompany: '',
    selectedInverter: {},
    selectedBattery: {},
    selectedPanels: 0,
    currentStep: 'company'
};

const kstarInverters = [
    { kva: 3.6, voltage: 24, price: 48000, labour: 20000, img: 'images/kstarinverter.png', specsLink: 'https://drive.google.com/file/d/1VVXGcq5FHHTslH-GWH8VSz9-jWaDOZWg/view?usp=sharing' },
    { kva: 3.6, voltage: 48, price: 63000, labour: 20000, img: 'images/kstarinverter.png', specsLink: 'https://drive.google.com/file/d/1VVXGcq5FHHTslH-GWH8VSz9-jWaDOZWg/view?usp=sharing' },
    { kva: 6.0, voltage: 48, price: 80000, labour: 25000, img: 'images/kstarinverter.png', specsLink: 'https://drive.google.com/file/d/1VVXGcq5FHHTslH-GWH8VSz9-jWaDOZWg/view?usp=sharing' }
];

const fortunerInverters = [
    { kva: 0.7, watts: 450, voltage: 12, price: 12500, labour: 15000, img: 'images/fortunerinverter.png', specsLink: '#' },
    { kva: 1.5, watts: 1200, voltage: 24, price: 16000, labour: 15000, img: 'images/fortunerinverter.png', specsLink: '#' },
    { kva: 2.2, watts: 1400, voltage: 24, price: 21000, labour: 18000, img: 'images/fortunerinverter.png', specsLink: '#' },
    { kva: 10.0, voltage: 48, price: 105000, labour: 25000, img: 'images/fortunerinverter.png', specsLink: '#' }
];

const batteries = [
    { name: 'Tubular 200AH', price: 23500, img: 'images/battery-200ah-tubular.png', specsLink: 'https://drive.google.com/file/d/17stgG0eX-rTGS8QR9KdDVZ08OXjWJH47/view?usp=sharing' },
    { name: 'Maintenance Free KM12 12V 200AH', price: 35500, img: 'images/battery-200ah-mf.png', specsLink: 'https://drive.google.com/file/d/1IiygyBHcx85JLY5W7wFI6gQBflkKHNh9/view?usp=sharing' },
    { name: 'Lithium LFP 51.2-100W', price: 125000, img: 'images/battery-100ah-lithium.png', specsLink: 'https://drive.google.com/file/d/194rpm8gHCgehwTyFhx35o35G-JwXVgCS/view?usp=sharing' }
];

function getAccessoryCost() {
    if (state.selectedCompany === 'Fortuner') {
        if (state.selectedInverter.kva === 1.5 || state.selectedInverter.kva === 2.2) {
            return 4000 + 2500 + 4000 + 4500; // Change Over Switch + DC MCCB + AVS 30 AMPS + Mounting Structure & Cables (4,500 Ksh)
        } else if (state.selectedInverter.kva === 10.0) {
            return 4000 + 2500 + 4000 + 54500; // Change Over Switch + DC MCCB + AVS 30 AMPS + Mounting Structure & Cables (54,500 Ksh)
        }
        return 4000 + 2500 + 4000 + 22000; // Default for 0.7 kVA
    }
    if (state.selectedInverter.kva === 6.0 && state.selectedInverter.voltage === 48) {
        return 4000 + 2500 + 4000 + 40000; // Kstar 6.0 kVA
    }
    return 4000 + 2500 + 4000 + 22000; // Default for Kstar
}

function saveState() {
    localStorage.setItem('solarSelectorState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('solarSelectorState');
    if (saved) {
        Object.assign(state, JSON.parse(saved));
        updateProgressIndicator(state.currentStep);
        updateInverterOptions();
        updateBatteryOptions();
        updatePanelRequirement();
        updateSummary();
    }
}

function updateProgressIndicator(step) {
    state.currentStep = step;
    const steps = ['company', 'inverter', 'battery', 'summary'];
    const currentIndex = steps.indexOf(step);
    const progressFill = document.getElementById('progress-fill');
    progressFill.classList.add('transition');
    progressFill.style.width = `${(currentIndex + 1) * 25}%`;
    setTimeout(() => progressFill.classList.remove('transition'), 500);
    
    document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
        if (index <= currentIndex) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
}

function navigateToStep(step) {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById(`${step}-section`).classList.remove('hidden');
    
    if (step === 'summary') {
        document.getElementById('panel-section').classList.remove('hidden');
        document.getElementById('accessory-section').classList.remove('hidden');
        document.getElementById('summary-section').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('summary-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 2000);
    } else {
        const targetSection = document.getElementById(`${step}-section`);
        const sectionRect = targetSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollPosition = sectionRect.top + window.scrollY - (windowHeight / 2) + (sectionRect.height / 2);
        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
    
    updateProgressIndicator(step);
}

function navigateBack() {
    const steps = ['company', 'inverter', 'battery', 'summary'];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex > 0) navigateToStep(steps[currentIndex - 1]);
}

function selectCompany(company, clickedElement) {
    state.selectedCompany = company;
    document.querySelectorAll('#company-options .option').forEach(option => option.classList.remove('selected'));
    if (clickedElement) clickedElement.classList.add('selected');
    navigateToStep('inverter');
    updateInverterOptions();
    saveState();
}

function updateInverterOptions() {
    const inverterOptions = document.getElementById('inverter-options');
    inverterOptions.innerHTML = '';
    const inverters = state.selectedCompany === 'Kstar' ? kstarInverters : fortunerInverters;

    inverters.forEach(inverter => {
        const div = document.createElement('div');
        div.className = 'option';
        if (state.selectedInverter.kva === inverter.kva && state.selectedInverter.voltage === inverter.voltage) {
            div.classList.add('selected');
        }
        const specsLink = inverter.specsLink || '#';
        const wattageText = inverter.watts ? ` (${inverter.watts}W)` : '';
        div.innerHTML = `
            <div class="option-image">
                <img src="${inverter.img}">
            </div>
            <div class="option-content">
                <p>${state.selectedCompany} ${inverter.kva}kVA${wattageText} - ${inverter.voltage}V</p>
                <p class="price">${inverter.price.toLocaleString()} Ksh</p>
                <p class="view-specs"><a href="${specsLink}" target="_blank" ${specsLink === '#' ? 'onclick="alert(\'Specification link unavailable\')"' : ''}><i class="fas fa-external-link-alt"></i> Specifications</a></p>
            </div>
        `;
        div.addEventListener('click', (e) => {
            if (!e.target.closest('.view-specs a')) {
                selectInverter(inverter, div);
            }
        });
        inverterOptions.appendChild(div);
    });
}

function selectInverter(inverter, clickedElement) {
    state.selectedInverter = inverter;
    document.querySelectorAll('#inverter-options .option').forEach(option => option.classList.remove('selected'));
    if (clickedElement) clickedElement.classList.add('selected');
    navigateToStep('battery');
    updateBatteryOptions();
    const mountingCostText = state.selectedCompany === 'Fortuner' ? 
        (inverter.kva === 1.5 || inverter.kva === 2.2 ? '4,500 Ksh' : 
         inverter.kva === 10.0 ? '54,500 Ksh' : '22,000 Ksh') : 
        (inverter.kva === 6.0 && inverter.voltage === 48 ? '40,000 Ksh' : '22,000 Ksh');
    document.querySelector('#mounting-cost .price').textContent = mountingCostText;
    saveState();
}

function updateBatteryOptions() {
    const batteryOptions = document.getElementById('battery-options');
    batteryOptions.innerHTML = '';

    batteries.forEach(battery => {
        let compatible = false;
        let batteryCount = 0;

        if (state.selectedCompany === 'Kstar') {
            if (state.selectedInverter.kva === 3.6 && state.selectedInverter.voltage === 24) {
                if (battery.name === 'Tubular 200AH' || battery.name === 'Maintenance Free KM12 12V 200AH') {
                    compatible = true;
                    batteryCount = state.selectedInverter.voltage / 12;
                }
            } else if (state.selectedInverter.kva === 3.6 && state.selectedInverter.voltage === 48) {
                if (battery.name === 'Lithium LFP 51.2-100W') {
                    compatible = true;
                    batteryCount = 1;
                } else if (battery.name === 'Tubular 200AH' || battery.name === 'Maintenance Free KM12 12V 200AH') {
                    compatible = true;
                    batteryCount = state.selectedInverter.voltage / 12;
                }
            } else if (state.selectedInverter.kva === 6.0 && state.selectedInverter.voltage === 48) {
                if (battery.name === 'Lithium LFP 51.2-100W') {
                    compatible = true;
                    batteryCount = 2;
                } else if (battery.name === 'Tubular 200AH' || battery.name === 'Maintenance Free KM12 12V 200AH') {
                    compatible = true;
                    batteryCount = state.selectedInverter.voltage / 12;
                }
            }
        } else if (state.selectedCompany === 'Fortuner') {
            if (state.selectedInverter.kva === 0.7 && state.selectedInverter.voltage === 12) {
                if (battery.name === 'Tubular 200AH' || battery.name === 'Maintenance Free KM12 12V 200AH') {
                    compatible = true;
                    batteryCount = 1;
                }
            } else if (state.selectedInverter.kva === 1.5 && state.selectedInverter.voltage === 24) {
                if (battery.name === 'Tubular 200AH' || battery.name === 'Maintenance Free KM12 12V 200AH') {
                    compatible = true;
                    batteryCount = 2;
                }
            } else if (state.selectedInverter.kva === 2.2 && state.selectedInverter.voltage === 24) {
                if (battery.name === 'Tubular 200AH' || battery.name === 'Maintenance Free KM12 12V 200AH') {
                    compatible = true;
                    batteryCount = 2;
                }
            } else if (state.selectedInverter.kva === 10.0 && state.selectedInverter.voltage === 48) {
                if (battery.name === 'Tubular 200AH' || battery.name === 'Maintenance Free KM12 12V 200AH') {
                    compatible = true;
                    batteryCount = 4;
                }
            }
        }

        if (compatible) {
            const div = document.createElement('div');
            div.className = 'option';
            if (state.selectedBattery.name === battery.name && state.selectedBattery.count === batteryCount) {
                div.classList.add('selected');
            }
            const specsLink = battery.specsLink || '#';
            div.innerHTML = `
                <div class="option-image">
                    <img src="${battery.img}">
                </div>
                <div class="option-content">
                    <p>${battery.name}</p>
                    <p class="price">${battery.price.toLocaleString()} Ksh <span>(x${batteryCount})</span></p>
                    <p class="view-specs"><a href="${specsLink}" target="_blank" ${specsLink === '#' ? 'onclick="alert(\'Specification link unavailable\')"' : ''}><i class="fas fa-external-link-alt"></i> Specifications</a></p>
                </div>
            `;
            div.addEventListener('click', (e) => {
                if (!e.target.closest('.view-specs a')) {
                    selectBattery(battery, batteryCount, div);
                }
            });
            batteryOptions.appendChild(div);
        }
    });
}

function selectBattery(battery, count, clickedElement) {
    state.selectedBattery = { ...battery, count };
    document.querySelectorAll('#battery-options .option').forEach(option => option.classList.remove('selected'));
    if (clickedElement) clickedElement.classList.add('selected');
    document.getElementById('panel-info').style.display = 'none';
    document.getElementById('panel-images').style.display = 'none';
    document.getElementById('panel-section').classList.add('hidden');
    document.getElementById('accessory-section').classList.add('hidden');
    document.getElementById('summary-section').classList.add('hidden');
    navigateToStep('summary');
    setTimeout(() => {
        document.getElementById('panel-info').style.display = 'block';
        document.getElementById('panel-images').style.display = 'flex';
        document.getElementById('panel-section').classList.remove('hidden');
        document.getElementById('accessory-section').classList.remove('hidden');
        document.getElementById('summary-section').classList.remove('hidden');
        updatePanelRequirement();
    }, 800);
    saveState();
}

function updatePanelRequirement() {
    if (state.selectedCompany === 'Fortuner') {
        if (state.selectedInverter.kva === 0.7) {
            state.selectedPanels = 0;
        } else if (state.selectedInverter.kva === 1.5 || state.selectedInverter.kva === 2.2) {
            state.selectedPanels = 2;
        } else if (state.selectedInverter.kva === 10.0) {
            state.selectedPanels = 16;
        }
    } else {
        state.selectedPanels = (state.selectedInverter.kva === 6.0 && state.selectedInverter.voltage === 48) ? 10 : 6;
    }
    
    document.getElementById('panel-info').innerHTML = state.selectedPanels > 0 ? `
        <p>You need ${state.selectedPanels} solar panels</p>
        <p><span class="price">8,300 Ksh each</span></p>
        <p><a href="https://drive.google.com/file/d/14w98znycd4Y4-quOsoSItp4ulKUkpoCv/view?usp=sharing" target="_blank"><i class="fas fa-external-link-alt"></i> View Specifications</a></p>
    ` : `
        <p>No solar panels required for this configuration</p>
    `;
    const panelImages = document.getElementById('panel-images');
    panelImages.innerHTML = '';
    for (let i = 0; i < state.selectedPanels; i++) {
        const img = document.createElement('img');
        img.src = 'images/solar-panel.png';
        img.className = 'solar-panel';
        img.loading = 'lazy';
        panelImages.appendChild(img);
    }
    updateSummary();
}

function updateSummary() {
    const inverterCost = state.selectedInverter.price || 0;
    const labourCost = state.selectedInverter.labour || 0;
    const batteryCost = state.selectedBattery.price ? state.selectedBattery.price * state.selectedBattery.count : 0;
    const panelCost = state.selectedPanels * 8300;
    const accessoryCost = getAccessoryCost();
    const totalCost = inverterCost + labourCost + batteryCost + panelCost + accessoryCost;
    
    document.getElementById('summary').innerHTML = `
        <div class="summary-item">
            <span>Inverter: ${state.selectedCompany} ${state.selectedInverter.kva}kVA${state.selectedInverter.watts ? ` (${state.selectedInverter.watts}W)` : ''} - ${state.selectedInverter.voltage}V</span>
            <span class="price-value">${inverterCost.toLocaleString()} Ksh</span>
        </div>
        <div class="summary-item">
            <span>Labour</span>
            <span class="price-value">${labourCost.toLocaleString()} Ksh</span>
        </div>
        <div class="summary-item">
            <span>Batteries: ${state.selectedBattery.name} x${state.selectedBattery.count}</span>
            <span class="price-value">${batteryCost.toLocaleString()} Ksh</span>
        </div>
        <div class="summary-item">
            <span>Solar Panels: ${state.selectedPanels} panels</span>
            <span class="price-value">${panelCost.toLocaleString()} Ksh</span>
        </div>
        <div class="summary-item">
            <span>Accessories (included)</span>
            <span class="price-value">${accessoryCost.toLocaleString()} Ksh</span>
        </div>
    `;
    
    document.getElementById('total-cost').textContent = totalCost.toLocaleString() + ' KSH';
}

function shareSummary() {
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const phone = document.getElementById('user-phone').value || 'Not provided';
    if (!name || !email) {
        alert('Please fill in your name and email.');
        return;
    }
    const inverterText = `${state.selectedCompany} ${state.selectedInverter.kva}kVA${state.selectedInverter.watts ? ` (${state.selectedInverter.watts}W)` : ''} - ${state.selectedInverter.voltage}V`;
    const batteryText = `${state.selectedBattery.name} x${state.selectedBattery.count}`;
    const panelText = state.selectedPanels > 0 ? `${state.selectedPanels} panels` : 'No panels required';
    const accessoryCost = getAccessoryCost();
    const totalCost = document.getElementById('total-cost').textContent;

    const subject = encodeURIComponent(`Sangyug Solar Quote for ${name}`);
    const body = encodeURIComponent(
        `Solar System Quote for ${name}\n\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n\n` +
        `Here are the details of your selected solar inverter system:\n\n` +
        `🔹 INVERTER\n` +
        `• Model: ${inverterText}\n` +
        `• Price: ${state.selectedInverter.price.toLocaleString()} Ksh\n` +
        `• Installation/Labour: ${state.selectedInverter.labour.toLocaleString()} Ksh\n\n` +
        `🔹 BATTERY\n` +
        `• Type: ${batteryText}\n` +
        `• Price: ${(state.selectedBattery.price * state.selectedBattery.count).toLocaleString()} Ksh\n\n` +
        `🔹 SOLAR PANELS\n` +
        `• Quantity: ${panelText}\n` +
        `• Price: ${(state.selectedPanels * 8300).toLocaleString()} Ksh\n\n` +
        `🔹 ACCESSORIES\n` +
        `• Included: ${accessoryCost.toLocaleString()} Ksh\n\n` +
        `TOTAL COST: ${totalCost}\n\n` +
        `Important Notes:\n` +
        `• Above quote includes solar mounting/structure\n` +
        `• Final quote will be provided after site survey\n\n` +
        `For any questions, please contact us at:\n` +
        `📞 Phone: 0742196553\n` +
        `📧 Email: info@sangyug.com\n\n` +
        `Thank you for choosing Sangyug Solar!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
}

function shareWhatsApp() {
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const phone = document.getElementById('user-phone').value || 'Not provided';
    if (!name || !email) {
        alert('Please fill in your name and email.');
        return;
    }
    const inverterText = `${state.selectedCompany} ${state.selectedInverter.kva}kVA${state.selectedInverter.watts ? ` (${state.selectedInverter.watts}W)` : ''} - ${state.selectedInverter.voltage}V`;
    const batteryText = `${state.selectedBattery.name} x${state.selectedBattery.count}`;
    const panelText = state.selectedPanels > 0 ? `${state.selectedPanels} panels` : 'No panels required';
    const accessoryCost = getAccessoryCost();
    const totalCost = document.getElementById('total-cost').textContent;

    const text = encodeURIComponent(
        `Solar System Quote for ${name}\n\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n\n` +
        `Here are the details of your selected solar inverter system:\n\n` +
        `🔹 INVERTER\n` +
        `• Model: ${inverterText}\n` +
        `• Price: ${state.selectedInverter.price.toLocaleString()} Ksh\n` +
        `• Installation/Labour: ${state.selectedInverter.labour.toLocaleString()} Ksh\n\n` +
        `🔹 BATTERY\n` +
        `• Type: ${batteryText}\n` +
        `• Price: ${(state.selectedBattery.price * state.selectedBattery.count).toLocaleString()} Ksh\n\n` +
        `🔹 SOLAR PANELS\n` +
        `• Quantity: ${panelText}\n` +
        `• Price: ${(state.selectedPanels * 8300).toLocaleString()} Ksh\n\n` +
        `🔹 ACCESSORIES\n` +
        `• Included: ${accessoryCost.toLocaleString()} Ksh\n\n` +
        `TOTAL COST: ${totalCost}\n\n` +
        `Important Notes:\n` +
        `• Above quote includes solar mounting/structure\n` +
        `• Final quote will be provided after site survey\n\n` +
        `For any questions, please contact us at:\n` +
        `📞 Phone: 0742196553\n` +
        `📧 Email: info@sangyug.com\n\n` +
        `Thank you for choosing Sangyug Solar!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function downloadPDF() {
    if (!window.jspdf) {
        alert('PDF generation failed. Please try again later.');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const primaryColor = [0, 102, 204];
    const accentColor = [0, 0, 0];
    const textColor = [51, 51, 51];
    
    doc.setFontSize(18);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("SANGYUG SOLAR QUOTATION", 105, 20, { align: 'center' });
    
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, 25, 195, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const name = document.getElementById('user-name').value || 'Customer';
    const email = document.getElementById('user-email').value || 'Not provided';
    const phone = document.getElementById('user-phone').value || 'Not provided';
    doc.text(`Prepared for: ${name}`, 20, 35);
    doc.text(`Email: ${email}`, 20, 40);
    doc.text(`Phone: ${phone}`, 20, 45);
    doc.text("Date: " + new Date().toLocaleDateString(), 160, 35);
    
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    let yPosition = 55;
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("SYSTEM DETAILS", 20, yPosition);
    yPosition += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    const inverterText = `${state.selectedCompany} ${state.selectedInverter.kva}kVA${state.selectedInverter.watts ? ` (${state.selectedInverter.watts}W)` : ''} - ${state.selectedInverter.voltage}V`;
    doc.text(`Inverter: ${inverterText}`, 20, yPosition);
    doc.text(`${state.selectedInverter.price.toLocaleString()} Ksh`, 160, yPosition);
    yPosition += 7;
    
    doc.text(`Installation/Labour`, 20, yPosition);
    doc.text(`${state.selectedInverter.labour.toLocaleString()} Ksh`, 160, yPosition);
    yPosition += 7;
    
    doc.text(`Batteries: ${state.selectedBattery.name} x${state.selectedBattery.count}`, 20, yPosition);
    doc.text(`${(state.selectedBattery.price * state.selectedBattery.count).toLocaleString()} Ksh`, 160, yPosition);
    yPosition += 7;
    
    doc.text(`Solar Panels: ${state.selectedPanels} panels`, 20, yPosition);
    doc.text(`${(state.selectedPanels * 8300).toLocaleString()} Ksh`, 160, yPosition);
    yPosition += 7;
    
    doc.text(`Accessories (included)`, 20, yPosition);
    doc.text(`${getAccessoryCost().toLocaleString()} Ksh`, 160, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accentColor);
    doc.text("TOTAL COST", 20, yPosition);
    const totalCost = document.getElementById('total-cost').textContent;
    doc.text(totalCost, 160, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("IMPORTANT NOTES", 20, yPosition);
    yPosition += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text("1. Above quote includes solar mounting/structure.", 20, yPosition);
    yPosition += 7;
    doc.text("2. Final quote will be provided after site survey.", 20, yPosition);
    yPosition += 20;
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for choosing Sangyug!", 105, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text("Contact: 0742196553 | info@sangyug.com", 105, yPosition, { align: 'center' });
    
    doc.save(`Sangyug_Solar_Quote_${new Date().toISOString().slice(0,10)}.pdf`);
}

function resetSelection() {
    state.selectedCompany = '';
    state.selectedInverter = {};
    state.selectedBattery = {};
    state.selectedPanels = 0;
    navigateToStep('company');
    document.querySelectorAll('.option').forEach(option => option.classList.remove('selected'));
    saveState();
}

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    const companyOptions = document.getElementById('company-options');
    
    const companies = [
        { name: 'Kstar', logo: 'images/kstar-logo.png' },
        { name: 'Fortuner', logo: 'images/fortuner-logo.png' }
    ];
    
    companies.forEach(company => {
        const div = document.createElement('div');
        div.className = 'option';
        if (state.selectedCompany === company.name) {
            div.classList.add('selected');
        }
        div.innerHTML = `
            <div class="option-image">
                <img src="${company.logo}">
            </div>
            <div class="option-content">
                <p>${company.name}</p>
            </div>
        `;
        div.addEventListener('click', () => selectCompany(company.name, div));
        companyOptions.appendChild(div);
    });
    
    document.getElementById('share-summary').addEventListener('click', shareSummary);
    document.getElementById('share-whatsapp').addEventListener('click', shareWhatsApp);
    document.getElementById('download-pdf').addEventListener('click', downloadPDF);
    document.getElementById('reset-selection').addEventListener('click', resetSelection);
    
    const scrollToTopButton = document.getElementById('scroll-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    });
    
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    updateProgressIndicator('company');
    
    document.querySelectorAll('.progress-step').forEach(step => {
        step.addEventListener('click', () => {
            const stepName = step.getAttribute('data-step');
            if (stepName === 'company' || 
                (stepName === 'inverter' && state.selectedCompany) || 
                (stepName === 'battery' && state.selectedInverter.kva) || 
                (stepName === 'summary' && state.selectedBattery.name)) {
                navigateToStep(stepName);
            } else {
                step.classList.add('disabled');
                setTimeout(() => step.classList.remove('disabled'), 1000);
            }
        });
    });
});