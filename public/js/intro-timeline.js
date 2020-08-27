import * as AudioFX from './audio-fx.js';
import * as Preloader from './preloader.js';

let runIntro = true;

function play({ onComplete = () => console.log("nada") } = {}) {
    // const tl = gsap.timeline({ onComplete: onComplete });
    const tl = gsap.timeline({});

    if (runIntro) {
        tl.to("#splash.screen", { opacity: 1, duration: 2 });
        tl.addPause(2, runPreloader, [tl]);
        tl.to("#splash.screen", { opacity: 0, duration: 2 });

        tl.to("#intro.screen", { opacity: 1, duration: 2 });
        tl.to("#intro.screen", { opacity: 0, duration: 2 });
    } 1

    tl.to("#experience.screen", { opacity: 1, duration: 2 });
}

function runPreloader(tl) {
    Preloader.run(AudioFX.fileList()).then((responses) => {
        AudioFX.init(responses).then((audioBuffers) => {
            // AudioFX.play(audioBuffers[0]);
            tl.resume();
        });
    });

}

export { play };