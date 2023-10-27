const fs = require('fs');
const path = require('path');



function getData() {
    const result = {};

    const dataDirPath = path.resolve(__dirname, './');
    const dataDirContents = fs.readdirSync(dataDirPath);
    dataDirContents.forEach(item => {
        const dataItemPath = `${dataDirPath}/${item}/${item}.js`;
        if (fs.existsSync(dataItemPath)) {
            const dataItem = require(dataItemPath).get();
            result[item] = dataItem;
        }
    });

    result.offers = [];
    result.affiliateNetworks.forEach(affiliateNetwork => {
        const offers = [...affiliateNetwork.offers];
        result.offers = [...result.offers, ...offers];
    });

    return result;
}

function parseJsonFiles(dir, Model) {
    const result = [];

    const dirContents = fs.readdirSync(dir);
    dirContents.forEach(item => {
        const targetPath = `${dir}/${item}/${item}.json`;
        if (fs.existsSync(targetPath)) {
            const jsonData = require(targetPath);
            const model = new Model({ jsonData });
            result.push(model);
        }
    });

    return result;
}



module.exports = {
    getData,
    parseJsonFiles
};
