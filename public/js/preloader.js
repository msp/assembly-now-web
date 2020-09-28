import * as GUI from './gui.js';
import { fileDictionary } from './audio-fx.js';

const responsesDictionary = {
    light1: [],
    light2: [],
    projector1: []
};

let totalLoaded = 0;
let totalRequested = 0;

function init() {
}

async function run(fileDictionary) {
    let allLoaded = false;
    totalRequested = calculateTotalRequestedIn(fileDictionary);

    await getFilesFor('light1', fileDictionary);
    await getFilesFor('light2', fileDictionary);
    await getFilesFor('projector1', fileDictionary);

    allLoaded = true;
    return responsesDictionary;
}

function files() {
    return responsesDictionary;
}

function calculateTotalRequestedIn(fileDictionary) {
    return fileDictionary['light1'].length +
        fileDictionary['light2'].length +
        fileDictionary['projector1'].length;
}

async function getFilesFor(screen, fileDictionary) {
    await Promise.all(fileDictionary[screen].map(async (file) => {
        // console.log("preloading file: ", file);
        const sample = await getFile(file);
        totalLoaded += 1;
        responsesDictionary[screen].push(sample);

        // TODO Move out to a callback
        GUI.updateLoaderStats(totalLoaded, totalRequested);
    }));
}

async function getFile(filepath) {
    const response = await fetch(filepath);
    return response;
}

export { init, run, files, calculateTotalRequestedIn };
