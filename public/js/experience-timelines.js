import { Timeline } from './timeline-class.js';

let frameRef = null;
let light1 = null;
let light2 = null;
let projector1 = null;

function init() {
    console.log("GenerativeTimeline.init");

    light1 = new Timeline('light1', 0); //Yourself
    light2 = new Timeline('light2', 1); //The Other
    projector1 = new Timeline('projector1', 2); //VFX
    //console.log("MSP JSON light1: "+JSON.stringify(light1)+ "\n");

    light1.events = [200, 600, 1000, 1400];
    light2.events = [400, 800, 1200];
    projector1.events = [50, 1001, 2500];

    light1.runEvent = light1Event;
    light2.runEvent = light2Event;
    projector1.runEvent = projector1Event;
}

function play() {
    init();
    console.log("GenerativeTimeline.play");

    frameRef = requestAnimationFrame(update);
}

function stop() {
    console.log("GenerativeTimeline.stop");

    cancelAnimationFrame(frameRef);

    gsap.set("#localVideo", { opacity: 1 });
    gsap.set("#remoteVideo", { opacity: 1 });
    gsap.set("#projector", { opacity: 1 });


}

function update() {
    light1.draw();
    light2.draw();
    projector1.draw();

    frameRef = requestAnimationFrame(update);
}

function light1Event() {
    console.log("Running light1Event!");

    gsap.set("#remoteVideo", { opacity: 0 });
    gsap.set("#projector", { opacity: 0 });
    gsap.to("#localVideo", {
        duration: 1,
        opacity: 1,
        rotation: 360,
        ease: "none"
    });
}

function light2Event() {
    console.log("Running light2Event!");

    gsap.set("#localVideo", { opacity: 0 });
    gsap.set("#projector", { opacity: 0 });
    gsap.to("#remoteVideo", {
        duration: 1,
        opacity: 1,
        rotation: 360,
        ease: "none"
    });
}

function projector1Event() {
    console.log("Running projector1Event!");

    gsap.set("#localVideo", { opacity: 0 });
    gsap.set("#remoteVideo", { opacity: 0 });
    gsap.to("#projector", {
        yoyo: true,
        duration: 1,
        opacity: 1,
        ease: "elastic"
    });

}

export { play, stop };