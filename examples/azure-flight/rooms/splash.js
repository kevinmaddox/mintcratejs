'use strict';

export class Splash {
  load(engine) {
    this.mint = engine;
    
    let mint = this.mint;
    let obj = this.mint.obj;
    
    mint.setRoomBackgroundColor(255, 255, 255);
    
    mint.configureRoomFadeIn( 15, 15, {r: 255, g: 255, b: 255});
    mint.configureRoomFadeOut(15, 30, {r: 255, g: 255, b: 255});
    
    mint.obj.harpy = mint.bg.addBackdrop("harpy", 0, 52);
    mint.obj.harpy.setX(
      (mint.getBaseWidth()/2) - (mint.obj.harpy.getWidth()/2) - 4
    );
    
    mint.obj.copyright = mint.bg.addParagraph(
      "system_dialog",
      mint.getBaseWidth() / 2,
      mint.obj.harpy.getY() + 40,
      "Studio Densetsu",
      {alignment: "center"}
    );
    
    mint.delayFunction(() => {
      mint.changeRoom(mint.roomList.Title);
    }, 120);
  }
}