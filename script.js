const state = {
    selectedCompany: '',
    selectedInverter: {},
    selectedBattery: {},
    selectedPanels: 0,
    currentStep: 'company'
};

const kstarInverters = [
    { kva: 3.6, voltage: 24, price: 48000, labour: 20000, img: 'images/inverter-3.6-24v.png', specsLink: 'https://drive.google.com/file/d/1VVXGcq5FHHTslH-GWH8VSz9-jWaDOZWg/view?usp=sharing' },
    { kva: 3.6, voltage: 48, price: 63000, labour: 20000, img: 'images/inverter-3.6-48v.png', specsLink: 'https://drive.google.com/file/d/1VVXGcq5FHHTslH-GWH8VSz9-jWaDOZWg/view?usp=sharing' },
    { kva: 6.0, voltage: 48, price: 80000, labour: 25000, img: 'images/inverter-6.0-48v.png', specsLink: 'https://drive.google.com/file/d/1VVXGcq5FHHTslH-GWH8VSz9-jWaDOZWg/view?usp=sharing' }
];

const fortunerInverters = [
    { kva: 0.7, voltage: 12, price: 25000, labour: 15000, img: 'images/solar.jpg', specsLink: 'https://drive.google.com/file/d/placeholder_fortuner_700va/view?usp=sharing' },
    { kva: 1.7, voltage: 24, price: 35000, labour: 15000, img: 'images/solar.jpg', specsLink: 'https://drive.google.com/file/d/placeholder_fortuner_1700va/view?usp=sharing' },
    { kva: 2.2, voltage: 24, price: 45000, labour: 18000, img: 'images/solar.jpg', specsLink: 'https://drive.google.com/file/d/placeholder_fortuner_2200va/view?usp=sharing' },
    { kva: 10.2, voltage: 48, price: 90000, labour: 25000, img: 'images/solar.jpg', specsLink: 'https://drive.google.com/file/d/placeholder_fortuner_10200va/view?usp=sharing' }
];

const batteries = [
    { name: 'Tubular 200AH', price: 23500, img: 'images/battery-200ah-tubular.png', specsLink: 'https://drive.google.com/file/d/17stgG0eX-rTGS8QR9KdDVZ08OXjWJH47/view?usp=sharing' },
    { name: 'Maintenance Free KM12 12V 200AH', price: 35500, img: 'images/battery-200ah-mf.png', specsLink: 'https://drive.google.com/file/d/1IiygyBHcx85JLY5W7wFI6gQBflkKHNh9/view?usp=sharing' },
    { name: 'Lithium LFP 51.2-100W', price: 125000, img: 'images/battery-100ah-lithium.png', specsLink: 'https://drive.google.com/file/d/194rpm8gHCgehwTyFhx35o35G-JwXVgCS/view?usp=sharing' }
];

function getAccessoryCost() {
    if ((state.selectedInverter.kva === 6.0 && state.selectedInverter.voltage === 48) || 
        (state.selectedInverter.kva === 10.2 && state.selectedInverter.voltage === 48)) {
        return 4000 + 2500 + 4000 + 40000;
    }
    return 4000 + 2500 + 4000 + 22000;
}

function updateProgressIndicator(step) {
    state.currentStep = step;
    const steps = ['company', 'inverter', 'battery', 'summary'];
    const currentIndex = steps.indexOf(step);
    const progressPercentage = (currentIndex + 1) * 25;
    
    document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
    
    document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
        if (index <= currentIndex) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
}

function navigateToStep(step) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(`${step}-section`).classList.remove('hidden');
    
    // Show all relevant sections for summary
    if (step === 'summary') {
        document.getElementById('panel-section').classList.remove('hidden');
        document.getElementById('accessory-section').classList.remove('hidden');
        document.getElementById('summary-section').classList.remove('hidden');

    }
    
    updateProgressIndicator(step);
    
    // Scroll to center of section
    const targetSection = document.getElementById(`${step}-section`);
    const sectionRect = targetSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollPosition = sectionRect.top + window.scrollY - (windowHeight / 2) + (sectionRect.height / 2);
    if (step === 'summary') {
        setTimeout(() => {
            const summarySection = document.getElementById('summary-section');
            summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 2000);
    }

    else {
        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }

}

function selectCompany(company) {
    state.selectedCompany = company;
    navigateToStep('inverter');
    updateInverterOptions();
}

function updateInverterOptions() {
    const inverterOptions = document.getElementById('inverter-options');
    inverterOptions.innerHTML = '';
    const inverters = state.selectedCompany === 'Kstar' ? kstarInverters : fortunerInverters;

    inverters.forEach(inverter => {
        const div = document.createElement('div');
        div.className = 'option';
        div.innerHTML = `
            <div class="option-image">
                <img src="${inverter.img}" alt="${state.selectedCompany} ${inverter.kva}kVA ${inverter.voltage}V" loading="lazy">
            </div>
            <div class="option-content">
                <p>${state.selectedCompany} ${inverter.kva}kVA - ${inverter.voltage}V</p>
                <p class="price">${inverter.price.toLocaleString()} Ksh</p>
                <p class="view-specs"><a href="${inverter.specsLink}" target="_blank"><i class="fas fa-external-link-alt"></i> Specifications</a></p>
            </div>
        `;

        // Add click event to the entire div
        div.addEventListener('click', (e) => {
            // Check if the click was on the specs link
            if (!e.target.closest('.view-specs a')) {
                selectInverter(inverter);
            }
        });
        
        inverterOptions.appendChild(div);
    });
}

function selectInverter(inverter) {
    state.selectedInverter = inverter;
    navigateToStep('battery');
    updateBatteryOptions();
    
    const mountingCostText = (inverter.kva === 6.0 && inverter.voltage === 48) || 
                           (inverter.kva === 10.2 && inverter.voltage === 48) ? 
                           '40,000 Ksh' : '22,000 Ksh';
    document.querySelector('#mounting-cost .price').textContent = mountingCostText;
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
                    batteryCount = state.selectedInverter.voltage / 12;
                }
            } else if (state.selectedInverter.kva === 1.7 && state.selectedInverter.voltage === 24) {
                if (battery.name === 'Tubular 200AH' || battery.name === 'Maintenance Free KM12 12V 200AH') {
                    compatible = true;
                    batteryCount = state.selectedInverter.voltage / 12;
                }
            } else if (state.selectedInverter.kva === 2.2 && state.selectedInverter.voltage === 24) {
                compatible = true;
                batteryCount = battery.name === 'Lithium LFP 51.2-100W' ? 1 : state.selectedInverter.voltage / 12;
            } else if (state.selectedInverter.kva === 10.2 && state.selectedInverter.voltage === 48) {
                compatible = true;
                batteryCount = battery.name === 'Lithium LFP 51.2-100W' ? 2 : state.selectedInverter.voltage / 12;
            }
        }

        if (compatible) {
            const div = document.createElement('div');
            div.className = 'option';
            div.innerHTML = `
                <div class="option-image">
                    <img src="${battery.img}" alt="${battery.name}" loading="lazy">
                </div>
                <div class="option-content">
                    <p>${battery.name}</p>
                    <p class="price">${battery.price.toLocaleString()} Ksh <span>(x${batteryCount})</span></p>
                    <p class="view-specs"><a href="${battery.specsLink}" target="_blank"><i class="fas fa-external-link-alt"></i> Specifications</a></p>
                </div>
            `;
            
            // Modified click handler to prevent selection when clicking specs link
            div.addEventListener('click', (e) => {
                // Check if the click was on the specs link
                if (!e.target.closest('.view-specs a')) {
                    selectBattery(battery, batteryCount);
                }
            });
            
            batteryOptions.appendChild(div);
        }
    });
}
function selectBattery(battery, count) {
    state.selectedBattery = { ...battery, count };
    
    // Show loading state
    document.getElementById('panel-info').style.display = 'none';
    document.getElementById('panel-images').style.display = 'none';
    document.getElementById('panel-section').classList.add('hidden');
    document.getElementById('accessory-section').classList.add('hidden');
    document.getElementById('summary-section').classList.add('hidden');
    
    // Navigate to summary with all sections
    navigateToStep('summary');
    
    // After a short delay, show the content
    setTimeout(() => {
        document.getElementById('panel-info').style.display = 'block';
        document.getElementById('panel-images').style.display = 'flex';
        document.getElementById('panel-section').classList.remove('hidden');
        document.getElementById('accessory-section').classList.remove('hidden');
        document.getElementById('summary-section').classList.remove('hidden');
        
        updatePanelRequirement();
    }, 800);
}

function updatePanelRequirement() {
    state.selectedPanels = (state.selectedInverter.kva === 6.0 && state.selectedInverter.voltage === 48) || 
                          (state.selectedInverter.kva === 10.2 && state.selectedInverter.voltage === 48) ? 10 : 6;
    
    document.getElementById('panel-info').innerHTML = `
        <p>You need ${state.selectedPanels} solar panels</p>
        <p><span class="price">8,300 Ksh each</span></p>
        <p><a href="https://drive.google.com/file/d/14w98znycd4Y4-quOsoSItp4ulKUkpoCv/view?usp=sharing" target="_blank"><i class="fas fa-external-link-alt"></i> View Specifications</a></p>
    `;
    
    const panelImages = document.getElementById('panel-images');
    panelImages.innerHTML = '';
    for (let i = 0; i < state.selectedPanels; i++) {
        const img = document.createElement('img');
        img.src = 'images/solar-panel.png';
        img.alt = 'Solar Panel';
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
            <span>Inverter: ${state.selectedCompany} ${state.selectedInverter.kva}kVA - ${state.selectedInverter.voltage}V</span>
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
    const inverterText = `${state.selectedCompany} ${state.selectedInverter.kva}kVA - ${state.selectedInverter.voltage}V`;
    const batteryText = `${state.selectedBattery.name} x${state.selectedBattery.count}`;
    const panelText = `${state.selectedPanels} panels`;
    const accessoryCost = getAccessoryCost();
    const totalCost = document.getElementById('total-cost').textContent;

    const subject = encodeURIComponent('Sangyug Solar Inverter System Summary');
    const body = encodeURIComponent(
`Solar System Quote from Sangyug

Here are the details of your selected solar inverter system:

🔹 INVERTER
• Model: ${inverterText}
• Price: ${state.selectedInverter.price.toLocaleString()} Ksh
• Installation/Labour: ${state.selectedInverter.labour.toLocaleString()} Ksh

🔹 BATTERY
• Type: ${batteryText}
• Price: ${(state.selectedBattery.price * state.selectedBattery.count).toLocaleString()} Ksh

🔹 SOLAR PANELS
• Quantity: ${panelText}
• Price: ${(state.selectedPanels * 8300).toLocaleString()} Ksh

🔹 ACCESSORIES
• Included: ${accessoryCost.toLocaleString()} Ksh

TOTAL COST: ${totalCost}

Important Notes:
• Above quote includes solar mounting/structure
• Final quote will be provided after site survey


For any questions, please contact us at:
📞 Phone: 0742196553
📧 Email: info@sangyug.com

Thank you for choosing Sangyug Solar!
`);

    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set colors
    const primaryColor = [0, 102, 204]; // Blue
    const accentColor = [0, 0, 0];  // Orange
    const textColor = [51, 51, 51];     // Dark gray
    
    // Add header with logo
    doc.setFontSize(18);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("SANGYUG SOLAR QUOTATION", 105, 20, { align: 'center' });
    
    // Add divider line
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, 25, 195, 25);
    
    // Customer info section
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Prepared for:", 20, 35);
    doc.text("Date: " + new Date().toLocaleDateString(), 160, 35);
    
    // Main content
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    let yPosition = 50;
    
    // System Details section
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("SYSTEM DETAILS", 20, yPosition);
    yPosition += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text(`Inverter: ${state.selectedCompany} ${state.selectedInverter.kva}kVA - ${state.selectedInverter.voltage}V`, 20, yPosition);
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
    
    // Total section
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accentColor);
    doc.text("TOTAL COST", 20, yPosition);
    const totalCost = document.getElementById('total-cost').textContent;
    doc.text(totalCost, 160, yPosition);
    yPosition += 15;
    
    // Notes section
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
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for choosing Sangyug!", 105, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text("Contact: 0742196553 | info@sangyug.com", 105, yPosition, { align: 'center' });
    
    // Save the PDF
    doc.save(`Sangyug_Solar_Quote_${new Date().toISOString().slice(0,10)}.pdf`);
}

function resetSelection() {
    state.selectedCompany = '';
    state.selectedInverter = {};
    state.selectedBattery = {};
    state.selectedPanels = 0;
    navigateToStep('company');
    document.querySelectorAll('.option').forEach(option => option.classList.remove('selected'));
}

document.addEventListener('DOMContentLoaded', () => {
    const companyOptions = document.getElementById('company-options');
    
    const companies = [
        { name: 'Kstar', logo: 'images/kstar-logo.png' },
        { name: 'Fortuner', logo: 'images/fortuner-logo.png' }
    ];
    
    companies.forEach(company => {
        const div = document.createElement('div');
        div.className = 'option';
        div.innerHTML = `
            <div class="option-image">
                <img src="${company.logo}" alt="${company.name} Logo" loading="lazy">
            </div>
            <div class="option-content">
                <p>${company.name}</p>
            </div>
        `;
        div.addEventListener('click', () => selectCompany(company.name));
        companyOptions.appendChild(div);
    });
    
    document.getElementById('share-summary').addEventListener('click', shareSummary);
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
            }
        });
    });
});