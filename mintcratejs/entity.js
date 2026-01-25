// ---------------------------------------------------------------------------
// MintCrate - Entity
// A visual game object that can be manipulated in various ways
// ---------------------------------------------------------------------------

'use strict';

import { MintUtil } from "./mintutil.js";

export class Entity {
  
  //----------------------------------------------------------------------------
  // Private variables
  //----------------------------------------------------------------------------
  
  #name;
  
  #x;
  #y;
  
  #instances;
  #linearInstanceList;
  #drawOrder;
  
  #wasDestroyed;
  #isVisible;
  #opacity;
  
  //----------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------
  
  constructor(name, instances, linearInstanceList, drawOrder, x, y) {
    this.#name = name;
    
    this.#x = x;
    this.#y = y;
    
    this.#instances = instances;
    this.#linearInstanceList = linearInstanceList;
    this.#drawOrder = drawOrder;
    
    this.#wasDestroyed = false;
    this.#isVisible = true;
    this.#opacity = 1.0;
  }
  
  // ---------------------------------------------------------------------------
  // Methods for management
  // ---------------------------------------------------------------------------
  
  #getInstanceIndex() {
    // this.#
  }
  
  destroy() {
    // Remove entity from Mintcrate's instance list
    // TODO: Implement recursive function for finding object and removing it
    MintUtil.deleteInCollection(this, this.#instances);
    
    // Remove entity from MintCrate's linear instance list
    let linearInstanceIndex =
      this.#linearInstanceList.findIndex((entity) => entity === this);
    this.#linearInstanceList.splice(linearInstanceIndex, 1);
    
    // Remove entity from MintCrate's draw order table
    let drawIndex = this.#drawOrder.findIndex((entity) => entity === this);
    this.#drawOrder.splice(drawIndex, 1);
    console.log(this.#instances);
  }
  
  getName() {
    return this.#name;
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