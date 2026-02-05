'use strict';

export class PhysicsObjectConverter {
  static convert(active, gravity) {
    active.xSpeed = 0;
    active.ySpeed = 0;
    active.gravity = gravity;
    
    active.isFalling = false;
    
    active.addYSpeed = function(val) {
      active.ySpeed += val;
    };
    
    active.setYSpeed = function(val) {
      active.ySpeed = val;
    }
    
    active.setXSpeed = function(val) {
      active.xSpeed = val;
    }
    
    active.updatePhysics = function() {
      // Handle "falling" state
      if (active.isFalling) {
        active.ySpeed -= active.gravity;
        active.setAngle(active.getAngle() + active.xSpeed);
      }
      
      // Update X and Y positions
      // console.log(active.xSpeed, active.ySpeed);
      active.moveX(active.xSpeed);
      active.moveY(-active.ySpeed);
    }
    
  }
}