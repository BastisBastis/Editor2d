import Phaser from "phaser"
import BgBlocker from "./BgBlocker"
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';


export class Window {
  
  constructor(scene,x,y,{
    width=300,
    height=150,
    depth=1,
    backgroundColor=0xffffff,
    borderColor=0x000000,
    borderThickness=10,
    blockBackground=false,
    blockAlpha=0,
    blockerTweenDuration=0,
    cornerRadius=0,
    onClick
  }={}) {
    if (blockBackground) {
      this.bgBlocker=new BgBlocker(scene,depth,blockAlpha,undefined,blockerTweenDuration)
    }
    this.scene=scene
      
    this._visible=true
    this.bg=new RoundRectangle(
      scene,
      x,
      y,
      width,
      height,
      cornerRadius,
      backgroundColor,
      1
    )
    
    scene.add.existing(this.bg)
    
    this._x=x
    this._y=y
    
    this.bg
      .setOrigin(0.5,0.5)
      .setStrokeStyle(borderThickness,borderColor,1)
      .setDepth(depth)
      .setInteractive()
      .on("pointerdown",(e)=>{
        e.event.preventDefault()
        e.event.stopPropagation()
        if (onClick)
          onClick()
      })
      
    this.children=[]
    
  }
  
  set x(val) {
    const d=val-this.x
    this._x=val
    this.bg.x=val
    this.children.forEach(child=>{
      child.x+=d
    })
  }
  
  get x(){
    return this._x
  }
  
  set y(val) {
    const d=val-this.y
    this._y=val
    this.bg.y=val
    this.children.forEach(child=>{
      child.y+=d
    })
  }
  
  get y(){
    return this._y
  }
  
  get visible() {
    return this._visible
  }
  
  set visible(val) {
    this.setVisible(val)
  }
  
  setVisible(val) {
    this._visible=val
    this.bg.visible=val
    return this
  }
  
  destroy() {
    if (this.bgBlocker) {
      this.bgBlocker.destroy()
    }
    this.bg.destroy()
  }
  
}