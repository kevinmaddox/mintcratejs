// Imports ---------------------------------------------------------------------

'use strict';

// MintCrate
let mcPath = (window.location.hostname === 'localhost')
  ? window.mintCratePaths.local
  : window.mintCratePaths.remote;

const { MintCrate } = await import(mcPath);

// Levels
import { Gallery } from "./rooms/gallery.js";

let roomList = [
  Gallery
];

// MintCrate Initialization ----------------------------------------------------

var mint = new MintCrate("mintcrate-target", 480, 360, roomList, {
  screenScale: 1,
  // devMode: true
});

window.mint = mint;

mint.defineColorKeys([
  {r:   82, g: 173, b: 154},
  {r:  140, g: 222, b: 205}
]);

mint.addInputHandler();

mint.inputs[0].mapInput('a',     'KeyA');
mint.inputs[0].mapInput('d',     'KeyD');
mint.inputs[0].mapInput('j',     'KeyJ');
mint.inputs[0].mapInput('k',     'KeyK');
mint.inputs[0].mapInput('l',     'KeyL');
mint.inputs[0].mapInput(';',     'Semicolon');
mint.inputs[0].mapInput('space', 'Space');

mint.inputs[0].mapInput('1', 'Digit1');

mint.setGlobalUpdateFunction(() => {
  if (mint.inputs[0].pressed('1')) {
    mint.showAllDebugOverlays();
  }
});

// Game Object Definitions -----------------------------------------------------

mint.defineActives([
  // Buttons
  {name: 'btn'},
  {name: 'btn_collider', width: 16, height: 16},
  {name: 'btn_arrowleft',  loop: true},
  {name: 'btn_arrowright', loop: true},
  {name: 'btn_bg',         loop: true},
  {name: 'btn_magnify',    loop: true},
  {name: 'btn_movehorz',   loop: true},
  {name: 'btn_movevert',   loop: true},
  {name: 'btn_rotate',     loop: true},
  
  // Sprites
  {name: 'sprite'},
  {name: 'sprite_astronaut1', loop: true, offset: [-22, -24]},
  {name: 'sprite_astronaut2', loop: true, offset: [-22, -27]},
  {name: 'sprite_bigslime',   loop: true, offset: [-40, -32]},
  {name: 'sprite_fisherman',  loop: true, offset: [-36, -33]},
  {name: 'sprite_floppydisk', loop: true, offset: [ -9,  -9]},
  {name: 'sprite_guitar',     loop: true, offset: [-28, -86]},
  {name: 'sprite_knight',     loop: true, offset: [-15, -22]},
  {name: 'sprite_miria',      loop: true, offset: [-24, -18]},
  {name: 'sprite_mushroom',   loop: true, offset: [ -8,  -8]},
  {name: 'sprite_pencil',     loop: true, offset: [-10,  -7]},
  {name: 'sprite_potion',     loop: true, offset: [-11, -22]},
  {name: 'sprite_rabbit',     loop: true, offset: [-12, -13]},
  {name: 'sprite_robot',      loop: true, offset: [-48, -67]},
  {name: 'sprite_scorpion',   loop: true, offset: [-35, -28]},
  {name: 'sprite_slime',      loop: true, offset: [-14, -15], frameCount: 13, frameDuration: 2},
  {name: 'sprite_soldier',    loop: true, offset: [-21, -28], frameCount:  8, frameDuration: 5},
  {name: 'sprite_spaceship1', loop: true, offset: [ -8,  -8]},
  {name: 'sprite_spaceship2', loop: true, offset: [ -8,  -8]},
  {name: 'sprite_spaceship3', loop: true, offset: [-24, -24]},
  {name: 'sprite_sword',      loop: true, offset: [-15, -35]},
  {name: 'sprite_watermelon', loop: true, offset: [-36, -41]}
]);

mint.defineBackdrops([
  {name: 'clouds'},
  {name: 'checkerboard-top', mosaic: true},
  {name: 'checkerboard-bot', mosaic: true}
]);

mint.defineFonts([
  {name: 'retro-black'},
  {name: 'retro-white'}
]);

// mint.defineSounds([
  // {name: 'tickb'},
  // {name: 'down'},
  // {name: 'up'}
// ]);


// Boot System -----------------------------------------------------------------

mint.ready();
