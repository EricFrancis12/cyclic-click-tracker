const Campaign = require('../../models/Campaign');

const path = require('path');

const { parseJsonFiles } = require('../data');



function get() {
    const campaignsDirPath = path.resolve(__dirname, './');
    const campaigns = parseJsonFiles(campaignsDirPath, Campaign);

    return campaigns;
}

function find(predicate = (item) => item) {
    const campaigns = get();
    const campaign = campaigns.find(predicate);

    return campaign ? campaign : null;
}



module.exports = {
    get,
    find
};
