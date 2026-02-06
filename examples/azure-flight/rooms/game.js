/*
  Important Note
  
  The formulas and values in this code can be a bit weird. I cobbled them
  together back in 2016 for the original version of Azure Flight. I didn't
  totally know what I was doing back then.
  
  Furthermore, the original game was written with a variable timestep, whereas
  MintCrate runs with a fixed timestep, further adding to the complications and
  weirdness. This is why a lot of numbers are divided by 60.
  
  For the sake of consistency between the versions, I'm choosing to keep it the
  same, weirdness and all. Please understand that this is, once again, based on
  very old code. This is not out of laziness and, in fact, I've made a great
  effort to keep the physics as close as possible to the original Android
  version.
*/

'use strict';

import { Button } from "../objects/button.js";
import { PhysicsObjectConverter } from "../objects/physicsobjectconverter.js";

export class Game {
  load(engine) {
    this.mint = engine;
    let mint = this.mint;
    
    mint.configureRoomFadeIn(15, 0, {r: 0,g: 0,b: 0});
    mint.configureRoomFadeOut(15, 15, {r: 0,g: 0,b: 0});
    
    mint.bg.addBackdrop('mountains');
    
    mint.playBgm('tangent');
    
    this.WATER_LINE_Y = 156;
    // this.waterLine = mint.fg.addActive('water', 0, 156);
    
    this.dangerIconDown = mint.fg.addActive('danger-down', 201, 133);
    this.dangerIconUp = mint.fg.addActive('danger-up', 201, 3);
    this.dangerIconDown.setOpacity(0.6);
    this.dangerIconUp.setOpacity(0.6);
    
    this.ready = mint.fg.addBackdrop('ready', 0, 24);
    this.ready.setX(mint.getBaseWidth() / 2 - this.ready.getWidth() / 2);
    
    this.instructions = mint.fg.addParagraph('ui-main', mint.getBaseWidth() / 2, 0, 'TAP & HOLD\nTO FLY', {alignment: 'center'});
    this.sineWaveTicks = 0;
    
    this.readyHighScoreDisplay =
      mint.fg.addParagraph('title-high-score', 2, 0, 'HIGH '+mint.globals.highScore);
    this.readyHighScoreDisplay.setY(mint.getBaseHeight() -
      this.readyHighScoreDisplay.getGlyphHeight() - 2);
    
    this.poles = [
      mint.fg.addActive('post-pole', 112, 148),
      mint.fg.addActive('post-pole', 128, 148),
      mint.fg.addActive('post-top',  120, 136)
    ];
    
    for (const pole of this.poles) {
      PhysicsObjectConverter.convert(pole, 4.0 / 60);
    }
    
    this.splashes = [];
    this.droplets = [];
    this.stars = [];
    this.shadows = [];
    this.initialShadowsCreated = false;
    
    this.harpy = mint.fg.addActive('harpy', 120, 124);
    PhysicsObjectConverter.convert(this.harpy, 5.5 / 60);
    this.harpy.lift = this.harpy.gravity;
    this.harpy.flapSoundDelay = 0;
    this.harpy.treadDelay = 0;
    this.harpy.wasHit = false;
    this.harpy.hitAngle = 0;
    
    this.TOTAL_BOULDERS = 5;
    this.TOTAL_BOULDER_ROWS = 6;
    this.BOULDER_ROWS_STARTING_Y = 4;
    this.BOULDER_ROWS_SPACING = 1;
    this.BOULDER_MAX_SPEED = (150 / 60);
    this.boulders = [];
    this.boulderSpawnTimer = 0;
    this.boulderRowOccupancy = [];
    for (let i = 0; i < this.TOTAL_BOULDER_ROWS; i++) {
      this.boulderRowOccupancy[i] = false;
    }
    
    this.state = "ready";
  }
  
  update() {
    let mint = this.mint;
    
    let inputReceived =
      (mint.mouseHeld(0) || mint.inputs[0].held('j'));
    
    // State: Ready to play ----------------------------------------------------
    if (this.state === "ready") {
      // Create Harpy's and logs' shadows
      if (!this.initialShadowsCreated) {
        this.createShadow(this.harpy);
        
        for (const pole of this.poles) {
          this.createShadow(pole);
        }
        
        this.initialShadowsCreated = true;
      }
      
      // Floating effect for instructions text
      this.sineWaveTicks += 0.1;
      this.instructions.setY(3 * Math.sin(this.sineWaveTicks) + 68);
      
      // Start actually playing the game when the user clicks
      if (inputReceived) {
        this.state = 'playing';
        this.ready = this.ready.destroy();
        this.instructions = this.instructions.destroy();
        this.dangerIconDown = this.dangerIconDown.destroy();
        this.dangerIconUp = this.dangerIconUp.destroy();
        this.readyHighScoreDisplay.destroy();
        
        // Initialize score-tracking objects
        this.score = 0;
        this.scoreDisplay = mint.bg.addParagraph('ui-main', mint.getBaseWidth() / 2, 12, '0', {alignment: 'center'});
        this.scoreDisplayHigh = mint.bg.addParagraph('ui-gold-numbers', mint.getBaseWidth() / 2, 12, '', {alignment: 'center'});
        this.scoreDisplayHigh.setVisibility(false);
        
        // Drop starting platform into river
        for (const pole of this.poles) {
          pole.isFalling = true;
          let dir = mint.util.randomChoice(-1, 1);
          pole.setXSpeed((0.67 + (mint.math.randomInt(0, 20) * 0.01)) * dir);
        }
      }
      
    // State: Playing the game -------------------------------------------------
    } else if (this.state === "playing") {
      if (this.harpy.wasHit) { inputReceived = false; }
      
      // Spawn boulders
      if (
        this.boulders.length < this.TOTAL_BOULDERS
        && this.boulderSpawnTimer <= 0
      ) {
        this.boulderSpawnTimer = 240;
        let boulder = mint.fg.addActive('boulder', -64, -64);
        PhysicsObjectConverter.convert(boulder, 5.5 / 60);
        boulder.currentSpeed = (80 / 60);
        boulder.currentRow = 1;
        boulder.hasGivenScore = false;
        this.boulders.push(boulder);
        this.repositionBoulder(boulder);
        this.createShadow(boulder);
        boulder.sendToBack();
      }
      this.boulderSpawnTimer--;
      
      // Player movement (harpy flight)
      if (inputReceived && this.harpy.ySpeed < 0) {
        this.harpy.addYSpeed(this.harpy.lift * 2);
      } else if (inputReceived) {
        this.harpy.addYSpeed((1.5-this.harpy.ySpeed/(233/60)) * this.harpy.lift);
      } else {
        this.harpy.addYSpeed(-this.harpy.gravity);
      }
      
      // Update player position.
      this.harpy.updatePhysics();
      
      // Handle harpy animations.
      if (inputReceived) {
        this.harpy.playAnimation('flap');
      } else if (!this.harpy.wasHit) {
        this.harpy.playAnimation('fall');
      } else {
        this.harpy.hitAngle += (-this.harpy.xSpeed / (15 / 60));
        let angle = Math.abs(this.harpy.hitAngle);
        if     (angle >=   0.0 && angle <  22.5) {
          this.harpy.playAnimation('hit01');
        } else if (angle >=  22.5 && angle <  67.5) {
          this.harpy.playAnimation('hit02');
        } else if (angle >=  67.5 && angle < 112.5) {
          this.harpy.playAnimation('hit03');
        } else if (angle >= 112.5 && angle < 157.5) {
          this.harpy.playAnimation('hit04');
        } else if (angle >= 157.5 && angle < 180.0) {
          this.harpy.playAnimation('hit05');
        }
        
        this.harpy.flipHorizontally((this.harpy.hitAngle < 0));
      }
      
      // Play flapping sound.
      if (inputReceived && this.harpy.flapSoundDelay <= 0) {
        mint.playSfx('flap', {pitch: 0.875 + (Math.random() / 4)});
        this.harpy.flapSoundDelay = 15;
      } else if (!inputReceived) {
        this.harpy.flapSoundDelay = 0;
      }
      this.harpy.flapSoundDelay = this.harpy.flapSoundDelay - 1;
      
      // Process player-boulder collision
      for (const boulder of this.boulders) {
        if (
          !boulder.isFalling
          && mint.testActiveCollision(this.harpy, boulder)
        ) {
          // Play sound
          if (!this.harpy.wasHit) {
            mint.playSfx('impact-big');
          } else {
            mint.playSfx('impact');
          }
          
          // Mark objects as being hit
          boulder.isFalling = true;
          this.harpy.wasHit = true;
          
          // Bounce objects due to impact
          let bounceSpeed = Math.abs(boulder.xSpeed);
          let bounceDir = -1;
          if (this.harpy.getX() > boulder.getX()) { bounceDir = 1; }
          
          this.harpy.setXSpeed(bounceSpeed * bounceDir / 1.5);
          boulder.setXSpeed(bounceSpeed * bounceDir / 1.5 * -1);
          
          this.harpy.setYSpeed(this.harpy.ySpeed * -0.5);
          if (this.harpy.ySpeed < 0) {
            this.harpy.setYSpeed(mint.math.randomInt(0, 19) / 60);
          }
          boulder.setYSpeed(bounceSpeed);
          
          // Create stars effect
          let starPos = mint.math.midpoint(
            this.harpy.getX(), this.harpy.getY(),
            boulder.getX(), boulder.getY()
          );
          this.createStars(starPos.x, starPos.y);
        }
      }
      
      // Kill player if they go too high
      if (this.harpy.getY() < 0) {
        mint.playSfx('impact-big');
        
        this.harpy.wasHit = true;
        this.harpy.setY(0);
        this.harpy.setYSpeed(0);
        
        let dir = mint.util.randomChoice(-1, 1);
        this.harpy.setXSpeed((4/60) * mint.math.randomInt(0, 5) * dir);
        
        this.createStars(this.harpy.getX(), 0);
      }
      
      // Create water splashes when player treads water
      if (
        (this.harpy.getY() + this.harpy.getSpriteHeight()/2) >= this.WATER_LINE_Y
        && this.harpy.treadDelay <= 0
        && !this.harpy.wasHit
      ) {
          this.harpy.treadDelay = 0.2;
          this.createWaterSplash(this.harpy.getX(), 0.05, 0.25);
          this.createDroplets(this.harpy.getX(), 2, true);
          mint.playSfx('tread');
      }
      
      this.harpy.treadDelay -= (1 / 60);
      
      // Handle scoring
      for (const boulder of this.boulders) {
        if (!boulder.hasGivenScore && !this.harpy.wasHit) {
          if (
            (
              boulder.xSpeed > 0
              && boulder.getX() >= (this.harpy.getX() + boulder.getColliderRadius())
            )
            ||
            (
              boulder.xSpeed < 0
              && boulder.getX() <= (this.harpy.getX() - boulder.getColliderRadius())
            )
          ) {
            this.score++;
            boulder.hasGivenScore = true;
          }
        }
      }
      this.scoreDisplay.setTextContent(this.score);
      this.scoreDisplayHigh.setTextContent(this.score);
      if (this.score > mint.globals.highScore) {
        this.scoreDisplay.setVisibility(false);
        this.scoreDisplayHigh.setVisibility(true);
      }
      
      // Rearrange draw orders
      // this.waterLine.bringToFront();
      for (const shadow of this.shadows) {
        shadow.sendToBack();
        shadow.bottom.bringToFront();
      }
      
      // Show game over screen if player goes too low
      if (this.harpy.getY() > mint.getBaseHeight()) {
        mint.playSfx('splash-big');
        
        this.createWaterSplash(this.harpy.getX());
        this.createDroplets(this.harpy.getX());
        
        this.scoreDisplay.destroy();
        this.scoreDisplayHigh.destroy();
        
        this.state = 'gameover';
        
        this.overlayBlack = mint.fg.addActive('overlay', 0, 0);
        this.overlayBlack.setOpacity(0.5);
        this.overlayBlack.playAnimation('black');
        
        this.overlayWhite = mint.fg.addActive('overlay', 0, 0);
        this.overlayWhite.playAnimation('white');
      }
      
    // State: Game over screen -------------------------------------------------
    } else if (this.state === "gameover") {
      if (this.harpy.exists()) {
        if (this.score > mint.globals.highScore) {
          mint.globals.highScore = this.score;
        }
        
        this.harpy.destroy();
        
        mint.fg.addParagraph('ui-main', mint.getBaseWidth() / 2, 35,
          'SCORE '+this.score, {alignment: 'center'});
        mint.fg.addParagraph('ui-main', mint.getBaseWidth() / 2, 53,
          'BEST '+mint.globals.highScore, {alignment: 'center'});
          
        this.btnRetry = new Button(mint,
          56, 72,
          128, 24,
          'RETRY', 'w', false,
          () => {
            mint.changeRoom(mint.roomList.Game, {persistAudio: true});
          }
        );
        
        this.btnMenu = new Button(mint,
          56, 96,
          128, 24,
          'MENU', 's', false,
          () => {
            mint.changeRoom(mint.roomList.Title, {fadeMusic: true});
          }
        );
      }
      
      // Fade flash overlay
      this.overlayWhite.adjustOpacity(-0.05);
      
      this.btnRetry.update();
      this.btnMenu.update();
    }
    
    // Process for all states --------------------------------------------------
    // Handle starting platforms poles/logs.
    for (let i = this.poles.length - 1; i >= 0; i--) {
      let pole = this.poles[i];
      
      pole.updatePhysics();
      
      // Remove pole if it falls into the water.
      if (pole.getY() > 156) {
        this.createWaterSplash(pole.getX());
        this.createDroplets(pole.getX());
        pole.destroy();
        this.poles.splice(i, 1);
        mint.playSfx('splash');
      }
    }
    
    // Handle boulders.
    for (let i = this.boulders.length - 1; i >= 0; i--) {
      let boulder = this.boulders[i];
      
      // Update boulder's physics simulation
      boulder.updatePhysics();
      
      // Rotate boulder
      boulder.rotate(boulder.xSpeed / (30 / 60));
      
      // Remove boulder if it falls into the water
      if (boulder.getY() > mint.getBaseHeight() + boulder.getColliderRadius()) {
        mint.playSfx('splash');
        this.createWaterSplash(boulder.getX());
        this.createDroplets(boulder.getX());
        boulder.destroy();
        this.boulders.splice(i, 1);
      }
    }
    
    // Reposition boulders if they've left the screen
    for (let i = this.boulders.length - 1; i >= 0; i--) {
      let boulder = this.boulders[i];
      if (
        (
          boulder.xSpeed > 0
          && boulder.getX() > (mint.getBaseWidth() + boulder.getColliderRadius())
        ) ||
        (
          boulder.xSpeed < 0
          && boulder.getX() < (0 - boulder.getColliderRadius())
        )
      ) {
        if (this.state === "playing") {
          this.repositionBoulder(boulder);
        } else {
          boulder.destroy();
          this.boulders.splice(i, 1);
        }
      }
    }
    
    // Handle water splashes
    for (let i = this.splashes.length - 1; i >= 0; i--) {
      let splash = this.splashes[i];
      
      splash.scaleSpeed -= 0.002917;
      
      splash.scaleX(0.0375);
      splash.scaleY(splash.scaleSpeed);
      
      splash.adjustOpacity(-0.01667);
      
      // Remove splash if it's no longer visible.
      if (splash.getScaleY() <= 0 || splash.getOpacity() <= 0) {
        splash.destroy();
        this.splashes.splice(i, 1);
      }
    }
    
    // Handle water droplets
    for (let i = this.droplets.length - 1; i >= 0; i--) {
      let droplet = this.droplets[i];
      droplet.updatePhysics();
      // Remove droplet if it's no longer visible.
      if (droplet.getY() > 160) {
        droplet.destroy();
        this.droplets.splice(i, 1);
      }
    }
    
    // Handle stars
    for (let i = this.stars.length - 1; i >= 0; i--) {
      let star = this.stars[i];
      star.updatePhysics();
      // Decrease star's lifespan and remove when it's dead.
      if (star.lifespan > 0) {
        star.lifespan -= (1 / 60);
        star.setOpacity(star.lifespan / star.totalLifespan);
      } else {
        star.destroy();
        this.stars.splice(i, 1);
      }
    }
    
    // Handle shadows
    for (let i = this.shadows.length - 1; i >= 0; i--) {
      let shadow = this.shadows[i];
      if (shadow.entity.exists()) {
        shadow.setX(shadow.entity.getX());
        shadow.setY(157 - 1);
        
        shadow.bottom.setX(shadow.getX());
        shadow.bottom.setY(shadow.getY());
        
        // Set opacity and scaling values
        let entityBottomY =
          shadow.entity.getY() + (shadow.entity.getSpriteHeight() / 2);
        
        let maxScale =
          shadow.entity.getSpriteWidth() / shadow.getSpriteWidth();
        let scale = (entityBottomY / 157) * maxScale;
        
        shadow.setScaleX(scale);
        shadow.bottom.setScaleX(scale);
        
        shadow.setScaleY(scale);
        shadow.bottom.setScaleY(scale);
        
        let alpha = entityBottomY / 157;
        shadow.setOpacity(alpha);
        shadow.bottom.setOpacity(alpha);
      } else {
        shadow.bottom.destroy();
        shadow.destroy();
        this.shadows.splice(i, 1);
      }
    }
  }
  
  createWaterSplash(x, scaleSpeed = 0.0667, scaleX = 0.85) {
    let splash = this.mint.fg.addActive('splash', x, this.WATER_LINE_Y);
    splash.scaleSpeed = scaleSpeed;
    splash.setScaleX(scaleX);
    splash.setScaleY(0);
    
    if (this.state === "gameover") {
      splash.sendToBack();
    }
    
    this.splashes.push(splash);
  }
  
  createDroplets(x, numDrops = 4, weak = false) {
    for (let i = 0; i < numDrops; i++) {
      let xSpeed = this.mint.math.randomInt(0, 100) * 0.01;
      let ySpeed = 1.5 + (this.mint.math.randomInt(1, 75) * 0.01);
      
      if (weak) {
        xSpeed *= 0.75;
        ySpeed *= 0.75;
      }
      
      let droplet = this.mint.fg.addActive('droplet', x, this.WATER_LINE_Y);
      PhysicsObjectConverter.convert(droplet, (4.5 / 60));
      droplet.isFalling = true;
      droplet.setOpacity(0.75);
      droplet.playAnimation('0' + this.mint.math.randomInt(1, 3));
      
      let dir = this.mint.util.randomChoice(-1, 1);
      droplet.setXSpeed(xSpeed * dir);
      droplet.setYSpeed(ySpeed);
      
      if (this.state === 'gameover') { droplet.sendToBack(); }
      
      this.droplets.push(droplet);
    }
  }
  
  createStars(x, y) {
    for (let i = 0; i < 10; i++) {
      let star = this.mint.fg.addActive(
        'star',
        x - 5 + this.mint.math.randomInt(0, 10),
        y - 5 + this.mint.math.randomInt(0, 10)
      );
      PhysicsObjectConverter.convert(star, 5.5 / 60);
      
      star.playAnimation('0'+this.mint.math.randomInt(1, 4));
      
      let angle = this.mint.math.randomInt(0, 359);
      let speed = (20 + this.mint.math.randomInt(0, 59)) / 60;
      
      star.setXSpeed(speed * Math.cos(this.mint.math.rad(angle)));
      star.setYSpeed(-speed * Math.sin(this.mint.math.rad(angle)));
      
      star.setAngle(angle);
      
      star.totalLifespan = 0.5;
      star.lifespan = star.totalLifespan;
      
      this.stars.push(star);
    }
  }
  
  createShadow(targetEntity) {
    let shadow = this.mint.fg.addActive('shadow-top', 0, 0);
    shadow.bottom = this.mint.fg.addActive('shadow-bottom', 0, 0);
    shadow.entity = targetEntity;
    this.shadows.push(shadow)
  }
  
  repositionBoulder(boulder) {
    if (boulder.isFalling) { return; }
    
    // Determine which rows are not occupied by a boulder
    let availableRows = [];
    
    for (let row = 0; row < this.boulderRowOccupancy.length; row++) {
      let isOccupied = this.boulderRowOccupancy[row];
      if (!isOccupied) {
        availableRows.push(row);
      }
    }
    
    // Pick a random row
    let targetRow = availableRows[this.mint.math.randomInt(0, availableRows.length-1)];
    boulder.currentRow = targetRow;
    
    // Pick a random side
    let dir = this.mint.util.randomChoice(-1, 1);
    
    // Warp boulder
    if (dir == 1) {
      boulder.setX(0 - boulder.getColliderRadius());
    } else {
      boulder.setX(this.mint.getBaseWidth() + boulder.getColliderRadius());
    }
    
    boulder.setY(
      (this.BOULDER_ROWS_STARTING_Y + boulder.getColliderRadius()) +
      (boulder.getColliderRadius() * 2 * targetRow) +
      (this.BOULDER_ROWS_SPACING * targetRow)
    );
    
    // Set boulder's speed/direction
    boulder.setXSpeed(
      (boulder.currentSpeed + (this.mint.math.randomInt(1, 30) / 60)) * dir
    );
    
    if (boulder.currentSpeed < this.BOULDER_MAX_SPEED) {
      boulder.currentSpeed += (1 / 60);
    }
    
    // Reset boulder's scoring flag
    boulder.hasGivenScore = false;
    
    // Update row-occupancy states
    for (let i = 0; i < this.boulderRowOccupancy.length; i++) {
      this.boulderRowOccupancy[i] = false;
    }
    
    for (const boulder of this.boulders) {
      this.boulderRowOccupancy[boulder.currentRow] = true;
    }
  }
  
}