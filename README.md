# MintCrateJS

![mintcrate logo](https://raw.githubusercontent.com/kevinmaddox/mintcratejs/refs/heads/main/readme-content/logo.png)

Rapid game development framework for developing prototypes and simple games. Favors fun and ease of use.

## Examples

Warning: These examples may feature audio.

### [Azure Flight](https://kevinmaddox.github.io/mintcratejs/examples/azure-flight/)

Arcade action game. Fly up and down and avoid the rocks!

[<img src="https://raw.githubusercontent.com/kevinmaddox/mintcratejs/refs/heads/main/readme-content/azure-flight.png" alt="azure flight screenshot">](https://kevinmaddox.github.io/mintcratejs/examples/azure-flight/)

### [Sprite Gallery](https://kevinmaddox.github.io/mintcratejs/examples/sprite-gallery/)

View and play with some pixel art graphics.

[<img src="https://raw.githubusercontent.com/kevinmaddox/mintcratejs/refs/heads/main/readme-content/sprite-gallery.png" alt="azure flight screenshot">](https://kevinmaddox.github.io/mintcratejs/examples/sprite-gallery/)

## Quickstart Guide

### Overview

Blah blah

### Project Structure

Main JS file, rooms, folder structure

Resources and entities are defined in your main JavaScript file.

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

// Tilemaps
mint.defineTilemaps([
  {name: 'grassland', tileWidth: 16, tileHeight: 16},
  {name: 'grassland_field'},
  {name: 'grassland_woods'}
]);

// Sound effects
mint.defineSounds([
  {name: 'footstep'},
  {name: 'swish'},
  {name: 'getcoin'}
]);

// Background music tracks
mint.defineMusic([
  {name: 'field', loop: true},
  {name: 'battle', loop: true, loopStart: 0.247, loopEnd: 83.649},
  {name: 'victory'}
]);
```

### Entities

Like many game-development frameworks, MintCrate has a concept of entities. There are 4 types.

1. Actives: Animated sprite entities that support collisions. Used for players, enemies, bullets, etc.
2. Backdrops: Non-animated sprite entities that support tiling and ninepatching. Used for scenery, UIs, etc.
3. Paragraphs: Monospaced bitmap font entities that support simple formatting. Used for variable text strings, of course.
4. Shapes: Abstract geometric shapes (lines, rectangles, and circles). Used for any supporting graphical means.

Entities have functions, which vary depending on the entity type. For example:

```
// Actives
knight.playAnimation('walk');
knight.getTransformedSpriteWidth();
knight.getLeftEdgeX();
knight.getActionPointX();

// Backdrops
checkerboard.setWidth(64);
checkerboard.setU(32);
checkerboard.setV(32);

// Paragraphs
menuText.setTextContent('Press start to play!');
menuText.getGlyphWidth();

// Shapes
myCircle.setBorderWidth(2);
myCircle.setRadius(16);
myCircle.getRadius();
```

### Input

### Audio

## Licensing for Example Projects

### Open-source Content

All code and assets, including system image resources (the crosshairs and bitmap
font files), that make up the MintCrate library are licensed under the MIT
License (see repository root to find the license information file). In other
words, the entirety of the MintCrate library itself (excluding example projects)
falls under the MIT License.

The program code (JS & JSON files) provided within the example files within this
folder also fall under the MIT License.

### Copyrighted Media

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
