// ---------------------------------------------------------------------------
// MintCrate - Backdrop
// A static entity intended for background visuals
// ---------------------------------------------------------------------------

'use strict';

import { Entity } from "./entity.js";

export class Backdrop extends Entity {
  
  //----------------------------------------------------------------------------
  // Member variables
  //----------------------------------------------------------------------------
  
  #name;
  
  #width;
  #height;
  
  #imageWidth;
  #imageHeight;
  
  #u;
  #v;
  
  //----------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------
  
  constructor(
    name,
    instances,
    linearInstanceList,
    drawOrder,
    x,
    y,
    width,
    height,
    imageWidth,
    imageHeight
  ) {
    super("backdrop", name, instances, linearInstanceList, drawOrder, x, y);
    
    this.#width = width;
    this.#height = height;
    
    this.#imageWidth = imageWidth;
    this.#imageHeight = imageHeight;
    
    this.#u = 0;
    this.#v = 0;
  }
  
  // ---------------------------------------------------------------------------
  // Methods for retrieving data about the Backdrop
  // ---------------------------------------------------------------------------
  
  getWidth() {
    return this.#width;
  }
  
  getHeight() {
    return this.#height;
  }
  
  getImageWidth() {
    return this.#imageWidth;
  }
  
  getImageHeight() {
    return this.#imageHeight;
  }
  
  getU() {
    return this.#u;
  }
  
  getV() {
    return this.#v;
  }
  
  setU(u) {
    this.#u = u;
  }
  
  setV(v) {
    this.#v = v;
  }
  
  moveU(u) {
    this.setU(this.#u + u);
  }
  
  moveV(v) {
    this.setV(this.#v + v);
  }
}