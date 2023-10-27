const LandingPage = require('../backend/models/LandingPage');

const fs = require('fs');
const path = require('path');

const DIRS_TO_MAKE = [
    'affiliateNetworks',
    'campaigns',
    'landingPages',
    'trafficSources'
].map(dir => path.resolve(__dirname, `../backend/data/${dir}`));



(function () {
    DIRS_TO_MAKE.forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    });
})();



(function () {
    const directLinkingLandingPage = new LandingPage(LandingPage.DIRECT_LINKING_LP);

    const directLinkLandingPageDir = path.resolve(__dirname, `../backend/data/landingPages/${directLinkingLandingPage._id}`);
    if (!fs.existsSync(directLinkLandingPageDir)) fs.mkdirSync(directLinkLandingPageDir);

    const jsonFilePath = `${directLinkLandingPageDir}/${directLinkingLandingPage._id}.json`;
    if (!fs.existsSync(jsonFilePath)) fs.writeFileSync(jsonFilePath, JSON.stringify(directLinkingLandingPage, null, 4));
})();
