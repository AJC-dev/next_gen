import { postcardConfig } from './config.js';

// Function to populate the form with values from the config object
function populateForm() {
    // Main Page
    document.getElementById('pageTitle').value = postcardConfig.content.pageTitle;
    document.getElementById('faviconURL').value = postcardConfig.content.faviconURL;
    document.getElementById('mainTitle').value = postcardConfig.content.mainTitle;
    document.getElementById('subtitleText').value = postcardConfig.content.subtitleText;
    document.getElementById('subtitleLinkText').value = postcardConfig.content.subtitleLinkText;
    document.getElementById('subtitleLinkURL').value = postcardConfig.content.subtitleLinkURL;

    // Styles
    document.getElementById('titleColor').value = postcardConfig.styles.titleColor;
    document.getElementById('subtitleLinkColor').value = postcardConfig.styles.subtitleLinkColor;
    document.getElementById('uploadButtonColor').value = postcardConfig.styles.uploadButtonColor;
    document.getElementById('findImageButtonColor').value = postcardConfig.styles.findImageButtonColor;
    document.getElementById('sendPostcardButtonColor').value = postcardConfig.styles.sendPostcardButtonColor;

    // Email
    document.getElementById('senderName').value = postcardConfig.email.senderName;
    document.getElementById('subject').value = postcardConfig.email.subject;
    document.getElementById('body').value = postcardConfig.email.body;

    // Success Page
    document.getElementById('successTitle').value = postcardConfig.successPage.title;
    document.getElementById('successHeading').value = postcardConfig.successPage.heading;
    document.getElementById('successHeadingColor').value = postcardConfig.successPage.headingColor;
    document.getElementById('successSubheading').value = postcardConfig.successPage.subheading;
    document.getElementById('successButtonText').value = postcardConfig.successPage.buttonText;
    document.getElementById('successButtonColor').value = postcardConfig.successPage.buttonColor;
    document.getElementById('successPromoText').value = postcardConfig.successPage.promoText;
    document.getElementById('successPromoImageURL').value = postcardConfig.successPage.promoImageURL;
    document.getElementById('successPromoLinkURL').value = postcardConfig.successPage.promoLinkURL;
}

// Function to handle form submission (for a future step)
function handleFormSubmit(event) {
    event.preventDefault();
    // In a future step, this function will collect all form data
    // and send it to a server-side function to update config.js
    alert('Saving functionality will be implemented in the next step!');
}


// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    populateForm();
    const form = document.getElementById('config-form');
    form.addEventListener('submit', handleFormSubmit);
});
