import * as ExperienceTimelines from './experience-timelines.js';
import * as Utils from './utils.js';

const constraints = {
    audio: true,
    video: {
        width: {
            ideal: 1280
        },
        height: {
            ideal: 720
        }
    }
};

const debugMode = Utils.debugMode();
let permittedUserMedia = null;

function init() {
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));
    addEventListeners();

    animateTitle();

    if (debugMode) {
        showAllScreens();
        showControls();
        positionScreensForDebug();
    }
}

function animateTitle() {
    gsap.registerPlugin(TextPlugin);
    gsap.to("#title", { duration: 2, text: "assembly now!", delay: 1 });
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
    if (!debugMode) {
        setBackgroundColour(sample.url);

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
    if (sampleCalled("form-void", url)) {
        gsap.set("#projector", { backgroundColor: "#ffff00" })
    } else if (sampleCalled("form-misty", url)) {
        gsap.set("#projector", { backgroundColor: "#ff0000" })
    } else {
        // Bug Tones
        gsap.set("#projector", { backgroundColor: "#ffffff" })
    }
}

function sampleCalled(name, url) {
    return url.toLowerCase().includes(name);
}

function addEventListeners() {
    document.querySelector('#playBtn').addEventListener('click', ExperienceTimelines.play);
    document.querySelector('#stopBtn').addEventListener('click', ExperienceTimelines.stop);
    window.addEventListener('resize', constrainVideoWidth);
}

function fullscreen() {
    if (!debugMode) {
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
}

function constrainVideoWidth() {
    gsap.set("#localVideo", { width: window.innerWidth });
    gsap.set("#remoteVideo", { width: window.innerWidth });
}

function bindOpenCameraHandler(callback) {
    const button = document.querySelector("#camera-prompt");
    button.addEventListener("click", function(event) {
        event.preventDefault();
        callback();
    });
}

function bindStartExperienceHandler(callback) {
    const button = document.querySelector("#experience-prompt");
    button.addEventListener("click", function(event) {
        event.preventDefault();
        callback();
    });
}

function showControls() {
    gsap.set("#buttons", { opacity: 1 });
}

function hideControls() {
    if (!Utils.debugMode()) {
        gsap.set("#buttons", { opacity: 0 });
    }
}

function positionScreensForDebug() {
    gsap.set("#localVideo, #remoteVideo, #projector", {
        position: "inherit", width: "49%", float: "left"
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

async function requestUserMedia() {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const localVideo = document.querySelector('#localVideo');
    const remoteVideo = document.querySelector('#remoteVideo');

    permittedUserMedia = {
        stream,
        localVideo,
        remoteVideo
    }

    return permittedUserMedia
}

function getPermittedUserMedia() {
    return permittedUserMedia;
}

function showSupportedBrowserInfo() {
    var node = document.createElement("p");
    var textNode = document.createTextNode(Utils.browserInfoString());
    node.appendChild(textNode);

    document.getElementById("supported-browsers").appendChild(node);

    gsap.to("#supported-browsers", {
        duration: 3,
        opacity: 1,
        display: 'inherit',
    });

    hideloader();
}

function showViewingSchedule(timetable) {
    let node;
    let textNode;

    if (timetable.futureViewings.length == 0) {
        updateScheduleIntro(
            "Our virtual gallery is closed right now! Please check back later."
        );
    } else {
        updateScheduleIntro(
            "Our virtual gallery is closed right now! Please check back for future viewing(s) below:"
        );
    }

    timetable.futureViewings.forEach(
        (viewing) => addListItemTo("timetable", viewing)
    );

    gsap.to("#schedule", {
        duration: 2,
        opacity: 1,
        display: 'inherit',
    });

    hideloader();
}

function addListItemTo(listId, text) {
    const node = document.createElement("li");
    const textNode = document.createTextNode(text);
    node.appendChild(textNode);
    document.getElementById(listId).appendChild(node);
}

function updateScheduleIntro(text) {
    const textNode = document.createTextNode(text);
    document.getElementById("schedule-message").appendChild(textNode);
}

function hideloader() {
    gsap.set("#splash.screen #loading-wrapper", { opacity: 0 });
    gsap.set("#splash.screen #loading-count", { opacity: 0 });
}

export {
    activatePlayButton,
    activateStopButton,
    bindOpenCameraHandler,
    bindStartExperienceHandler,
    constrainVideoWidth,
    fullscreen,
    getPermittedUserMedia,
    hideControls,
    init,
    requestUserMedia,
    showAllScreens,
    showLight1Screen,
    showLight2Screen,
    showProjector1Screen,
    showSupportedBrowserInfo,
    showViewingSchedule,
    updateLoaderStats,
};
