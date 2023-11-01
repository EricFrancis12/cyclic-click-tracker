const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const inquirer = require('inquirer');

const { formatTime, removeIllegalChars } = require('../utils/utils');
const { AN } = require('../../frontend/src/config/config.json').suffixes;



class AffiliateNetwork {
    constructor(props) {
        const { name, defaultNewOfferString = '&REPLACE={click_id}', jsonData } = props;

        if (!jsonData) {
            this._id = `${removeIllegalChars(name)}_${crypto.randomUUID()}_${AN}`;
            this.fileName = `${this._id}.json`;
            this.timestamp = Date.now();
            this.timestampFormatted = formatTime(this.timestamp);
            this.name = name || this._id;
            this.defaultNewOfferString = defaultNewOfferString;
        } else {
            for (const key in jsonData) {
                this[key] = jsonData[key];
            }
        }
    }
}



AffiliateNetwork.create = function () {
    const questions1 = [
        {
            type: 'input',
            name: 'name',
            message: 'Enter affiliate network name:'
        },
        {
            type: 'input',
            name: 'defaultNewOfferString',
            message: 'Enter default offer string (the part of the URL where we pass our click_id. leave blank to use replaceable template)'
        }
    ];

    inquirer
        .prompt(questions1)
        .then((answers1) => {
            const { name, defaultNewOfferString } = answers1;
            const affiliateNetwork = new AffiliateNetwork({ name, defaultNewOfferString });

            const affiliateNetworkDir = path.resolve(__dirname, `../data/affiliateNetworks/${affiliateNetwork._id}`);
            if (!fs.existsSync(affiliateNetworkDir)) fs.mkdirSync(affiliateNetworkDir);

            const offersDir = `${affiliateNetworkDir}/offers`;
            if (!fs.existsSync(offersDir)) fs.mkdirSync(offersDir);

            const jsonFilePath = `${affiliateNetworkDir}/${affiliateNetwork._id}.json`;
            if (!fs.existsSync(jsonFilePath)) fs.writeFileSync(jsonFilePath, JSON.stringify(affiliateNetwork, null, 4));

            console.log(`New affiliate network created at ${jsonFilePath}`);
        })
        .catch((err) => {
            console.error('Error occurred:', err);
        });
}



module.exports = AffiliateNetwork;
