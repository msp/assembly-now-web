import * as Networking from './networking.js';
import * as ExperienceTimelines from './experience-timelines.js';

const urlParams = new URLSearchParams(window.location.search);
const debugMode = urlParams.has('debug');

function init() {
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));
    addEventListeners();

    if (debugMode) {
        showAllScreens();
        showControls();
        positionScreensForDebug();
    }
}

function updateLoaderStats(totalLoaded, totalRequested) {
    document.querySelector('#totalLoaded').textContent = totalLoaded;
    document.querySelector('#totalRequested').textContent = totalRequested;
}

function showAllScreens() {
    gsap.set("#localVideo", { opacity: 1 });
    gsap.set("#remoteVideo", { opacity: 1 });
    gsap.set("#projector", { opacity: 1 });
}

function activatePlayButton() {
    document.querySelector('#playBtn').disabled = false;
    document.querySelector('#stopBtn').disabled = true;
}

function activateStopButton() {
    document.querySelector('#playBtn').disabled = true;
    document.querySelector('#stopBtn').disabled = false;
}

function showLight1Screen(sample) {
    if (!debugMode) {
        gsap.to("#localVideo", {
            duration: sample.buffer.duration,
            opacity: 0.5,
            ease: "none",
            onComplete: () => gsap.set("#localVideo", { opacity: 0 })
        });
    } else {
        highlightBorder("localVideo");
    }
}

function showLight2Screen(sample) {
    if (!debugMode) {
        gsap.to("#remoteVideo", {
            duration: sample.buffer.duration,
            opacity: 0.5,
            ease: "none",
            onComplete: () => gsap.set("#remoteVideo", { opacity: 0 })
        });
    } else {
        highlightBorder("remoteVideo");
    }
}

function showProjector1Screen(sample) {
    setBackgroundColour(sample.url);

    if (!debugMode) {
        gsap.to("#projector", {
            yoyo: true,
            duration: sample.buffer.duration,
            opacity: 0.5,
            ease: "elastic",
            onComplete: () => gsap.set("#projector", { opacity: 0 })
        });
    } else {
        highlightBorder("projector");
    }
}

function setBackgroundColour(url) {
    if (isBugTone(url)) {
        gsap.set("#projector", { backgroundColor: "#fff" })
    } else {
        gsap.set("#projector", { backgroundColor: "#ffff00" })
    }
}

function isBugTone(url) {
    return url.toLowerCase().includes("bug");
}

function addEventListeners() {
    document.querySelector('#playBtn').addEventListener('click', ExperienceTimelines.play);
    document.querySelector('#stopBtn').addEventListener('click', ExperienceTimelines.stop);
}

function fullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function bindOpenCameraHandler(callback) {
    const button = document.querySelector("#cameraBtn");
    button.addEventListener("click", async function(event) {
        event.preventDefault();
        const experience = document.querySelector("#experience");
        experience.style.display = 'block';
        await Networking.openUserMedia();
        hideControls();
        fullscreen();
        callback();
    });
}

function showControls() {
    gsap.set("#buttons", { opacity: 1 });
}

function hideControls() {
    gsap.set("#buttons", { opacity: 0 });
}

function positionScreensForDebug() {
    gsap.set("#localVideo, #remoteVideo, #projector", {
        position: "inherit", width: "33%", float: "left"
    });
}

function highlightBorder(screen) {
    switch (screen) {
        case "localVideo":
            gsap.set("#localVideo", { border: "5px solid red" });
            gsap.set("#remoteVideo", { border: "0px" });
            gsap.set("#projector", { border: "0px" });
            break;
        case "remoteVideo":
            gsap.set("#localVideo", { border: "0px" });
            gsap.set("#remoteVideo", { border: "5px solid red" });
            gsap.set("#projector", { border: "0px" });
            break;
        case "projector":
            gsap.set("#localVideo", { border: "0px" });
            gsap.set("#remoteVideo", { border: "0px" });
            gsap.set("#projector", { border: "5px solid red" });
            break;
        default:
            console.log("Unknown screen!", screen);
    }
}

export {
    init,
    updateLoaderStats,
    showAllScreens,
    activatePlayButton,
    activateStopButton,
    showLight1Screen,
    showLight2Screen,
    showProjector1Screen,
    bindOpenCameraHandler
};
