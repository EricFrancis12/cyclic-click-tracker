const Campaign = require('../../models/Campaign');

const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth/auth');
const { getData } = require('../../data/data');

const validator = require('../../middleware/validator/validator');



router.get('/', auth, (req, res) => {
    try {
        const campaigns = getData().campaigns;

        res.status(200).json({
            success: true,
            data: campaigns
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            success: false,
            message: `Error reading database: ${err}`
        });
    }
});

router.get('/:campaign_id', auth, (req, res) => {
    let campaign;
    try {
        const campaigns = getData().campaigns;
        campaign = campaigns.find(_campaign => _campaign._id === req.params.campaign_id);
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            success: false,
            message: `Error reading database: ${err}`
        });
    }

    if (!campaign) {
        return res.status(404).json({
            success: false,
            message: 'No campaign found'
        });
    }

    res.status(200).json({
        success: true,
        data: campaign
    });
});

router.post('/', auth, (req, res, next) => validator(req, res, next, 'Campaign'), (req, res) => {
    const { name, trafficSource_id, landingPageRotation, offerRotation, geoName, tags, flow } = req.body;

    try {
        const trafficSource = getData().trafficSources.find(_trafficSource => _trafficSource._id === trafficSource_id);
        if (!trafficSource) {
            return res.status(404).json({
                success: false,
                message: 'Traffic source not found with provided trafficSource_id'
            });
        }

        const campaign = new Campaign({ name, trafficSource, landingPageRotation, offerRotation, flow });
        campaign.save();

        res.status(201).json({
            success: true,
            data: campaign
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error creating new campaign'
        });
    }
});

router.put('/:campaign_id', auth, validator, (req, res) => {
    try {
        const campaigns = getData().campaigns;
        const campaign = campaigns.find(_campaign => _campaign._id === req.params.campaign_id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'No campaign found'
            });
        }

        campaign.updateAndSave({ jsonData: req.body.jsonData });

        res.status(200).json({
            success: true
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            success: false,
            message: `Error updating campaign.`
        });
    }
});

router.delete('/:campaign_id', auth, (req, res) => {
    try {
        const campaigns = getData().campaigns;
        const campaign = campaigns.find(_campaign => _campaign._id === req.params.campaign_id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'No campaign found'
            });
        }

        campaign.delete();

        res.status(200).json({
            success: true
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            success: false,
            message: `Error deleting campaign.`
        });
    }
});



module.exports = router;
