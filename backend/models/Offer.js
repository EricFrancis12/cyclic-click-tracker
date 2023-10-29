const fs = require('fs');
const path = require('path');

const inquirer = require('inquirer');

const { formatTime, removeIllegalChars, extract_uuid } = require('../utils/utils');



class Offer {
    constructor(props) {
        const { name, affiliateNetwork, url = '', appendDefaultNewOfferString = false, payout = 0, jsonData } = props;

        if (!jsonData) {
            const uuid = extract_uuid(affiliateNetwork._id);

            this._id = `${removeIllegalChars(name)}_${uuid}_OF`;
            this.fileName = `${this._id}.json`;
            this.timestamp = Date.now();
            this.timestampFormatted = formatTime(this.timestamp);

            this.name = name || this._id;
            this.affiliateNetwork_id = affiliateNetwork._id;

            this.url = appendDefaultNewOfferString === true
                ? (url + affiliateNetwork.defaultNewOfferString)
                : url;

            this.payout = parseFloat(payout) >= 0
                ? parseFloat(payout.toFixed(2))
                : 0;

                console.log(payout);
                console.log(typeof payout);
                console.log(this.payout);
                console.log(typeof this.payout);
        } else {
            for (const key in jsonData) {
                this[key] = jsonData[key];
            }
        }
    }
}

Offer.create = function () {
    const affiliateNetworks = require('../data/affiliateNetworks/affiliateNetworks').get();
    const affiliateNetworkChoices = affiliateNetworks.map(affiliateNetwork => affiliateNetwork.name);

    const questions1 = [
        {
            type: 'input',
            name: 'name',
            message: 'Enter offer name:'
        },
        {
            type: 'list',
            name: 'affiliateNetworkName',
            message: 'What affiliate network is the offer on?',
            choices: affiliateNetworkChoices
        },
        {
            type: 'input',
            name: 'url',
            message: 'Enter offer url:'
        }
    ];

    inquirer
        .prompt(questions1)
        .then((answers1) => {
            const affiliateNetwork = affiliateNetworks.find(affiliateNetwork => affiliateNetwork.name === answers1.affiliateNetworkName);

            const questions2 = [
                {
                    type: 'list',
                    name: 'appendDefaultNewOfferString',
                    message: `Do you want to append this network's default new offer string "${affiliateNetwork.defaultNewOfferString}"? (final Url would be: ${answers1.url + affiliateNetwork.defaultNewOfferString})`,
                    choices: ['Yes', 'No']
                },
                {
                    type: 'input',
                    name: 'payout',
                    message: 'Enter offer payout (leave blank for auto):'
                }
            ];

            inquirer
                .prompt(questions2)
                .then((answers2) => {
                    const { name, url } = answers1;
                    const { appendDefaultNewOfferString, payout } = answers2;

                    const offer = new Offer({
                        name,
                        affiliateNetwork,
                        url,
                        appendDefaultNewOfferString,
                        payout: parseFloat(payout)
                    });

                    const OfferDir = path.resolve(__dirname, `../data/affiliateNetworks/${affiliateNetwork._id}/offers/${offer._id}`);
                    if (!fs.existsSync(OfferDir)) fs.mkdirSync(OfferDir);
                    const jsonFilePath = `${OfferDir}/${offer._id}.json`;
                    if (!fs.existsSync(jsonFilePath)) fs.writeFileSync(jsonFilePath, JSON.stringify(offer, null, 4));

                    console.log(`New offer created at ${jsonFilePath}`);
                });
        })
        .catch((err) => {
            console.error('Error occurred:', err);
        });
}



Offer.rotationOptions = {
    RANDOM: 'RANDOM'
};



module.exports = Offer;
