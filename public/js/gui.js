import * as Networking from './networking.js';

function init() {
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));
}

function addEventListeners() {
    document.querySelector('#cameraBtn').addEventListener('click', Networking.openUserMedia);
    document.querySelector('#hangupBtn').addEventListener('click', Networking.hangUp);
    document.querySelector('#createBtn').addEventListener('click', Networking.createRoom);
    document.querySelector('#joinBtn').addEventListener('click', Networking.joinRoom);
}

export { init, addEventListeners };
