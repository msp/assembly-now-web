import * as ExperienceTimelines from './experience-timelines.js';
import * as FBase from './firebase.js';
import * as GUI from './gui.js';
import * as Intro from './intro-timeline.js';


function main() {
    FBase.init()
    GUI.init();

    Intro.play({
        onComplete: () => {
            ExperienceTimelines.play();
        }
    });
}

main();
