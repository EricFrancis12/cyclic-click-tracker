

class Flow {
    constructor(props) {
        const { landingPages = [], offers = [], type = Flow.types.BUILT_IN } = props;

        this.type = type;

        if (type === Flow.types.SAVED) {
            throw new Error('Saved Flows are not yet implimented.');
        } else {
            this.type = Flow.types.BUILT_IN;
            this._id = `${Flow.types.BUILT_IN}_FL`;
            this.defaultPath = Flow.makePath({ landingPages, offers, pathType: Flow.pathTypes.DEFAULT });
            this.rulePaths = [];
        }
    }
}



Flow.makePath = function (props) {
    const { landingPages, offers, pathType, rules } = props;

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
        landingPages: _landingPages,
        offers: _offers,
        rules
    };
}



Flow.types = {
    BUILT_IN: 'BUILT_IN',
    SAVED: 'SAVED'
};

Flow.pathTypes = {
    DEFAULT: 'DEFAULT',
    RULE: 'RULE'
};



module.exports = Flow;
