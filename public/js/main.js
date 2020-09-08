import * as BackingTrack from './backing-track.js';
import * as ExperienceTimelines from './experience-timelines.js';
import * as GUI from './gui.js';
import * as Intro from './intro-timeline.js';


function main() {
    GUI.init();

    Intro.play({
        onComplete: () => {
            GUI.fullscreen();
            ExperienceTimelines.play();
            BackingTrack.play();
        }
    });
}

main();
