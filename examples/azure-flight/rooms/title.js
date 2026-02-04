'use strict';

import { Button } from "../objects/button.js";

export class Title {
  load(engine) {
    this.mint = engine;
    
    let mint = this.mint;
    let obj = this.mint.obj;
    
    if (mint.globals.enteringFromSplashScreen) {
      mint.configureRoomFadeIn(15, 0, {r: 255, g: 255, b: 255});
    } else {
      mint.configureRoomFadeIn(15, 15, {r: 0, g: 0, b: 0});
    }
    mint.configureRoomFadeOut(15, 30, {r: 0, g: 0, b: 0});
    
    mint.playBgm('select-your-whatever-2k15');
    
    obj.background = mint.bg.addBackdrop('menu-bg', 0, 0, {width: 272, height: 192});
    obj.background.setX(-obj.background.getImageWidth());
    obj.background.setY(-obj.background.getImageHeight());
    
    obj.logoShadow = mint.bg.addBackdrop('logo-shadow', 0, 10);
    obj.logoShadow.setX(mint.getBaseWidth() / 2 - obj.logoShadow.getWidth() / 2);
    
    obj.logo = mint.bg.addBackdrop('logo', 0, 0);
    obj.logo.setX(obj.logoShadow.getX());
    
    this.sineWaveTicks = 0.2;
    
    this.btnStart = new Button(mint,
      56, 72,
      128, 24,
      'PLAY', 'w', false,
      () => {
        mint.globals.enteringFromSplashScreen = false;
        // mint.changeRoom(mint.roomList.Game, {fadeMusic: true});
      }
    );
    
    this.btnBgm = new Button(mint,
      56, 96,
      64, 24,
      'BGM', 'a', true,
      (enabled) => {
        mint.globals.bgmOn = enabled;
        let vol = (enabled) ? 1 : 0;
        mint.setBgmVolume(vol);
      }
    );
    /*
    o.btnSfx = Button:new(120, 96, 64, 'SFX', true, function(enabled)
      globals.sfxOn = enabled
      local vol = 1
      if (not enabled) then vol = 0 end
      mint:setMasterSoundVolume(vol)
    end, false, 'right', globals.sfxOn)
    o.btnQuit = Button:new(56, 120, 128, 'QUIT', false, function()
      mint:quit(true)
    end, true, 'down')
    */
  }
  
  update() {
    let mint = this.mint;
    let obj = this.mint.obj;
    
    // Scroll background
    obj.background.setX(obj.background.getX() + 0.75);
    obj.background.setY(obj.background.getY() + 0.75);
    if (obj.background.getX() >= 0) { obj.background.setX(-obj.background.getImageWidth()); }
    if (obj.background.getY() >= 0) { obj.background.setY(-obj.background.getImageHeight()); }
    
    // Float logo text
    // I wrote this math a long time ago and barely remember why it is the way
    // it is, lol. However, it works.
    this.sineWaveTicks += 0.01;
    let logoPosition =
      Math.floor((2.5 * Math.sin(this.sineWaveTicks * 0.9 * Math.PI / 0.5)) + 8);
    obj.logo.setY(logoPosition);
    
    // Update buttons
    this.btnStart.update();
    // self.btnBgm:update()
    // self.btnSfx:update()
    // self.btnQuit:update()
  }
}