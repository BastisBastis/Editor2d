import Phaser from "phaser"
import { EventCenter } from "./EventCenter"

export class Controls {
  
  constructor(scene) {
    this.scene=scene;
    scene.input.addPointer(1)
    this.enabled=true
    
    this.setupKeyboardControls()
    this.setupTouch()
    
    
  }
  
  setupTouch() {
    EventCenter.on("joystickUpdate",(data)=>{
      EventCenter.emit("setMovementAxis",data)
    })
    let jumpPointer=null
    this.scene.input.on("pointerdown",(p)=>{
      if (p.x<this.scene.cameras.main.centerX) {
        jumpPointer=p.id
        EventCenter.emit("requestJump")
      }
    })
    
    this.scene.input.on("pointerup",(p)=>{
      if (p.id===jumpPointer) {
        this.jumpPointer=null
        EventCenter.emit("stopRequestingJump")
      }
    })
  }
  
  setupKeyboardControls() {
    
    
    this.scene.input.keyboard.on("keydown", e=>this.keyDown(e))
    this.scene.input.keyboard.on("keyup", e=>this.keyUp(e))
  }
  
  getEventCursor(event) {
    let cursor=null;
    switch (event.which) {
      case 87:
      case 119:
        cursor="up"
        break
      case 65:
      case 97:
        cursor="left"
        break
      case 83:
      case 115:
        cursor="down"
        break
      case 68:
      case 100:
        cursor="right"
        break
      case 82:
        EventCenter.emit("restartLevel")
        
        
    }
    return cursor
  }
  
  keyDown(event) {
    if (!this.enabled)
      return
    const cursor=this.getEventCursor(event);
    if (cursor) {
      EventCenter.emit("setMovementCursor",{cursor:cursor,value:true}) 
    } 
  }
  
  keyUp(event) {
    if (!this.enabled)
      return
    const cursor=this.getEventCursor(event);
    if (cursor) {
      EventCenter.emit("setMovementCursor",{cursor:cursor,value:false})
  } 
  }
  
  disable() {
    this.enabled=false
  }
  
  enable() {
    
    this.enabled=true
  }
  
   setupGamepad() {
     this.scene.input.gamepad.once('down', function (pad, button, index) {
      this.pad=pad
    }, this)
    this.savedPadButtons={
      up:false,
      down:false,
      left:false,
      right:false
    }
   }
   
   update(time,dt) {
     if (this.pad) {
       EventCenter.emit("updateCursor",{key:"left",value:this.pad.left})
     }
     
   }
  
}