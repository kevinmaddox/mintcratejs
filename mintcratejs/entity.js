// ---------------------------------------------------------------------------
// MintCrate - Entity
// A visual game object that can be manipulated in various ways
// ---------------------------------------------------------------------------

'use strict';

import { MintUtil } from "./mintutil.js";
import { MintMath } from "./mintmath.js";

export class Entity {
  
  //----------------------------------------------------------------------------
  // Private variables
  //----------------------------------------------------------------------------
  
  #entityType;
  #name;
  
  #linearInstanceList;
  #drawOrder;
  
  #wasDestroyed;
  #isVisible;
  #opacity;
  
  #x;
  #y;
  
  //----------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------
  
  constructor(entityType, name, linearInstanceList, drawOrder, x, y) {
    this.#entityType = entityType;
    this.#name = name;
    
    this.#linearInstanceList = linearInstanceList;
    this.#drawOrder = drawOrder;
    
    this.#wasDestroyed = false;
    this.#isVisible = true;
    this.#opacity = 1.0;
    
    this.#x = x;
    this.#y = y;
  }
  
  // ---------------------------------------------------------------------------
  // Methods for management
  // ---------------------------------------------------------------------------
  
  destroy() {
    if (this.#wasDestroyed) { return; }
    
    // Remove entity from MintCrate's linear instance list
    let linearInstanceIndex =
      this.#linearInstanceList.findIndex((entity) => entity === this);
    this.#linearInstanceList.splice(linearInstanceIndex, 1);
    
    // Remove entity from MintCrate's draw order table
    let drawIndex = this.#drawOrder.findIndex((entity) => entity === this);
    this.#drawOrder.splice(drawIndex, 1);
    
    // Zero out properties
    this.#entityType = "";
    this.#name       = "";
    this.#x          = 0;
    this.#y          = 0;
    this.#isVisible  = false;
    this.#opacity    = 0;
    
    // Mark entity as having been deleted
    this.#wasDestroyed = true;
  }
  
  exists() {
    return (!this.#wasDestroyed);
  }
  
  getName() {
    return this.#name;
  }
  
  getEntityType() {
    return this.#entityType;
  }
  
  // ---------------------------------------------------------------------------
  // Methods for managing positions
  // ---------------------------------------------------------------------------
  
  getX() {
    return this.#x;
  }
  
  getY() {
    return this.#y;
  }
  
  setX(x) {
    if (this.#wasDestroyed) { return; }
    
    // Update position
    this.#x = x;
  }
  
  setY(y) {
    if (this.#wasDestroyed) { return; }
    
    // Update position
    this.#y = y;
  }
  
  moveX(pixels) {
    if (this.#wasDestroyed) { return; }
    
    this.setX(this.#x + pixels);
  }
  
  moveY(pixels) {
    if (this.#wasDestroyed) { return; }
    
    this.setY(this.#y + pixels);
  }
  
  // ---------------------------------------------------------------------------
  // Methods for managing draw order
  // ---------------------------------------------------------------------------
  
  bringForward() {
    if (this.#wasDestroyed) { return; }
    
    let index = this.#drawOrder.findIndex((entity) => entity === this);
    MintUtil.array.moveItemRight(this.#drawOrder, index);
  }
  
  sendBackward() {
    if (this.#wasDestroyed) { return; }
    
    let index = this.#drawOrder.findIndex((entity) => entity === this);
    MintUtil.array.moveItemLeft(this.#drawOrder, index);
  }
  
  bringToFront() {
    if (this.#wasDestroyed) { return; }
    
    let index = this.#drawOrder.findIndex((entity) => entity === this);
    MintUtil.array.moveItemToEnd(this.#drawOrder, index);
  }
  
  sendToBack() {
    if (this.#wasDestroyed) { return; }
    
    let index = this.#drawOrder.findIndex((entity) => entity === this);
    MintUtil.array.moveItemToStart(this.#drawOrder, index);
  }
  
  // ---------------------------------------------------------------------------
  // Methods for managing visibility
  // ---------------------------------------------------------------------------
  
  isVisible() {
    return this.#isVisible;
  }
  
  show() {
    if (this.#wasDestroyed) { return; }
    
    this.setVisibility(true);
  }
  
  hide() {
    if (this.#wasDestroyed) { return; }
    
    this.setVisibility(false);
  }
  
  setVisibility(isVisible) {
    if (this.#wasDestroyed) { return; }
    
    this.#isVisible = isVisible;
  }
  
  getOpacity() {
    return this.#opacity;
  }
  
  setOpacity(opacity) {
    if (this.#wasDestroyed) { return; }
    
    this.#opacity = MintMath.clamp(opacity, 0, 1);
  }
  
  adjustOpacity(opacity) {
    if (this.#wasDestroyed) { return; }
    
    this.#opacity = MintMath.clamp(this.#opacity + opacity, 0, 1);
  }
}