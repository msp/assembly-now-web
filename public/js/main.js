import * as AudioFX from './audio-fx.js';
import * as ExperienceTimelines from './experience-timelines.js';
import * as GUI from './gui.js';
import * as Intro from './intro-timeline.js';
import * as Networking from './networking.js';
import * as Preloader from './preloader.js';


function main() {
    GUI.init();
    Networking.init();

    Intro.play({
        onComplete: ExperienceTimelines.play
    });

    const fileList = AudioFX.fileList();

    // Preloader.run(fileList).then((responses) => {
    //     AudioFX.init(responses).then((audioBuffers) => {
    //         AudioFX.play(audioBuffers[0]);
    //     });
    // });
}

main();
