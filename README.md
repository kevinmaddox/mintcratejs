# MintCrateJS

![mintcrate logo](https://raw.githubusercontent.com/kevinmaddox/mintcratejs/refs/heads/main/readme-content/logo.png)

Rapid game-development framework for developing prototypes and simple games. Favors fun and ease of use.

# Examples

Warning: These examples may feature audio.

## [Azure Flight](https://kevinmaddox.github.io/mintcratejs/examples/azure-flight/)

Arcade action game. Fly up and down and avoid the rocks!

[<img src="https://raw.githubusercontent.com/kevinmaddox/mintcratejs/refs/heads/main/readme-content/azure-flight.png" alt="azure flight screenshot">](https://kevinmaddox.github.io/mintcratejs/examples/azure-flight/)

## [Sprite Gallery](https://kevinmaddox.github.io/mintcratejs/examples/sprite-gallery/)

View and play with some pixel art graphics.

[<img src="https://raw.githubusercontent.com/kevinmaddox/mintcratejs/refs/heads/main/readme-content/sprite-gallery.png" alt="azure flight screenshot">](https://kevinmaddox.github.io/mintcratejs/examples/sprite-gallery/)

# Quickstart Guide

## Overview

MintCrate was developed to be fast and fun. Simplicity was a main goal in its development and, in multiple cases, control is sacrified for the sake of simplicity. Should you ever find yourself thinking, "I should be able to do {x} with MintCrate!," then it's most likely not the framework for your needs.

What it's good for:

- Simple, hobby games and projects
- Rapid prototyping
- Having fun

What it's not good for:

- Robust, professional-quality games.
- Games in which graphical performance is a bottleneck (rendering is done via HTML canvas, as opposed to WebGL).

Please see the example project code and project structures for more detailed views of what a MintCrate-developed game looks like.

## Project Structure

MintCrate has a few core concepts:

- main.js: This is where you define your game's properties, resource, and game objects (entities). It can be named whatever you want, though it will be referred to as `main.js` for the remainder of this guide.
- Rooms: The "levels" of your game.
- Tilemaps: Tiled maps which can be used for creating level layouts. These support user-definable behaviors (behavior maps).
- Entities: Game objects used for actually building your game.

Your project folder should look like this:

```
├── main.js
├── res/
│   ├── actives/
│   ├── backdrops/
│   ├── fonts/
│   ├── music/
│   ├── sounds/
│   ├── tilemaps/
├── rooms/
```

The `res/` directory, and its subdirectories, are immutable. For the sake of simplicity, MintCrate expects these directory paths to exist.

An example project may look like the following:

```
├── main.js
├── res/
│   ├── actives/
│   │   ├── knight_idle.png
│   │   ├── knight_walk.png
│   │   ├── coin_default.png
│   ├── backdrops/
│   │   ├── tree.png
│   │   ├── cloudysky.png
│   │   ├── menubox.png
│   ├── fonts/
│   │   ├── pixel.png
│   ├── music/
│   │   ├── field.ogg
│   │   ├── battle.ogg
│   │   ├── victory.ogg
│   ├── sounds/
│   │   ├── footstep.ogg
│   │   ├── swish.ogg
│   │   ├── getcoin.ogg
│   ├── tilemaps/
│   │   ├── grassland.png
│   │   ├── grassland_field.json
│   │   ├── grassland_woods.json
├── rooms/
│   ├── title.js
│   ├── game.js
```

All files are either `js`, `png`, `ogg`, or `json`. Keep this in mind.

## Initializing MintCrate

You will want to include a `<div>` on the page you're loading your MintCrate-powered game on:

`<div id="mintcrate-target">`

This is where MintCrate will inject the loaded game. All contents within the `<div>` will be replaced.

Under the `<div>`, load your `main.js` file:

`<script type="module" src="main.js"></script>`

Ensure that it's `type` is specified as `module`.

## main.js

This is the entrypoint for your game. Begin by importing MintCrate:

```
import { MintCrate } from "./lib/mintcratejs/mintcratejs/core.js";`
```

Then, import your rooms:

```
import { Title }  from "./rooms/title.js";
import { Game }   from "./rooms/game.js";

let roomList = [
  Title,
  Game
];
```

The first room specified in the room list array will be the default room loaded when the game boots up (in this case, `Title`).

Next, initialize MintCrate:

```
var mint = new MintCrate("mintcrate-target", 320, 240, roomList, {
  screenScale: 2
});
```

Add your input mappings:

```
mint.addInputHandler();

mint.inputs[0].mapInput('up'   , 'ArrowUp');
mint.inputs[0].mapInput('down' , 'ArrowDown');
mint.inputs[0].mapInput('left' , 'ArrowLeft');
mint.inputs[0].mapInput('right', 'ArrowRight');
mint.inputs[0].mapInput('z'    , 'KeyZ');
mint.inputs[0].mapInput('x'    , 'KeyX');
```

Define your resources and entities (game objects):

```
// Actives
mintCrate.defineActives([
  // Knight (player character)
  {name: 'knight'},
  {name: 'knight_collider', width: 32, height: 48, offset: [-16, -48]},
  {name: 'knight_idle', offset: [-16, -48], actionPoints: [[32, 24]]},
  {name: 'knight_walk', offset: [-16, -48], actionPoints: [[32, 24], [32, 23], [32, 24], [32, 23]], frameCount: 4, frameDuration: 20},
  
  // Coin
  {name: 'coin'},
  {name: 'coin_collider', width: 16, height: 16, offset: [-8, -8]},
  {name: 'coin_default', offset: [-8, -8]},
]);

// Backdrops
mintCrate.defineBackdrops([
  {name: 'tree'},
  {name: 'cloudysky', mosaic: true},
  {name: 'menubox', ninePatch: false}
]);

// Fonts
mint.defineFonts([
  {name: 'pixel'}
]);

// Background music tracks
mint.defineMusic([
  {name: 'field', loop: true},
  {name: 'battle', loop: true, loopStart: 0.247, loopEnd: 83.649},
  {name: 'victory'}
]);

// Sound effects
mint.defineSounds([
  {name: 'footstep'},
  {name: 'swish'},
  {name: 'getcoin'}
]);

// Tilemaps
mint.defineTilemaps([
  {name: 'grassland', tileWidth: 16, tileHeight: 16},
  {name: 'grassland_field'},
  {name: 'grassland_woods'}
]);
```

And finally, tell MintCrate to begin the boot-up sequence:

```
mint.ready();
```

## Rooms

The basic setup for a room script is as such:

```
export class Game {
  load(engine) {
    this.mintCrate = engine;
  }
  
  update() {
  }
}
```

It is recommended that, for ease of use, you alias the engine name to avoid having to repeatedly reference it with `this`:

```
export class Game {
  load(engine) {
    this.mintCrate = engine;
    let mint = this.mintCrate;
  }
  
  update() {
    let mint = this.mintCrate;
  }
}
```

The `load` method is where you initialize all your variables and entities:

```
this.totalCoins = 0;
this.playerHP = 100;
```

A room can be configured in a few ways (in the `load` method):

```
// Room background color
mint.setRoomBackgroundColor(128, 128, 128);

// Room fade-in and fade-out visuals
mint.configureRoomFadeIn(15, 15, {r: 255, g: 255, b: 255});
mint.configureRoomFadeOut(15, 15, {r: 0, g: 0, b: 0});

// Room's loaded tilemap
mint.setTilemap('grassland_field');
```

Entities can be added to a room (in the `load` method):

```
// Actives
this.player = mint.fg.addActive('knight', 32, 128);
this.coin = mint.fg.addActive('coin', 64, 128);

// Backdrops
this.tree = mint.bg.addBackdrop('tree', 64, 128);

// Paragraphs
this.playerHudHP = mint.bg.addParagraph('pixel', 8, 8, "HP: " + this.playerHP);

// Shapes
this.compassLine = mint.bg.addLine(128, 128, 136, 136);
this.waterLine = mint.bg.addRectangle(0, 128, 320, 64);
this.radarBg = mint.bg.addCircle(64, 8, 32);
```

Notice the `.fg` and `.bg` specifiers when adding entities. This is because MintCrate rooms have 3 rendering layers:

- Background layer (`.bg`)
- Tilemap layer (cannot be added to, reserved only for tilemap)
- Foreground layer (`.fg`)

How you use these layers is entirely up to you.

The `update` function is where all of the room's game logic takes place. The actual "game stuff" happens in here.
```
if (mint.inputs[0].pressed('right')) {
  this.player.moveX(1);
}

if (mint.testActiveCollision(this.player, this.coin)) {
  this.coin.destroy;
  this.totalCoins++;
}
```

## Tilemaps

Tilemaps are made up of 2 files:

1. An image file (`png`) that contains all the tiles for the tilemap.
2. A JSON file containing the tilemap layout and, optionally, a behavior map.

Tilemap images are 1-indexed. The indexing occurs left-to-right, top-to-bottom. So, for a 2x2 tilemap, the top-left tile index is 1, and the bottom-right index is 4.

A tilemap PNG file may look as follows:

![tilemap sample image](https://raw.githubusercontent.com/kevinmaddox/mintcratejs/refs/heads/main/readme-content/tilemap-sample.png)

A tilemap JSON file may look as follows:

```
{
 "tiles": [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1 ],
    [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1 ],
    [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1 ],
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  ],
  
  "behaviors": [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1 ],
    [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1 ],
    [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1 ],
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  ]
}
```

The behavior map is used to handle collisions with different types of tiles. For example, touching a regular grass block is going to be different than touching a lava block. These behavior values are later used in the `testActiveCollision` function (see section "Entities" below).

## Entities

Like many game-development frameworks, MintCrate has a concept of entities. There are 4 types:

1. Actives: Animated sprite entities that support collisions. Used for players, enemies, bullets, etc.
2. Backdrops: Non-animated sprite entities that support tiling and ninepatching. Used for scenery, UIs, etc.
3. Paragraphs: Monospaced bitmap font entities that support simple formatting. Used for variable text strings, of course.
4. Shapes: Abstract geometric shapes (lines, rectangles, and circles). Used for any supporting graphical means.

Entities have functions, which vary depending on the entity type. For example:

```
// Actives
this.player.playAnimation('walk');
this.player.getTransformedSpriteWidth();
this.player.getLeftEdgeX();
this.player.getActionPointX();

// Backdrops
this.tree.setWidth(64);
this.tree.setU(32);
this.tree.setV(32);

// Paragraphs
this.playerHudHP.setTextContent('HP: ' + this.playerHP);
this.playerHudHP.getGlyphWidth();

// Shapes
this.radarBg.setBorderWidth(2);
this.radarBg.setRadius(16);
this.radarBg.getRadius();
```

Actives, which support collisions, can be tested via a couple methods:

```
mint.mouseOverActive(this.player);
mint.testActiveCollision(this.player, this.coin);
```

You can also test for collisions between Actives and tilemap tiles:

```
mint.testMapCollision(this.player, 4);
```

The `4` indicates the tilemap behavior. For example, `4` may be a lava tile, in which you'd want to make the player take damage should the check succeed.

## Input

Checking inputs is done via input handlers, which are defined in the `main.js` initialization sequence. Ensure that a handler is added before checking its input. A few notes:

- Input handlers correspond to keyboard inputs.
- There is no way to arbitrarily check for keyboard inputs without defining them in an input handler.
- You can, however, check for mouse inputs without defining them in an input handler (as that is not possible). Mouse buttons identifiers are indexed beginning at 0.

```
// MintCrate input handler (keyboard input)
mint.inputs[0].pressed('x');
mint.inputs[0].released('x');
mint.inputs[0].held('x');

// Mouse input
mint.getMouseX();
mint.getMouseY();
mint.mousePressed(0);
mint.mouseReleased(0);
mint.mouseHeld(0);
```

## Audio

Music can be played simply (only one track can be played at a time), and a few functions are available for manipulating its playback:

```
mint.playMusic('field');
mint.setMusicPitch(0.8);
```

Multiple sounds can be played at once, though the same sound cannot layer over itself (firing it off while it's still playing will silence the current instance and play the new instance):

```
mint.playSound('getcoin', {pitch: 0.5});
```

The master volume of all music tracks and all sound effects can be adjusted, too (1.0 is full volume):

```
mint.setMusicVolume(0.75);
mint.setSoundVolume(0.4);
```

# Licensing for Example Projects

## Open-source Content

All code and assets, including system image resources (the crosshairs and bitmap
font files), that make up the MintCrate library are licensed under the MIT
License (see repository root to find the license information file). In other
words, the entirety of the MintCrate library itself (excluding example projects)
falls under the MIT License.

The program code (JS & JSON files) provided within the example files within this
folder also fall under the MIT License.

## Copyrighted Media

The media assets within the provided example projects, however, are copyrighted
material and do not fall under the MIT License. This includes (but is not
limited to) image files, music files, sound effect files, character designs, and
musical compositions. They are intellectual property wholly owned by MintCrate's
author: Kevin Maddox. They are protected by both U.S. copyright law and the
Berne Convention.

These copyrighted materials are provided solely for educational purposes and as
a means to demonstrate how to use MintCrate in a more meaningful and
understandable way. They may be freely redistributed with the library but they
should not be present in your final projects.

They cannot be used for any sort of commercial purposes. They may, however,
be used for educational purposes and may be used within an academic environment
or institution for the purpose of teaching and learning.
