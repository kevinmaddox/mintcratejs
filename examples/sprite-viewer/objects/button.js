'use strict';

export class Button {
  
  #mint;
  #clickedCallback;
  
  constructor(
    mint,
    x,
    y,
    animationName
  ) {
    this.#mint = mint;
    
    this.active = mint.fg.addActive('btn', 0, 0);
    this.active.setX(x);
    this.active.setY(y);
    this.active.playAnimation(animationName);
    
    this.wasClicked = false;
    this.isHovering = false;
  }
  
  setClickCallback(func) {
    this.#clickedCallback = func;
  }
  
  update() {
    let mint = this.#mint;
    
    let mouseOverBtn = mint.mouseOverActive(this.active);
    
    // Handle button clicking
    if (
      mint.mouseReleased(0) && mouseOverBtn
      // || mint.inputs[0].released(this.keyboardKey)
    ) {
      this.wasClicked = true;
      
      // mint.playSound('up');
      this.#clickedCallback();
    }
    
    if (!mint.mouseHeld(0) && mouseOverBtn) {
      if (!this.isHovering) {
        this.isHovering = true;
        // mint.playSound('tickb');
      }
    } else {
      this.isHovering = false;
    }
    
    if (
      !mint.mouseHeld(0) && mouseOverBtn
    ) {
      this.active.setOpacity(0.75);
      this.active.resetBlendMode();
    } else if (
      mint.mouseHeld(0) && mouseOverBtn
      // || mint.inputs[0].held(this.keyboardKey)
    ) {
      if (!this.isDown) {
        // mint.playSound('down');
        this.isDown = true;
      }
      
      this.active.setOpacity(1.0);
      this.active.setBlendMode('multiply');
    } else {
      this.isDown = false;
      
      this.active.setOpacity(1.0);
      this.active.resetBlendMode();
    }
    
    
  }
  
}