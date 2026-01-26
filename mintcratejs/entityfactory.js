// -----------------------------------------------------------------------------
// MintCrate - Entity Factory
// Factory for creating game entities
// -----------------------------------------------------------------------------

'use strict';

import { Backdrop } from "./backdrop.js";
import { Paragraph } from "./paragraph.js";

export class EntityFactory {
  
  //----------------------------------------------------------------------------
  // Member variables
  //----------------------------------------------------------------------------
  
  #data;
  #instanceCollection;
  #linearInstanceLists;
  #drawOrders
  
  //----------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------
  
  constructor(data, instanceCollection, linearInstanceLists, drawOrders) {
    this.#data = data;
    this.#instanceCollection = instanceCollection;
    this.#linearInstanceLists = linearInstanceLists;
    this.#drawOrders = drawOrders;
  }
  
  //----------------------------------------------------------------------------
  // Methods for adding entities to the current room
  //----------------------------------------------------------------------------
  
  addBackdrop(name, x, y, options = {}) {
    let backdrop = new Backdrop(
      name,
      this.#instanceCollection,
      this.#linearInstanceLists.backdrops,
      this.#drawOrders,
      x,
      y,
      240,
      172
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
      this.#instanceCollection,
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