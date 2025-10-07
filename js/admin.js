import { postcardConfig } from './config.js';

// --- INITIALIZATION ---
loadConfiguration();
setupEventListeners();


// --- FUNCTIONS ---

function setupEventListeners() {
    document.getElementById('config-form').addEventListener('submit', handleFormSubmit);

    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentlyOpen = header.classList.contains('open');

            // First, close all accordion sections
            accordionHeaders.forEach(h => {
                h.classList.remove('open');
                h.nextElementSibling.classList.remove('open');
            });

            // If the clicked one wasn't already open, then open it.
            if (!currentlyOpen) {
                header.classList.add('open');
                header.nextElementSibling.classList.add('open');
            }
        });
    });
    
    // Auto-open the first accordion section by default
    const firstHeader = document.querySelector('.accordion-header');
    if (firstHeader) {
        firstHeader.classList.add('open');
        firstHeader.nextElementSibling.classList.add('open');
    }

    // Image upload handlers
    setupImageUploader('favicon-uploader', 'faviconURL', 'favicon-preview');
    setupImageUploader('success-favicon-uploader', 'successFaviconURL', 'success-favicon-preview');
    setupImageUploader('promo-image-uploader', 'successPromoImageURL', 'promo-image-preview');

    // Image preview updater when URL is pasted
    document.getElementById('faviconURL').addEventListener('input', (e) => updatePreviewFromInput(e.target.value, 'favicon-preview'));
    document.getElementById('successFaviconURL').addEventListener('input', (e) => updatePreviewFromInput(e.target.value, 'success-favicon-preview'));
    document.getElementById('successPromoImageURL').addEventListener('input', (e) => updatePreviewFromInput(e.target.value, 'promo-image-preview'));
}

function loadConfiguration() {
    // Main Page Settings
    document.getElementById('pageTitle').value = postcardConfig.content.pageTitle;
    updatePreviewFromInput(postcardConfig.content.faviconURL, 'favicon-preview');
    document.getElementById('faviconURL').value = postcardConfig.content.faviconURL;
    document.getElementById('mainTitle').value = postcardConfig.content.mainTitle;
    document.getElementById('titleColor').value = postcardConfig.styles.titleColor;
    document.getElementById('subtitleText').value = postcardConfig.content.subtitleText;
    document.getElementById('subtitleLinkText').value = postcardConfig.content.subtitleLinkText;
    document.getElementById('subtitleLinkURL').value = postcardConfig.content.subtitleLinkURL;
    document.getElementById('subtitleLinkColor').value = postcardConfig.styles.subtitleLinkColor;
    
    // Button Colours
    document.getElementById('uploadButtonColor').value = postcardConfig.styles.uploadButtonColor;
    document.getElementById('findImageButtonColor').value = postcardConfig.styles.findImageButtonColor;
    document.getElementById('sendPostcardButtonColor').value = postcardConfig.styles.sendPostcardButtonColor;

    // Confirmation Email Settings
    document.getElementById('emailSenderName').value = postcardConfig.email.senderName;
    document.getElementById('emailSubject').value = postcardConfig.email.subject;
    document.getElementById('emailBody').value = postcardConfig.email.body;

    // Success Page Settings
    document.getElementById('successTitle').value = postcardConfig.successPage.pageTitle;
    updatePreviewFromInput(postcardConfig.successPage.faviconURL, 'success-favicon-preview');
    document.getElementById('successFaviconURL').value = postcardConfig.successPage.faviconURL;
    document.getElementById('successHeading').value = postcardConfig.successPage.heading;
    document.getElementById('successHeadingColor').value = postcardConfig.successPage.headingColor;
    document.getElementById('successSubheading').value = postcardConfig.successPage.subheading;
    document.getElementById('successButtonText').value = postcardConfig.successPage.buttonText;
    document.getElementById('successButtonColor').value = postcardConfig.successPage.buttonColor;
    document.getElementById('successPromoText').value = postcardConfig.successPage.promoText;
    document.getElementById('successPromoLinkURL').value = postcardConfig.successPage.promoLinkURL;
    updatePreviewFromInput(postcardConfig.successPage.promoImageURL, 'promo-image-preview');
    document.getElementById('successPromoImageURL').value = postcardConfig.successPage.promoImageURL;
}


function handleFormSubmit(event) {
    event.preventDefault();
    alert('Saving functionality will be implemented in the next step!');
}

function setupImageUploader(uploaderId, targetInputId, previewId) {
    const uploader = document.getElementById(uploaderId);
    const targetInput = document.getElementById(targetInputId);
    const preview = document.getElementById(previewId);

    uploader.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target.result;
            preview.src = base64String;
            targetInput.value = base64String; // Store as Base64 string
        };
        reader.readAsDataURL(file);
    });
}

function updatePreviewFromInput(url, previewId) {
    const preview = document.getElementById(previewId);
    // Basic check to see if it's a URL or Base64
    if (url && (url.startsWith('http') || url.startsWith('data:image'))) {
        preview.src = url;
    } else if (!url) {
        preview.src = ""; // Clear preview if input is empty
    }
}

