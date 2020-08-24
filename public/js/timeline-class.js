function Timeline(name, outlet) {
    console.log("Timeline constructed [" + name + "][" + outlet + "] \n");
    this.name = name;
    this.outlet = outlet;
    this.events = new Array(1, 10, 20, 30, 200, 400, 600, 680, 860, 900, 910, 920, 925, 1000, 1100, 1200);
    this.probability = 90;
    this.offDelay = 5;

    this.eventCount = 0;
    this.localFrameCount = 1;
    this.offDelayCounter = 0;
    this.inlets = 2;
};

Timeline.prototype.draw = function() {
    //console.log("Timeline draw() \n");
    if (this.eventFired()) {
        if (this.getChance() > (100 - this.probability)) {
            console.log(this.name + "[" + this.outlet + "]: prob: " + this.probability + " --> " + this.eventCount + "/" + this.events.length + ": " + this.events[this.eventCount] + "\n");
            this.runEvent();
        }

        if (this.eventCount < this.events.length - 1) {
            this.eventCount++;
        } else {
            this.localFrameCount = 0;
            this.eventCount = 0;
        }
    } else {
        if (this.offDelayCounter >= this.offDelay) {
            this.offDelayCounter = 0;
            //outlet(this.outlet, -1);
        } else {
            this.offDelayCounter++
        }
    }

    this.localFrameCount++;
}

Timeline.prototype.eventFired = function() {
    return this.localFrameCount == this.events[this.eventCount];
}

Timeline.prototype.randomBetween = function(low, high) {
    var r = Math.floor((Math.random() * high) + low);
    return r;
}

Timeline.prototype.getChance = function() {
    var chance = this.randomBetween(1, 100);
    return chance;
}

export { Timeline };