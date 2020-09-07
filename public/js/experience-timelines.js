import * as AudioFX from './audio-fx.js';
import * as GUI from './gui.js';
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

    light1.events = [50, 1200, 3800];
    light2.events = [300, 1500, 2500, 4050];
    projector1.events = [220, 1650, 2800, 5500];

    light1.runEvent = light1Event;
    light2.runEvent = light2Event;
    projector1.runEvent = projector1Event;
}

function play() {
    init();
    frameRef = requestAnimationFrame(update);

    GUI.activateStopButton();
}

function stop() {
    cancelAnimationFrame(frameRef);

    GUI.showAllScreens();
    GUI.activatePlayButton();
}

function update() {
    light1.update();
    light2.update();
    projector1.update();

    frameRef = requestAnimationFrame(update);
}

function light1Event() {
    const sample = AudioFX.playRandomFor('light1');
    GUI.showLight1Screen(sample);
}

function light2Event() {
    const sample = AudioFX.playRandomFor('light2');
    GUI.showLight2Screen(sample);
}

function projector1Event() {
    const sample = AudioFX.playRandomFor('projector1');

    GUI.showProjector1Screen(sample);
}

export { play, stop };
