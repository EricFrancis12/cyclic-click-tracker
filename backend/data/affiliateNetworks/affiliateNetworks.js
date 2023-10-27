const AffiliateNetwork = require('../../models/AffiliateNetwork');
const Offer = require('../../models/Offer');

const fs = require('fs');
const path = require('path');

const { parseJsonFiles } = require('../data');



function get() {
    const affiliateNetworksDirPath = path.resolve(__dirname, './');
    const affiliateNetworks = parseJsonFiles(affiliateNetworksDirPath, AffiliateNetwork);

    affiliateNetworks.forEach(affiliateNetwork => {
        const offersDirPath = `${affiliateNetworksDirPath}/${affiliateNetwork._id}/offers`;
        if (fs.existsSync(offersDirPath)) {
            const offers = parseJsonFiles(offersDirPath, Offer);
            affiliateNetwork.offers = offers;
        }
    });

    return affiliateNetworks;
}

function find(predicate = (item) => item) {
    const affiliateNetworks = get();
    const affiliateNetwork = affiliateNetworks.find(predicate);

    return affiliateNetwork ? affiliateNetwork : null;
}

function getAllOffers() {
    let result = [];

    const affiliateNetworks = get();
    affiliateNetworks.forEach(affiliateNetwork => {
        const offers = [...affiliateNetwork.offers];
        result = [...result, ...offers];
    });

    return result;
}



module.exports = {
    get,
    find,
    getAllOffers
};
