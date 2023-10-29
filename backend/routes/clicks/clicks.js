const Click = require('../../models/Click');

const express = require('express');
const router = express.Router();

const CyclicDB = require('@cyclic.sh/dynamodb');
const db = CyclicDB(process.env.CYCLIC_DB);

const auth = require('../../middleware/auth/auth');



router.get('/', auth, async (req, res) => {
    // get all clicks in db
    try {
        const clicksCollection = db.collection('clicks');

        console.log(clicksCollection);
        console.log(clicksCollection.filter());

        const results = await clicksCollection.filter().results;

        console.log(results);

        const clicks = results?.map(result => result.props) ?? [];

        res.status(200).json({
            success: true,
            data: clicks
        });
    } catch (err) {
        console.error(`Error fetching clicks: ${err}`);
        res.status(500).json({ success: false, message: `Error fetching clicks: ${err}` });
    }
});

router.get('/:click_id', auth, async (req, res) => {
    try {
        // get a specific click in db
        const clicksCollection = db.collection('clicks');
        const results = await clicksCollection.filter().results;
        const click = results.find(result => result.props._id === req.params.click_id)?.props;

        if (!click) return res.status(404).json({ success: false, message: 'Click not found.' });

        res.status(200).json({
            success: true,
            data: click
        });
    } catch (err) {
        console.error(`Error fetching click: ${err}`);
        res.status(500).json({ success: false, message: `Error fetching click: ${err}` });
    }
});



module.exports = router;
