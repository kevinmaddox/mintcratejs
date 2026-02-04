'use strict';

export class Button {
  constructor(
    mint,
    x,
    y,
    width,
    height,
    textContent,
    keyboardKey,
    toggleable,
    clickedCallback,
  ) {
    this.mint = mint;
    
    this.x      = x;
    this.y      = y;
    this.width  = width;
    this.height = height;
    
    console.log(mint);
    mint.obj.btnBackdrops = {
      activeUp:       mint.bg.addBackdrop('button-active-up',     x, y, {ninePatch: true, width: width, height: height}),
      activeDown:     mint.bg.addBackdrop('button-active-down',   x, y, {ninePatch: true, width: width, height: height}),
      inactiveUp:     mint.bg.addBackdrop('button-inactive-down', x, y, {ninePatch: true, width: width, height: height}),
      inactiveDown:   mint.bg.addBackdrop('button-inactive-down', x, y, {ninePatch: true, width: width, height: height})
    };
    
    this.textActive = mint.bg.addParagraph('ui-main', 0, 0, textContent, {alignment: 'center'});
    this.textActive.setX(x + width / 2);
    this.textActive.setY(
      y + (height / 2) - (this.textActive.getGlyphHeight() / 2)
    );
    
    this.isDown = false;
    
    this.toggleable = toggleable;
    this.enabled = true;
    
    this.wasClicked = false;
    
    this.clickedCallback = clickedCallback;
    
    this.keyboardKey = keyboardKey;
  }
  
  update() {
    let mint = this.mint;
    
    if (!this.toggleable && this.wasClicked) { return; }
    
    let mouseOverBtn =
      mint.mouseOverRegion(this.x, this.y, this.width, this.height);
    
    // Handle button clicking
    if (
      mint.mouseReleased(0) && mouseOverBtn
      || mint.inputs[0].released(this.keyboardKey)
    ) {
      if (this.toggleable) {
          this.enabled = !this.enabled;
      } else {
        this.wasClicked = true;
      }
      
      mint.playSfx('button-up');
      this.clickedCallback(this.enabled);
    }
    
    
    for (const btnBackdrop of Object.values(mint.obj.btnBackdrops)) {
      btnBackdrop.setVisibility(false);
    }
    
    // Handle visuals
    if (
      mint.mouseHeld(0) && mouseOverBtn
      || mint.inputs[0].held(this.keyboardKey)
    ) {
      if (!this.isDown) {
        mint.playSfx('button-down');
        this.isDown = true;
      }
      
      if (this.enabled) {
        mint.obj.btnBackdrops.activeDown.setVisibility(true);
      } else {
        mint.obj.btnBackdrops.inactiveDown.setVisibility(true);
      }
    } else {
      this.isDown = false;
      if (this.enabled) {
        mint.obj.btnBackdrops.activeUp.setVisibility(true);
      } else {
        mint.obj.btnBackdrops.inactiveUp.setVisibility(true);
      }
    }
  }
}