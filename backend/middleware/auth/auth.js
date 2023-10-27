

async function auth(req, res, next) {
    const authorized = await validate(req);

    if (!authorized) {
        return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    next();
}



async function validate(req) {
    if (req.signedCookies.loggedIn === process.env.LOGGED_IN_SECRET) {
        return true;
    }

    return false;
}



module.exports = auth;
