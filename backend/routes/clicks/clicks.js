const express = require('express');
const router = express.Router();

const CyclicDB = require('@cyclic.sh/dynamodb');
const db = CyclicDB(process.env.CYCLIC_DB);

const auth = require('../../middleware/auth/auth');



router.get('/', auth, async (req, res) => {
    // get all clicks in db
    try {
        const clicksCollection = db.collection('clicks');
        const clicks = await clicksCollection.filter();
        res.status(200).json(clicks);
    } catch (err) {
        console.error(`Error fetching clicks: ${err}`);
        res.status(500).json({ message: `Error fetching clicks: ${err}` });
    }
});

router.get('/:click_id', auth, async (req, res) => {
    try {
        // get a specific click in db
        const clicksCollection = db.collection('clicks');
        const click = await clicksCollection.get(req.params.click_id);
        res.status(200).json(click);
    } catch (err) {
        console.error(`Error fetching click: ${err}`);
        res.status(500).json({ message: `Error fetching click: ${err}` });
    }
});



module.exports = router;
