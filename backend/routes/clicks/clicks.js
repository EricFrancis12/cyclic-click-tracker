const express = require('express');
const router = express.Router();

const CyclicDB = require('@cyclic.sh/dynamodb');
const db = CyclicDB(process.env.CYCLIC_DB);
const Clicks = db.collection('clicks');

const auth = require('../../middleware/auth/auth');



router.get('/', auth, async (req, res) => {
    // get all clicks in db
    try {
        const clicks = await Clicks.filter();
        res.status(200).json({ data: clicks });
    } catch (err) {
        console.error(`Error fetching clicks: ${err}`);
        res.status(500).json({ message: `Error fetching clicks: ${err}` });
    }
});

router.get('/:click_id', auth, async (req, res) => {
    try {
        // get a specific click in db
        const click = await Clicks.get(req.params.click_id);
        res.status(200).json({ data: click });
    } catch (err) {
        console.error(`Error fetching click: ${err}`);
        res.status(500).json({ message: `Error fetching click: ${err}` });
    }
});

router.patch('/:click_id', auth, async (req, res) => {
    try {
        // update a specific click in db
        let click = await Clicks.get(req.params.click_id);
        const props = click.props;

        for (key in req.body.data.props) {
            props[key] = req.body.data.props[key];
        }

        click = await Clicks.set(click.key, props);

        res.status(200).json({ data: click });
    } catch (err) {
        console.error(`Error updating click: ${err}`);
        res.status(500).json({ message: `Error updating click: ${err}` });
    }
});



module.exports = router;
