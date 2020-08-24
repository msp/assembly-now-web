import * as Networking from './networking.js';
import * as Timeline from './timeline.js';
import * as GUI from './gui.js';


function main() {
  GUI.init();
  GUI.addEventListeners();

  Networking.init();
  Timeline.play();
}

main();
