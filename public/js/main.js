import * as Networking from './networking.js';
import * as Intro from './intro-timeline.js';
import * as ExperienceTimelines from './experience-timelines.js';

import * as GUI from './gui.js';


function main() {
  GUI.init();
  Networking.init();

  Intro.play({
    onComplete: ExperienceTimelines.play
  });
}

main();
