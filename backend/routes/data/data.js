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



module.exports = router;
