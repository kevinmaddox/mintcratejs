'use strict';

import { SYSTEM_MEDIA_B64 } from "./img/b64.js";

export class MintCrate {
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
  
  #quickBoot;
  #showFps;
  #showRoomInfo;
  #showActiveCollisionMasks;
  #showActiveInfo;
  #showActiveOriginPoints;
  #showActiveActionPoints;
  
  #currentFps;    // Current FPS value
  #fpsTimeLast;   // Time snapshot logger for throttling FPS
  #frameInterval; //
  #fpsFrameLast;  // Time snapshot logger for calculating FPS
  #frameCounter;  // Counts frames to calculate FPS
  
  #STARTING_ROOM;
  #currentRoom;
  #isChangingRooms;
  
  #masterBgmVolume;
  #masterSfxVolume;
  #masterBgmPitch;
  
  #COLLIDER_SHAPES;
  #loadingQueue;
  #data;
  #instances;
  #drawOrders;
  
  constructor(
    divTargetId,
    baseWidth, baseHeight,
    startingRoom,
    screenScale = 1
  ) {
    // Initialize render canvases/contexts
    this.#frontCanvas = document.createElement('canvas');
    this.#frontCanvas.addEventListener('contextmenu', event => event.preventDefault());
    this.#frontCanvas.width = baseWidth;
    this.#frontCanvas.height = baseHeight;
    
    this.#frontContext = this.#frontCanvas.getContext('2d');
    this.#frontContext.imageSmoothingEnabled = false;
    
    this.#backCanvas = new OffscreenCanvas(baseWidth, baseHeight);
    
    this.#backContext = this.#backCanvas.getContext('2d');
    this.#backContext.imageSmoothingEnabled = false;
    
    document.querySelector(`#${divTargetId}`).append(this.#frontCanvas);
    
    // Paths for loading media resources
    this.#RES_PATHS = {
      actives   : "res/actives/",
      backdrops : "res/backdrops/",
      fonts     : "res/fonts/",
      music     : "res/music/",
      sounds    : "res/sounds/",
      tilemaps  : "res/tilemaps/"
    };
    
    // Game's base pixel resolution
    this.#BASE_WIDTH = baseWidth;
    this.#BASE_HEIGHT = baseHeight;
    
    // Graphics scaling values
    this.#SCREEN_SCALE = screenScale;
    
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
    
    // document.addEventListener('keydown', (e) => Inu.#keyboardHandler(e), false);
    // document.addEventListener('keyup',   (e) => Inu.#keyboardHandler(e), false);
    
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
    
    // canvas.addEventListener('mousedown', (e) => Inu.#mouseButtonHandler(e), false);
    // canvas.addEventListener('mouseup',   (e) => Inu.#mouseButtonHandler(e), false);
    // canvas.addEventListener('mousemove', (e) => Inu.#mouseMoveHandler(e), false);
    
    // Camera
    this.#camera        = {x : 0, y : 0};
    this.#cameraBounds  = {x1 : 0, x2 : 0, y1 : 0, y2 : 0};
    this.#cameraIsBound = false;
    
    // Debug functionality
    this.#quickBoot                = false;
    this.#showFps                  = false;
    this.#showRoomInfo             = false;
    this.#showActiveCollisionMasks = false;
    this.#showActiveInfo           = false;
    this.#showActiveOriginPoints   = false;
    this.#showActiveActionPoints   = false;
    
    // FPS limiter
    this.#currentFps    = 0;
    this.#frameCounter  = 0;
    this.#fpsTimeLast   = 0;
    this.#frameInterval = 1000 / 60;
    this.#fpsFrameLast  = 0;
    
    // Room/gamestate management
    this.#STARTING_ROOM   = startingRoom;
    this.#isChangingRooms = false;
    
    // Music/SFX global volume levels
    this.#masterBgmVolume = 1;
    this.#masterSfxVolume = 1;
    this.#masterBgmPitch  = 1;
    
    // Game data
    this.#COLLIDER_SHAPES = {NONE: 0, RECTANGLE: 1, CIRCLE: 2};
    
    this.#loadingQueue = {};
    
    this.#data = {
      actives   : {},
      backdrops : {},
      fonts     : {},
      tilemaps  : {},
      sounds    : {},
      music     : {}
    };
    
    this.#instances = {
      actives    : [],
      backdrops  : [],
      paragraphs : [],
      tiles      : []
    };
    
    this.#drawOrders = {
      backdrops : [],
      main      : []
    };
    
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
      promises.push(this.#loadImage(SYSTEM_MEDIA_B64.graphics[mediaName])
        .then((img) => {
          this.#systemImages[mediaName] = this.#colorKeyImage(img);
        })
      );
    }
    
    // Load system fonts
    for (const mediaName in SYSTEM_MEDIA_B64.fonts) {
      promises.push(this.#loadImage(SYSTEM_MEDIA_B64.fonts[mediaName])
        .then((img) => {
          this.#data.fonts[mediaName] = this.#formatFont(img);
        })
      );
    }
    
    // Present "ready to play" screen for user to trigger loading process
    Promise.allSettled(promises).then((results) => {
      if (this.#initFailed(results)) {
        return;
      }
      
      if (this.#quickBoot) {
        // this.#loadActives();
        this.#loadBackdrops();
      } else {
        let over = () => { this.#drawReadyScreen(1); };
        let out  = () => { this.#drawReadyScreen(0); };
        
        let click = () => {
          this.#frontCanvas.style.cursor = '';
          
          this.#frontCanvas.removeEventListener('mouseover', over);
          this.#frontCanvas.removeEventListener('mouseout', out);
          this.#frontCanvas.removeEventListener('click', click);
          
          this.#clearCanvas();
          this.#renderFrame();
          
          // setTimeout(() => this.#loadActives(), 250);
          setTimeout(() => this.#loadBackdrops(), 250);
        }
        
        this.#frontCanvas.addEventListener('mouseover', over);
        this.#frontCanvas.addEventListener('mouseout', out);
        this.#frontCanvas.addEventListener('click', click);
        
        this.#drawReadyScreen(0);
        this.#frontCanvas.style.cursor = 'pointer';
      }
    });
  }
  
  #drawReadyScreen(state) {
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
  
  #drawLoadingScreen(statusMessage) {
    return;
    let font = this.#data.fonts['system_boot'];
    let msgWidth = font.tileWidth * statusMessage.length;
    
    this.#clearCanvas();
    
    this.#backContext.fillStyle = 'gray';
    this.#backContext.fillRect(0, 0, this.#BASE_WIDTH, this.#BASE_HEIGHT);
    
    this.#drawText(
      statusMessage, font,
      (this.#BASE_WIDTH  / 2) - (msgWidth        / 2),
      (this.#BASE_HEIGHT / 2) - (font.tileHeight / 2)
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
  
  #formatFont(img) {
    return {
      img: this.#colorKeyImage(img),
      charWidth: img.width / 32,
      charHeight: img.height / 3
    };
  }
  
  defineColorKeys(rgbSets) {
    
  }
  
  #colorKeyImage(img) {
    this.#colorKeyCanvas.width = img.width;
    this.#colorKeyCanvas.height = img.height;
    this.#colorKeyContext.clearRect(0, 0, img.width, img.height);
    
    this.#colorKeyContext.drawImage(img, 0, 0);
    
    let imgData = this.#colorKeyContext.getImageData(0, 0, img.width, img.height);
    
    for (const color of this.#colorKeys) {
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
    
    img.src = this.#colorKeyCanvas.toDataURL();
    
    return img;
  }
  
  defineBackdrops(data) {
    this.#loadingQueue.backdrop = data;
  }
  
  #loadBackdrops() {
    console.log('Loading Backdrops');
    this.#drawLoadingScreen('Loading Backdrops');
    return;
    
    let promises = [];
    for (const item of this.#loadingQueue.backdrop) {
      // Load and store backdrop image
      promises.push(this.#loadImage(`res_backdrops/${item.name}.png`)
        .then((img) =>
          this.#data.backdrops[item.name] = {
            img: this.#colorKeyImage(img),
            repeat: item.repeat ?? false
          }));
    }
    
    // Proceed when loading is done
    Promise.allSettled(promises).then((results) => {
      if (this.#initFailed(results))
        return;
      
      // this.#loadFonts();
    });
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
  
  
  
  //----------------------------------------------------------------------------
  
  #drawText() {
    
  }
  
  
  changeRoom(room) {
    this.room = new room(this);
  }
  
  #clearCanvas() {
    if (this.#currentRoom)
      this.#backContext.fillStyle = this.#currentRoom.getBackgroundColor();
    else
      this.#backContext.fillStyle = 'black';
    
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
  
  // ---------------------------------------------------------------------------
  // Methods for toggling debug functionality
  // ---------------------------------------------------------------------------
  
  #setQuickBoot(enabled) {
    this.#quickBoot = enabled;
  }
}