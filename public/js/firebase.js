// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCQE0kMpFdV89MMG-tHwKnW6TojF9W9OFA",
    authDomain: "assembly-now-rtc.firebaseapp.com",
    databaseURL: "https://assembly-now-rtc.firebaseio.com",
    projectId: "assembly-now-rtc",
    storageBucket: "assembly-now-rtc.appspot.com",
    messagingSenderId: "832458070870",
    appId: "1:832458070870:web:4263727cccc3a4df4d54f7",
    measurementId: "G-K6926JK9D4"
};

function init() {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
}

export { init };