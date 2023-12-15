const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const inquirer = require('inquirer');

const { formatTime, removeIllegalChars } = require('../utils/utils');
const { LP } = require('../../frontend/src/config/config.json').suffixes;
const LandingPageConfig = require('../../frontend/src/config/LandingPage.config.json');



class LandingPage {
    constructor(props) {
        const { name, url = '', _id, tags, jsonData } = props;

        if (!jsonData) {
            this._id = _id || `${removeIllegalChars(name)}_${crypto.randomUUID()}_${LP}`;
            this.fileName = `${this._id}.json`;
            this.timestamp = Date.now();
            this.timestampFormatted = formatTime(this.timestamp);

            this.name = name || this._id;
            this.url = url;

            this.tags = tags ?? [];
        } else {
            for (const key in jsonData) {
                this[key] = jsonData[key];
            }
        }
    }
}



LandingPage.create = function () {
    const questions1 = [
        {
            type: 'input',
            name: 'name',
            message: 'Enter landing page name (leave blank to use URL as name):'
        },
        {
            type: 'input',
            name: 'url',
            message: 'Enter landing page URL:'
        }
    ];

    inquirer
        .prompt(questions1)
        .then((answers1) => {
            const { name, url } = answers1;
            const landingPage = new LandingPage({ name, url });

            const landingPageDir = path.resolve(__dirname, `../data/landingPages/${landingPage._id}`);
            if (!fs.existsSync(landingPageDir)) fs.mkdirSync(landingPageDir);
            const jsonFilePath = `${landingPageDir}/${landingPage._id}.json`;
            if (!fs.existsSync(jsonFilePath)) fs.writeFileSync(jsonFilePath, JSON.stringify(landingPage, null, 4));

            console.log(`New landing page created at ${jsonFilePath}`);
        })
        .catch((err) => {
            console.error('Error occurred:', err);
        });
}



LandingPage.rotationOptions = {
    ...LandingPageConfig.rotationOptions
};

LandingPage.DIRECT_LINKING_LP = {
    name: 'Direct Linking',
    url: '',
    _id: LandingPageConfig.static_ids.DIRECT_LINKING_LP
};



module.exports = LandingPage;
