const express = require('express');
const router = express.Router();



router.post('/', (req, res) => {
    const password = req.body.password;
    const correctPassword = password === process.env.PASSWORD;

    if (!password || !correctPassword) return res.status(401).json({ success: false, message: 'Incorrect Password' });

    const sevenDays = 60 * 60 * 24 * 7 * 1000;

    res.cookie('loggedIn', process.env.LOGGED_IN_SECRET, {
        httpOnly: true,
        signed: true,
        maxAge: sevenDays
    });

    res.status(200).json({ success: true });
});



module.exports = router;
