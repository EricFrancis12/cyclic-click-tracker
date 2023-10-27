const Offer = require('../../models/Offer');

const express = require('express');
const router = express.Router();

const CyclicDB = require('@cyclic.sh/dynamodb');
const db = CyclicDB(process.env.CYCLIC_DB);

const campaigns = require('../../data/campaigns/campaigns');
const { weightedRandomlySelectItem } = require('../../utils/utils');



router.get('/', async (req, res) => {
    let clickRedirectUrl, campaign, offer;
    const click_id = req.signedCookies.click_id;
    const campaign_id = req.signedCookies.campaign_id;

    if (campaign_id) campaign = campaigns.find(campaign => campaign._id === campaign_id);

    if (campaign.offerRotation === Offer.rotationOptions.RANDOM) {
        const offer_id = weightedRandomlySelectItem(campaign.offers)._id;
        offer = require('../../data/affiliateNetworks/affiliateNetworks').getAllOffers().find(_offer => _offer._id === offer_id);

        if (offer) clickRedirectUrl = offer.url;
    } else {
        throw new Error('Other offer rotation options not yet implimented.');
    }

    res.status(300).redirect(clickRedirectUrl || process.env.CATCH_ALL_REDIRECT_URL || 'https://bing.com');

    if (click_id) {
        try {
            const clicksCollection = db.collection('clicks');
            const click = await clicksCollection.get(click_id);

            if (click) {
                click.recordClick({
                    campaign_id,
                    offer_id: offer?._id,
                    clickRedirectUrl,
                    req
                });
            }

            await clicksCollection.set(click._id, click);
        } catch (err) {
            console.error(err);
        }
    }
})



module.exports = router;
