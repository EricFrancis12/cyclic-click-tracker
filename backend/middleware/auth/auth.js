

async function auth(req, res, next) {
    if (process.env.DISABLE_AUTH?.toLowerCase() === 'true') {
        next();
        return;
    }

    const authorized = await authorize(req);

    if (!authorized) {
        return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    next();
}



async function authorize(req) {
    const cookieSecretPresent = req.signedCookies.loggedIn === process.env.LOGGED_IN_SECRET;

    const authToken = req.header('Authorization')?.split('.')?.pop();
    const correctBearerAuth = authToken === process.env.AUTHORIZATION || authToken === process.env.PASSWORD;

    if (cookieSecretPresent || correctBearerAuth) {
        return true;
    }

    return false;
}



module.exports = auth;
