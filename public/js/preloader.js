import * as GUI from './gui.js';

const responses = [];
let totalLoaded = 0;
let totalRequested = 0;

function init() {
}

async function run(fileList) {
    let allLoaded = false;
    totalRequested = fileList.length;

    await Promise.all(fileList.map(async (file) => {
        console.log("preloading file: ", file);
        const sample = await getFile(file);
        totalLoaded += 1;
        responses.push(sample);

        GUI.updateLoader(totalLoaded, totalRequested);
    }));

    allLoaded = true;
    return responses;
}

function files() {
    return responses;
}

async function getFile(filepath) {
    const response = await fetch(filepath);
    return response;
}

export { init, run, files };