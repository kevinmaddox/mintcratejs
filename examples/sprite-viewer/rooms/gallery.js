'use strict';

export class Gallery {
  load(engine) {
    this.mint = engine;
    let mint = this.mint;
    
    mint.setRoomBackgroundColor(128, 128, 128);
    
    mint.configureRoomFadeIn(15, 15, {r: 0, g: 0, b: 0});
    
    this.bg = mint.bg.addBackdrop('clouds', 0, 0);
    // TODO: Add entity blend modes
    mint.bg.addBackdrop('checkerboard-top', 0, 0, {width: mint.getBaseWidth()});
    let cbBot = mint.bg.addBackdrop('checkerboard-bot', 0, 0, {width: mint.getBaseWidth()});
    cbBot.setY(mint.getBaseHeight() - cbBot.getImageHeight());
    
    this.currentSpriteIndex = 0;
    this.spriteNames = [
      'astronaut1',
      'astronaut2',
      'bigslime',
      'fisherman',
      'floppydisk',
      'guitar',
      'knight',
      'miria',
      'mushroom',
      'pencil',
      'potion',
      'rabbit',
      'robot',
      'scorpion',
      'slime',
      'soldier',
      'spaceship1',
      'spaceship2',
      'spaceship3',
      'sword',
      'watermelon'
    ];
    
    this.sprite = mint.fg.addActive('sprite', mint.getBaseWidth() / 2, mint.getBaseHeight() / 2);
    
    this.info = mint.fg.addParagraph('retro', 4, 4, this.spriteNames[0]);
    // mint.bg.addParagraph('retro', 5, 5, "blah"); // TODO: Add font tinting
    
    let btnNames = [
      'background',
      'rotate',
      'moveHorz',
      'moveVert',
      'magnify',
      'arrowLeft',
      'arrowRight',
    ];
    
    this.btns = {};
    
    for (let i = 0; i < btnNames.length; i++) {
      let btn = mint.fg.addActive('btn', 0, 0);
      btn.setX(mint.getBaseWidth() / 2 + ((i-3) * 24) - 8);
      btn.setY(mint.getBaseHeight() - btn.getSpriteHeight() * 2);
      this.btns[btnNames[i]] = btn;
    }
    
    this.btns.background.playAnimation('bg');
    this.btns.rotate.playAnimation('rotate');
    this.btns.moveHorz.playAnimation('movehorz');
    this.btns.moveVert.playAnimation('movevert');
    this.btns.magnify.playAnimation('magnify');
    this.btns.arrowLeft.playAnimation('arrowleft');
    this.btns.arrowRight.playAnimation('arrowright');
    
    this.isRotating = false;
    this.angle = 0;
    
    this.isMovingHorz = false;
    this.horzVal = 0;
    
    this.isMovingVert = false;
    this.vertVal = 0;
    
    this.isMagnified = false;
  }
  
  update() {
    let mint = this.mint;
    
    // Handle button clicking
    if (mint.mousePressed(0)) {
      // Toggle background
      if (mint.mouseOverActive(this.btns.background)) {
        this.bg.setVisibility(!this.bg.isVisible());
        
      // Rotate sprite
      } else if (mint.mouseOverActive(this.btns.rotate)) {
        this.isRotating = !this.isRotating;
      
      // Move sprite horizontally
      } else if (mint.mouseOverActive(this.btns.moveHorz)) {
        this.isMovingHorz = !this.isMovingHorz;
      
      // Move sprite vertically
      } else if (mint.mouseOverActive(this.btns.moveVert)) {
        this.isMovingVert = !this.isMovingVert;
      
      // Magnify sprite
      } else if (mint.mouseOverActive(this.btns.magnify)) {
        this.isMagnified = !this.isMagnified;
        
      // Previous sprite
      } else if (mint.mouseOverActive(this.btns.arrowRight)) {
        this.currentSpriteIndex++;
        if (this.currentSpriteIndex >= this.spriteNames.length) {
          this.currentSpriteIndex = 0;
        }
        
        let spriteName = this.spriteNames[this.currentSpriteIndex];
        this.sprite.playAnimation(spriteName);
        this.info.setTextContent(spriteName);
      
      // Next sprite
      } else if (mint.mouseOverActive(this.btns.arrowLeft)) {
        this.currentSpriteIndex--;
        if (this.currentSpriteIndex < 0) {
          this.currentSpriteIndex = this.spriteNames.length - 1;
        }
        
        let spriteName = this.spriteNames[this.currentSpriteIndex];
        this.sprite.playAnimation(spriteName);
        this.info.setTextContent(spriteName);
      }
    }
    
    if (this.isRotating) {
      this.angle++;
      console.log(this.angle);
      this.sprite.rotate(1);
    } else {
      this.angle = 0;
      this.sprite.setAngle(0);
    }
    
    if (this.isMovingHorz) {
      this.horzVal += 0.025;
      this.sprite.setX(mint.getBaseWidth() / 2 + Math.sin(this.horzVal) * 150);
    } else {
      this.horzVal = 0;
      this.sprite.setX(mint.getBaseWidth() / 2);
    }
    
    if (this.isMovingVert) {
      this.vertVal += 0.055;
      this.sprite.setY(mint.getBaseHeight() / 2 + Math.sin(this.vertVal) * 75);
    } else {
      this.vertVal = 0;
      this.sprite.setY(mint.getBaseHeight() / 2);
    }
    
    
    this.sprite.setScaleX((this.isMagnified ? 2 : 1));
    this.sprite.setScaleY((this.isMagnified ? 2 : 1));
  }
}