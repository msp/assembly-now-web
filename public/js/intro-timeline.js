import { Networking } from './networking.js';
import { MediaDelay } from './media-delay.js';
import * as AudioFX from './audio-fx.js';
import * as BackingTrack from './backing-track.js';
import * as Preloader from './preloader.js';
import * as GUI from './gui.js';
import * as Timetable from './timetable.js';
import * as Utils from './utils.js';

let debugMode = Utils.debugMode();
let runIntro = !debugMode;
let pauseSeconds = debugMode ? 1 : 7
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
        tl.to("#intro-three.screen #headphones", { opacity: 1, duration: screenSeconds / 3, yoyo: true, repeat: 4 });
        tl.to({}, pauseSeconds, {});
        tl.to("#intro-three.screen ", { opacity: 0, display: "none", duration: screenSeconds });
    };

    tl.to("#intro-four.screen ", { opacity: 1, display: "grid", duration: screenSeconds });
    tl.to({}, pauseSeconds / 2, {});
    tl.to("#intro-four.screen nav", { opacity: 1, duration: screenSeconds / 3, yoyo: true, repeat: 4 });
    tl.addPause("#intro-four.screen", requestCameraAccess, [tl]);
    tl.to("#intro-four.screen ", { opacity: 0, display: "none", duration: screenSeconds });

    tl.to("#intro-five.screen ", { opacity: 1, display: "grid", duration: screenSeconds });
    tl.to("#intro-five.screen #credits", { opacity: 1, duration: screenSeconds });
    tl.to({}, pauseSeconds, {});
    tl.to("#intro-five.screen #disclaimer", { opacity: 1, duration: screenSeconds });
    tl.to({}, pauseSeconds / 3, {});
    tl.to("#intro-five.screen nav", { opacity: 1, duration: screenSeconds / 3, yoyo: true, repeat: 4 });

    tl.addPause("#intro-five.screen", startExperience, [tl]);
    tl.to("#intro-five.screen", { opacity: 0, display: "none", duration: screenSeconds * 2 });

    tl.to("#experience.screen", { opacity: 1, display: "grid", duration: screenSeconds * 2 });
}

function requestCameraAccess(tl) {
    GUI.bindOpenCameraHandler(function() {
        GUI.requestUserMedia().then(() => {
            tl.resume();
        })
    });
}

function startExperience(tl) {
    GUI.bindStartExperienceHandler(function() {
        GUI.fullscreen();
        GUI.constrainVideoWidth();
        BackingTrack.play();

        let { stream, localVideo, remoteVideo } = GUI.getPermittedUserMedia()

        localVideo.srcObject = stream;

        const networking = new Networking(stream, localVideo, remoteVideo);
        const mediaDelay = new MediaDelay(stream, remoteVideo);

        networking.connectionCallback = async function(remoteStream) {
            await AudioFX.initReverbFromStream(remoteStream);
            mediaDelay.finalize();
        };

        networking.disconnectionCallback = async function() {
            mediaDelay.finalize();
            mediaDelay.initialize();
        };

        mediaDelay.streamAddedCallback = async function() {
            await AudioFX.initReverbFromElement(remoteVideo);
            await networking.initialize();
        };

        mediaDelay.initialize();

        GUI.hideControls();

        tl.resume();
    });
}

async function runPreloader(tl) {
    const browserSupported = await Utils.browserSupported()
    const timetable = await Timetable.read();
    const activeViewing = timetable.activeViewings.length > 0

    if (browserSupported) {
        if (activeViewing) {
            GUI.updateLoaderStats(
                0,
                Preloader.calculateTotalRequestedIn(AudioFX.fileDictionary())
            );

            Preloader.run(AudioFX.fileDictionary()).then((responses) => {
                AudioFX.init(responses).then((audioBuffers) => {
                    tl.resume();
                });
            });
        } else {
            GUI.showViewingSchedule(timetable);
        }
    } else {
        GUI.showSupportedBrowserInfo();
    }
}

export { play };
