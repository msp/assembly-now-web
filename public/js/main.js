import * as ExperienceTimelines from './experience-timelines.js';
import * as GUI from './gui.js';
import * as Intro from './intro-timeline.js';
import * as Networking from './networking.js';


function main() {
    GUI.init();
    Networking.init();

    Intro.play({
        onComplete: ExperienceTimelines.play
    });
}

main();
