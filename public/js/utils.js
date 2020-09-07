import * as Detect from './detect.js'

const browser = Detect.detect();

function randomBetween(low, high) {
    var r = Math.floor((Math.random() * high) + low);
    return r;
}

function debugMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('debug');
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function browserSupported() {
    console.log("browser", browser);
    let retVal = false;

    switch (browser && browser.name) {
        case 'chrome':
        case 'safari':
        case 'android':
        case 'ios':
        case 'edge':
            console.log(`Great! ${browser.name} supported. Onwards..`);
            retVal = true;
            break;

        case 'firefox':
        case 'fxios':
            console.log(`Sorry ${browser.name} is NOT supported, the CSS filters suck :(`);
            retVal = false;
            break;

        // TODO - test Edge
        // case 'edge':
        //     break;

        default:
            console.log(`Sorry ${browser.name} is NOT supported at this time :(`);
    }

    return retVal;
}

function browserInfoString() {
    return `Name: ${browser.name}, Version: ${browser.version}, OS: ${browser.os}`;
}


export { randomBetween, debugMode, uuidv4, browserInfoString, browserSupported }
