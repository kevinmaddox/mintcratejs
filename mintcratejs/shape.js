// ---------------------------------------------------------------------------
// MintCrate - Shape
// A geometric entity that can be used for abstract and supporting visuals
// ---------------------------------------------------------------------------

'use strict';

import { Entity } from "./entity.js";

export class Shape extends Entity {
  
  //----------------------------------------------------------------------------
  // Member variables
  //----------------------------------------------------------------------------
  
  static TYPES = {LINE: 0, RECTANGLE: 1, CIRCLE: 2};
  
  #type;
  
  #x2;
  #y2;
  #lineWidth;
  
  #width;
  #height;
  
  #radius;
  
  #color;
  #borderColor;
  #borderWidth;
  
  //----------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------
  
  constructor(
    linearInstanceList,
    drawOrder,
    x,
    y,
    type,
    dimensions,
    color,
    borderColor,
    borderWidth
  ) {
    super("shape", "", linearInstanceList, drawOrder, x, y);
    
    this.#type = type;
    
    // Line
    this.#x2        = dimensions.x2;
    this.#y2        = dimensions.y2;
    this.#lineWidth = dimensions.lineWidth;
    
    // Rectangle
    this.#width  = dimensions.width;
    this.#height = dimensions.height;
    
    // Circle
    this.#radius = dimensions.radius;
    
    // Shape colors
    this.#color       = color;
    this.#borderColor = borderColor;
    this.#borderWidth = borderWidth;
  }
  
  // ---------------------------------------------------------------------------
  // Methods for management
  // ---------------------------------------------------------------------------
  
  destroy() {
    if (!super.exists()) { return; }
    
    super.destroy();
    
    // Zero out properties
    this.#type = Shape.TYPES.LINE;
    
    this.#x2        = 0;
    this.#y2        = 0;
    this.#lineWidth = 0;
    
    this.#width  = 0;
    this.#height = 0;
    
    this.#radius = 0;
    
    this.#color       = {r: 0, g: 0, b: 0};
    this.#borderColor = {r: 0, g: 0, b: 0};
    this.#borderWidth = 0;
  }
  
  // ---------------------------------------------------------------------------
  // Methods for retrieving data about the Shape
  // ---------------------------------------------------------------------------
  
  getType() {
    return this.#type;
  }
  
  getX2() {
    return this.#x2;
  }
  
  getY2() {
    return this.#y2;
  }
  
  getLineWidth() {
    return this.#lineWidth;
  }
  
  getWidth() {
    return this.#width;
  }
  
  getHeight() {
    return this.#height;
  }
  
  getRadius() {
    return this.#radius;
  }
  
  setX2(x2) {
    if (!super.exists()) { return; }
    
    this.#x2 = x2;
  }
  
  setY2(y2) {
    if (!super.exists()) { return; }
    
    this.#y2 = y2;
  }
  
  moveX2(x2) {
    if (!super.exists()) { return; }
    
    this.setX2(x2);
  }
  
  moveY2(Y2) {
    if (!super.exists()) { return; }
    
    this.setY2(y2);
  }
  
  setWidth(width) {
    if (!super.exists()) { return; }
    
    this.#width = width;
  }
  
  setHeight(height) {
    if (!super.exists()) { return; }
    
    this.#height = height;
  }
  
  adjustWidth(width) {
    if (!super.exists()) { return; }
    
    this.setWidth(this.#width + width);
  }
  
  adjustHeight(height) {
    if (!super.exists()) { return; }
    
    this.setHeight(this.#height + height);
  }
  
  setRadius(radius) {
    if (!super.exists()) { return; }
    
    this.#radius = radius;
  }
  
  adjustRadius(radius) {
    if (!super.exists()) { return; }
    
    this.setRadius(this.#radius + radius);
  }
  
  getColor() {
    return this.#color;
  }
  
  getBorderColor() {
    return this.#borderColor;
  }
  
  getBorderWidth() {
    return this.#borderWidth;
  }
  
  setColor(r, g, b) {
    if (!super.exists()) { return; }
    
    this.#color = {r: r, g: g, b: b};
  }
  
  setBordercolor(r, g, b) {
    if (!super.exists()) { return; }
    
    this.#borderColor = {r: r, g: g, b: b};
  }
  
  setBorderWidth(width) {
    if (!super.exists()) { return; }
    
    this.#borderWidth = width;
  }
  
  adjustBorderWidth(width) {
    if (!super.exists()) { return; }
    
    this.setBorderWidth(this.#borderWidth + width);
  }
}