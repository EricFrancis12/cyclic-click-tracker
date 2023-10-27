const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth/auth');
const { getData } = require('../../data/data');



router.get('/', auth, (req, res) => {
    const data = getData();

    res.status(200).json({
        success: true,
        data
    });
});

router.get('/affiliate-networks', auth, (req, res) => {
    const affiliateNetworks = getData().affiliateNetworks;

    res.status(200).json({
        success: true,
        data: affiliateNetworks
    });
});

router.get('/campaigns', auth, (req, res) => {
    const campaigns = getData().campaigns;

    res.status(200).json({
        success: true,
        data: campaigns
    });
});

router.get('/landing-pages', auth, (req, res) => {
    const landingPages = getData().landingPages;

    res.status(200).json({
        success: true,
        data: landingPages
    });
});

router.get('/offers', auth, (req, res) => {
    const offers = require('../../data/affiliateNetworks/affiliateNetworks').getAllOffers();

    res.status(200).json({
        success: true,
        data: offers
    });
});

router.get('/traffic-sources', auth, (req, res) => {
    const trafficSources = getData().trafficSources;

    res.status(200).json({
        success: true,
        data: trafficSources
    });
});



module.exports = router;
