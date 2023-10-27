const express = require('express');
const router = express.Router();



router.get('/', logout);
router.post('/', logout);

function logout(req, res) {
    res.clearCookie('loggedIn');
    res.status(204).end();
}



module.exports = router;
