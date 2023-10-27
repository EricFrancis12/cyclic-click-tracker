

async function auth(req, res, next) {
    if (process.env.DISABLE_AUTH.toLowerCase() === 'true') next();

    const authorized = await authorize(req);

    if (!authorized) {
        return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    next();
}



async function authorize(req) {
    if (req.signedCookies.loggedIn === process.env.LOGGED_IN_SECRET) {
        return true;
    }

    return false;
}



module.exports = auth;
