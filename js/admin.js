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


async function handleFormSubmit(event) {
    event.preventDefault();
    const saveButton = document.getElementById('save-changes-btn');
    saveButton.textContent = 'Saving...';
    saveButton.disabled = true;

    // Reconstruct the config object from the form fields
    const newConfigData = {
        content: {
            pageTitle: document.getElementById('pageTitle').value,
            faviconURL: document.getElementById('faviconURL').value,
            mainTitle: document.getElementById('mainTitle').value,
            subtitleText: document.getElementById('subtitleText').value,
            subtitleLinkText: document.getElementById('subtitleLinkText').value,
            subtitleLinkURL: document.getElementById('subtitleLinkURL').value,
        },
        styles: {
            titleColor: document.getElementById('titleColor').value,
            subtitleLinkColor: document.getElementById('subtitleLinkColor').value,
            uploadButtonColor: document.getElementById('uploadButtonColor').value,
            findImageButtonColor: document.getElementById('findImageButtonColor').value,
            sendPostcardButtonColor: document.getElementById('sendPostcardButtonColor').value,
        },
        email: {
            senderName: document.getElementById('emailSenderName').value,
            subject: document.getElementById('emailSubject').value,
            body: document.getElementById('emailBody').value,
        },
        successPage: {
            pageTitle: document.getElementById('successTitle').value,
            faviconURL: document.getElementById('successFaviconURL').value,
            heading: document.getElementById('successHeading').value,
            headingColor: document.getElementById('successHeadingColor').value,
            subheading: document.getElementById('successSubheading').value,
            buttonText: document.getElementById('successButtonText').value,
            buttonColor: document.getElementById('successButtonColor').value,
            promoText: document.getElementById('successPromoText').value,
            promoLinkURL: document.getElementById('successPromoLinkURL').value,
            promoImageURL: document.getElementById('successPromoImageURL').value,
        },
        // Keep non-editable print and validation settings from the original config
        print: postcardConfig.print,
        validation: postcardConfig.validation,
    };

    try {
        const response = await fetch('/api/update-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newConfigData),
        });

        if (!response.ok) {
            throw new Error('Server responded with an error.');
        }

        saveButton.textContent = 'Saved!';
        saveButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        saveButton.classList.add('bg-green-500');

    } catch (error) {
        console.error('Failed to save configuration:', error);
        saveButton.textContent = 'Error!';
        saveButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        saveButton.classList.add('bg-red-500');
    } finally {
        setTimeout(() => {
            saveButton.textContent = 'Save Changes';
            saveButton.disabled = false;
            saveButton.classList.remove('bg-green-500', 'bg-red-500');
            saveButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }, 2000);
    }
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
            targetInput.value = base64String;
        };
        reader.readAsDataURL(file);
    });
}

function updatePreviewFromInput(url, previewId) {
    const preview = document.getElementById(previewId);
    if (url && (url.startsWith('http') || url.startsWith('data:image'))) {
        preview.src = url;
    } else if (!url) {
        preview.src = "";
    }
}
                                                                                                                                                                                                                                                                                