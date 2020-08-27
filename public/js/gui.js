import * as Networking from './networking.js';
import * as ExperienceTimelines from './experience-timelines.js';

function init() {
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));
    addEventListeners();
}

function updateLoader(totalLoaded, totalRequested) {
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

function showLight1Screen(duration) {
    gsap.to("#localVideo", {
        duration: duration,
        opacity: 0.5,
        ease: "none",
        onComplete: () => gsap.set("#localVideo", { opacity: 0 })
    });
}

function showLight2Screen(duration) {
    gsap.to("#remoteVideo", {
        duration: duration,
        opacity: 0.5,
        ease: "none",
        onComplete: () => gsap.set("#remoteVideo", { opacity: 0 })
    });
}

function showProjector1Screen(duration) {
    gsap.to("#projector", {
        yoyo: true,
        duration: duration,
        opacity: 0.5,
        ease: "elastic",
        onComplete: () => gsap.set("#projector", { opacity: 0 })
    });
}

function addEventListeners() {
    document.querySelector('#cameraBtn').addEventListener('click', openCamera);
    document.querySelector('#hangupBtn').addEventListener('click', Networking.hangUp);
    document.querySelector('#createBtn').addEventListener('click', Networking.createRoom);
    document.querySelector('#joinBtn').addEventListener('click', Networking.joinRoom);
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

async function openCamera() {
    await Networking.openUserMedia();
    hideControls()
    fullscreen();
}

function hideControls() {
    gsap.set("#buttons", { opacity: 0 });
}

export {
    init,
    updateLoader,
    showAllScreens,
    activatePlayButton,
    activateStopButton,
    showLight1Screen,
    showLight2Screen,
    showProjector1Screen
};
