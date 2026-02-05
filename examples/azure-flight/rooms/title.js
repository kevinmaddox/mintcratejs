'use strict';

import { Button } from "../objects/button.js";

export class Title {
  load(engine) {
    this.mint = engine;
    let mint = this.mint;
    
    if (mint.globals.enteringFromSplashScreen) {
      mint.configureRoomFadeIn(15, 0, {r: 255, g: 255, b: 255});
    } else {
      mint.configureRoomFadeIn(15, 15, {r: 0, g: 0, b: 0});
    }
    mint.configureRoomFadeOut(15, 30, {r: 0, g: 0, b: 0});
    
    mint.playBgm('select-your-whatever-2k15');
    
    this.background = mint.bg.addBackdrop('menu-bg', 0, 0, {width: 272, height: 192});
    this.background.setX(-this.background.getImageWidth());
    this.background.setY(-this.background.getImageHeight());
    
    this.logoShadow = mint.bg.addBackdrop('logo-shadow', 0, 16);
    this.logoShadow.setX(mint.getBaseWidth() / 2 - this.logoShadow.getWidth() / 2);
    
    this.logo = mint.bg.addBackdrop('logo', 0, 0);
    this.logo.setX(this.logoShadow.getX());
    
    this.sineWaveTicks = 0.2;
    
    let uiTopY = 86;
    this.btnStart = new Button(mint,
      56, uiTopY,
      128, 24,
      'PLAY', 'w', false,
      () => {
        mint.globals.enteringFromSplashScreen = false;
        mint.changeRoom(mint.roomList.Game, {fadeMusic: true});
      }
    );
    
    this.btnBgm = new Button(mint,
      56, uiTopY + 24,
      64, 24,
      'BGM', 'a', true,
      (enabled) => {
        mint.globals.bgmOn = enabled;
        mint.setBgmVolume((enabled) ? 1 : 0);
      }
    );
    
    this.btnSfx = new Button(mint,
      120, uiTopY + 24,
      64, 24,
      'SFX', 'd', true,
      (enabled) => {
        mint.globals.sfxOn = enabled;
        mint.setSfxVolume((enabled) ? 1 : 0);
      }
    );
  }
  
  update() {
    let mint = this.mint;
    
    // Scroll background
    this.background.setX(this.background.getX() + 0.75);
    this.background.setY(this.background.getY() + 0.75);
    if (this.background.getX() >= 0) { this.background.setX(-this.background.getImageWidth()); }
    if (this.background.getY() >= 0) { this.background.setY(-this.background.getImageHeight()); }
    
    // Float logo text
    // I wrote this math a long time ago and barely remember why it is the way
    // it is, lol. However, it works.
    this.sineWaveTicks += 0.01;
    let logoPosition =
      Math.floor((2.5 * Math.sin(this.sineWaveTicks * 0.9 * Math.PI / 0.5)) + this.logoShadow.getY() - 2);
    this.logo.setY(logoPosition);
    
    // Update buttons
    this.btnStart.update();
    this.btnBgm.update();
    this.btnSfx.update();
  }
}