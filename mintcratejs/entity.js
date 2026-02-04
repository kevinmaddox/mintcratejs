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
  
  #getInstanceIndex() {
    // this.#
  }
  
  destroy() {
    // Remove entity from MintCrate's linear instance list
    let linearInstanceIndex =
      this.#linearInstanceList.findIndex((entity) => entity === this);
    this.#linearInstanceList.splice(linearInstanceIndex, 1);
    
    // Remove entity from MintCrate's draw order table
    let drawIndex = this.#drawOrder.findIndex((entity) => entity === this);
    this.#drawOrder.splice(drawIndex, 1);
    
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
    // Update position
    this.#x = x;
    
    // Update collider's position
    // if (this._collider) {
      // this._collider.x = this.#x + this._colliderOffsetX
    // }
  }
  
  setY(y) {
    // Update position
    this.#y = y;
    
    // Update collider's position
    // if (this._collider) {
      // this._collider.y = this.#y + this._colliderOffsetY
    // }
  }
  
  moveX(pixels) {
    this.setX(this.#x + pixels);
  }
  
  moveY(pixels) {
    this.setY(this.#y + pixels);
  }
  
  // ---------------------------------------------------------------------------
  // Methods for managing draw order
  // ---------------------------------------------------------------------------
  
  bringForward() {
    let index = this.#drawOrder.findIndex((entity) => entity === this);
    MintUtil.array.moveItemRight(this.#drawOrder, index);
  }
  
  sendBackward() {
    let index = this.#drawOrder.findIndex((entity) => entity === this);
    MintUtil.array.moveItemLeft(this.#drawOrder, index);
  }
  
  bringToFront() {
    let index = this.#drawOrder.findIndex((entity) => entity === this);
    MintUtil.array.moveItemToEnd(this.#drawOrder, index);
  }
  
  sendToBack() {
    let index = this.#drawOrder.findIndex((entity) => entity === this);
    MintUtil.array.moveItemToStart(this.#drawOrder, index);
  }
  
  // ---------------------------------------------------------------------------
  // Methods for managing visibility
  // ---------------------------------------------------------------------------
  
  isVisible() {
    return this.#isVisible;
  }
  
  setVisibility(isVisible) {
    this.#isVisible = isVisible;
  }
  
  getOpacity() {
    return this.#opacity;
  }
  
  setOpacity(opacity) {
    this.#opacity = MintMath.clamp(opacity, 0, 1);
  }
  
  adjustOpacity(opacity) {
    this.#opacity = MintMath.clamp(this.#opacity + opacity, 0, 1);
  }
}

/*
for (let i = 0; i < enemies.length; i++)
  
for (let i = 0; i < this.mint.actives.enemies; i++)
  
this.mint.actives.harpy = this.mint.addActive(blahblah);
this.mint.actives.harpy.x += 1
harpy.x += 1

this.mint.iterate(this.mint.actives.enemies, (enemy) => {
  enemy.destroy();
});
*/