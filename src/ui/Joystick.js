import Phaser from "phaser"


export class Joystick {
  constructor({
    scene,
    onChange=()=>false,
    origin,
    touchArea=()=>true,
    maxJoystick=100,
    cursorDirThreshold=30,
    backgroundColor=0x000000,
    backgroundAlpha=0.4,
    markerColor=0x882222,
    depth=1000
  }) {
    this.enabled=true
    this.scene = scene;
    origin=origin 
      || ({
        x:scene.cameras.main.width*0.8,
        y:scene.cameras.main.height*0.2
      })
    
    this.steeringTouch = this.steeringTouch = {
      id:null,
      startX:null,
      startY:null,
          
    };
    this.current={
      magnitude:0,
      x:0,
      y:0,
      angle:0,
      cursors:{
        up:false,
        down:false,
        left:false,
        right:false
      }
    }
    

    this.background = scene.add.circle(
      origin.x,
      origin.y,
      50,
      backgroundColor,
      backgroundAlpha)
        .setScrollFactor(0)
        .setVisible(false)
        .setDepth(depth)
    this.marker = scene.add.circle(
      50,
      50,
      20,
      markerColor,
      1)
        .setScrollFactor(0)
        .setVisible(false)
        .setDepth(depth)
    
    //enable multi touch
    scene.input.addPointer(3);
    
    
      
    
    //Register new touches
    scene.input.on("pointerdown", pointer => {
      if (!this.enabled)
        return
      if (!this.steeringTouch.id && touchArea(pointer.x,pointer.y)) {
        
        this.steeringTouch = {
          id:pointer.id,
          startX:pointer.x,
          startY:pointer.y,
        };
        
        this.marker.x=this.background.x;
        this.marker.y=this.background.y;
        
        this.toggleJoystick(true)
        
      } 
    });
    
    scene.input.on("pointerup", pointer => {
      if (this.steeringTouch.id && this.steeringTouch.id === pointer.id) {
        
        this.steeringTouch = this.steeringTouch = {
          id:null,
          startX:null,
          startY:null,
          
        };
        this.current={
          magnitude:0,
          x:0,
          y:0,
          angle:0,
          cursors:{
            up:false,
            down:false,
            left:false,
            right:false
          }
        }
        this.marker.x=this.background.x;
        this.marker.y=this.background.y;
        this.toggleJoystick(false)
        onChange(this.current)
      } 
    });
    
    scene.input.on("pointermove", pointer => {
      try { 
      if (!this.enabled)
        return
      if (this.steeringTouch.id && this.steeringTouch.id === pointer.id) {
        
        let deltaX = Math.min(Math.max(this.steeringTouch.startX-pointer.x, -maxJoystick),maxJoystick);
        let deltaY = Math.min(Math.max(this.steeringTouch.startY-pointer.y, -maxJoystick),maxJoystick);
        if (deltaX > -10 && deltaX < 10) {
          deltaX = 0;
        }
        else {
          deltaX = deltaX>0 ? deltaX-10 : deltaX+10;
        }
        if (deltaY > -10 && deltaY < 10) {
          deltaY = 0;
        }
        else {
          deltaY = deltaY>0 ? deltaY-10 : deltaY+10;
        }
        
        const delta= new Phaser.Math.Vector2(deltaX,deltaY)
        this.current.magnitude=delta.length()
        this.current.angle=delta.angle()
        
        const dir=delta.normalize();
        this.current.x=-dir.x*Math.min(maxJoystick,this.current.magnitude);
        this.current.y=-dir.y*Math.min(maxJoystick,this.current.magnitude);
        this.current.cursors={
          up:deltaY>cursorDirThreshold,
          down:deltaY<-cursorDirThreshold,
          left:deltaX>cursorDirThreshold,
          right:deltaX<-cursorDirThreshold
        }
        
        this.marker.x=this.background.x+this.current.x
        this.marker.y=this.background.y+this.current.y
        
       
        onChange(this.current)
        
        
        
      } 
    } catch (er) {console.log(er.message,er.stack); throw er} 
    });
    
  }
  
  enable() {
    this.enabled=true
  }
  
  disable() {
    this.enabled=false
  }
  
  toggleJoystick(value) {
    this.background.visible=value;
    this.marker.visible=value
  }
  
  update() {
  }
}