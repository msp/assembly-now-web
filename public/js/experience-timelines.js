import { Timeline } from './timeline-class.js';
import * as BackingTrack from './backing-track.js';
import * as AudioFX from './audio-fx.js';

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

    // light1.events = [50, 600, 1200, 8800];
    // light2.events = [300, 900, 1500];
    // projector1.events = [80, 320, 550];

    light1.events = [1000, 3000, 5000];
    light2.events = [1000, 1500, 3500, 5500];
    projector1.events = [50, 1001, 2500];

    light1.runEvent = light1Event;
    light2.runEvent = light2Event;
    projector1.runEvent = projector1Event;
}

function play() {
    init();
    console.log("GenerativeTimeline.play");

    frameRef = requestAnimationFrame(update);

    document.querySelector('#playBtn').disabled = true;
    document.querySelector('#stopBtn').disabled = false;

    BackingTrack.play();
}

function stop() {
    console.log("GenerativeTimeline.stop");

    cancelAnimationFrame(frameRef);

    gsap.set("#localVideo", { opacity: 1 });
    gsap.set("#remoteVideo", { opacity: 1 });
    gsap.set("#projector", { opacity: 1 });

    document.querySelector('#playBtn').disabled = false;
    document.querySelector('#stopBtn').disabled = true;
}

function update() {
    light1.update();
    light2.update();
    projector1.update();

    frameRef = requestAnimationFrame(update);
}

function light1Event() {
    gsap.set("#remoteVideo", { opacity: 0 });
    gsap.set("#projector", { opacity: 0 });

    const audioBuffer = AudioFX.playRandomFor('light1');

    gsap.to("#localVideo", {
        duration: audioBuffer.duration,
        opacity: 0.5,
        ease: "none",
        onComplete: () => gsap.set("#localVideo", { opacity: 0 })
    });
}

function light2Event() {
    gsap.set("#localVideo", { opacity: 0 });
    gsap.set("#projector", { opacity: 0 });

    const audioBuffer = AudioFX.playRandomFor('light2');

    gsap.to("#remoteVideo", {
        duration: audioBuffer.duration,
        opacity: 0.5,
        ease: "none",
        onComplete: () => gsap.set("#remoteVideo", { opacity: 0 })
    });
}

function projector1Event() {
    gsap.set("#localVideo", { opacity: 0 });
    gsap.set("#remoteVideo", { opacity: 0 });

    const audioBuffer = AudioFX.playRandomFor('projector1');

    gsap.to("#projector", {
        yoyo: true,
        duration: audioBuffer.duration,
        opacity: 0.5,
        ease: "elastic",
        onComplete: () => gsap.set("#projector", { opacity: 0 })
    });

}

export { play, stop };