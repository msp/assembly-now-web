import * as Utils from './utils.js';
import sac from 'https://dev.jspm.io/npm:standardized-audio-context';

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
    "https://dl.dropboxusercontent.com/s/cly94x13trrzodg/20200901-assembly-now-narrative-01.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/msys9ijcrdr0nha/20200901-assembly-now-narrative-04.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/atqhy9vqljqp2j5/20200901-assembly-now-narrative-08.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/031v5t7b9o3rvhj/20200901-assembly-now-narrative-09.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/j9ttlm8v5540xf2/20200901-assembly-now-narrative-10.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/d3zq18vkjpd120n/20200901-assembly-now-narrative-14.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/evozgto9eu5wtgs/20200901-assembly-now-narrative-16.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/7ekvha8ovqpe6qb/20200901-assembly-now-narrative-17.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/6delezzqaaq8b2h/20200901-assembly-now-narrative-18.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/hjkjtzp98ssvoxn/20200901-assembly-now-narrative-21.mp3?raw=1"
]

const light2Files = [
    "https://dl.dropboxusercontent.com/s/ll4b66kedyfdykd/Breathing-2.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/j2vjkuc843m0yf7/Breathing-4.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/jmwb3kty2fvezq6/Breathing-6.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/lg2fri5n877lj1i/Breathing-7.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/lc8jrv6y8np3yrp/Breathing-9.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/q3j3wbfjdaqgbe5/Breathing-B.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/i551yh3hpfuhvvg/Breathing-C.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/wdbo5on8fv8pa66/Breathing-E.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/nw2bob2b5od09uq/Breathing-I.mp3?raw=1"
]

const Projector1Files = [
    "https://dl.dropboxusercontent.com/s/s96g8kvq53f33nq/08-Form-Void.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/0tclpeeu7d8ixpg/Form-Misty-Ramen.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/q49wk8cl4fdysqj/BugTones-1.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/1nvf19jsdj3bx3x/BugTones-2.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/zq2i39icx4pxfa9/BugTones-3.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/gxvt47zd740ttkc/BugTones-4.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/nfb9opjrgu9sud2/BugTones-5.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/bue5pet3z3x9jwf/BugTones-6.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/bbuatd3j694glwp/BugTones-7.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/fd79y2b5387a7jt/BugTones-8.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/7momtzv6db5aipn/BugTones-9.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/68w72vwadkjfvpv/BugTones-10.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/n7iej6p0nb9h4it/BugTones-12.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/45aql5w87vafw4t/BugTones-18.mp3?raw=1",
    "https://dl.dropboxusercontent.com/s/rarws687ckqr1b5/BugTones-20.mp3?raw=1",
]

const audioCtx = new sac.AudioContext();
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

var reverbSource;

async function initReverb(element) {
    const reverb = new Reverb(audioCtx);
    if(!reverbSource) {
      reverbSource = audioCtx.createMediaElementSource(element);
    }
    await reverb.setup("/wav/impulse-response.wav");
    reverbSource.disconnect();
    reverbSource.connect(reverb.input);
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
        play(randomBuffer.buffer);
    } else {
        console.log("Unknown screen!", screen);
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
        audioBuffersDictionary[screen].push({ url: response.url, buffer: audioBuffer });
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
