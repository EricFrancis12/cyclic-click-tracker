const fs = require('fs');
const path = require('path');

const Joi = require('joi');



function validator(req, res, next, schemaName) {
    console.log(req.body);

    const schemaFilePath = path.resolve(__dirname, `./schemas/${schemaName}.schema.js`);

    if (!fs.existsSync(schemaFilePath)) {
        console.log('Schema not found matching schemaName. Calling next()');
        next();
        return;
    }

    const schema = require(schemaFilePath);

    const { error, value } = schema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        console.error(error);
        return res.json({
            success: false,
            data: error.details
        });
    }

    next();
};



module.exports = validator;
