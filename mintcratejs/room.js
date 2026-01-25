// -----------------------------------------------------------------------------
// MintCrate - Room
// A scene or level in the game (a game state).
// -----------------------------------------------------------------------------

'use strict';

import { MintMath } from "./mintmath.js";

export class Room {
  
  //----------------------------------------------------------------------------
  // Private variables
  //----------------------------------------------------------------------------
  
  #name;
  #width;
  #height;
  #backgroundColor;
  
  #fadeInConfig;
  #fadeOutConfig;
  
  //----------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------
  
  constructor(name, width, height) {
    // Set room name
    this.#name = name;
    
    // Set room dimensions
    this.#width = width;
    this.#height = height;
    
    // Initialize background color (clear color)
    this.#backgroundColor = {r: 0, g: 0, b: 0};
    
    // Initialize fade in/out settings
    this.#fadeInConfig  = {enabled: false};
    this.#fadeOutConfig = {enabled: false};
  }
  
  // ---------------------------------------------------------------------------
  // Methods for getting information about the room
  // ---------------------------------------------------------------------------
  
  getRoomName() {
    return this.#name;
  }
  
  getRoomWidth() {
    return this.#width;
  }
  
  getRoomHeight() {
    return this.#height;
  }
  
  // -----------------------------------------------------------------------------
  // Methods for configuring the room's fade in/out settings
  // -----------------------------------------------------------------------------
  
  getRoomFadeConfig() {
    return {
      fadeIn  : this.#fadeInConfig,
      fadeOut : this.#fadeOutConfig
    };
  }
  
  configureRoomFadeIn(fadeLength, pauseLength = 0, color = {r: 0, g: 0, b: 0}) {
    this.#fadeInConfig = {
      enabled    : true,
      fadeLength : fadeLength,
      pauseLength: pauseLength,
      fadeColor  : {r: color.r, g: color.g, b: color.b}
    };
  }
  
  configureRoomFadeOut(fadeLength, pauseLength = 0, color = {r: 0, g: 0, b: 0}) {
    this.#fadeOutConfig = {
      enabled    : true,
      fadeLength : fadeLength,
      pauseLength: pauseLength,
      fadeColor  : {r: color.r, g: color.g, b: color.b}
    };
  }
  
  // ---------------------------------------------------------------------------
  // Methods for changing room visuals
  // ---------------------------------------------------------------------------
  
  getRoomBackgroundColor() {
    return {
      r: this.#backgroundColor.r,
      g: this.#backgroundColor.g,
      b: this.#backgroundColor.b
    };
  }
  
  setRoomBackgroundColor(r, g, b) {
    // Constrain color values
    r = MintMath.clamp(r, 0, 255);
    g = MintMath.clamp(g, 0, 255);
    b = MintMath.clamp(b, 0, 255);
    
    // Set background clear color
    this.#backgroundColor = {r: r, g: g, b: b};
  }
}