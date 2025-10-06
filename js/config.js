export const postcardConfig = {
    content: {
        pageTitle: "SixStarCruises - Send Free Postcards",
        faviconURL: "ssc_favicon.ico",
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

