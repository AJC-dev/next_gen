import { postcardConfig } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const { successPage } = postcardConfig;

    document.getElementById('success-page-title').textContent = successPage.title;
    
    const heading = document.getElementById('success-heading');
    heading.textContent = successPage.heading;
    heading.style.color = successPage.headingColor;

    document.getElementById('success-subheading').textContent = successPage.subheading;
    
    const button = document.getElementById('success-button');
    button.textContent = successPage.buttonText;
    button.style.backgroundColor = successPage.buttonColor;

    document.getElementById('success-promo-text').textContent = successPage.promoText;
    document.getElementById('success-promo-image-link').href = successPage.promoLinkURL;
    document.getElementById('success-promo-image').src = successPage.promoImageURL;
});
