import { Networking } from './networking.js';
import { MediaDelay } from './media-delay.js';
import * as AudioFX from './audio-fx.js';
import * as BackingTrack from './backing-track.js';
import * as Preloader from './preloader.js';
import * as GUI from './gui.js';
import * as Utils from './utils.js';

let debugMode = Utils.debugMode();
let runIntro = !debugMode;
let pauseSeconds = debugMode ? 1 : 5
let screenSeconds = debugMode ? 0.2 : 1

function play({ onComplete = () => console.log("nada") } = {}) {
    const tl = gsap.timeline({ onComplete: onComplete });

    if (runIntro) {
        tl.to("#splash.screen", { opacity: 1, display: "grid", duration: screenSeconds * 2 });
        tl.addPause(2, runPreloader, [tl]);
        tl.to("#splash.screen #title", { opacity: 0, duration: 1 });
        tl.to("#splash.screen #loading-wrapper", { opacity: 0, duration: screenSeconds });
        tl.to("#splash.screen h3", { opacity: 0, duration: 1 });
        tl.to("#splash.screen", { opacity: 0, duration: 1 });
        tl.set("#splash.screen", { display: "none" });

        tl.to("#intro-one.screen ", { opacity: 1, display: "grid", duration: screenSeconds });
        tl.to({}, pauseSeconds, {});
        tl.to("#intro-one.screen ", { opacity: 0, display: "none", duration: screenSeconds });

        tl.to("#intro-two.screen ", { opacity: 1, display: "grid", duration: screenSeconds });
        tl.to({}, pauseSeconds, {});
        tl.to("#intro-two.screen ", { opacity: 0, display: "none", duration: screenSeconds });

        tl.to("#intro-three.screen ", { opacity: 1, display: "grid", duration: screenSeconds });
        tl.to({}, pauseSeconds, {});
        tl.to("#intro-three.screen ", { opacity: 0, display: "none", duration: screenSeconds });
    };

    tl.to("#intro-four.screen ", { opacity: 1, display: "grid", duration: screenSeconds });
    tl.to("#intro-four.screen #credits", { opacity: 1, duration: screenSeconds });
    tl.to({}, pauseSeconds, {});
    tl.to("#intro-four.screen #disclaimer", { opacity: 1, duration: screenSeconds });
    tl.to({}, pauseSeconds, {});
    tl.to("#intro-four.screen nav", { opacity: 1, duration: screenSeconds / 2, yoyo: true, repeat: 4 });

    tl.addPause("#intro-four.screen", requestCameraAccess, [tl]);
    tl.to("#intro-four.screen", { opacity: 0, display: "none", duration: screenSeconds * 2 });


    tl.to("#experience.screen", { opacity: 1, display: "grid", duration: screenSeconds * 2 });
}

function requestCameraAccess(tl) {
    GUI.bindOpenCameraHandler(function() {
        // Keep outside of async so it works in Safari!
        BackingTrack.play();

        GUI.getUserMedia().then((media) => {
            let { stream, localVideo, remoteVideo } = media;

            localVideo.srcObject = stream;

            const networking = new Networking(stream, localVideo, remoteVideo);
            const mediaDelay = new MediaDelay(stream, remoteVideo);

            networking.connectionCallback = async function() {
                await AudioFX.initReverb(remoteVideo);
                mediaDelay.finalize();
            };

            networking.disconnectionCallback = async function() {
                mediaDelay.initialize();
            };

            mediaDelay.streamAddedCallback = async function() {
                await AudioFX.initReverb(remoteVideo);
                await networking.initialize();
            };

            mediaDelay.initialize();
            GUI.hideControls();
            GUI.fullscreen();

            tl.resume();
        })
    });
}

function runPreloader(tl) {
    GUI.updateLoaderStats(
        0,
        Preloader.calculateTotalRequestedIn(AudioFX.fileDictionary())
    );

    Preloader.run(AudioFX.fileDictionary()).then((responses) => {
        AudioFX.init(responses).then((audioBuffers) => {
            tl.resume();
        });
    });
}

export { play };
