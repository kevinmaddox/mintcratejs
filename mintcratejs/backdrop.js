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
  
  static TYPES = {NORMAL: 0, MOSAIC: 1, NINEPATCH: 2};
  
  #type;
  
  #width;
  #height;
  
  #imageWidth;
  #imageHeight;
  
  #scaleX;
  #scaleY;
  
  #minimumWidth;
  #minimumHeight
  
  #u;
  #v;
  
  //----------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------
  
  constructor(
    name,
    linearInstanceList,
    drawOrder,
    x,
    y,
    type,
    width,
    height,
    imageWidth,
    imageHeight,
    scaleX,
    scaleY,
    minimumWidth,
    minimumHeight
  ) {
    super("backdrop", name, linearInstanceList, drawOrder, x, y);
    
    this.#type = type;
    
    this.#width = width;
    this.#height = height;
    
    this.#imageWidth = imageWidth;
    this.#imageHeight = imageHeight;
    
    this.#minimumHeight = minimumHeight;
    this.#minimumWidth = minimumWidth;
    
    this.#scaleX = scaleX;
    this.#scaleY = scaleY;
    
    this.#u = 0;
    this.#v = 0;
  }
  
  // ---------------------------------------------------------------------------
  // Methods for management
  // ---------------------------------------------------------------------------
  
  destroy() {
    if (!super.exists()) { return; }
    
    super.destroy();
    
    // Zero out properties
    this.#type = Backdrop.TYPES.NORMAL;
    
    this.#width = 0;
    this.#height = 0;
    
    this.#imageWidth = 0;
    this.#imageHeight = 0;
    
    this.#scaleX = 0;
    this.#scaleY = 0;
    
    this.#minimumWidth = 0;
    this.#minimumHeight = 0;
    
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
  
  setWidth(width) {
    if (!super.exists()) { return; }
    
    width = Math.max(width, this.#minimumWidth);
    this.#width = width;
    if (this.#type === Backdrop.TYPES.NORMAL) {
      this.#scaleX = this.#width / this.#imageWidth;
    }
  }
  
  setHeight(height) {
    if (!super.exists()) { return; }
    
    height = Math.max(height, this.#minimumHeight);
    this.#height = height;
    if (this.#type === Backdrop.TYPES.NORMAL) {
      this.#scaleY = this.#height / this.#imageHeight;
    }
  }
  
  adjustWidth(width) {
    if (!super.exists()) { return; }
    
    this.setWidth(this.#width + width);
  }
  
  adjustHeight(height) {
    if (!super.exists()) { return; }
    
    this.setHeight(this.#height + height);
  }
  
  getImageWidth() {
    return this.#imageWidth;
  }
  
  getImageHeight() {
    return this.#imageHeight;
  }
  
  getScaleX() {
    return this.#scaleX;
  }
  
  getScaleY() {
    return this.#scaleY;
  }
  
  getU() {
    return this.#u;
  }
  
  getV() {
    return this.#v;
  }
  
  setU(u) {
    if (!super.exists()) { return; }
    
    if (this.#type !== Backdrop.TYPES.NINEPATCH) {
      this.#u = u;
    }
  }
  
  setV(v) {
    if (!super.exists()) { return; }
    
    if (this.#type !== Backdrop.TYPES.NINEPATCH) {
      this.#v = v;
    }
  }
  
  moveU(u) {
    if (!super.exists()) { return; }
    
    this.setU(this.#u + u);
  }
  
  moveV(v) {
    if (!super.exists()) { return; }
    
    this.setV(this.#v + v);
  }
}