

export function isNil(any) {
    return any === null || any === undefined;
}

export function isEmpty(any) {
    return isNil(any) || any === '';
}

export function isNonsense(any) {
    return isEmpty(any) || isNaN(any) || any === Infinity;
}

export function replaceNonsense(any, replacement = 0) {
    if (isNonsense(any)) return replacement;
    return any;
}

export function makeDate(year, month, day, hour, min, sec, ms) {
    const date = new Date();
    date.setUTCFullYear(year, month, day); // year, month (0-11), day
    date.setUTCHours(hour, min, sec, ms); // hour, minute, second, millisecond
    return date;
}

export function formatDate(date = new Date()) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

export function formatDatesRange(dates) {
    return dates.map(date => formatDate(date)).join(' - ');
}

export function traverseParentsForId(element, id) {
    let currentElement = element;
    while (currentElement && currentElement.tagName !== 'BODY') {
        if (currentElement.id === id) {
            return true;
        }
        currentElement = currentElement.parentElement;
    }
    return false;
}

export function traverseParentsForClass(element, _class) {
    let currentElement = element;
    while (currentElement && currentElement.tagName !== 'BODY') {
        if (currentElement.classList.contains(_class)) {
            return true;
        }
        currentElement = currentElement.parentElement;
    }
    return false;
}

export function arrayIncludesKeyValuePair(array, key, value) {
    if (!array) return false;
    return array.find(item => item[key] === value) !== undefined
}

export function extract_uuid(_id) {
    return _id.split('_').at(-2);
}