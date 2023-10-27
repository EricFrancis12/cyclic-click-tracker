const LandingPage = require('../../models/LandingPage');

const path = require('path');

const { parseJsonFiles } = require('../data');



function get() {
    const landingPagesDirPath = path.resolve(__dirname, './');
    const landingPages = parseJsonFiles(landingPagesDirPath, LandingPage);

    return landingPages;
}

function find(predicate = (item) => item) {
    const landingPages = get();
    const landingPage = landingPages.find(predicate);

    return landingPage ? landingPage : null;
}



module.exports = {
    get,
    find
};
