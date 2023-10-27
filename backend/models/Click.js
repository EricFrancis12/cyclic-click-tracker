const TrafficSource = require('./TrafficSource');

const crypto = require('crypto');

const campaigns = require('../data/campaigns/campaigns');



class Click {
    constructor(props) {
        const { campaign_id, campaign, req } = props;

        if (campaign_id && !campaign) {
            campaign = campaigns.find(_campagin => _campagin._id === campaign_id);
        }

        if (!campaign) throw new Error('Campaign not found.');

        const timestamp = Date.now();
        const { viewRedirectUrl, isDirectLink, landingPage, offer, trafficSource, tokens } = campaign.handleView(req);

        this.campaign_id = campaign._id;
        this._id = `${crypto.randomUUID()}_${campaign._id}_CLK`;
        this.viewTimestamp = timestamp;

        this.lpClick = isDirectLink ? true : false;
        this.lpClickTimestamp = isDirectLink ? timestamp : null;

        this.conversion = false;
        this.conversionTimestamp = null;

        this.cost = tokens.find(token => token.key === TrafficSource.defaultTokens.cost.key)?.value;
        this.revenue = 0;

        this.landingPage_id = landingPage?._id || null;
        this.offer_id = offer?._id || null;
        this.trafficSource_id = campaign.trafficSource_id;
        this.flow_id = campaign.flow_id;

        this.tokens = tokens || [];

        this.url = req.url;
        this.ip = req.ip;
        this.userAgent = req.headers['user-agent'];
        // other server-detected data can be assigned to the click here...

        this.viewRedirectUrl = viewRedirectUrl;
        this.clickRedirectUrl = null;
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
