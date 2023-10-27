const TrafficSource = require('../../models/TrafficSource');

const path = require('path');

const { parseJsonFiles } = require('../data');



function get() {
    const trafficSourcesDirPath = path.resolve(__dirname, './');
    const trafficSources = parseJsonFiles(trafficSourcesDirPath, TrafficSource);

    return trafficSources;
}

function find(predicate = (item) => item) {
    const trafficSources = get();
    const trafficSource = trafficSources.find(predicate);

    return trafficSource ? trafficSource : null;
}



module.exports = {
    get,
    find
};
