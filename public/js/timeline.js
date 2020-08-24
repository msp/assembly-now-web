let tl = gsap.timeline();
let runIntro = true;

function play() {
    if (runIntro) {
        tl.to("#splash.screen", { opacity: 1, duration: 2 });
        tl.to("#splash.screen", { opacity: 0, duration: 2 });

        tl.to("#intro.screen", { opacity: 1, duration: 2 });
        tl.to("#intro.screen", { opacity: 0, duration: 2 });
    }

    tl.to("#experience.screen", { opacity: 1, duration: 2 });
}

export { play };