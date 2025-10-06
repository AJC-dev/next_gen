export const postcardConfig = {
    branding: {
        pageTitle: "SixStarCruises - Send Free Postcards",
        faviconURL: "ssc_favicon.ico"
    },
    content: {
        mainTitle: "Send holiday postcards home now.",
        subtitleText: "Upload pics, add a message and we'll post them for you tomorrow. A free service from",
        subtitleLinkURL: "https://www.sixstarcruises.co.uk/",
        subtitleLinkText: "Six Star Cruises"
    },
    styles: {
        titleColor: "#b9965b",
        subtitleLinkColor: "#b9965b",
        uploadButtonColor: "#b9965b",
        findImageButtonColor: "#212529",
        sendPostcardButtonColor: "#212529"
    },
    email: {
        senderName: "Six Star Cruises",
        subject: "Your Postcard is on its way!",
        body: "Thank you for using our postcard service. Please click the link below to confirm and send your postcard."
    },
    apiKeys: {
        // IMPORTANT: These keys should be treated as secrets. 
        // In a real-world scenario, they would be fetched from a secure backend 
        // and not stored directly in a public JavaScript file.
        recaptchaSiteKey: "YOUR_RECAPTCHA_SITE_KEY",
        pixabayApiKey: "YOUR_PIXABAY_API_KEY"
    },
    settings: {
        minImageDimension: 800,
        printDPI: 300,
        a5WidthMM: 210,
        a5HeightMM: 148,
        bleedMM: 3,
        handleRadius: 8,
        maxFileSizeMB: 4
    }
};

