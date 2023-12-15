const Joi = require('joi');

const flowSchema = require('./Flow.schema');

const lpConfig = require('../../../../frontend/src/config/LandingPage.config.json');
const offerConfig = require('../../../../frontend/src/config/Offer.config.json');
const geos = require('../../../../frontend/src/config/rules/geos.json');



const campaignSchema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    trafficSource_id: Joi.string().min(1).required(),
    landingPageRotation: Joi.valid(...Object.values(lpConfig.rotationOptions)).default(lpConfig.rotationOptions.RANDOM),
    offerRotation: Joi.valid(...Object.values(offerConfig.rotationOptions)).default(offerConfig.rotationOptions.RANDOM),
    geoName: Joi.valid(...geos.map(geos => geos.name)).default(geos[0].name),
    tags: Joi.array().items(Joi.string().min(1).max(100)).default([]),
    flow: flowSchema
}).unknown(false);



module.exports = campaignSchema;
