async function play() {
    const audio = new Audio('https://www.dropbox.com/s/udxc236gh8xbs5t/20200823-assembly-now-draft-v1.0.0.mp3?raw=1');
    audio.type = 'audio/mpeg';
    audio.loop = true;
    audio.volume = 0.6;

    try {
        await audio.play();
        console.log('Playing...');
    } catch (err) {
        console.log('Failed to play...' + err);
    }
}

export { play };
