const responses = [];

function init() {
}

async function run(fileList) {
    let allLoaded = false;

    await Promise.all(fileList.map(async (file) => {
        console.log("preloading file: ", file);
        const sample = await getFile(file);
        responses.push(sample);
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