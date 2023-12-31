const Click = require('../../models/Click');

const express = require('express');
const router = express.Router();

const CyclicDB = require('@cyclic.sh/dynamodb');
const db = CyclicDB(process.env.CYCLIC_DB);

const campaigns = require('../../data/campaigns/campaigns');
const landingPages = require('../../data/landingPages/landingPages');
const { getAllOffers } = require('../../data/affiliateNetworks/affiliateNetworks');
const { catchAllRedirect } = require('../../config/settings.json');
const { extract_uuid } = require('../../utils/utils');



router.get('/:campaign_uuid', async (req, res) => {
    let viewRedirectUrl, click;
    const campaign = campaigns.find(campaign => extract_uuid(campaign._id) === req.params.campaign_uuid);

    if (campaign) {
        click = new Click({ campaign, req });
        viewRedirectUrl = click.viewRedirectUrl;
    } else if (catchAllRedirect.type === 'url') {
        viewRedirectUrl = catchAllRedirect.url;
    } else if (catchAllRedirect.type === 'offer') {
        const offer = getAllOffers().find(offer => offer._id === catchAllRedirect._id);
        viewRedirectUrl = offer.url;
    } else if (catchAllRedirect.type === 'landingPage') {
        const landingPage = landingPages.find(landingPage => landingPage._id === catchAllRedirect._id);
        viewRedirectUrl = landingPage.url;
    }

    // const sevenDaysFromNow = Date.now() + 60 * 60 * 24 * 7 * 1000;

    if (click?._id) res.cookie('click_id', click._id, { httpOnly: true });
    if (campaign?._id) res.cookie('campaign_id', campaign._id, { httpOnly: true });

    res.status(300).redirect(viewRedirectUrl || process.env.CATCH_ALL_REDIRECT_URL || 'https://bing.com');

    try {
        const clicksCollection = db.collection('clicks');
        await clicksCollection.set(click._id, click);
    } catch (err) {
        console.error(err);
    }
});



module.exports = router;
