const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const inquirer = require('inquirer');

const { formatTime, removeIllegalChars } = require('../utils/utils');
const { TS } = require('../../frontend/src/config/config.json').suffixes;



class TrafficSource {
    constructor(props) {
        const { name, postbackUrl = '', tokens = [], tags, jsonData } = props;

        if (!jsonData) {
            this._id = `${removeIllegalChars(name)}_${crypto.randomUUID()}_${TS}`;
            this.fileName = `${this._id}.json`;
            this.timestamp = Date.now();
            this.timestampFormatted = formatTime(this.timestamp);

            this.name = name || this._id;
            this.postbackUrl = postbackUrl;
            this.tokens = tokens;

            this.tags = tags ?? [];
        } else {
            for (const key in jsonData) {
                this[key] = jsonData[key];
            }
        }
    }

    tokensFromUrl(url) {
        const queryString = url.includes('?')
            ? url.split('?').at(-1)
            : '';

        const params = queryString.split('&');
        const result = [];

        params.forEach(param => {
            let [key, value] = param.split('=');

            if (key === TrafficSource.defaultTokens.cost.key) {
                value = parseFloat(value);
                result.push({ key, value });
            }
        });

        return result;
    }
}



TrafficSource.create = function () {
    const questions1 = [
        {
            type: 'input',
            name: 'name',
            message: 'Enter traffic source name:'
        },
        {
            type: 'input',
            name: 'postbackUrl',
            message: 'Enter postback url:'
        },
        {
            type: 'input',
            name: 'externalIdTokenValue',
            message: 'Enter traffic source "External ID" token (include any and all brackets "{}", "[]", etc.):'
        },
        {
            type: 'input',
            name: 'costTokenValue',
            message: 'Enter traffic source "Cost" token (include any and all brackets "{}", "[]", etc.):'
        },
        {
            type: 'list',
            name: 'numAddlTokens',
            message: 'How many additional tokens do you want to track?',
            choices: ['Input later', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
    ];

    inquirer
        .prompt(questions1)
        .then((answers1) => {
            const questions2 = [];
            if (typeof answers1.numAddlTokens === 'number') {
                for (let i = 1; i <= answers1.numAddlTokens; i++) {
                    questions2.push({
                        type: 'input',
                        name: `customToken${i}Name`,
                        message: `Enter custom token ${i} name (as it will appear in your data columns):`
                    });
                    questions2.push({
                        type: 'input',
                        name: `customToken${i}Key`,
                        message: `Enter custom token ${i} key (this will become your tracking parameter):`
                    });
                    questions2.push({
                        type: 'input',
                        name: `customToken${i}Value`,
                        message: `Enter custom token ${i} value (from traffic source; include any and all brackets "{}", "[]", etc.):`
                    });
                }
            }

            inquirer
                .prompt(questions2)
                .then((answers2) => {
                    const { name, postbackUrl, externalIdTokenValue, costTokenValue } = answers1;
                    const defaultExternalIdToken = TrafficSource.defaultTokens.externalId;
                    const defaultCostToken = TrafficSource.defaultTokens.cost;

                    const tokens = [
                        { ...defaultExternalIdToken, value: externalIdTokenValue },
                        { ...defaultCostToken, value: costTokenValue },
                        // ... make addlTokens via answers2
                    ];

                    const trafficSource = new TrafficSource({ name, postbackUrl, tokens });

                    const trafficSourceDir = path.resolve(__dirname, `../data/trafficSources/${trafficSource._id}`);
                    if (!fs.existsSync(trafficSourceDir)) fs.mkdirSync(trafficSourceDir);
                    const jsonFilePath = `${trafficSourceDir}/${trafficSource._id}.json`;
                    if (!fs.existsSync(jsonFilePath)) fs.writeFileSync(jsonFilePath, JSON.stringify(trafficSource, null, 4));

                    fs.writeFileSync(jsonFilePath, JSON.stringify(trafficSource, null, 4));

                    console.log(`New traffic source created at ${jsonFilePath}`);
                });
        })
        .catch((err) => {
            console.error('Error occurred:', err);
        });
}



TrafficSource.defaultTokens = {
    externalId: { name: 'External ID', key: 'externalId' },
    cost: { name: 'Cost', key: 'cost' },
    payout: { name: 'Payout', key: 'payout' }
};



module.exports = TrafficSource;
