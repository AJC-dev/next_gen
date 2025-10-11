export default {
    content: {
        pageTitle: "SixStarCruises - Send Free Postcards",
        faviconURL: "ssc_favicon.ico",
        loadingImageURL: "https://i.gifer.com/ZZ5H.gif",
        mainTitle: "Send holiday postcards home now.",
        subtitleText: "Upload pics, add a message and we'll post them for you tomorrow. A free service from",
        subtitleLinkText: "Six Star Cruises",
        subtitleLinkURL: "https://www.sixstarcruises.co.uk/"
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
        subject: "Your Postcard Proof",
        body: "Here is the final proof of your postcard. Please click the link to confirm and send."
    },
    confirmationEmail: {
        senderName: "Six Star Cruises Team",
        subject: "Your Postcard Has Been Sent!",
        body: "Thank you for using our service. Your postcard is on its way."
    },
    successPage: {
        pageTitle: "Postcard Sent!",
        faviconURL: "ssc_favicon.ico",
        heading: "Success!",
        headingColor: "#0E0B3D",
        subheading: "Hope you're having a great holiday.",
        buttonText: "Send again, to someone else?",
        buttonColor: "#212529",
        promoText: "Savings Event: Book next year with savings of up to 40% and Free Business Class Flights",
        promoLinkURL: "https://www.sixstarcruises.co.uk/",
        promoImageURL: "sixstars.png"
    },
    limits: {
        postcardLimit: 5,
        limitDays: 30
    },
    print: {
        dpi: 300,
        a5WidthMM: 210,
        a5HeightMM: 148,
        bleedMM: 3,
        handleRadius: 8
    },
    validation: {
        minImageDimension: 800,
        maxFileSizeMB: 4
    }
};

