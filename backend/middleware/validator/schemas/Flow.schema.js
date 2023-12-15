const Joi = require('joi');

const flowConfig = require('../../../../frontend/src/config/Flow.config.json');



const pathSchema = Joi.object({
    active: Joi.valid(true, false).default(true),
    weight: Joi.number().min(0).max(100).default(100),
    landingPages: Joi.array().items({
        _id: Joi.string(),
        active: Joi.valid(true, false).default(true),
        weight: Joi.number().min(0).max(100).default(100)
    }),
    offers: Joi.array().items({
        _id: Joi.string(),
        active: Joi.valid(true, false).default(true),
        weight: Joi.number().min(0).max(100).default(100)
    }),
}).unknown(false);



const ruleSchema = Joi.object({
    equals: Joi.valid(true, false).default(true),
    data: Joi.array().items(Joi.string())
}).unknown(false);



const flowSchema = Joi.object({
    type: Joi.valid(...Object.values(flowConfig.types)).required(),
    _id: Joi.string().required(),
    defaultRoute: {
        active: Joi.valid(true, false).default(true),
        paths: Joi.array().items(pathSchema).required()
    },
    ruleRoutes: Joi.array().items({
        active: Joi.valid(true, false).default(true),
        logicalRelation: Joi.valid(flowConfig.logicalRelations.AND, flowConfig.logicalRelations.OR),
        rules: Joi.array().items(ruleSchema),
        paths: Joi.array().items(pathSchema)
    }),
    url: Joi.string()
}).unknown(false);



module.exports = flowSchema;
