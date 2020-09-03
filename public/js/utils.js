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


export { randomBetween, debugMode, uuidv4 }
