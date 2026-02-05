// -----------------------------------------------------------------------------
// MintCrate - Entity Factory
// Factory for creating game entities
// -----------------------------------------------------------------------------

'use strict';

import { Active    } from "./active.js";
import { Backdrop  } from "./backdrop.js";
import { Paragraph } from "./paragraph.js";

export class EntityFactory {
  
  //----------------------------------------------------------------------------
  // Member variables
  //----------------------------------------------------------------------------
  
  #data;
  #linearInstanceLists;
  #drawOrders
  
  //----------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------
  
  constructor(data, linearInstanceLists, drawOrders) {
    this.#data = data;
    this.#linearInstanceLists = linearInstanceLists;
    this.#drawOrders = drawOrders;
  }
  
  //----------------------------------------------------------------------------
  // Methods for adding entities to the current room
  //----------------------------------------------------------------------------
  
  addActive(name, x, y) {
    // Retrieve active's collider data (if available)
    let collider = this.#data.actives[name].collider ?? {};
    
    // Retrieve list of animations for the active (if available)
    let animationList = [];
    for (const animName in this.#data.actives[name].animations) {
      animationList.push(animName);
    }
    
    // Retrieve initial animation to play upon creation (if available)
    let initialAnimationName = this.#data.actives[name].initialAnimationName ?? "";
    let animation = false;
    if (initialAnimationName) {
      animation = this.#data.actives[name].animations[initialAnimationName];
    }
    
    let active = new Active(
      name,
      this.#linearInstanceLists.actives,
      this.#drawOrders,
      x,
      y,
      collider.shape   ?? 0, // Defaults to MintCrate.COLLIDER_SHAPES.NONE (0)
      collider.offsetX ?? 0,
      collider.offsetY ?? 0,
      collider.width   ?? 0,
      collider.height  ?? 0,
      collider.radius  ?? 0,
      animationList,
      initialAnimationName,
      animation
    );
    
    this.#linearInstanceLists.actives.push(active);
    this.#drawOrders.push(active);
    
    return active;
  }
  
  addBackdrop(name, x, y, options = {}) {
    let data = this.#data.backdrops[name];
    let img = data.img;
    
    options.width = options.width ?? img.width;
    options.height = options.height ?? img.height;
    
    let scaleX = 1;
    let scaleY = 1;
    if (!data.mosaic) {
      scaleX = options.width / img.width;
      scaleY = options.height / img.height;
    }
    
    let type = Backdrop.TYPES.NORMAL;
    if (data.mosaic) {
      type = Backdrop.TYPES.MOSAIC;
    } else if (data.ninepatch) {
      type = Backdrop.TYPES.NINEPATCH;
    }
    
    let backdrop = new Backdrop(
      name,
      this.#linearInstanceLists.backdrops,
      this.#drawOrders,
      x,
      y,
      type,
      options.width ?? img.width,
      options.height ?? img.height,
      img.width,
      img.height,
      scaleX,
      scaleY,
      (data.ninepatchData ? data.ninepatchData.minimumWidth  : 0),
      (data.ninepatchData ? data.ninepatchData.minimumHeight : 0)
    );
    
    this.#linearInstanceLists.backdrops.push(backdrop);
    this.#drawOrders.push(backdrop);
    
    return backdrop;
  }
  
  addParagraph(name, x, y, startingTextContent = "", options = {}) {
    // Retrieve font's glyph width/height
    let font = this.#data.fonts[name];
    
    // Create new Paragraph
    let paragraph = new Paragraph(
      name,
      this.#linearInstanceLists.paragraphs,
      this.#drawOrders,
      x,
      y,
      font.charWidth,
      font.charHeight,
      options.maxCharsPerLine ?? 9999,
      options.lineSpacing ?? 0,
      options.wordWrap ?? false,
      options.alignment ?? "left",
      options.hyphenate ?? false
    );
    
    // Set initial text content
    paragraph.setTextContent(startingTextContent);
    
    // Store entry for paragraph in instance and draw-order lists
    this.#linearInstanceLists.paragraphs.push(paragraph);
    this.#drawOrders.push(paragraph);
    
    // Return new entity
    return paragraph;
  }
}