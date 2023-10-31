const TrafficSource = require('./TrafficSource');

const crypto = require('crypto');

const campaigns = require('../data/campaigns/campaigns');
const { UNKNOWN } = require('../../frontend/src/config/config.json').terms;



class Click {
    constructor(props) {
        const { campaign_id, campaign, req } = props;

        if (campaign_id && !campaign) {
            campaign = campaigns.find(_campagin => _campagin._id === campaign_id);
        }

        if (!campaign) throw new Error('Campaign not found.');

        const { viewRedirectUrl, isDirectLink, landingPage, offer, trafficSource, tokens } = campaign.handleView(req);

        const timestamp = Date.now();
        this.viewTimestamp = timestamp;

        this.campaign_id = campaign._id;
        this._id = `${crypto.randomUUID()}_${campaign._id}_CLK`;

        this.landingPage_id = landingPage?._id || null;
        this.offer_id = offer?._id || null;
        this.trafficSource_id = campaign.trafficSource_id;
        this.flow_id = campaign.flow._id;

        this.lpClick = isDirectLink ? true : false;
        this.lpClickTimestamp = isDirectLink ? timestamp : null;

        this.conversion = false;
        this.conversionTimestamp = null;

        this.cost = tokens.find(token => token.key === TrafficSource.defaultTokens.cost.key)?.value ?? 0;
        this.revenue = 0;

        this.tokens = tokens || [];

        this.viewRedirectUrl = viewRedirectUrl;
        this.clickRedirectUrl = isDirectLink ? this.viewRedirectUrl : null;

        this.language = req.headers['accept-language'] ?? req.lang ?? UNKNOWN;
        this.city = null ?? UNKNOWN;
        this.region = null ?? UNKNOWN;
        this.country = null ?? UNKNOWN;

        this.isp = null ?? UNKNOWN;
        this.carriers = null ?? UNKNOWN;
        this.connectionType = null ?? UNKNOWN;

        this.deviceModel = null ?? UNKNOWN;
        this.deviceVendor = null ?? UNKNOWN;
        this.deviceType = null ?? UNKNOWN;
        this.screenResolution = null ?? UNKNOWN;

        this.os = null ?? UNKNOWN;
        this.osVersion = null ?? UNKNOWN;

        this.browserName = null ?? UNKNOWN;
        this.browserVersion = null ?? UNKNOWN;

        this.ip = req.ip ?? UNKNOWN;
        this.userAgent = req.headers['user-agent'] ?? UNKNOWN;
    }

    recordClick(props) {
        const { campaign_id, campaign, offer_id, clickRedirectUrl, req } = props;

        if (campaign_id && !campaign) {
            campaign = campaigns.find(_campagin => _campagin._id === campaign_id);
        }

        if (!campaign) throw new Error('Campaign not found.');

        const timestamp = Date.now();

        this.lpClick = true;
        this.lpClickTimestamp = timestamp;

        this.offer_id = offer_id || null;
        this.clickRedirectUrl = clickRedirectUrl;
    }

    recordConversion(props) {
        const { req } = props;

        const timestamp = Date.now();

        this.conversion = true;
        this.conversionTimestamp = timestamp;

        this.revenue = (this.revenue ?? 0) + parseFloat(req.query[TrafficSource.defaultTokens.payout.key]);
    }
}



module.exports = Click;
