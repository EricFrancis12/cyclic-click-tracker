const express = require('express');
const router = express.Router();

const CyclicDB = require('@cyclic.sh/dynamodb');
const db = CyclicDB(process.env.CYCLIC_DB);



router.get('/:click_id', postback);
router.post('/:click_id', postback);

async function postback(req, res) {
    res.status(200).json({});

    try {
        const clicksCollection = db.collection('clicks');
        const click = await clicksCollection.get(req.params.click_id);

        click.recordConversion({ req });

        await clicksCollection.set(click._id, click);
    } catch (err) {
        console.error(err);
    }
}



module.exports = router;
