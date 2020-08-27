function randomBetween(low, high) {
    var r = Math.floor((Math.random() * high) + low);
    return r;
}

export { randomBetween }
