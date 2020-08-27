const files = [
    "https://dl.dropboxusercontent.com/s/gad8ifrj5nvm8vk/BugTones-1.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/ztfdyv91x9pcjsw/BugTones-2.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/25mn1vj40ruehhm/BugTones-3.wav?raw=1",
    "https://dl.dropboxusercontent.com/s/fsaxsnegx2vwq9g/BugTones-4.wav?raw=1"
]

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const audioBuffers = [];

async function init(responses) {
    await Promise.all(responses.map(async (response) => {
        console.log("decoding response: ", response);

        const audioBuffer = await decodeFile(response);
        audioBuffers.push(audioBuffer);
    }));

    return audioBuffers;
}

function play(audioBuffer) {
    console.log("AudioFX.play(): ", audioBuffer);

    const sampleSource = audioCtx.createBufferSource();
    sampleSource.buffer = audioBuffer;
    // sampleSource.playbackRate.setValueAtTime(playbackRate, audioCtx.currentTime);
    sampleSource.connect(audioCtx.destination)
    sampleSource.start();
    return sampleSource;
}

function fileList() {
    return files;
}

async function decodeFile(response) {
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

export { init, play, fileList };