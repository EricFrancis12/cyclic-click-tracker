

export function isObject(any) {
    return any != null && typeof any === 'object';
}

export function isArray(any) {
    return Object.prototype.toString.call(any) === '[object Array]';
}

export function isNil(any) {
    return any === null || any === undefined;
}

export function isEmpty(any) {
    return isNil(any) || any === '';
}

export function isNonsense(any) {
    return isEmpty(any) || isNaN(any) || any === Infinity;
}

export function isEven(number) {
    return number % 2 === 0;
}

export function replaceNonsense(any, replacement = 0) {
    if (isNonsense(any)) return replacement;
    return any;
}

export function stringIncludes(string, substring) {
    if (isNil(string) || isNil(substring) || typeof string !== 'string' || typeof substring !== 'string') return false;
    return string?.toUpperCase()?.includes(substring?.toUpperCase());
}

export function removeDupes(array) {
    return [...new Set(array)];
}

export function shallowFlatten(array) {
    let result = [];
    array.forEach(item => {
        if (isArray(item)) {
            result = [result, ...item];
        } else {
            result.push(item);
        }
    });
    return result;
}

export function replaceAtIndex(array, item, index) {
    return array.splice(index, 1, item);
}

export function arrayOf(item, length = 1) {
    let result = [];
    for (let i = 0; i < length; i++) {
        result.push(structuredClone(item));
    }
    return result;
}

export function swapArrayElementsPerCondition(array, condition, options) {
    const { direction = 'before', matchAll = false } = options;

    const copyArray = [...array];
    for (let i = 0; i < array.length; i++) {
        if (condition(array[i], i) !== true) continue;

        if (direction === 'before') {
            if (i === 0) continue;
            [copyArray[i], copyArray[i - 1]] = [copyArray[i - 1], copyArray[i]];
        } else if (direction === 'after') {
            if (i === array.length - 1) continue;
            [copyArray[i], copyArray[i + 1]] = [copyArray[i + 1], copyArray[i]];
        }

        if (!matchAll) break;
    }
    return copyArray;
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