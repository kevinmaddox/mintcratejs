// -----------------------------------------------------------------------------
// MintCrate - Core
// Framework core
// -----------------------------------------------------------------------------

'use strict';

import { Active }        from "./active.js";
import { InputHandler }  from "./inputhandler.js";
import { Sound }         from "./sound.js";
import { EntityFactory } from "./entityfactory.js";
import { MintUtil }      from "./mintutil.js";
import { MintMath }      from "./mintmath.js";

import { SYSTEM_MEDIA_B64 } from "./img/b64.js";

export class MintCrate {
  
  //----------------------------------------------------------------------------
  // Member variables
  //----------------------------------------------------------------------------
  
  #pageHasFocus;
  
  #frontCanvas;
  #frontContext;
  #backCanvas;
  #backContext;
  
  #RES_PATHS;
  
  #BASE_WIDTH;
  #BASE_HEIGHT;
  
  #SCREEN_SCALE;
  
  #colorKeys;
  #colorKeyCanvas;
  #colorKeyContext;
  
  #systemImages;
  
  #queuedFunctions;
  
  #inputHandlers;
  #keyStates;
  #keyboard;
  
  #mouseStates;
  #mousePositions;
  #mouseButtons;
  
  #camera;
  #cameraBounds;
  #cameraIsBound;
  
  #tilemapIsSet;
  #tilemapFullName;
  #tilemapName;
  #layoutName;
  
  #fadeLevel;
  #fadeValue;
  #fadeColor;
  #fadeFunc;
  
  #devMode;
  #showFps;
  #showRoomInfo;
  #showCameraInfo;
  #showTilemapCollisionMasks
  #showTilemapBehaviorValues
  #showActiveCollisionMasks;
  #showActiveInfo;
  #showActiveOriginPoints;
  #showActiveActionPoints;
  
  #currentFps;    // Current FPS value
  #fpsTimeLast;   // Time snapshot logger for throttling FPS
  #frameInterval; //
  #fpsFrameLast;  // Time snapshot logger for calculating FPS
  #frameCounter;  // Counts frames to calculate FPS
  
  #entityCreator;
  
  #ROOM_LIST;
  #STARTING_ROOM;
  #currentRoom;
  #roomData;
  #isChangingRooms;
  #roomHasChanged;
  
  #audioContext;
  #MUSIC_FADE_TYPES;
  #MUSIC_STATES;
  #masterVolume;
  #masterBgmPitch;
  #currentMusicTrackName;
  #systemAudioHalted
  
  #loadingQueue;
  #data;
  #instanceCollection;
  #tiles;
  #linearInstanceLists;
  #drawOrders;
  
  //----------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------
  
  constructor(
    divTargetId,
    baseWidth,
    baseHeight,
    roomList,
    options = {}
  ) {
    // Listen for lost page focus so that we can pause the game
    this.#pageHasFocus = true;
    document.addEventListener(
      "visibilitychange", 
      () => { this.#onPageFocusLost(); },
      false
    );
    
    // Default options
    options.screenScale = options.screenScale ?? 1;
    options.devMode     = options.devMode ?? false;
    
    // Initialize render canvases/contexts
    this.#frontCanvas = document.createElement('canvas');
    this.#frontCanvas.addEventListener('contextmenu',
      event => event.preventDefault());
    
    this.#frontCanvas.width    = baseWidth * options.screenScale;
    this.#frontCanvas.height   = baseHeight * options.screenScale;
    this.#frontCanvas.tabIndex = 1;
    
    this.#frontContext = this.#frontCanvas.getContext('2d');
    this.#frontContext.imageSmoothingEnabled = false;
    
    this.#backCanvas = new OffscreenCanvas(baseWidth, baseHeight);
    
    this.#backContext = this.#backCanvas.getContext('2d');
    this.#backContext.imageSmoothingEnabled = false;
    
    document.querySelector(`#${divTargetId}`).append(this.#frontCanvas);
    
    // Paths for loading media resources
    this.#RES_PATHS = {
      actives   : "res/actives",
      backdrops : "res/backdrops",
      fonts     : "res/fonts",
      music     : "res/music",
      sounds    : "res/sounds",
      tilemaps  : "res/tilemaps"
    };
    
    // Game's base pixel resolution
    this.#BASE_WIDTH = baseWidth;
    this.#BASE_HEIGHT = baseHeight;
    
    // Graphics scaling values
    this.#SCREEN_SCALE = options.screenScale;
    
    // RGB value sets and rendering context for color keying sprites
    this.#colorKeys = [];
    this.#colorKeyCanvas = document.createElement('canvas');
    this.#colorKeyContext = this.#colorKeyCanvas.getContext('2d');
    
    // System graphics for debugging purposes
    this.#systemImages = {};
    
    // Functions that get called after a delay
    this.#queuedFunctions = [];
    
    // Stores input handlers for managing player input
    this.#inputHandlers = [];
    
    // Used for keeping track of keyboard data
    this.#keyStates     = {};
    
    document.addEventListener('keydown', (e) => this.#keyHandler(e), false);
    document.addEventListener('keyup',   (e) => this.#keyHandler(e), false);
    
    // Used for keeping track of mouse data
    this.#mouseStates = {};
    this.#mousePositions = {
      localX  : 0, localY  : 0,
      globalX : 0, globalY : 0
    };
    this.#mouseButtons = [
      {pressed : false, held : false, released : false},
      {pressed : false, held : false, released : false},
      {pressed : false, held : false, released : false}
    ];
    
    document.addEventListener('mousedown', (e) => this.#mouseButtonHandler(e), false);
    document.addEventListener('mouseup',   (e) => this.#mouseButtonHandler(e), false);
    document.addEventListener('mousemove', (e) => this.#mouseMoveHandler(e),   false);
    
    // Camera
    this.#camera        = {x : 0, y : 0};
    this.#cameraBounds  = {x1 : 0, x2 : 0, y1 : 0, y2 : 0};
    this.#cameraIsBound = false;
    
    // Tilemap
    this.#tilemapIsSet    = false;
    this.#tilemapFullName = "";
    this.#tilemapName     = "";
    this.#layoutName      = "";
    
    // Visual fades
    this.#fadeLevel = 0;
    this.#fadeValue = 1;
    this.#fadeColor = {r: 0, g: 0, b: 0};
    
    // Debug functionality
    this.#devMode                   = options.devMode;
    this.#showFps                   = false;
    this.#showRoomInfo              = false;
    this.#showCameraInfo            = false;
    this.#showTilemapCollisionMasks = false;
    this.#showTilemapBehaviorValues = false;
    this.#showActiveCollisionMasks  = false;
    this.#showActiveInfo            = false;
    this.#showActiveOriginPoints    = false;
    this.#showActiveActionPoints    = false;
    
    // FPS limiter
    this.#currentFps    = 0;
    this.#frameCounter  = 0;
    this.#fpsTimeLast   = 0;
    this.#frameInterval = 1000 / 60;
    this.#fpsFrameLast  = 0;
    
    // Room/gamestate management
    this.#ROOM_LIST = {};
    for (const room of roomList) {
      this.#ROOM_LIST[room.name] = room;
    }
    this.#STARTING_ROOM   = roomList[0];
    this.#roomData = {};
    this.#isChangingRooms = false;
    this.#roomHasChanged = false;
    
    // Music/SFX global volume levels
    this.#MUSIC_FADE_TYPES = {IN: 0, OUT: 1};
    this.#MUSIC_STATES = {PLAYING: 0, PAUSING: 1, PAUSED: 2, STOPPING: 3, STOPPED: 4};
    this.#masterVolume = {
      bgm: 1,
      sfx: 1
    };
    this.#masterBgmPitch  = 1;
    this.#currentMusicTrackName = "";
    this.#systemAudioHalted = false;
    
    // Game data
    this.#loadingQueue = {
      actives: [],
      backdrops: [],
      fonts: [],
      tilemaps: [],
      sounds: [],
      music: []
    };
    
    this.#data = { // TODO: Change to this.#definitions (after everything else)
      actives   : {},
      backdrops : {},
      fonts     : {},
      tilemaps  : {},
      sounds    : {},
      music     : {}
    };
    
    this.#tiles = [];
    
    this.#instanceCollection = {};
    
    this.#linearInstanceLists = {
      actives    : [],
      backdrops  : [],
      paragraphs : []
    }
    
    this.#drawOrders = {
      background : [],
      foreground : []
    };
    
    // Entity creation
    this.#entityCreator = {
      foreground: new EntityFactory(this.#data, this.#instanceCollection, this.#linearInstanceLists, this.#drawOrders.foreground),
      background: new EntityFactory(this.#data, this.#instanceCollection, this.#linearInstanceLists, this.#drawOrders.background)
    };
    
    // Aliases for easy user access
    this.obj      = this.#instanceCollection;
    this.bg       = this.#entityCreator.background;
    this.fg       = this.#entityCreator.foreground;
    this.roomList = this.#ROOM_LIST;
    this.inputs   = this.#inputHandlers;
    
    // Prepare canvas.
    this.#clearCanvas();
    this.#renderFrame();
  }
  
  //----------------------------------------------------------------------------
  // System initialization methods
  //----------------------------------------------------------------------------
  
  // Signifies that all loading has been completed and that the game should run.
  ready() {
    let promises = [];
    
    // Load system images
    // for (const basename of ['point_origin', 'point_action']) {
    for (const mediaName in SYSTEM_MEDIA_B64.graphics) {
      let promise =
        this.#loadImage(SYSTEM_MEDIA_B64.graphics[mediaName])
        .then((img) => this.#colorKeyImage(img, true))
        .then((img) => {
          this.#systemImages[mediaName] = img;
        });
      
      promises.push(promise);
    }
    
    // Load system fonts
    for (const mediaName in SYSTEM_MEDIA_B64.fonts) {
      let promise =
        this.#loadImage(SYSTEM_MEDIA_B64.fonts[mediaName])
        .then((img) => this.#colorKeyImage(img, true))
        .then((img) => {
          this.#data.fonts[mediaName] = {
            img: img,
            charWidth: img.width / 32,
            charHeight: img.height / 3
          };
        });
      
      promises.push(promise);
    }
    
    // Present "ready to play" screen for user to trigger loading process
    Promise.allSettled(promises).then((results) => {
      if (this.#initFailed(results)) {
        return;
      }
      
      if (this.#devMode) {
        this.#loadActives();
      } else {
        let over = () => { this.#displayReadyScreen(1); };
        let out  = () => { this.#displayReadyScreen(0); };
        
        let click = () => {
          this.#frontCanvas.style.cursor = '';
          
          this.#frontCanvas.removeEventListener('mouseover', over);
          this.#frontCanvas.removeEventListener('mouseout', out);
          this.#frontCanvas.removeEventListener('click', click);
          
          this.#clearCanvas();
          this.#renderFrame();
          
          setTimeout(() => this.#loadActives(), 250);
        }
        
        this.#frontCanvas.addEventListener('mouseover', over);
        this.#frontCanvas.addEventListener('mouseout', out);
        this.#frontCanvas.addEventListener('click', click);
        
        this.#displayReadyScreen(0);
        this.#frontCanvas.style.cursor = 'pointer';
      }
    });
  }
  
  #displayReadyScreen(state) {
    // state = 0: Mouse not hovering
    // state = 1: Mouse hovering
    
    let graphic = this.#systemImages['start'];
    
    this.#clearCanvas();
    
    this.#backContext.drawImage(
      this.#systemImages['start'],                    // image
      (graphic.width / 2) * state,                    // sx
      0,                                              // sy
      graphic.width / 2,                              // sWidth
      graphic.height,                                 // sHeight
      (this.#BASE_WIDTH  / 2) - (graphic.width  / 2), // dx
      (this.#BASE_HEIGHT / 2) - (graphic.height / 2), // dy
      graphic.width / 2,                              // dWidth,
      graphic.height                                  // dHeight
    );
    
    this.#renderFrame();
  }
  
  #displayLoadingScreen(statusMessage) {
    let font = this.#data.fonts['system_boot'];
    let msgWidth = font.charWidth * statusMessage.length;
    
    this.#clearCanvas();
    
    this.#backContext.fillStyle = 'gray';
    this.#backContext.fillRect(0, 0, this.#BASE_WIDTH, this.#BASE_HEIGHT);
    
    this.#drawText(
      [statusMessage],
      font,
      (this.#BASE_WIDTH  / 2) - (msgWidth        / 2),
      (this.#BASE_HEIGHT / 2) - (font.charHeight / 2)
    );
    
    this.#renderFrame();
  }
  
  //----------------------------------------------------------------------------
  // Methods for loading game resources
  //----------------------------------------------------------------------------
  
  // Works with B64 image strings, too.
  #loadImage(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.addEventListener('load', () => { resolve(img); });
      img.addEventListener('error', (err) => { reject(err); });
      img.src = url;
    });
  }
  
  defineColorKeys(rgbSets) {
    // TODO: This
  }
  
  #colorKeyImage(img, isSystemResource = false) {
    return new Promise((resolve, reject) => {
      this.#colorKeyCanvas.width = img.width;
      this.#colorKeyCanvas.height = img.height;
      this.#colorKeyContext.clearRect(0, 0, img.width, img.height);
      
      this.#colorKeyContext.drawImage(img, 0, 0);
      
      let imgData = this.#colorKeyContext.getImageData(
        0,
        0,
        img.width,
        img.height
      );
      
      let colorKeys = this.#colorKeys;
      if (isSystemResource) {
        colorKeys = [
          {r:  82, g: 173, b: 154},
          {r: 140, g: 222, b: 205}
        ];
      }
      
      for (const color of colorKeys) {
        for (let i = 0; i < imgData.data.length; i += 4) {
          
          if (
            imgData.data[i]   === color.r &&
            imgData.data[i+1] === color.g &&
            imgData.data[i+2] === color.b
          ) {
            imgData.data[i]   = 0;
            imgData.data[i+1] = 0;
            imgData.data[i+2] = 0;
            imgData.data[i+3] = 0;
          }
        }
      }
      
      this.#colorKeyContext.putImageData(imgData, 0, 0);
      
      img.addEventListener('load', () => { resolve(img); });
      img.addEventListener('error', (err) => { reject(err); });
      img.src = this.#colorKeyCanvas.toDataURL();
    });
  }
  
  defineActives(data) {
    this.#loadingQueue.actives = data;
  }
  
  defineBackdrops(data) {
    this.#loadingQueue.backdrops = data;
  }
  
  defineFonts(data) {
    this.#loadingQueue.fonts = data;
  }
  
  defineTilemaps(data) {
    this.#loadingQueue.tilemaps = data;
  }
  
  defineSounds(data) {
    this.#loadingQueue.sounds = data;
  }
  
  defineMusic(data) {
    this.#loadingQueue.music = data;
  }
  
  #loadActives() {
    console.log('Loading Active');
    this.#displayLoadingScreen('Loading Active');
    
    let loadedImages = {};
    
    let promises = [];
    
    for (const item of this.#loadingQueue.actives) {
      if (item.name.includes('_') && !item.name.includes('collider')) {
        let promise =
          this.#loadImage(`${this.#RES_PATHS.actives}/${item.name}.png`)
          .then((img) => this.#colorKeyImage(img))
          .then((img) => loadedImages[item.name] = img);
        
        promises.push(promise);
      }
    }
    
    // Proceed when loading is done
    Promise.allSettled(promises).then((results) => {
      if (this.#initFailed(results)) {
        return;
      }
      
      for (const item of this.#loadingQueue.actives) {
        // Active's base name
        if (!item.name.includes('_')) {
          this.#data.actives[item.name] = {
            animations: {}
          };
          
        // Active's collider data
        } else if (item.name.includes('collider')) {
          // Default params
          item.offset = item.offset ?? [0, 0];
          item.width  = item.width  ?? 0;
          item.height = item.height ?? 0;
          item.radius = item.radius ?? 0;
          
          // Split name to get Active's name
          let nameParts = item.name.split('_');
          
          // Store Active's name
          let activeName = nameParts[0];
          
          // Figure out collider's shape
          let shape = Active.COLLIDER_SHAPES.NONE;
          if (item.width !== 0 && item.height !== 0) {
            shape = Active.COLLIDER_SHAPES.RECTANGLE;
          } else if (item.radius !== 0) {
            shape = Active.COLLIDER_SHAPES.CIRCLE;
          }
          
          // Create And store collider data structure
          this.#data.actives[activeName].collider = {
            width   : item.width,
            height  : item.height,
            radius  : item.radius,
            offsetX : item.offset[0],
            offsetY : item.offset[1],
            shape   : shape
          };
          
        // Active's sprites/animations
        } else {
          // Default params
          item.offset        = item.offset        ?? [0, 0];
          item.actionPoints  = item.actionPoints  ?? [[0, 0]];
          item.frameCount    = item.frameCount    ?? 1;
          item.frameDuration = item.frameDuration ?? 20;
          
          // Split name to get Active's name and animation
          let nameParts = item.name.split('_');
          
          // Store active and animation names
          let activeName = nameParts[0];
          let animationName = nameParts[1];
          
          // Specify default animation (the first one the user defines)
          if (typeof this.#data.actives[activeName].initialAnimationName === 'undefined') {
            this.#data.actives[activeName].initialAnimationName = animationName;
          }
          
          // Store action points, filling with available action points...
          let actionPoints = [];
          for (let i = 0; i < item.actionPoints.length; i++) {
            actionPoints.push(item.actionPoints[i]);
          }
          
          // ... then propagating remaining slots with the last-provided set
          for (let i = actionPoints.length; i < item.frameCount; i++) {
            actionPoints.push(item.actionPoints[item.actionPoints.length-1]);
          }
          
          // Store animation data
          let img = loadedImages[item.name];
          let animation = {
            img           : img,
            quads         : [],
            offsetX       : item.offset[0],
            offsetY       : item.offset[1],
            actionPoints  : actionPoints,
            frameCount    : item.frameCount,
            frameDuration : item.frameDuration,
            frameWidth    : img.width / item.frameCount,
            frameHeight   : img.height
          };
          
          // Store animation
          this.#data.actives[activeName].animations[animationName] = animation;
        }
      }
      
      this.#loadBackdrops();
    });
  }
  
  #loadBackdrops() {
    console.log('Loading Backdrops');
    this.#displayLoadingScreen('Loading Backdrops');
    
    let loadedImages = {};
    
    let promises = [];
    
    for (const item of this.#loadingQueue.backdrops) {
      let promise =
        this.#loadImage(`${this.#RES_PATHS.backdrops}/${item.name}.png`)
        .then((img) => this.#colorKeyImage(img))
        .then((img) => loadedImages[item.name] = img);
      
      promises.push(promise);
    }
    
    // Proceed when loading is done
    Promise.allSettled(promises).then((results) => {
      if (this.#initFailed(results)) {
        return;
      }
      
      for (const item of this.#loadingQueue.backdrops) {
        let img = loadedImages[item.name];
        
        this.#data.backdrops[item.name] = {
          img: img,
          mosaic: item.mosaic ?? false,
          ninePatch: item.ninePatch ?? false
        };
        
        if (item.mosaic) {
          this.#data.backdrops[`${item.name}_mosaic`] =
            this.#backContext.createPattern(img, "repeat");
        }
      }
      
      this.#loadFonts();
    });
  }
  
  #loadFonts() {
    console.log('Loading Fonts');
    this.#displayLoadingScreen('Loading Fonts');
    
    let loadedImages = {};
    
    let promises = [];
    
    for (const item of this.#loadingQueue.fonts) {
      let promise =
        this.#loadImage(`${this.#RES_PATHS.fonts}/${item.name}.png`)
        .then((img) => this.#colorKeyImage(img))
        .then((img) => loadedImages[item.name] = img);
      
      promises.push(promise);
    }
    
    // Proceed when loading is done
    Promise.allSettled(promises).then((results) => {
      if (this.#initFailed(results)) {
        return;
      }
      
      for (const item of this.#loadingQueue.fonts) {
        let img = loadedImages[item.name];
        
        this.#data.fonts[item.name] = {
          img: img,
          charWidth: img.width / 32,
          charHeight: img.height / 3
        };
      }
      
      this.#loadTilemaps();
    });
  }
  
  #loadTilemaps() {
    console.log('Loading Tilemaps');
    this.#displayLoadingScreen('Loading Tilemaps');
    
    let loadedImages = {};
    let loadedJson   = {};
    
    let promises = [];
    
    for (const item of this.#loadingQueue.tilemaps) {
      // Tilemap's base name (refers to the image file)
      if (!item.name.includes('_')) {
        let promise =
          this.#loadImage(`${this.#RES_PATHS.tilemaps}/${item.name}.png`)
          .then((img) => this.#colorKeyImage(img))
          .then((img) => loadedImages[item.name] = img);
        
        promises.push(promise);
      
      // Tilemap's actual map data layout files
      } else {
        let promise =
          fetch(`${this.#RES_PATHS.tilemaps}/${item.name}.json`)
          .then((response) => response.json())
          .then((json) => loadedJson[item.name] = json);
        
        promises.push(promise);
      }
    }
    
    // Proceed when loading is done
    Promise.allSettled(promises).then((results) => {
      if (this.#initFailed(results))
        return;
      
      for (const item of this.#loadingQueue.tilemaps) {
        // Tilemap's base name (refers to the image file)
        if (!item.name.includes('_')) {
          let img = loadedImages[item.name];
          
          this.#data.tilemaps[item.name] = {
            img: img,
            tileWidth: item.tileWidth,
            tileHeight: item.tileHeight,
            clippingRects: [],
            layouts: {}
          };
          
          for (let y = 0; y < img.height; y += item.tileHeight) {
            for (let x = 0; x < img.width; x += item.tileWidth) {
              if (x < img.width && y < img.height) {
                this.#data.tilemaps[item.name].clippingRects.push({x:x, y:y});
              }
            }
          }
          
        // Tilemap's actual map data layout files
        } else {
          let layoutData = loadedJson[item.name];
          
          let nameParts = item.name.split('_');
          let tilemapName = nameParts[0];
          let layoutName = nameParts[1];
          
          this.#data.tilemaps[tilemapName].layouts[layoutName] = {
            tiles: layoutData.tiles
          };
          
          this.#generateCollisionMap(tilemapName, layoutName, layoutData.behaviors);
        }
      }
      
      this.#loadSounds();
    });
  }
  
  #loadSounds() {
    console.log('Loading Sound Effects');
    this.#displayLoadingScreen('Loading Sound Effects');
    
    // The audio context is created here, and not in the constructor, as the
    // game should have user input by this point and the context won't be
    // blocked from being instantiated by the browser
    this.#audioContext = new AudioContext();
    
    let loadedOggs = {};
    
    let promises = [];
    
    for (const item of this.#loadingQueue.sounds) {
      let promise =
        fetch(`${this.#RES_PATHS.sounds}/${item.name}.ogg`)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => this.#audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => loadedOggs[item.name] = audioBuffer);
      
      promises.push(promise);
    }
    
    // Proceed when loading is done
    Promise.allSettled(promises).then((results) => {
      if (this.#initFailed(results))
        return;
      
      for (const item of this.#loadingQueue.sounds) {
        let audioBuffer = loadedOggs[item.name];
        
        this.#data.sounds[item.name] = {
          source: new Sound(this.#audioContext, audioBuffer),
          lastVolume: 1,
          lastPitch: 1
        };
      }
      
      this.#loadMusic();
    });
  }
  
  #loadMusic() {
    console.log('Loading Music');
    this.#displayLoadingScreen('Loading Music');
    
    let loadedOggs = {};
    
    let promises = [];
    
    for (const item of this.#loadingQueue.music) {
      let promise =
        fetch(`${this.#RES_PATHS.music}/${item.name}.ogg`)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => this.#audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => loadedOggs[item.name] = audioBuffer);
      
      promises.push(promise);
    }
    
    // Proceed when loading is done
    Promise.allSettled(promises).then((results) => {
      if (this.#initFailed(results))
        return;
      
      for (const item of this.#loadingQueue.music) {
        let audioBuffer = loadedOggs[item.name];
        
        this.#data.music[item.name] = {
          source: new Sound(this.#audioContext, audioBuffer),
          relativeVolume: 0,
          state: this.#MUSIC_STATES.STOPPED,
          fade: {
            type: this.#MUSIC_FADE_TYPES.IN,
            remainingFrames: 0,
            affectingValue: 0
          },
          loop: {
            enabled : item.loop      ?? false,
            start   : item.loopStart ?? 0,
            end     : item.loopEnd   ?? audioBuffer.duration
          }
        };
      }
      
      this.#initDone();
    });
  }
  
  #generateCollisionMap(tilemapName, layoutName, behaviorMap) {
    // Get layout data
    let layout = this.#data.tilemaps[tilemapName].layouts[layoutName];
    
    // Generate simple on/off behavior map if none was provided
    let bMap = behaviorMap;
    
    if (!bMap) {
      bMap = [];
      for (let row = 0; row < layout.tiles.length; row++) {
        bMap[row] = [];
        for (let col = 0; col < layout.tiles[row].length; col++) {
          let tileNumber = layout.tiles[row][col];
          bMap[row][col] = (tileNumber === 0) ? 0 : 1;
        }
      }
    }
    
    // Generate collision map
    layout.collisionMasks = {};
    
    for (let row = 0; row < bMap.length; row++) {
      for (let col = 0; col < bMap[row].length; col++) {
        let tileType = bMap[row][col];
        
        // Skip if empty tile
        if (tileType === 0) {
          continue;
        }
        
        // If tile found, perform a two-step scan for a full quad
        let start = {row: row, col: col};
        let stop  = {row: row, col: col};
        
        // Find ending column
        for (let scanCol = start.col+1; scanCol < bMap[row].length; scanCol++) {
          let scanTileType = bMap[row][scanCol];
          if (scanTileType === 0 || scanTileType !== tileType) {
            break;
          } else {
            stop.col = scanCol;
          }
        }
        
        // Find ending row
        let done = false;
        for (let scanRow = start.row+1; scanRow < bMap.length; scanRow++) {
          for (let scanCol = start.col; scanCol <= stop.col; scanCol++) {
            let scanTileType = bMap[scanRow][scanCol];
            done = (scanTileType === 0 || scanTileType !== tileType);
            if (done) { break; }
          }
          
          if (done) { break; }
          
          stop.row = scanRow;
        }
        
        // Remove from collision data map
        for (let remRow = start.row; remRow <= stop.row; remRow++) {
          for (let remCol = start.col; remCol <= stop.col; remCol++) {
            bMap[remRow][remCol] = 0;
          }
        }
        
        // Store as collision mask
        if (!layout.collisionMasks[tileType]) {
          layout.collisionMasks[tileType] = [];
        }
        
        layout.collisionMasks[tileType].push({
          s: Active.COLLIDER_SHAPES.RECTANGLE,
          x: start.col,
          y: start.row,
          w: stop.col - start.col + 1,
          h: stop.row - start.row + 1,
          collision: false
        });
        
      }
    }
    
    let tilemapData = this.#data.tilemaps[tilemapName];
    for (const tileType in layout.collisionMasks) {
      for (const mask of layout.collisionMasks[tileType]) {
        mask.x *= tilemapData.tileWidth;
        mask.y *= tilemapData.tileHeight;
        mask.w *= tilemapData.tileWidth;
        mask.h *= tilemapData.tileHeight;
      }
    }
  }
  
  #initFailed(results) {
    if (results.filter((res) => res.status === 'rejected').length === 0)
      return false;
    else {
      console.log('Failed to initialize MintCrateJS.');
      console.log(results);
      return true;
    }
  }
  
  #initDone() {
    console.log(this.#data);
    console.log('Loading Complete!');
    this.#displayLoadingScreen('Loading Complete!');
    this.#loadingQueue = null;
    
    if (this.#devMode) {
      this.changeRoom(this.#STARTING_ROOM);
      window.requestAnimationFrame(this.#gameLoop.bind(this));
    } else {
      // Wipe the screen after a moment
      setTimeout(() => {
        this.#clearCanvas();
        this.#renderFrame();
      }, 1000);
      
      // Pause for a further moment before starting the game
      setTimeout(
        () => {
          this.changeRoom(this.#STARTING_ROOM);
          window.requestAnimationFrame(this.#gameLoop.bind(this));
        },
        1500
      );
    }
  }
  
  // ---------------------------------------------------------------------------
  // Room management
  // ---------------------------------------------------------------------------
  
  changeRoom(room, options = {}) {
    options.fadeMusic    = options.fadeMusic    ?? false;
    options.persistAudio = options.persistAudio ?? false;
    
    // Only change room if we're not currently transitioning to another one.
    if (!this.#isChangingRooms) {
      // Indicate we're now changing rooms.
      this.#isChangingRooms = true;
      
      // Handle fade-out before changing room (if configured).
      if (
        this.#currentRoom &&
        this.#roomData.fadeOutConfig.enabled
      ) {
        // Trigger the fade-out effect, then change room when it's done.
        this.#triggerRoomFade('fadeOut', () => {
            this.#performRoomChange(room, options.persistAudio)
          },
          options.fadeMusic
        )
      // Otherwise, simply change room.
      } else {
        this.#performRoomChange(room, options.persistAudio)
      }
    }
  }
  
  #performRoomChange(room, persistAudio) {
    // Wipe current entity instances
    this.#instanceCollection = {};
    for (const key in this.#linearInstanceLists) {
      this.#linearInstanceLists[key].length = 0;
    }
    
    // Wipe draw-order tables
    for (const key in this.#drawOrders) {
      this.#drawOrders[key].length = 0;
    }
    
    // Stop all audio
    if (!persistAudio) {
      this.stopAllSounds();
      this.stopMusic();
    }
    
    // Reset camera
    this.#camera        = {x: 0, y: 0};
    this.#cameraBounds  = {x1: 0, x2: 0, y1: 0, y2: 0};
    this.#cameraIsBound = false;
    
    // Remove tilemap from scene
    this.#tilemapIsSet = false;
    this.#tilemapFullName = "";
    this.#tilemapName     = "";
    this.#layoutName      = "";
    
    // Mark delayed/repeated functions to be cleared out
    for (let i = 0; i < this.#queuedFunctions.length; i++) {
      this.#queuedFunctions[i].cancelled = true;
    }
    
    // Indicate we're done changing rooms
    this.#isChangingRooms = false;
    
    // Create new room
    let newRoom = new room();
    
    this.#roomData = {
      name            : newRoom.constructor.name,
      width           : this.#BASE_WIDTH,
      height          : this.#BASE_HEIGHT,
      backgroundColor : {r: 0, g: 0, b: 0},
      fadeInConfig    : {enabled: false},
      fadeOutConfig   : {enabled: false}
    };
    
    newRoom.load(this);
    
    // Store reference to new room, but only if it's the last in a queue.
    // This can happen if a room calls changeRoom() from its constructor.
    // It's to avoid issues when the functions bubble up from being nested.
    if (!this.#roomHasChanged) {
      this.#currentRoom = newRoom;
      this.#roomHasChanged = true;
      
      // Trigger fade in for fresh room (if configured)
      if (this.#roomData.fadeInConfig.enabled) {
        this.#triggerRoomFade('fadeIn');
      } else {
        this.#fadeLevel = 100;
      }
    }
  }
  
  #triggerRoomFade(fadeType, finishedCallback, fadeMusic) {
    
    // Cancel fade-in if it's in progress
    let fadeConfig = (fadeType === "fadeIn")
      ? this.#roomData.fadeInConfig
      : this.#roomData.fadeOutConfig;
    
    // Calculate rate of change for the fade overlay opacity
    this.#fadeValue = 100 / fadeConfig.fadeLength;
    
    // The lowest value for the fade out (used for delay effect)
    let fadeOutMinimumLevel = 0 - (fadeConfig.pauseLength * this.#fadeValue);
    
    // Only set the fade level if we're fading in
    if (fadeType === 'fadeIn') {
      this.#fadeLevel = fadeOutMinimumLevel;
    }
    
    // Store the fade color for when we render if
    this.#fadeColor = fadeConfig.fadeColor;
    
    // Set up function to handle the fade progression
    this.#fadeFunc = () => {
      this.#fadeLevel +=
        (fadeType === 'fadeIn') ? this.#fadeValue : -this.#fadeValue;
      
      if (
        (
          fadeType === 'fadeIn' &&
          this.#fadeLevel >= 100
        )
        ||
        (
          fadeType === 'fadeOut' &&
          this.#fadeLevel <= fadeOutMinimumLevel
        )
      ) {
        this.#fadeLevel = (fadeType === 'fadeIn') ? 100 : 0;
        
        this.clearFunction(this.#fadeFunc);
        
        if (finishedCallback) {
          finishedCallback();
        }
      }
    };
    
    // Run the function every frame
    this.repeatFunction(this.#fadeFunc, 1);
    
    // Fade out music (if specified)
    if (fadeMusic) {
      this.stopMusic(this.#fadeLevel / this.#fadeValue);
    }
  }
  
  getRoomWidth() {
    return this.#roomData.width;
  }
  
  getRoomHeight() {
    return this.#roomData.height;
  }
  
  setRoomDimensions(width, height) {
    // Set room dimensions
    this.#roomData.width = width;
    this.#roomData.height = height;
  }
  
  configureRoomFadeIn(fadeLength, pauseLength = 0, color = {r: 0, g: 0, b: 0}) {
    this.#roomData.fadeInConfig = {
      enabled    : true,
      fadeLength : fadeLength,
      pauseLength: pauseLength,
      fadeColor  : {r: color.r, g: color.g, b: color.b}
    };
  }
  
  configureRoomFadeOut(fadeLength, pauseLength = 0, color = {r: 0, g: 0, b: 0}) {
    this.#roomData.fadeOutConfig = {
      enabled    : true,
      fadeLength : fadeLength,
      pauseLength: pauseLength,
      fadeColor  : {r: color.r, g: color.g, b: color.b}
    };
  }
  
  setRoomBackgroundColor(r, g, b) {
    // Constrain color values
    r = MintMath.clamp(r, 0, 255);
    g = MintMath.clamp(g, 0, 255);
    b = MintMath.clamp(b, 0, 255);
    
    // Set background clear color
    this.#roomData.backgroundColor = {r: r, g: g, b: b};
  }
  
  // ---------------------------------------------------------------------------
  // Queued functions
  // ---------------------------------------------------------------------------
  
  delayFunction(callback, numFrames) {
    // Store function to be delay-fired by framework
    this.#queuedFunctions.push({
      callback        : callback,
      remainingFrames : numFrames
    });
  }
  
  repeatFunction(callback, numFrames, fireImmediately) {
    // Do an initial run of the function if specified
    if (fireImmediately) {
      callback();
    }
    
    // Store function to be repeat-fired by framework
    this.#queuedFunctions.push({
      callback        : callback,
      remainingFrames : numFrames,
      repeatValue     : numFrames
    });
  }
  
  clearFunction(callback) {
    // Find function and mark it to be cleared out
    let foundFunc = this.#queuedFunctions.find(f => f.callback === callback);
    if (foundFunc) {
      foundFunc.cancelled = true;
    }
  }
  
  // ---------------------------------------------------------------------------
  // Camera management
  // ---------------------------------------------------------------------------
  
  getCameraX() {
    return this.#camera.x;
  }
  
  getCameraY() {
    return this.camera.y;
  }
  
  setCameraX(x) {
    // Figure out camera bounds
    let x1;
    let x2;
    
    if (!this.#cameraIsBound) {
      x1 = 0;
      x2 = this.#roomData.width;
    } else {
      x1 = this.#cameraBounds.x1;
      x2 = this.#cameraBounds.x2;
    }
    
    // Bind camera
    let boundX = x;
    boundX     = Math.max(boundX, x1);
    boundX     = Math.min(boundX, x2 - this.#BASE_WIDTH);
    
    // Reposition camera
    this.#camera.x = boundX;
  }
  
  setCameraY(y) {
    // Figure out camera bounds
    let y1;
    let y2;
    
    if (!this.#cameraIsBound) {
      y1 = 0;
      y2 = this.#roomData.height;
    } else{
      y1 = this.#cameraBounds.y1;
      y2 = this.#cameraBounds.y2;
    }
    
    // Bind camera
    let boundY = y;
    boundY     = Math.max(boundY, y1);
    boundY     = Math.min(boundY, y2 - this.#BASE_HEIGHT);
    
    // Reposition camera
    this.#camera.y = boundY;
  }
  
  centerCameraX(x) {
    this.setCameraX(x - (this.#BASE_WIDTH / 2));
  }
  
  centerCameraY(y) {
    this.setCameraY(y - (this.#BASE_HEIGHT / 2));
  }
  
  moveCameraX(pixels) {
    this.setCameraX(this.#camera.x + pixels);
  }
  
  moveCameraY(pixels) {
    this.setCameraY(this.#camera.y + pixels);
  }
  
  bindCamera(x1, y1, x2, y2) {
    // Set bounds
    this.#cameraBounds = {
      x1 : x1,
      y1 : y1,
      x2 : x2,
      y2 : y2
    };
    
    // Indicate that the camera is currently bound
    this.#cameraIsBound = true;
  }
  
  unbindCamera() {
    // Unset bounds
    this.#cameraBounds = {
      x1 : 0,
      x2 : 0,
      y1 : 0,
      y2 : 0
    };
    
    // Indicate that the camera is currently unbound
    this.#cameraIsBound = false;
  }
  
  // ---------------------------------------------------------------------------
  // Managing tilemaps
  // ---------------------------------------------------------------------------
  
  setTilemap(tilemapLayoutName) {
    let nameParts = tilemapLayoutName.split('_');
    this.#tilemapIsSet = true;
    this.#tilemapName = nameParts[0];
    this.#layoutName = nameParts[1];
  }
  
  #getTilemapCollisionMasks() {
    return (
      this.#data
      .tilemaps[this.#tilemapName]
      .layouts[this.#layoutName]
      .collisionMasks
    );
  }
  
  // ---------------------------------------------------------------------------
  // Collision testing
  // ---------------------------------------------------------------------------
  
  testActiveCollision(activeA, activeB) {
    return this.#testCollision(activeA._getCollider(), activeB._getCollider());
  }
  
  testMapCollision(active, tileType) {
    // Test active against all tilemap collision masks
    let collisions = [];
    
    if (this.#tilemapIsSet) {
      // Get all collision masks
      let mapColliders = this.#getTilemapCollisionMasks()[tileType];
      
      for (const collider of mapColliders) {
        // See if active is intersecting with collision mask
        if (this.#testCollision(active._getCollider(), collider)) {
          // Store data regarding the collision
          collisions.push({
            leftEdgeX   : collider.x,
            rightEdgeX  : collider.x + collider.w,
            topEdgeY    : collider.y,
            bottomEdgeY : collider.y + collider.h
          });
        }
      }
    }
    
    // Return false if no collisions took place
    if (collisions.length === 0) {
      return false;
    
    // Otherwise, return collisions
    } else {
      return collisions;
    }
  }
  
  #testCollision(colliderA, colliderB) {
    // Don't test for collision if one or more colliders haven't been defined
    if (
         colliderA.s === Active.COLLIDER_SHAPES.NONE
      || colliderB.s === Active.COLLIDER_SHAPES.NONE
    ) {
      return false;
    }
    
    // Prepare data for checking collisions
    let collision = false;
    
    // Collision test: both colliders are rectangles
    if (
         colliderA.s === Active.COLLIDER_SHAPES.RECTANGLE
      && colliderB.s === Active.COLLIDER_SHAPES.RECTANGLE
    ) {
      if (
        colliderA.x < (colliderB.x + colliderB.w)
        && (colliderA.x + colliderA.w) > colliderB.x
        && colliderA.y < (colliderB.y + colliderB.h)
        && (colliderA.y + colliderA.h) > colliderB.y
      ) {
        collision = true;
      }
    
    // Collision test: both colliders are circles
    } else if (
         colliderA.s === Active.COLLIDER_SHAPES.CIRCLE
      && colliderB.s === Active.COLLIDER_SHAPES.CIRCLE
    ) {
      let dx  = colliderA.x - colliderB.x;
      let dy  = colliderA.y - colliderB.y;
      collision = (Math.sqrt(dx * dx + dy * dy) < (colliderA.r + colliderB.r));
    
    // Collision test: one collider is a rectangle and the other is a circle
    } else {
      // Make things consistent: collider A should always be rectangular, and
      // collider B should always be circular, so flip them around if necessary
      if (colliderA.s == Active.COLLIDER_SHAPES.CIRCLE) {
        [colliderA, colliderB] = [colliderB, colliderA];
      }
      
      // Prepare to test for intersection
      let rect   = colliderA;
      let circle = colliderB;
      
      let testX = circle.x;
      let testY = circle.y;
      
      // Find closest edge
      if (circle.x < rect.x) {
        testX = rect.x;
      } else if (circle.x > (rect.x + rect.w)) {
        testX = rect.x + rect.w;
      }
      
      if (circle.y < rect.y) {
        testY = rect.y;
      } else if (circle.y > (rect.y + rect.h)) {
        testY = rect.y + rect.h;
      }
      
      // Calculate distances based on closest edges
      let distX    = circle.x - testX;
      let distY    = circle.y - testY;
      let distance = Math.sqrt((distX * distX) + (distY * distY));
      
      // Check for collision
      collision = (distance <= circle.r);
    }
    
    // If a collision occurred, mark flag in both colliders
    if (collision) {
      colliderA.collision = true;
      colliderB.collision = true;
    }
    
    // Return result of collision test
    return collision;
  }
  
  mouseOverActive(active) {
    // Prepare to perform check
    let collider = active._getCollider();
    let mouseX   = this.#mousePositions.globalX;
    let mouseY   = this.#mousePositions.globalY;
    let over     = false;
    
    // Don't test for collision if collider hasn't been defined
    if (collider.s === Active.COLLIDER_SHAPES.NONE) {
      return false;
    }
    
    // Hover check: collider is a rectangle
    if (collider.s === Active.COLLIDER_SHAPES.RECTANGLE) {
      over = (
           mouseX >= collider.x
        && mouseY >= collider.y
        && mouseX < (collider.x + collider.w)
        && mouseY < (collider.y + collider.h)
      );
    
    // Hover check: collider is a circle
    } else {
      let dx = mouseX - collider.x;
      let dy = mouseY - collider.y;
      let d  = Math.sqrt((dx * dx) + (dy * dy));
      over   = (d <= collider.r);
    }
    
    // If mouse is hovering over active, then mark flag in collider
    collider.mouseOver = over;
    
    // Return result of hover test
    return over;
  }
  
  // ---------------------------------------------------------------------------
  // Mouse input
  // ---------------------------------------------------------------------------
  
  getMouseX() {
    return this.#mousePositions.globalX;
  }
  
  getMouseY() {
    return this.#mousePositions.globalY;
  }
  
  getWindowMouseX() {
    return this.#mousePositions.localX;
  }
  
  getWindowMouseY() {
    return this.#mousePositions.localY;
  }
  
  mousePressed(mouseButton) {
    return this.#mouseButtons[mouseButton].pressed;
  }
  
  mouseReleased(mouseButton) {
    return this.#mouseButtons[mouseButton].released;
  }
  
  mouseHeld(mouseButton) {
    return this.#mouseButtons[mouseButton].held;
  }
  
  #mouseButtonHandler(e) {
    this.#mouseStates[e.button] = (e.type === 'mousedown');
  }
  
  #mouseMoveHandler(e) {
    let rect = this.#frontCanvas.getBoundingClientRect();
    let x    = e.clientX - rect.left;
    let y    = e.clientY - rect.top;
    
    this.#mousePositions.localX = Math.floor(x / this.#SCREEN_SCALE);
    this.#mousePositions.localY = Math.floor(y / this.#SCREEN_SCALE);
  }
  
  //----------------------------------------------------------------------------
  // Keyboard input
  //----------------------------------------------------------------------------
  
  #keyHandler(e) {
    // TODO: Make it so you can't use shift/ctrl/alt or the F keys
    if (
      (!this.#gameHasFocus() && !this.#devMode)
      || (e.ctrlKey && e.key.toLowerCase() === 'r')
      || e.key === 'F12'
      || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i')
    ) {
      return;
    }
    
    e.preventDefault();
    
    if (event.repeat) {
      return;
    }
    
    // Create new entry in keystate list if key hasn't been pressed previously
    if (!this.#keyStates[e.code]) {
      this.#keyStates[e.code] = {pressed: false, released: false, held: false};
    }
    
    if (event.type === 'keydown') {
      // Indicate that key was just pressed and is being held
      this.#keyStates[e.code].pressed = true;
      this.#keyStates[e.code].held    = true;
    } else {
      // Indicate that key was just released and is not being held
      this.#keyStates[e.code].released = true;
      this.#keyStates[e.code].held     = false;
    }
  }
  
  addInputHandler() {
    this.#inputHandlers.push(new InputHandler());
  }
  
  // ---------------------------------------------------------------------------
  // Audio
  // ---------------------------------------------------------------------------
  
  // TODO: Change Music -> BGM and Sound -> SFX?
  // playBgm(), playSfx, setBgmVolume, etc.
  
  playSound(soundName, options = {}) {
    // Default params
    options.volume = options.volume ?? 1;
    options.pitch = options.pitch ?? 1;
    
    // Get sound data
    let sound = this.#data.sounds[soundName];
    
    // Store volume & pitch in case we need to system halt/resume audio
    sound.lastVolume = options.volume;
    sound.lastPitch  = options.pitch;
    
    // Play sound
    sound.source.play(options.volume * this.#masterVolume.sfx, options.pitch, {enabled: false});
  }
  
  stopAllSounds() {
    // Stop all playing sounds
    for (const soundName in this.#data.sounds) {
      let sound = this.#data.sounds[soundName];
      sound.source.stop();
    }
  }
  
  // https://github.com/WebAudio/web-audio-api-v2/issues/105
  playMusic(trackName, fadeLength = 0) {
    /*
      01. No track is playing at all
        -> Play the new track
      02. Another track is currently playing
        -> Stop the other track (w/ fade)
        -> Play the new track
      03. The track-to-be-played is already playing
        -> Stop the current track (no fade)
        -> Play the new track
      04. The track-to-be-played was playing and is currently paused
        -> Stop the current track (no fade)
        -> Play the new track
    */
    
    // State 01
    if (!this.#musicTrackIsLoaded()) {
      this.#startMusicPlayback(trackName, fadeLength);
    
    // State 02
    } else if (this.#currentMusicTrackName !== trackName) {
      this.#stopMusicPlayback(this.#currentMusicTrackName, fadeLength);
      this.#startMusicPlayback(trackName, fadeLength);
    
    // State 03 & State 04
    } else {
      this.#stopMusicPlayback(this.#currentMusicTrackName, 0);
      this.#startMusicPlayback(trackName, fadeLength);
    }
    
    // Store the music track name
    this.#currentMusicTrackName = trackName;
  }
  
  stopMusic(fadeLength = 0) {
    if (this.#musicTrackIsLoaded()) {
      let track = this.#data.music[this.#currentMusicTrackName];
      
      if (
        track.state !== this.#MUSIC_STATES.STOPPING
        && track.state !== this.#MUSIC_STATES.STOPPED
      ) {
        this.#stopMusicPlayback(this.#currentMusicTrackName, fadeLength);
        
      } else if (
        track.state === this.#MUSIC_STATES.STOPPING
        && fadeLength === 0
      ) {
        this.#stopMusicPlayback(this.#currentMusicTrackName, fadeLength);
        this.#currentMusicTrackName = "";
      }
    }
  }
  
  pauseMusic(fadeLength = 0) {
    if (this.#musicTrackIsLoaded()) {
      let track = this.#data.music[this.#currentMusicTrackName];
      
      if (
        track.state === this.#MUSIC_STATES.PLAYING
        ||
        (
          track.state === this.#MUSIC_STATES.PAUSING
          && fadeLength === 0
        )
      ) {
        this.#stopMusicPlayback(this.#currentMusicTrackName, fadeLength, true);
      }
    }
  }
  
  resumeMusic(fadeLength = 0) {
    if (this.#musicTrackIsLoaded()) {
      let track = this.#data.music[this.#currentMusicTrackName];
      
      if (
        track.state === this.#MUSIC_STATES.PAUSING
        || track.state === this.#MUSIC_STATES.PAUSED
      ) {
        this.#startMusicPlayback(this.#currentMusicTrackName, fadeLength, true);
      }
    }
  }
  
  #startMusicPlayback(trackName, fadeLength, isResuming) {
    let affectingFadeValue = (fadeLength > 0) ? (1 / fadeLength) : 0;
    
    let track = this.#data.music[trackName];
    
    if (fadeLength === 0) {
      track.fade.remainingFrames = 0;
      track.relativeVolume = 1;
      
      if (isResuming) {
        track.source.resume(track.relativeVolume * this.#masterVolume.bgm, this.#masterBgmPitch, track.loop);
        track.source.setVolume(track.relativeVolume * this.#masterVolume.bgm);
      } else {
        track.source.play(track.relativeVolume * this.#masterVolume.bgm, this.#masterBgmPitch, track.loop);
      }
    } else {
      if (!isResuming) {
        track.relativeVolume = 0;
      }
      track.fade.type            = this.#MUSIC_FADE_TYPES.IN;
      track.fade.remainingFrames = fadeLength;
      track.fade.affectingValue  = affectingFadeValue;
      
      if (isResuming) {
        track.source.resume(0, this.#masterBgmPitch, track.loop);
      } else {
        track.source.play(0, this.#masterBgmPitch, track.loop);
      }
    }
    
    track.state = this.#MUSIC_STATES.PLAYING;
  }
  
  #stopMusicPlayback(trackName, fadeLength, isPausing) {
    let affectingFadeValue = (fadeLength > 0) ? (1 / fadeLength) : 0;
    
    let track = this.#data.music[this.#currentMusicTrackName];
    
    if (fadeLength === 0) {
      track.fade.remainingFrames = 0;
      track.relativeVolume = 0;
      
      if (isPausing) {
        track.state = this.#MUSIC_STATES.PAUSED;
        track.source.pause();
      } else {
        track.state = this.#MUSIC_STATES.STOPPED;
        track.source.stop();
      }
    } else {
      track.fade.type            = this.#MUSIC_FADE_TYPES.OUT;
      track.fade.remainingFrames = fadeLength;
      track.fade.affectingValue  = affectingFadeValue;
      
      track.state = (isPausing)
        ? this.#MUSIC_STATES.PAUSING
        : this.#MUSIC_STATES.STOPPING;
    }
  }
  
  setMusicVolume(newVolume) {
    // Constrain volume value
    newVolume = MintMath.clamp(newVolume, 0, 1);
    
    // Set all music track source volumes
    for (const trackName in this.#data.music) {
      let track = this.#data.music[trackName];
      track.source.setVolume(newVolume);
    }
    
    // Store volume value
    this.#masterVolume.bgm = newVolume;
  }
  
  adjustMusicVolume(newVolume) {
    this.setMusicVolume(this.#masterVolume.bgm + newVolume);
  }
  
  setMusicPitch(newPitch) {
    // Constrain pitch value
    // TODO: Check these values
    newPitch = MintMath.clamp(newPitch, 0.1, 30);
    
    // Set music track source pitches
    for (const trackName in this.#data.music) {
      let track = this.#data.music[trackName];
      track.source.setPitch(newPitch);
    }
    
    // Store pitch value
    this.#masterBgmPitch = newPitch;
  }
  
  adjustMusicPitch(newPitch) {
    this.setMusicPitch(this.#masterBgmPitch + newPitch);
  }
  
  #musicIsPaused() {
    let isPaused = false;
    
    if (this.#musicTrackIsLoaded()) {
      isPaused = this.#data.music[this.#currentMusicTrackName].source.isPaused();
    }
    
    return isPaused;
  }
  
  #musicTrackIsLoaded() {
    return (this.#currentMusicTrackName !== "");
  }
  
  // ---------------------------------------------------------------------------
  // Debugging
  // ---------------------------------------------------------------------------
  
  setFpsVisibility(enabled) {
    this.#showFps = enabled;
  }
  
  setRoomInfoVisibility(enabled) {
    this.#showRoomInfo = enabled;
  }
  
  setCameraInfoVisibility(enabled) {
    this.#showCameraInfo = enabled;
  }
  
  setTilemapCollisionMaskVisibility(enabled) {
    this.#showTilemapCollisionMasks = enabled;
  }
  
  setTilemapBehaviorValueVisibility(enabled) {
    this.#showTilemapBehaviorValues = enabled;
  }
  
  setActiveCollisionMaskVisibility(enabled) {
    this.#showActiveCollisionMasks = enabled;
  }
  
  setActiveInfoVisibility(enabled) {
    this.#showActiveInfo = enabled;
  }
  
  setOriginPointVisibility(enabled) {
    this.#showActiveOriginPoints = enabled;
  }
  
  setActionPointVisibility(enabled) {
    this.#showActiveActionPoints = enabled
  }
  
  setAllDebugOverlayVisibility(enabled) {
    
  }
  
  // ---------------------------------------------------------------------------
  // Runtime
  // ---------------------------------------------------------------------------
  
  #onPageFocusLost() {
    this.#pageHasFocus = !document.hidden;
    
    if (!this.#pageHasFocus && typeof this.#audioContext !== 'undefined') {
      this.#audioContext.suspend();
    } else if (this.#gameHasFocus()) {
      this.#audioContext.resume();
    }
  }
  
  #gameHasFocus() {
    let hasFocus = true;
    if (
      !this.#pageHasFocus
      || document.activeElement !== this.#frontCanvas
    ) {
      hasFocus = false;
    }
    
    return hasFocus;
  }
  
  #gameLoop(fpsTimeNow) {
    requestAnimationFrame(this.#gameLoop.bind(this));
    
    this.#update(fpsTimeNow);
    this.#draw();
  }
  
  #update(fpsTimeNow) {
    // Throttle FPS
    const delta = fpsTimeNow - this.#fpsTimeLast;
    
    if (delta <= this.#frameInterval)
      return;
    
    this.#fpsTimeLast = fpsTimeNow - (delta % this.#frameInterval);
    
    // Calculate FPS
    this.#frameCounter++;
    if (fpsTimeNow >= (this.#fpsFrameLast + 1000)) {
      this.#currentFps = this.#frameCounter;
      this.#frameCounter = 0;
      this.#fpsFrameLast = fpsTimeNow;
    }
    
    // Halt further update processing if game has lost focus
    if (!this.#gameHasFocus()) {
      this.#audioContext.suspend();
      return;
    }
    else {
      this.#audioContext.resume();
    }
    
    // Update inputs
    for (const inputHandler of this.#inputHandlers) {
      inputHandler._update(this.#keyStates);
    }
    
    // Update global mouse positions
    this.#mousePositions.globalX = this.#mousePositions.localX + this.#camera.x;
    this.#mousePositions.globalY = this.#mousePositions.localY + this.#camera.y;
    
    // Update mouse buttons states
    for (const btnNumber in this.#mouseButtons) {
      let btn = this.#mouseButtons[btnNumber];
      
      // Reset states
      btn.pressed = false;
      btn.released = false;
      
      // Get raw mouse state
      let down = false;
      if (this.#mouseStates[btnNumber]) { down = true; }
      
      // Handle setting held/pressed/released states
      if (down) {
        if (!btn.held) {
          btn.pressed = true;
        }
        
        btn.held = true;
      } else {
        if (btn.held) {
          btn.released = true;
        }
        
        btn.held = false;
      }
    }
    
    // Clear out loaded music track name if it's come to its natural end
    if (
      this.#musicTrackIsLoaded()
      && this.#data.music[this.#currentMusicTrackName].source.hasEnded()
    ) {
      let track = this.#data.music[this.#currentMusicTrackName];
      track.state = this.#MUSIC_STATES.STOPPED;
      this.#currentMusicTrackName = "";
    }
    
    // Reset collision states for actives
    for (const active of this.#linearInstanceLists.actives) {
      active._getCollider().collision = false;
      active._getCollider().mouseOver = false;
    }
    
    // Reset collision states for tilemap masks
    if (this.#tilemapIsSet) {
      for (const maskCollection of Object.values(this.#getTilemapCollisionMasks())) {
        for (const mask of maskCollection) {
          mask.collision = false;
        }
      }
    }
    
    // Handle music and fading
    for (const trackName in this.#data.music) {
      let track = this.#data.music[trackName];
      
      // Handle music fades
      if (track.fade.remainingFrames > 0) {
        // Tick fade counter
        track.fade.remainingFrames--;
        
        // Handle fade-ins
        if (track.fade.type === this.#MUSIC_FADE_TYPES.IN) {
          // Calculate new volume
          if (track.fade.remainingFrames > 0) {
            track.relativeVolume += track.fade.affectingValue;
            track.relativeVolume  = Math.min(1, track.relativeVolume);
          } else {
            track.relativeVolume = 1;
          }
          
          // End fade timer early if the fade finished
          if (track.relativeVolume === 1) {
            track.fade.remainingFrames = 0;
          }
          
          // Set volume
          track.source.setVolume(track.relativeVolume * this.#masterVolume.bgm);
          
        // Handle fade-outs
        } else if (track.fade.type === this.#MUSIC_FADE_TYPES.OUT) {
          // Calculate and set new volume
          if (track.fade.remainingFrames > 0) {
            track.relativeVolume -= track.fade.affectingValue;
            track.relativeVolume  = Math.max(0, track.relativeVolume);
            track.source.setVolume(track.relativeVolume * this.#masterVolume.bgm);
          } else {
            track.relativeVolume = 0;
          }
          
          // Finish fade if track's relative volume has reached zero
          if (track.relativeVolume === 0) {
            // End fade timer early if the fade finished
            track.fade.remainingFrames = 0;
            
            // Pause/stop the sound source if fade is done
            if (track.state === this.#MUSIC_STATES.PAUSING) {
              track.source.pause();
              track.state = this.#MUSIC_STATES.PAUSED;
            } else if (track.state === this.#MUSIC_STATES.STOPPING) {
              track.source.stop();
              track.state = this.#MUSIC_STATES.STOPPED;
            }
          }
        }
      }
    }
    
    // Handle delayed/repeated functions
    for (let i = this.#queuedFunctions.length - 1; i >= 0; i--) {
      let func = this.#queuedFunctions[i];
      
      // Tick function's wait timer
      func.remainingFrames = func.remainingFrames - 1;
      
      // Remove function if it's been cancelled
      if (func.cancelled) {
        this.#queuedFunctions.splice(i, 1);
      // Or, fire it if its timer has run out
      } else if (func.remainingFrames <= 0) {
        // Run the function
        func.callback();
        
        // If function is set to repeat, then reset its timer
        if (func.repeatValue) {
          func.remainingFrames = func.repeatValue;
        // Otherwise, remove it
        } else {
          this.#queuedFunctions.splice(i, 1);
        }
      }
    }
    
    // Run room update code
    this.#roomHasChanged = false;
    if (this.#currentRoom && this.#currentRoom.update) {
      this.#currentRoom.update();
    }
    
    // Process animations for active objects
    for (const active of this.#linearInstanceLists.actives) {
      // Get active's animation data
      let animation =
        this.#data.actives[active.getName()]
        .animations[active.getAnimationName()];
      
      if (animation) {
        active._animate(animation);
      }
    }
  }
  
  //----------------------------------------------------------------------------
  // Graphics rendering
  //----------------------------------------------------------------------------
  
  #clearCanvas() {
    if (this.#currentRoom) {
      let rgb = this.#roomData.backgroundColor;
      this.#backContext.fillStyle = MintUtil.rgbToString(rgb.r, rgb.g, rgb.b);
    } else {
      this.#backContext.fillStyle = 'black';
    }
    
    this.#backContext.fillRect(0, 0, this.#BASE_WIDTH, this.#BASE_HEIGHT);
  }
  
  #renderFrame() {
    this.#frontContext.drawImage(
      this.#backCanvas,                       // Image
      0,                                      // sx
      0,                                      // sy
      this.#BASE_WIDTH,                       // sWidth
      this.#BASE_HEIGHT,                      // sHeight
      0,                                      // dx
      0,                                      // dy
      this.#BASE_WIDTH  * this.#SCREEN_SCALE, // dWidth
      this.#BASE_HEIGHT * this.#SCREEN_SCALE  // dHeight
    );
  }
  
  #draw() {
    // Prepare canvas for rendering frame
    this.#clearCanvas();
    
    // Draw background layer entities
    this.#drawEntities('background');
    
    // Draw tilemap
    if (this.#tilemapIsSet) {
      let tilemap = this.#data.tilemaps[this.#tilemapName];
      let layout  = tilemap.layouts[this.#layoutName];
      
      // Iterate through tilemap layout, drawing tiles
      for (let row = 0; row < layout.tiles.length; row++) {
        for (let col = 0; col < layout.tiles[row].length; col++) {
          // Get tile graphic index
          let tileNumber = layout.tiles[row][col];
          
          // Only draw if it's not 0 (not empty)
          if (tileNumber > 0) {
            let clippingRect = tilemap.clippingRects[tileNumber-1];
            
            this.#backContext.drawImage(
              tilemap.img,
              clippingRect.x,
              clippingRect.y,
              tilemap.tileWidth,
              tilemap.tileHeight,
              (col * tilemap.tileWidth)  - this.#camera.x,
              (row * tilemap.tileHeight) - this.#camera.y,
              tilemap.tileWidth,
              tilemap.tileHeight
            );
          }
        }
      }
    }
    
    // Draw foreground layer entities
    this.#drawEntities('foreground');
    
    // Reset alpha rendering value
    this.#backContext.globalAlpha = 1.0;
    
    // Draw Text
    
    // Draw fade in/out effect
    if (this.#fadeLevel < 100) {
      // Set color of fade
      this.#backContext.fillStyle = MintUtil.rgbToString(
        this.#fadeColor.r,
        this.#fadeColor.g,
        this.#fadeColor.b,
        1 - (this.#fadeLevel / 100)
      );
      
      // Render fade
      this.#backContext.fillRect(
        this.#camera.x,
        this.#camera.y,
        this.#BASE_WIDTH,
        this.#BASE_HEIGHT
      );
    }
    
    // Draw debug graphics for tilemap
    if (
      (
        this.#showTilemapCollisionMasks
        || this.#showTilemapBehaviorValues
      )
      && this.#tilemapIsSet
    ) {
      // Set border color
      this.#backContext.strokeStyle = 'rgb(0 0 255 / 50%)';
      
      let tilemapCollisionMasks = this.#getTilemapCollisionMasks();
      
      for (const tileType in tilemapCollisionMasks) {
        let maskList = tilemapCollisionMasks[tileType];
        
        for (const mask of maskList) {
          // Draw collision masks
          if (this.#showTilemapCollisionMasks) {
            // Set fill color
            this.#backContext.fillStyle = (mask.collision)
              ? 'rgb(0 255 0 / 50%)'
              : 'rgb(255 0 0 / 50%)';
            
            this.#backContext.fillRect(
              mask.x+0.5 - this.#camera.x,
              mask.y+0.5 - this.#camera.y,
              mask.w-1,
              mask.h-1
            );
            
            this.#backContext.strokeRect(
              mask.x+0.5 - this.#camera.x,
              mask.y+0.5 - this.#camera.y,
              mask.w-1,
              mask.h-1
            );
          }
          
          // Draw collision mask behavior numbers
          if (this.#showTilemapBehaviorValues) {
            this.#drawText(
              [tileType],
              this.#data.fonts['system_counter'],
              mask.x + 2 - this.#camera.x,
              mask.y + 2 - this.#camera.y
              // 3, 0, false
            );
          }
        }
      }
    }
    
    // Draw debug graphics for Actives
    if (
      this.#showActiveCollisionMasks
      || this.#showActiveInfo
      || this.#showActiveOriginPoints
      || this.#showActiveActionPoints
    ) {
      for (const active of this.#linearInstanceLists.actives) {
        // Retrieve collider data
        let collider = active._getCollider();
        
        // Draw collision masks
        if (
          this.#showActiveCollisionMasks
          && collider.shape !== Active.COLLIDER_SHAPES.NONE
        ) {
          // Set draw color based on type of collision taking place, if any
          // Active is colliding with another object, and mouse is over it
          if (collider.collision && collider.mouseOver) {
            this.#backContext.fillStyle = 'rgb(0 0 255 / 50%)';
          // Active is colliding with another object
          } else if (collider.collision) {
            this.#backContext.fillStyle = 'rgb(0 255 0 / 50%)';
          // Mouse is over the active
          } else if (collider.mouseOver) {
            this.#backContext.fillStyle = 'rgb(0 255 255 / 50%)';
          // Active is not colliding with another object, nor is mouse over it
          } else {
            this.#backContext.fillStyle = 'rgb(255 255 0 / 50%)';
          }
          
          // Draw rectangular collision mask
          if (collider.s === Active.COLLIDER_SHAPES.RECTANGLE) {
            // Draw mask
            this.#backContext.fillRect(
              collider.x + 0.5 - this.#camera.x,
              collider.y + 0.5 - this.#camera.y,
              collider.w - 1,
              collider.h - 1
            );
            
            // Draw border
            this.#backContext.strokeRect(
              collider.x + 0.5 - this.#camera.x,
              collider.y + 0.5 - this.#camera.y,
              collider.w - 1,
              collider.h - 1
            );
          
          // Otherwise, draw circular collision mask
          } else {
            // Set up ellipse path
            this.#backContext.beginPath();
            this.#backContext.arc(
              collider.x - this.#camera.x,
              collider.y - this.#camera.y,
              collider.r,
              0,
              2 * Math.PI
            );
            
            // Draw mask
            this.#backContext.fill();
            
            // Draw border
            this.#backContext.stroke();
          }
        }
        
        // Draw action points
        if (this.#showActiveActionPoints) {
          // Get action point system image
          let img = this.#systemImages['point_action'];
          
          // Draw action point
          this.#backContext.drawImage(
            img,
            active.getActionPointX() - Math.floor(img.width/2) - this.#camera.x,
            active.getActionPointY() - Math.floor(img.height/2) - this.#camera.y
          );
        }
        
        // Draw origin points
        if (this.#showActiveOriginPoints) {
          let img = this.#systemImages['point_origin'];
          this.#backContext.drawImage(
            img,
            active.getX() - Math.floor(img.width/2) - this.#camera.x,
            active.getY() - Math.floor(img.height/2) - this.#camera.y
          );
        }
        
        // Draw X,Y position values & animation name
        if (this.#showActiveInfo) {
          // Get font
          let font = this.#data.fonts['system_counter'];
          
          // Get zero-padding size
          let pad = Math.max(
            this.getRoomWidth().toString().length,
            this.getRoomHeight().toString().length
          );
          
          // Get x and y coordinates
          let strX = MintMath.roundPrecise(active.getX(), 2).toString();
          let strY = MintMath.roundPrecise(active.getY(), 2).toString();
          
          // Split coordinates, and pad with zeroes for consistency
          let xParts = strX.toString().split('.');
          let yParts = strY.toString().split('.');
          if (xParts.length === 1) { xParts[1] = ""; }
          if (yParts.length === 1) { yParts[1] = ""; }
          
          strX = xParts[0].padStart(pad, " ") + "." + xParts[1].padEnd(2, "0");
          strY = yParts[0].padStart(pad, " ") + "." + yParts[1].padEnd(2, "0");
          
          strX = "X:" + strX;
          strY = "Y:" + strY;
          
          // Push into array representing text lines
          let numBlankLines = 1;
          let lines = Array(numBlankLines).fill(1);
          lines.push(strX);
          lines.push(strY);
          lines.push(active.getAnimationName());
          
          // Constrain text from going off the screen
          let x = active.getX();
          let y = active.getY();
          
          let halfWidth  = strX.length * font.charWidth  / 2;
          let height = lines.length * font.charHeight;
          
          let screenLeftEdge = this.#camera.x;
          let screenTopEdge  = this.#camera.y
          let screenRightEdge = this.#camera.x + this.#BASE_WIDTH;
          let screenBottomEdge = this.#camera.y + this.#BASE_HEIGHT
          
          // Constrain text - Horizontal edges
          x = Math.max(x, screenLeftEdge + halfWidth);
          x = Math.min(x, screenRightEdge - halfWidth);
          
          // Constrain text - Vertical edges
          y = Math.max(y, screenTopEdge - (numBlankLines * font.charHeight));
          y = Math.min(y, screenBottomEdge - height);
          
          // Draw text
          this.#drawText(
            lines,
            font,
            x - this.#camera.x,
            y - this.#camera.y,
            0,
            "center"
          );
        }
      }
    }
    
    // Draw FPS debug overlay
    this.#drawText(
      [this.#currentFps.toString()],
      this.#data.fonts['system_counter'],
      0,
      0
    );
    
    // Draw debug info for current room
    if (this.#showRoomInfo) {
      this.#drawText(
        [
          this.#roomData.name,
          this.#roomData.width +
            " x " +
            this.#roomData.height,
          "ACTS: " + this.#linearInstanceLists.actives.length,
          "BAKS: " + this.#linearInstanceLists.backdrops.length,
          "TEXT: " + this.#linearInstanceLists.paragraphs.length
        ],
        this.#data.fonts['system_counter'],
        0,
        this.#BASE_HEIGHT - (5 * this.#data.fonts['system_counter'].charHeight)
      );
    }
    
    // Draw overlay if game has lost focus
    if (!this.#gameHasFocus()) {
      this.#backContext.fillStyle = 'rgb(0 0 0 / 50%)';
      this.#backContext.fillRect(0, 0, this.#BASE_WIDTH, this.#BASE_HEIGHT);
      let font = this.#data.fonts['system_dialog'];
      this.#drawText(
        [
          'MINTCRATE',
          'Paused',
          'Please click the screen to resume playing'
        ],
        font,
        (this.#BASE_WIDTH  / 2),
        (this.#BASE_HEIGHT / 2) - (font.charHeight * 2),
        font.charHeight,
        'center'
      );
    }
    
    // Copy offscreen canvas to visible canvas
    this.#renderFrame();
  }
  
  #drawEntities(layerName) {
    for (const entity of this.#drawOrders[layerName]) {
      // Skip drawing entity if it's not visible
      if (!entity.isVisible() || entity.getOpacity() === 0) {
        continue;
      }
      
      let entityType = entity.getEntityType();
      
      // Set alpha rendering value
      this.#backContext.globalAlpha = entity.getOpacity();
      
      // Draw actives
      if (entityType === "active") {
        // Get active's animation data
        let animation =
          this.#data.actives[entity.getName()]
          .animations[entity.getAnimationName()];
        
        // If active doesn't have any animation graphics, then skip drawing it
        if (!animation) {
          continue;
        }
        
        // Get graphics-mirroring states
        let flippedX = (!entity.isFlippedHorizontally()) ? 1 : -1;
        let flippedY = (!entity.isFlippedVertically())   ? 1 : -1;
        
        this.#backContext.scale(flippedX, flippedY);
        
        // Move canvas origin to sprite's origin (transform) point
        this.#backContext.translate(
          (entity.getX() - this.#camera.x) * flippedX,
          (entity.getY() - this.#camera.y) * flippedY
        );
        
        // Rotate
        let angle = entity.getAngle();
        if (angle !== 0) {
          this.#backContext.rotate(MintMath.rad(entity.getAngle()) * flippedX * flippedY);
        }
        
        // Scale
        if (entity.getScaleX() !== 1 || entity.getScaleY() !== 1) {
          this.#backContext.scale(entity.getScaleX(), entity.getScaleY());
        }
        
        // Reposition canvas origin to original position.
        // We don't use the flipped state here, as we need to subtract even when
        // the sprite's been offset as a result of a -1 scale transformation.
        this.#backContext.translate(
          -(entity.getX() - this.#camera.x),
          -(entity.getY() - this.#camera.y)
        );
        
        // Account for 1-pixel offset if graphic is flipped
        let flipOffsetX = entity.isFlippedHorizontally() ? 1 : 0;
        let flipOffsetY = entity.isFlippedVertically()   ? 1 : 0;
        
        // Draw active
        this.#backContext.drawImage(animation.img,
          // Source X/Y
          animation.frameWidth * (entity.getAnimationFrameNumber() - 1),
          0,
          // Source width/height
          animation.frameWidth,
          animation.frameHeight,
          // Destination X/Y
          entity.getX() + animation.offsetX - flipOffsetX - this.#camera.x,
          entity.getY() + animation.offsetY - flipOffsetY - this.#camera.y,
          // Destination width/height
          animation.frameWidth,
          animation.frameHeight
        );
        
        // Restore transformation matrix
        this.#backContext.setTransform(1, 0, 0, 1, 0, 0);
        
      // Draw backdrops
      } else if (entityType === "backdrop") {
        // Get backdrop image and rendering properties
        let data = this.#data.backdrops[entity.getName()];
        let img = data.img;
        let isMosaic = data.mosaic;
        let isNinePatch = data.ninePatch;
        
        // Draw backdrop image
        if (!isMosaic && !isNinePatch) {
          this.#backContext.drawImage(
            img,
            entity.getX() - this.#camera.x,
            entity.getY() - this.#camera.y,
            entity.getWidth(),
            entity.getHeight()
          );
        } else if (isMosaic) {
          this.#backContext.fillStyle = this.#data.backdrops[entity.getName() + '_mosaic'];
          this.#backContext.translate(entity.getX() - this.#camera.x, entity.getY() - this.#camera.y);
          this.#backContext.fillRect(0, 0, 300, 300);
          this.#backContext.setTransform(1, 0, 0, 1, 0, 0);
        } else if (isNinePatch) {
          // TODO: This
        }
      
      // Draw paragraphs
      } else if (entityType === "paragraph") {
        // Draw text
        this.#drawText(
          entity.getTextLines(),
          this.#data.fonts[entity.getName()],
          entity.getX() - this.#camera.x,
          entity.getY() - this.#camera.y,
          entity.getLineSpacing(),
          entity.getAlignment()
        );
      }
    }
  }
  
  #drawText(
    textLines,
    font,
    x,
    y,
    lineSpacing = 0,
    alignment = "left"
  ) {
    // Draw lines of text, character-by-character
    for (let lineNum = 0; lineNum < textLines.length; lineNum++) {
      // Get line text
      const line = textLines[lineNum];
      
      // Figure out base offset based on text alignment
      let xOffset = 0
      
      if (alignment === "right") {
        xOffset = line.length * font.charWidth
      } else if (alignment === "center") {
        xOffset = Math.floor(line.length * font.charWidth / 2)
      }
      
      // Draw characters
      for (let charNum = 0; charNum < line.length; charNum++) {
        // Get ASCII character
        const character = line.charAt(charNum);
        
        // Get linear position of tile based on ASCII key code.
        // Our map starts at the // whitespace character, which is 32.
        // Look up an ASCII map for details.
        const asciiCode = line.charCodeAt(charNum) - 32;
        
        // Determine character tile position in bitmap font image
        const charTile = {
          row: Math.floor((asciiCode / 32)),
          col: asciiCode % 32
        };
        
        // Draw character
        this.#backContext.drawImage(
          font.img,                                                  // image
          charTile.col * font.charWidth,                             // sx
          charTile.row * font.charHeight,                            // sy
          font.charWidth,                                            // sWidth
          font.charHeight,                                           // sHeight
          x + (font.charWidth * charNum) - xOffset,                  // dx
          y + (font.charHeight * lineNum) + (lineSpacing * lineNum), // dy
          font.charWidth,                                            // dWidth
          font.charHeight                                            // dHeight
        );
      }
    }
  }
}