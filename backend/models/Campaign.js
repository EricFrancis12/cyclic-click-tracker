const Flow = require('./Flow');
const LandingPage = require('./LandingPage');
const Offer = require('./Offer');

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const inquirer = require('inquirer');

const { arrayFromObject, formatTime, removeIllegalChars, weightedRandomlySelectItem, extract_uuid } = require('../utils/utils');
const { isObject } = require('../utils/utils');
const { CA } = require('../../frontend/src/config/config.json').suffixes;



class Campaign {
    constructor(props) {
        const { name, trafficSource, landingPageRotation, offerRotation, flow, tags, geoName, jsonData } = props;

        if (!jsonData) {
            this._id = `${removeIllegalChars(name)}_${crypto.randomUUID()}_${CA}`;
            this.fileName = `${this._id}.json`;
            this.timestamp = Date.now();
            this.timestampFormatted = formatTime(this.timestamp);

            this.name = name;
            this.trafficSource_id = trafficSource._id;
            this.landingPageRotation = landingPageRotation;
            this.offerRotation = offerRotation;
            this.flow = flow;

            this.tags = tags ?? [];
            this.geoName = geoName;
        } else {
            for (const key in jsonData) {
                this[key] = jsonData[key];
            }
        }
    }

    update(jsonData) {
        if (!jsonData || !isObject(jsonData)) throw new Error('No data argument specified.');

        for (const key in jsonData) {
            if (this[key] !== undefined) {
                this[key] = jsonData[key];
            }
        }
    }

    save(jsonData = this) {
        try {
            const filePath = path.resolve(__dirname, `../data/campaigns/${this._id}/${this.fileName}`);
            fs.writeFileSync(filePath, json.stringify(jsonData, null, 4));
        } catch (err) {
            throw new Error('Error saving campaign');
        }
    }

    updateAndSave(jsonData) {
        this.update(jsonData);
        this.save();
    }

    delete() {
        const jsonFilePath = path.resolve(__dirname, `../data/campaigns/${this._id}/${this.fileName}`);
        if (fs.existsSync(jsonFilePath)) {
            fs.unlinkSync(jsonFilePath);
        }
    }

    getCampaignUrl() {
        const trafficSources = require('../data/trafficSources/trafficSources').get();
        const trafficSource = trafficSources.find(trafficSource => trafficSource._id === this.trafficSource_id);

        if (!trafficSource) throw new Error('Traffic source for this campaign not found');

        const queryString = trafficSource.tokens.map(token => (
            token.key + '=' + token.value
        )).join('&');

        const uuid = extract_uuid(this._id);

        return `${process.env.CAMPAIGN_PROTOCOL__ || 'http://'}${process.env.CAMPAIGN_DOMAIN}/t/${uuid}?${queryString}`;
    }

    expand() {
        const landingPages = require('../data/landingPages/landingPages').get();
        const offers = require('../data/affiliateNetworks/affiliateNetworks').getAllOffers();
        const trafficSources = require('../data/trafficSources/trafficSources').get();
        const { defaultPath, rulePaths } = this.flow || {};

        const findAndMapBy_id = (inputItem, array) => {
            const _id = inputItem._id;
            const outputItem = array.find(item => item._id === _id);

            if (outputItem) {
                for (const key in inputItem) {
                    outputItem[key] = inputItem[key];
                }
            }

            return outputItem;
        }

        const result = {
            defaultPath: {
                landingPages: defaultPath?.landingPages.map(landingPage => findAndMapBy_id(landingPage, landingPages)),
                offers: defaultPath?.offers.map(offer => findAndMapBy_id(offer, offers))
            },
            rulePaths: rulePaths?.map(rulePath => ({
                landingPages: rulePath.landingPages.map(landingPage => findAndMapBy_id(landingPage, landingPages)),
                offers: rulePath.offers.map(offer => findAndMapBy_id(offer, offers))
            })),
            trafficSource: trafficSources.find(trafficSource => trafficSource._id === this.trafficSource_id)
        };

        return result;
    }

    handleView(req) {
        const { defaultPath, rulePaths, trafficSource } = this.expand();
        req.tokens = trafficSource.tokensFromUrl(req.url);

        // check to see if req triggered any rules,
        // if so, go with the first one matched:
        let path = defaultPath;
        for (let i = 0; i < rulePaths.length; i++) {
            let allRulesSatisfied = true;
            rulePaths[i].rules.forEach(rule => {
                if (rule(req) !== true) allRulesTrue = false;
            });

            if (allRulesSatisfied) {
                path = rulePaths[i];
                break;
            }
        }

        let viewRedirectUrl, isDirectLink, landingPage, offer;

        if (this.landingPageRotation === LandingPage.rotationOptions.RANDOM) {
            landingPage = weightedRandomlySelectItem(path.landingPages);
        } else {
            throw new Error('Other landing page rotation options not implimented yet.')
        }

        if (landingPage?._id === LandingPage.DIRECT_LINKING_LP._id) {
            offer = weightedRandomlySelectItem(path.offers);

            viewRedirectUrl = offer.url;
            isDirectLink = true;
        } else {
            viewRedirectUrl = landingPage.url;
            isDirectLink = false;
        }

        return { viewRedirectUrl, isDirectLink, landingPage, offer, trafficSource, tokens: req.tokens };
    }

    // handleClick(req) {
    //     const _offers = require('../data/affiliateNetworks/affiliateNetworks').getAllOffers();
    //     const offers = this.offers.map(offer => _offers.find(_offer => _offer._id === offer._id));

    //     let clickRedirectUrl, offer;

    //     if (this.offerRotation === Offer.rotationOptions.RANDOM) {
    //         offer = randomlySelectItem(offers);
    //     } else {
    //         throw new Error('Other offer rotation options not implimented yet.')
    //     }

    //     if (offer) {
    //         clickRedirectUrl = offer.url;
    //     }

    //     return { clickRedirectUrl, offer };
    // }
}



Campaign.create = function () {
    const data = require('../data/data').getData();
    const landingPageChoices = data.landingPages.map(landingPage => landingPage.name);
    const trafficSourceChoices = data.trafficSources.map(trafficSource => trafficSource.name);
    const offerChoices = data.offers.map(offer => offer.name);

    const questions1 = [
        {
            type: 'input',
            name: 'name',
            message: 'Enter campaign name:'
        },
        {
            type: 'list',
            name: 'trafficSourceName',
            message: 'Select traffic source:',
            choices: trafficSourceChoices
        },
        {
            type: 'list',
            name: 'numLandingPages',
            message: 'Select number of landing pages:',
            choices: [1, 2, 3, 4, 5]
        },
        {
            type: 'list',
            name: 'landingPageRotation',
            message: 'Select landing page rotation',
            choices: arrayFromObject(LandingPage.rotationOptions)
        }
    ];

    inquirer
        .prompt(questions1)
        .then((answers1) => {
            const questions2 = [];

            for (let i = 1; i <= answers1.numLandingPages; i++) {
                questions2.push({
                    type: 'list',
                    name: `landingPage${i}Name`,
                    message: `Select landing page ${i}`,
                    choices: landingPageChoices
                });
            }

            inquirer.prompt(questions2)
                .then((answers2) => {
                    const questions3 = [
                        {
                            type: 'list',
                            name: 'numOffers',
                            message: 'Select number of offers:',
                            choices: [1, 2, 3, 4, 5]
                        },
                        {
                            type: 'list',
                            name: 'offerRotation',
                            message: 'Select offer rotation',
                            choices: arrayFromObject(Offer.rotationOptions)
                        }
                    ];

                    inquirer.prompt(questions3)
                        .then((answers3) => {
                            const questions4 = [];

                            for (let i = 1; i <= answers3.numOffers; i++) {
                                questions4.push({
                                    type: 'list',
                                    name: `Offer${i}Name`,
                                    message: `Select offer ${i}`,
                                    choices: offerChoices
                                });
                            }

                            inquirer.prompt(questions4)
                                .then((answers4) => {
                                    const { name, trafficSourceName, numLandingPages, landingPageRotation } = answers1;
                                    const landingPages = arrayFromObject(answers2).map(landingPageName => {
                                        return data.landingPages.find(landingPage => landingPage.name === landingPageName);
                                    });
                                    const { numOffers, offerRotation } = answers3;
                                    const offers = arrayFromObject(answers4).map(offerName => {
                                        return data.offers.find(offer => offer.name === offerName);
                                    });

                                    const trafficSource = data.trafficSources.find(trafficSource => trafficSource.name === trafficSourceName);

                                    const flow = new Flow({
                                        landingPages,
                                        offers,
                                        type: Flow.types.BUILT_IN
                                    });

                                    const campaign = new Campaign({
                                        name,
                                        trafficSource,
                                        landingPageRotation,
                                        offerRotation,
                                        flow
                                    });

                                    const campaignDir = path.resolve(__dirname, `../data/campaigns/${campaign._id}`);
                                    if (!fs.existsSync(campaignDir)) fs.mkdirSync(campaignDir);
                                    const jsonFilePath = `${campaignDir}/${campaign._id}.json`;
                                    if (!fs.existsSync(jsonFilePath)) fs.writeFileSync(jsonFilePath, JSON.stringify(campaign, null, 4));

                                    console.log(`New campaign created at ${jsonFilePath}`);
                                });
                        });
                });
        })
}



module.exports = Campaign;
