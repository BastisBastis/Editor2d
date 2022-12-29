import Phaser from "phaser"
import { GlobalStuff } from "../helpers/GlobalStuff"
import { EventCenter } from "../helpers/EventCenter" 

import {Window} from "./Window"

export class Button extends Window {
  
  constructor(scene,x,y,string,config={}) {
    const {
      fontSize=70,
      width=300,
      height=150,
      depth=1,
      fontFamily=GlobalStuff.FontFamily,
      fontColor="#000000",
      hoverFontColor=fontColor,
      downFontColor=fontColor,
      cornerRadius=8,
      borderThickness=2,
      backgroundColor=0xffffff,
      hoverBackgroundColor=0xff0000,
      downBackgroundColor=0x00ff00,
      
      onClick=()=>false,
      iconKey=null,
      requireDown=true
    }=config
    super(scene,x,y,{
      ...config,
      width,
      height,
      depth,
      cornerRadius,
      borderThickness,
      backgroundColor,
      onClick:undefined,
    })
      
    this.label=scene.add.text(x,y,string,{
      fontSize:fontSize,
      fontFamily:fontFamily,
      color:fontColor
    }).setOrigin(0.5,0.5)
      .setDepth(depth)
      
    this.down=false
    
    if (iconKey) {
     this.setIcon(iconKey)
    }
      
    this.bg.on('pointerover', () => {
      if (this.down)
        return
      this.bg.setFillStyle(hoverBackgroundColor,1)
          

      this.label.setColor(hoverFontColor)
      EventCenter.emit("playAudio",{key:"hover"})
        })
      .on('pointerout', () => {
          this.bg.setFillStyle(backgroundColor)
          this.down=false

          this.label.setColor(fontColor)
        })
      .on('pointerdown', () => {
          this.bg.setFillStyle(downBackgroundColor,1)
          this.down=true

          this.label.setColor(downFontColor)
          EventCenter.emit("playAudio",{key:"hover"})
        })
      .on('pointerup', () => {
        this.bg.setFillStyle(backgroundColor)
        EventCenter.emit("playAudio",{key:"click"})
          
        this.label.setColor(fontColor)
        
        if (this.down) {
          
          this.down=false
          onClick()
        }
        
          //this.scene.start("game")
          //EventCenter.emit("playAudio",{key:"hover"})
        })
        
        this.children.push(this.label)
  }
  
  
  
 setText(val) {
   this.label.text=val
 }
  
  setVisible(val) {
    super.setVisible(val)
    this.label.visible=val
    return this
  }
  
  setIcon(key) {
   if (this.icon) {
    this.icon.destroy()
   }
   if (!key) {
    this.icon=null
    return this
   }
    
    
    this.icon=this.scene.add.image(
     this.x,
     this.y,
     key
    ).setDepth(this.depth)
     .setOrigin(0.5,0.5)
     
    const scale=Math.min(
     this.width/this.icon.width,
     this.height/this.icon.height
    )*0.8
    
    this.icon.setScale(scale)
    
    return this
  }
  
  destroy() {
    super.destroy()
    this.label.destroy()
    if (this.icon)
     this.icon.destroy()
  }
  
}