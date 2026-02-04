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
  
  #name;
  
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
  // Methods for retrieving data about the Backdrop
  // ---------------------------------------------------------------------------
  
  getWidth() {
    return this.#width;
  }
  
  getHeight() {
    return this.#height;
  }
  
  setWidth(width) {
    width = Math.max(width, this.#minimumWidth);
    this.#width = width;
    if (this.#type === Backdrop.TYPES.NORMAL) {
      this.#scaleX = this.#width / this.#imageWidth;
    }
  }
  
  setHeight(height) {
    height = Math.max(height, this.#minimumHeight);
    this.#height = height;
    if (this.#type === Backdrop.TYPES.NORMAL) {
      this.#scaleY = this.#height / this.#imageHeight;
    }
  }
  
  adjustWidth(width) {
    this.setWidth(this.#width + width);
  }
  
  adjustHeight(height) {
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
    if (this.#type !== Backdrop.TYPES.NINEPATCH) {
      this.#u = u;
    }
  }
  
  setV(v) {
    if (this.#type !== Backdrop.TYPES.NINEPATCH) {
      this.#v = v;
    }
  }
  
  moveU(u) {
    this.setU(this.#u + u);
  }
  
  moveV(v) {
    this.setV(this.#v + v);
  }
}