function randomBetween(low, high) {
    var r = Math.floor((Math.random() * high) + low);
    return r;
}

function debugMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('debug');
}

export { randomBetween, debugMode }
