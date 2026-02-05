'use strict';

export class Splash {
  load(engine) {
    this.mint = engine;
    let mint = this.mint;
    
    mint.setRoomBackgroundColor(255, 255, 255);
    
    mint.configureRoomFadeIn( 15, 15, {r: 255, g: 255, b: 255});
    mint.configureRoomFadeOut(15, 30, {r: 255, g: 255, b: 255});
    
    this.harpy = mint.bg.addBackdrop("harpy", 0, 52);
    this.harpy.setX(
      (mint.getBaseWidth()/2) - (this.harpy.getWidth()/2) - 4
    );
    
    this.copyright = mint.bg.addParagraph(
      "system_dialog",
      mint.getBaseWidth() / 2,
      this.harpy.getY() + 40,
      "Studio Densetsu",
      {alignment: "center"}
    );
    
    mint.delayFunction(() => {
      mint.changeRoom(mint.roomList.Title);
    }, 120);
  }
}