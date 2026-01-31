// ---------------------------------------------------------------------------
// MintCrate - Active
// A static entity intended for background visuals
// ---------------------------------------------------------------------------

// TODO: Add mosaic feature where you can scroll the background without moving it

'use strict';

import { Entity } from "./entity.js";
import { MintMath } from "./mintmath.js";

export class Active extends Entity {
  
  //----------------------------------------------------------------------------
  // Member variables
  //----------------------------------------------------------------------------
  
  #name;
  
  #angle;
  #rotatedWidth;
  #rotatedHeight;
  
  #scaleX;
  #scaleY;
  #flippedHorizontally;
  #flippedVertically;
  
  static COLLIDER_SHAPES = {NONE: 0, RECTANGLE: 1, CIRCLE: 2};
  #collider;
  #colliderOffsetX;
  #colliderOffsetY;
  
  #animationIsLoaded;
  #animationList;
  #animationName;
  #currentAnimation;
  #animationFrameNumber;
  #animationFrameTimer;
  
  #actionPointX;
  #actionPointY;
  
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
    colliderShape,
    colliderOffsetX,
    colliderOffsetY,
    colliderWidth,
    colliderHeight,
    colliderRadius,
    animationList,
    initialAnimationName,
    initialAnimation
  ) {
    super("active", name, instances, linearInstanceList, drawOrder, x, y);
    
    // Initialize rotation values
    this.#angle         = 0;
    this.#rotatedWidth  = 0;
    this.#rotatedHeight = 0;
    
    // Initialize scaling/mirroring values
    this.#scaleX              = 1;
    this.#scaleY              = 1;
    this.#flippedHorizontally = false;
    this.#flippedVertically   = false;
    
    // Initialize collider structure
    this.#collider = {
      s         : colliderShape,
      x         : x + colliderOffsetX,
      y         : y + colliderOffsetY,
      w         : colliderWidth,
      h         : colliderHeight,
      r         : colliderRadius,
      collision : false,
      mouseOver : false
    };
    this.#colliderOffsetX = colliderOffsetX;
    this.#colliderOffsetY = colliderOffsetY;
    
    // Initialize animation data
    this.#animationIsLoaded    = (initialAnimationName !== "");
    this.#animationList        = animationList;
    this.#animationName        = initialAnimationName;
    this.#currentAnimation     = initialAnimation;
    this.#animationFrameNumber = 1;
    this.#animationFrameTimer  = 0;
    
    // Initialize action point coordinates
    this.#actionPointX = 0;
    this.#actionPointY = 0;
  }
  
  // ---------------------------------------------------------------------------
  // Methods for managing positions
  // ---------------------------------------------------------------------------
  
  setX(x) {
    super.setX(x);
    
    // Update collider's coordinate
    if (this.#collider.s !== Active.COLLIDER_SHAPES.NONE) {
      this.#collider.x = x + this.#colliderOffsetX;
    }
  }
  
  setY(y) {
    super.setY(y);
    
    // Update collider's coordinate
    if (this.#collider.s !== Active.COLLIDER_SHAPES.NONE) {
      this.#collider.y = y + this.#colliderOffsetY;
    }
  }
  
  // ---------------------------------------------------------------------------
  // Methods for performing graphical changes
  // ---------------------------------------------------------------------------
  
  getAngle() {
    return this.#angle;
  }
  
  setAngle(degrees) {
    this.#angle = degrees;
  }
  
  rotate(degrees) {
    this.#angle += degrees;
  }
  
  angleLookAtPoint(bx, by) {
    // Determine correct angle which faces the point
    let ax = this.getX();
    let ay = this.getY();
    
    let vx = bx - ax;
    let vy = by - ay;
    
    let radians = Math.atan2(vy, vx);
    let degrees = MintMath.deg(radians);
    
    // Make active look at point
    this.setAngle(degrees);
  }
  
  getScaleX() {
    return this.#scaleX;
  }
  
  getScaleY() {
    return this.#scaleY;
  }
  
  setScaleX(scaleX) {
    this.scaleX = scaleX;
  }
  
  setScaleY(scaleY) {
    this.scaleY = scaleY;
  }
  
  scaleX(scaleX) {
    this.#scaleX += scaleX;
  }
  
  scaleY(scaleY) {
    this.#scaleY += scaleY;
  }
  
  isFlippedHorizontally() {
    return this.#flippedHorizontally;
  }
  
  isFlippedVertically() {
    return this.#flippedVertically;
  }
  
  flipHorizontally(isFlipped = null) {
    if (isFlipped === null) {
      isFlipped = (!this.#flippedHorizontally);
    }
    
    this.#flippedHorizontally = isFlipped;
  }
  
  flipVertically(isFlipped = null) {
    if (isFlipped === null) {
      isFlipped = (!this.#flippedVertically);
    }
    
    this.#flippedVertically = isFlipped;
  }
  
  // ---------------------------------------------------------------------------
  // Methods for handling animation
  // ---------------------------------------------------------------------------
  
  getAnimationName() {
    return this.#animationName;
  }
  
  getAnimationFrameNumber() {
    return this.#animationFrameNumber;
  }
  
  playAnimation(animationName, forceRestart = false) {
    // Set animation name so engine core can draw it
    this.#animationName = animationName;
    
    // Restart animation frame values if specified
    if (forceRestart) {
      this.#animationFrameNumber = 1;
      this.#animationFrameTimer = 0;
    }
  }
  
  // Updates the animation.
  _animate(animation) {
    // Tick animation timer (time that each frame lasts)
    this.#animationFrameTimer++;
    
    // Advance frame
    if (this.#animationFrameTimer > animation.frameDuration) {
      this.#animationFrameNumber++;
      this.#animationFrameTimer = 0;
    }
    
    // Restart animation if we've gone past the last frame
    if (this.#animationFrameNumber > animation.frameCount) {
      this.#animationFrameNumber = 1;
    }
    
    // Store current animation name so engine core can draw it
    this.#currentAnimation = animation;
  }
  
  getSpriteWidth() {
    // Get animation frame width
    let val = 0;
    
    if (this.#animationIsLoaded) {
      val = this.#currentAnimation.frameWidth;
    }
    
    // Return animation frame width
    return val;
  }
  
  getSpriteHeight() {
    // Get animation frame height
    let val = 0;
    
    if (this.#animationIsLoaded) {
      val = this.#currentAnimation.frameHeight;
    }
    
    // Return animation frame height
    return val;
  }
  
  getTransformedSpriteWidth() {
    // Calculate transformed width
    let width    = this.getImageWidth()  * this.#scaleX;
    let height   = this.getImageHeight() * this.#scaleY;
    let rotation = MintMath.rad(Math.abs(this.#angle));
    
    let tWidth = (width * Math.cos(rotation)) + (height * Math.sin(rotation));
    
    // Return transformed width
    return Math.round(tWidth);
  }
  
  getTransformedSpriteHeight() {
    // Calculate transformed width
    let width    = this.getImageWidth()  * this.#scaleX;
    let height   = this.getImageHeight() * this.#scaleY;
    let rotation = MintMath.rad(Math.abs(this.#angle))
    
    let tHeight = (width * Math.cos(rotation)) + (height * Math.sin(rotation));
    
    // Return transformed width
    return Math.round(tHeight);
  }
  
  // ---------------------------------------------------------------------------
  // Methods for retrieving data about the collision mask
  // ---------------------------------------------------------------------------
  
  _getCollider() {
    return this.#collider;
  }
  
  getColliderWidth() {
    return this.#collider.width;
  }
  
  getColliderHeight() {
    return this.#collider.height;
  }
  
  getColliderRadius() {
    return this.#collider.radius;
  }
  
  getLeftEdgeX() {
    // Return edge coordinate based on collider shape
    if (this.#collider.r !== 0) {
      return this.#collider.x - this.#collider.r;
    } else {
      return this.#collider.x;
    }
  }
  
  getRightEdgeX() {
    // Return edge coordinate based on collider shape
    if (this.#collider.r !== 0) {
      return this.#collider.x + this.#collider.r;
    } else if (this.#collider.w !== 0) {
      return this.#collider.x + this.#collider.w;
    } else {
      return 0;
    }
  }
  
  getTopEdgeY() {
    // Return edge coordinate based on collider shape
    if (this.#collider.r !== 0) {
      return this.#collider.y - this.#collider.r;
    } else {
      return this.#collider.y;
    }
  }
  
  getBottomEdgeY() {
    // Return edge coordinate based on collider shape
    if (this.#collider.r !== 0) {
      return this.#collider.y + this.#collider.r;
    } else if (this.#collider.w !== 0) {
      return this.#collider.y + this.#collider.h;
    } else {
      return 0;
    }
  }
  
  // ---------------------------------------------------------------------------
  // Methods for retrieving data for transformation and action points
  // ---------------------------------------------------------------------------
  
  getActionPointX() {
    // Update action point positions
    this.#updateActionPoints();
    
    // Return action point's X coordinate
    return this.#actionPointX;
  }
  
  getActionPointY() {
    // Update action point positions
    this.#updateActionPoints();
    
    // Return action point's Y coordinate
    return this.#actionPointY;
  }
  
  #updateActionPoints() {
    // Get un-transformed action points for current animation frame
    let ax = 0;
    let ay = 0;
    
    // Get action points based on animation frame
    if (this.#animationIsLoaded) {
      ax = this.#currentAnimation.actionPoints[this.#animationFrameNumber-1][0];
      ay = this.#currentAnimation.actionPoints[this.#animationFrameNumber-1][1];
      
      ax += this.#currentAnimation.offsetX;
      ay += this.#currentAnimation.offsetY;
    }
    
    // Get flipped states
    let flippedX = 1;
    let flippedY = 1;
    if (this.#flippedHorizontally) { flippedX = -1; }
    if (this.#flippedVertically  ) { flippedY = -1; }
    
    // Scale
    ax *= this.#scaleX * flippedX;
    ay *= this.#scaleY * flippedY;
    
    // Rotate
    let r  = MintMath.rad(this.#angle);
    let rx = ax * Math.cos(r) - ay * Math.sin(r);
    let ry = ax * Math.sin(r) + ay * Math.cos(r);
    
    ax = rx;
    ay = ry;
    
    // Update action points
    this.#actionPointX = this.getX() + ax;
    this.#actionPointY = this.getY() + ay;
  }
}