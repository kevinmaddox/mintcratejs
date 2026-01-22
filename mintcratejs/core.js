'use strict';

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
  }
  
  ready() {
    
  }
  
  changeRoom(room) {
    this.room = new room(this);
  }
}