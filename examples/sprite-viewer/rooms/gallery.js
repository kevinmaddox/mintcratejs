'use strict';

import { Button } from "../objects/button.js";

export class Gallery {
  load(engine) {
    this.mint = engine;
    let mint = this.mint;
    
    mint.setRoomBackgroundColor(128, 128, 128);
    
    mint.configureRoomFadeIn(15, 15, {r: 0, g: 0, b: 0});
    
    this.bg = mint.bg.addBackdrop('clouds', 0, 0);
    let cbTop = mint.bg.addBackdrop('checkerboard-top', 0, 0, {width: mint.getBaseWidth()});
    let cbBot = mint.bg.addBackdrop('checkerboard-bot', 0, 0, {width: mint.getBaseWidth()});
    cbBot.setY(mint.getBaseHeight() - cbBot.getImageHeight());
    cbTop.setBlendMode("multiply");
    cbBot.setBlendMode("multiply");
    
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
    
    this.infoF = mint.fg.addParagraph('retro-white', 4, 4, this.spriteNames[0]);
    this.infoB = mint.bg.addParagraph('retro-black', 5, 5, this.spriteNames[0]);
    
    let btnNames = [
      'bg',
      'rotate',
      'movehorz',
      'movevert',
      'magnify',
      'arrowleft',
      'arrowright',
    ];
    
    this.isRotating = false;
    this.angle = 0;
    
    this.isMovingHorz = false;
    this.horzVal = 0;
    
    this.isMovingVert = false;
    this.vertVal = 0;
    
    this.isMagnified = false;
    
    this.isOverButton = false;
    
    this.btns = {};
    
    for (let i = 0; i < btnNames.length; i++) {
      this.btns[btnNames[i]] = new Button(
        this.mint,
        mint.getBaseWidth() / 2 + ((i-3) * 24) - 8,
        mint.getBaseHeight() - 16 * 2,
        btnNames[i]
      );
    }
    
    this.btns.bg.setClickCallback(() => {
      this.bg.setVisibility(!this.bg.isVisible());
    });
    
    this.btns.rotate.setClickCallback(() => {
      this.isRotating = !this.isRotating;
    });
    
    this.btns.movehorz.setClickCallback(() => {
      this.isMovingHorz = !this.isMovingHorz;
    });
    
    this.btns.movevert.setClickCallback(() => {
      this.isMovingVert = !this.isMovingVert;
    });
    
    this.btns.magnify.setClickCallback(() => {
      this.isMagnified = !this.isMagnified;
    });
    
    this.btns.arrowleft.setClickCallback(() => {
      this.currentSpriteIndex++;
      if (this.currentSpriteIndex >= this.spriteNames.length) {
        this.currentSpriteIndex = 0;
      }
      
      let spriteName = this.spriteNames[this.currentSpriteIndex];
      this.sprite.playAnimation(spriteName);
      this.infoF.setTextContent(spriteName);
      this.infoB.setTextContent(spriteName);
    });
    
    this.btns.arrowright.setClickCallback(() => {
      this.currentSpriteIndex--;
      if (this.currentSpriteIndex < 0) {
        this.currentSpriteIndex = this.spriteNames.length - 1;
      }
      
      let spriteName = this.spriteNames[this.currentSpriteIndex];
      this.sprite.playAnimation(spriteName);
      this.infoF.setTextContent(spriteName);
      this.infoB.setTextContent(spriteName);
    });
  }
  
  update() {
    let mint = this.mint;
    
    for (const btnName in this.btns) {
      let btn = this.btns[btnName];
      btn.update();
    }
    
    // Sprite rotation
    if (this.isRotating) {
      this.angle++;
      this.sprite.rotate(1);
    } else {
      this.angle = 0;
      this.sprite.setAngle(0);
    }
    
    // Sprite horizontal movement
    if (this.isMovingHorz) {
      this.horzVal += 0.025;
      this.sprite.setX(mint.getBaseWidth() / 2 + Math.sin(this.horzVal) * 150);
    } else {
      this.horzVal = 0;
      this.sprite.setX(mint.getBaseWidth() / 2);
    }
    
    // Sprite vertical movement
    if (this.isMovingVert) {
      this.vertVal += 0.055;
      this.sprite.setY(mint.getBaseHeight() / 2 + Math.sin(this.vertVal) * 75);
    } else {
      this.vertVal = 0;
      this.sprite.setY(mint.getBaseHeight() / 2);
    }
    
    // Sprite scale
    this.sprite.setScaleX((this.isMagnified ? 2 : 1));
    this.sprite.setScaleY((this.isMagnified ? 2 : 1));
  }
}