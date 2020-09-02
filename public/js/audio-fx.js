import * as Utils from './utils.js';

class Reverb {
    constructor(audioContext) {
        this.context = audioContext;
        this.input = this.context.createGain();
        this.output = this.context.createGain();
    }

    async setup(impulseResponseUrl, dryMix = 0.9) {
        this.dryMix = dryMix;
        this.impulseResponseUrl = impulseResponseUrl;
        this._setupConnections();
        await this._setupConvolver();
    }

    _setupConnections() {
        this.convolver = this.context.createConvolver();
        this.dry = this.context.createGain();
        this.wet = this.context.createGain();
        this.dry.gain.setValueAtTime(this.dryMix, this.context.currentTime);
        this.wet.gain.setValueAtTime(1 - this.dryMix, this.context.currentTime);
        this.input.connect(this.dry);
        this.input.connect(this.convolver);
        this.convolver.connect(this.wet);
        this.dry.connect(this.output);
        this.wet.connect(this.output);
    }

    async _setupConvolver() {
        const response = await fetch(this.impulseResponseUrl);
        const buffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(buffer);
        this.convolver.buffer = audioBuffer;
    }
}

const light1Files = [
    "https://dl.dropboxusercontent.com/s/gad8ifrj5nvm8vk/BugTones-1.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/ztfdyv91x9pcjsw/BugTones-2.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/25mn1vj40ruehhm/BugTones-3.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/fsaxsnegx2vwq9g/BugTones-4.wav?raw=1"
]

const light2Files = [
    "https://dl.dropboxusercontent.com/s/txpvl9ftm6orks6/Breathing-A.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/rmh9mgppq7qrttu/Breathing-B.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/h3amx9ymic0ptzb/Breathing-C.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/14cgpceusg8cu8o/Breathing-D.wav?raw=1"
]

const Projector1Files = [
    "https://dl.dropboxusercontent.com/s/oyaguwzjhunq41e/08-Form-Void.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/gtesqi2zt86hwyu/Form-Misty-Ramen.wav?raw=1"
]

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const audioBuffersDictionary = {
    light1: [],
    light2: [],
    projector1: []
};

async function init(responsesDictionary) {
    await decodeFilesFor('light1', responsesDictionary);
    await decodeFilesFor('light2', responsesDictionary);
    await decodeFilesFor('projector1', responsesDictionary);
    return audioBuffersDictionary;
}

async function initReverb(stream) {
    const reverb = new Reverb(audioCtx);
    const source = audioCtx.createMediaStreamSource(stream);
    await reverb.setup("/wav/impulse-response.wav");
    source.connect(reverb.input);
    reverb.output.connect(audioCtx.destination);
}

function play(audioBuffer) {
    const sampleSource = audioCtx.createBufferSource();
    sampleSource.buffer = audioBuffer;
    // sampleSource.playbackRate.setValueAtTime(playbackRate, audioCtx.currentTime);
    sampleSource.connect(audioCtx.destination)
    sampleSource.start();
    return sampleSource;
}

function playRandomFor(screen) {
    const buffers = audioBuffersDictionary[screen]
    const randomBuffer = buffers[Utils.randomBetween(0, buffers.length)];

    if (randomBuffer) {
        play(randomBuffer);
    } else {
        console.warning("Unknown screen!", screen);
    }

    return randomBuffer;
}

function fileDictionary() {
    return {
        light1: light1Files,
        light2: light2Files,
        projector1: Projector1Files
    }
}


async function decodeFilesFor(screen, responsesDictionary) {
    await Promise.all(responsesDictionary[screen].map(async (response) => {
        console.log("decoding response: ", response);

        const audioBuffer = await decodeFile(response);
        audioBuffersDictionary[screen].push(audioBuffer);
    }));
}

async function decodeFile(response) {
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    // Looks like Safari needs some callbacks?!
    // const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
    //     console.log("decodeAudioData. Is this safari only?!");
    // }, function(e) {
    //     console.log("Error with decoding audio data" + e.err);
    // });
    return audioBuffer;
}

export { init, initReverb, play, playRandomFor, fileDictionary };
