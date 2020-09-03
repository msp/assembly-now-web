import * as AudioFX from './audio-fx.js';
import * as Preloader from './preloader.js';
import * as GUI from './gui.js';

let runIntro = true;

function play({ onComplete = () => console.log("nada") } = {}) {
    const tl = gsap.timeline({ onComplete: onComplete });

    if (runIntro) {
        tl.to("#splash.screen", { opacity: 1, display: "grid", duration: 2 });
        tl.addPause(2, runPreloader, [tl]);
        tl.to("#splash.screen #title", { opacity: 0, duration: 1 });
        tl.to("#splash.screen #loading-wrapper", { opacity: 0, duration: 1 });
        tl.to("#splash.screen h3", { opacity: 0, duration: 1 });
        tl.to("#splash.screen", { opacity: 0, duration: 2 });
        tl.set("#splash.screen", { display: "none" });

        tl.to("#intro.screen", { opacity: 1, display: "grid", duration: 2 });
        tl.to("#intro.screen summary", { opacity: 1, duration: 1 });
        tl.to("#intro.screen summary #intro-one", { opacity: 1, duration: 1 });
        tl.to({}, 3, {}); //pause
        tl.to("#intro.screen summary #intro-two", { opacity: 1, duration: 1 });
        tl.to({}, 3, {}); //pause
        tl.to("#intro.screen summary #housekeeping", { opacity: 1, duration: 1 });
        tl.to({}, 3, {}); //pause
        tl.to("#intro.screen footer", { opacity: 1, duration: 1 });
        tl.to({}, 3, {}); //pause
        tl.to("#intro.screen nav", { opacity: 1, duration: 0.5, yoyo: true, repeat: 4 });
        tl.addPause("#intro.screen", requestCameraAccess, [tl]);
        tl.to("#intro.screen", { opacity: 0, duration: 2 });
        tl.set("#intro.screen", { display: "none" });
    };

    tl.to("#experience.screen", { opacity: 1, display: "grid", duration: 2 });
}


function requestCameraAccess(tl) {
    GUI.bindOpenCameraHandler(function() {
        tl.resume();
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
