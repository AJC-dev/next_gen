import { postcardConfig } from './config.js';

// --- INITIALIZATION ---
loadConfiguration();
document.getElementById('config-form').addEventListener('submit', handleFormSubmit);


// --- FUNCTIONS ---

function loadConfiguration() {
    // Main Page Settings
    document.getElementById('pageTitle').value = postcardConfig.content.pageTitle;
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
    document.getElementById('successFaviconURL').value = postcardConfig.successPage.faviconURL;
    document.getElementById('successHeading').value = postcardConfig.successPage.heading;
    document.getElementById('successHeadingColor').value = postcardConfig.successPage.headingColor;
    document.getElementById('successSubheading').value = postcardConfig.successPage.subheading;
    document.getElementById('successButtonText').value = postcardConfig.successPage.buttonText;
    document.getElementById('successButtonColor').value = postcardConfig.successPage.buttonColor;
    document.getElementById('successPromoText').value = postcardConfig.successPage.promoText;
    document.getElementById('successPromoLinkURL').value = postcardConfig.successPage.promoLinkURL;
    document.getElementById('successPromoImageURL').value = postcardConfig.successPage.promoImageURL;
}

// Function to handle form submission (for a future step)
function handleFormSubmit(event) {
    event.preventDefault();
    // In a future step, this function will collect all form data
    // and send it to a server-side function to update config.js
    alert('Saving functionality will be implemented in the next step!');
}

