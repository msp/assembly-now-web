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
    "https://dl.dropboxusercontent.com/s/l6ffhmag6ikrcl1/20200901-assembly-now-narrative-01.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/rnpoddi5bko2wt6/20200901-assembly-now-narrative-04.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/kzu990sr7gugp7n/20200901-assembly-now-narrative-08.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/0ffwz10hha9dojx/20200901-assembly-now-narrative-09.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/68znx4rnuym0bvh/20200901-assembly-now-narrative-10.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/izhvfw8p50mzc83/20200901-assembly-now-narrative-14.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/mz9eaqrvad2mdiw/20200901-assembly-now-narrative-16.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/yhxz9xjfoth53v1/20200901-assembly-now-narrative-17.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/hskt4zea3jsgee9/20200901-assembly-now-narrative-18.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/ygii5httheoxh9j/20200901-assembly-now-narrative-21.wav?raw=1"
]

const light2Files = [
    "https://dl.dropboxusercontent.com/s/vpt7b1vmoizmhd8/Breathing-2.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/q4os5d9dng79uem/Breathing-4.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/wtayqk8u8jtgq2s/Breathing-6.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/ypgtmknixickwfk/Breathing-7.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/erd4hpsogwcqxed/Breathing-9.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/l0w7mrkynqsgyvn/Breathing-B.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/27qar95r0mqnumb/Breathing-C.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/9vnrse419jgzbnl/Breathing-E.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/ipghrsmzjjyvebh/Breathing-I.wav?raw=1"
]

const Projector1Files = [
    "https://dl.dropboxusercontent.com/s/oyaguwzjhunq41e/08-Form-Void.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/gtesqi2zt86hwyu/Form-Misty-Ramen.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/jsprcjmlpc02keg/BugTones-1.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/jjuvuo2fab6idog/BugTones-2.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/jsgxw5okhsetbmo/BugTones-3.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/e22fq3n9230fwdc/BugTones-4.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/bo62tahgd1a1fxs/BugTones-5.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/qmbudoivgae84i6/BugTones-6.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/53v8a27xye0m2v7/BugTones-7.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/drjvuj41vmbljj4/BugTones-8.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/pzxc9y45tuvehb2/BugTones-9.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/zpicc6i9al2kdw5/BugTones-10.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/6t4cvn3n7oeqerz/BugTones-12.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/7nxszyek9lh3h6d/BugTones-18.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/t9sapxzk7gsb3bg/BugTones-20.wav?raw=1"
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
