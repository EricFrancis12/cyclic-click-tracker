const fs = require('fs');
const path = require('path');

const Joi = require('joi');



module.exports = class Validator {
    constructor(schemaName) {
        this.schemaName = schemaName;
    }

    validate(req, res, next) {
        // starter code for request validator:

        // const schemaFilePath = path.resolve(__dirname, `./schemas/${schemaName}.schema.js`);

        // if (!fs.existsSync(schemaFilePath)) {
        //     console.log('Schema not found matching schemaName. Calling next()');
        //     next();
        //     return;
        // }

        // const schema = require(schemaFilePath);

        // const { error, value } = schema.validate(req.body, {
        //     abortEarly: false
        // });

        // if (error) {
        //     console.error(error);
        //     return res.json({
        //         success: false,
        //         data: error.details
        //     });
        // }

        next();
    }
}
