

function arrayFromObject(object) {
    const result = [];

    for (const key in object) {
        result.push(object[key]);
    }

    return result;
}

function randomlySelectItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function weightedRandomlySelectItem(array) {
    const totalWeight = array.reduce((total, currentItem) => {
        return total + (currentItem.weight ?? 100);
    }, 0);
    let randomNum = Math.floor(Math.random() * totalWeight);

    for (let i = 0; i < array.length; i++) {
        randomNum -= array[i].weight;
        if (randomNum < 0) {
            return array[i];
        }
    }

    return null;
}

function formatTime(timestamp = Date.now()) {
    const date = new Date(timestamp);

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}-${day}-${year}_${hours}_${minutes}_${seconds}`;
}

function removeIllegalChars(string) {
    return string.replace(/[^\w\d.]/g, '_');
}

function extract_uuid(_id) {
    return _id.split('_').at(-2);
}



module.exports = {
    arrayFromObject,
    randomlySelectItem,
    weightedRandomlySelectItem,
    formatTime,
    removeIllegalChars,
    extract_uuid
};
