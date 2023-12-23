const { FL } = require('../../frontend/src/config/config.json').suffixes;
const FlowConfig = require('../../frontend/src/config/Flow.config.json');
const { BUILT_IN, SAVED, URL } = FlowConfig.types;
const { BUILT_IN_FL, URL_FL } = FlowConfig.static_ids;
const { DEFAULT, RULE } = FlowConfig.routeTypes;



class Flow {
    constructor(props) {
        const { name, type = BUILT_IN, defaultRoute, ruleRoutes, tags } = props;

        this.type = type;

        if (type === SAVED || type === URL) {
            throw new Error('Saved and URL Flows are not yet implimented.');
        } else {
            this.name = name ?? '';
            this.type = BUILT_IN;
            this._id = BUILT_IN_FL;
            this.defaultRoute = defaultRoute;
            this.ruleRoutes = ruleRoutes ?? [];

            this.tags = tags ?? [];
        }
    }
}



Flow.makePath = function (path) {
    const { landingPages, offers, pathType, rules, active = true } = path;

    const _landingPages = landingPages.map(landingPage => {
        return ({
            _id: landingPage._id,
            weight: 100,
        });
    });

    const _offers = offers.map(offer => {
        return ({
            _id: offer._id,
            weight: 100,
        });
    });

    return {
        type: pathType,
        weight: 100,
        active,
        landingPages: _landingPages,
        offers: _offers,
        rules
    };
}



Flow.types = {
    ...FlowConfig.types
};

Flow.routeTypes = {
    ...FlowConfig.routeTypes
};



module.exports = Flow;
