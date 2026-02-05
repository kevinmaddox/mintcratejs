// Imports ---------------------------------------------------------------------

'use strict';

// MintCrate
import { MintCrate } from "../../mintcratejs/core.js";

// Levels
import { Splash } from "./rooms/splash.js";
import { Title }  from "./rooms/title.js";
import { Game }   from "./rooms/game.js";

let roomList = [
  Game,
  Title,
  Splash,
];

// MintCrate Initialization ----------------------------------------------------

var mint = new MintCrate("mintcrate-target", 240, 160, roomList, {
  screenScale: 1,
  devMode: true
  // devMode: false
});

mint.defineColorKeys([
  {r:  134, g: 171, b: 125},
  {r:   88, g: 138, b: 103}
]);

mint.addInputHandler();

mint.inputs[0].mapInput('w', 'KeyW');
mint.inputs[0].mapInput('s', 'KeyS');
mint.inputs[0].mapInput('a', 'KeyA');
mint.inputs[0].mapInput('d', 'KeyD');

mint.inputs[0].mapInput('j', 'KeyJ');

mint.inputs[0].mapInput('1', 'Digit1');
mint.inputs[0].mapInput('2', 'Digit2');

mint.globals.enteringFromSplashScreen = true;
mint.globals.musicOn = true;
mint.globals.sfxOn = true;
mint.globals.highScore = 0;

mint.setGlobalUpdateFunction(() => {
  if (mint.inputs[0].pressed('1')) {
    mint.showAllDebugOverlays();
  }
  
  if (mint.inputs[0].pressed('2')) {
    mint.stopBgm();
  }
});

// Game Object Definitions -----------------------------------------------------

mint.defineActives([
  // Danger!! icons
  {name: 'danger-down'},
  {name: 'danger-down_default'},
  {name: 'danger-up'},
  {name: 'danger-up_default'},
  
  // Harpy
  {name: 'harpy'},
  {name: 'harpy_collider', radius: 4},
  {name: 'harpy_default', offset: [-10, -8]},
  {name: 'harpy_fall',    offset: [-10, -8]},
  {name: 'harpy_flap',    frameCount: 6, frameDuration: 2, offset: [-11, -9]},
  {name: 'harpy_hit01',   offset: [-10, -10]},
  {name: 'harpy_hit02',   offset: [-10, -10]},
  {name: 'harpy_hit03',   offset: [-10, -10]},
  {name: 'harpy_hit04',   offset: [-10, -10]},
  {name: 'harpy_hit05',   offset: [-10, -10]},
  
  // Platform posts
  {name: 'post-top'},
  {name: 'post-top_default',  offset: [-14, -4]},
  {name: 'post-pole'},
  {name: 'post-pole_default', offset: [-3, -8]},
  
  // Boulders
  {name: 'boulder'},
  {name: 'boulder_collider', radius: 12},
  {name: 'boulder_default',  offset: [-12,-12]},
  
  // Water line
  {name: 'water'},
  {name: 'water_default'},
  
  // Water splash
  {name: 'splash'},
  {name: 'splash_default', offset: [-13, -30]},
  
  // Water droplets
  {name: 'droplet'},
  {name: 'droplet_01', offset: [-1,-2]},
  {name: 'droplet_02', offset: [-1,-2]},
  {name: 'droplet_03', offset: [-1,-2]},
  
  // Stars
  {name: 'star'},
  {name: 'star_01', offset: [-2,-2]},
  {name: 'star_02', offset: [-4,-4]},
  {name: 'star_03', offset: [-3,-3]},
  {name: 'star_04', offset: [-5,-2]},
  
  // Screen flash/dim overlays
  {name: 'overlay'},
  {name: 'overlay_white'},
  {name: 'overlay_black'},
  
  // Shadow
  {name: 'shadow-top'},
  {name: 'shadow-top_default', offset: [-10,-2]},
  {name: 'shadow-bottom'},
  {name: 'shadow-bottom_default', offset: [-10,0]}
]);

mint.defineBackdrops([
  {name: 'harpy'},
  {name: 'menu-bg', mosaic: true},
  {name: 'logo'},
  {name: 'logo-shadow'},
  {name: 'mountains'},
  {name: 'ready'},
  
  // Buttons
  {name: 'button-active-up',     ninePatch: true},
  {name: 'button-active-down',   ninePatch: true},
  {name: 'button-inactive-up',   ninePatch: true},
  {name: 'button-inactive-down', ninePatch: true}
]);

mint.defineFonts([
  {name: 'ui-main'},
  {name: 'ui-main-inactive'},
  {name: 'ui-gold-numbers'},
  {name: 'title-high-score'}
]);

mint.defineMusic([
  {name: 'select-your-whatever-2k15', loop: true, loopStart: 51.206, loopEnd: 92.810},
  {name: 'tangent', loop: true, loopStart: 29.298, loopEnd: 112.018}
]);

mint.defineSounds([
  {name: 'button-down'},
  {name: 'button-up'},
  {name: 'flap'},
  {name: 'impact'},
  {name: 'impact-big'},
  {name: 'splash'},
  {name: 'splash-big'},
  {name: 'tread'}
]);


// Boot System -----------------------------------------------------------------

mint.ready();
