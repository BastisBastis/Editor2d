import Phaser from "phaser"
import {GlobalStuff} from "../helpers/GlobalStuff"
import {EventCenter} from "../helpers/EventCenter"

import {Window} from "./Window"
import { Button } from "./Button"


import { Palette } from "../data/Palette" 

export class VerticalButtonsWindow extends Window {
  
  constructor(
    scene,
    buttons=[],
    config={}
  ) {
    
    const {
      x=scene.cameras.main.centerX,
      y=scene.cameras.main.centerY,
      title=null,
      width=320,
      //height=600,
      depth=2000,
      fontFamily=GlobalStuff.FontFamily,
      fontColor="#000000",
      buttonFontColor=fontColor,
      hoverFontColor=fontColor,
      borderColor=Palette.brown1.hex,
      onConfirm=()=>false,
      onCancel=()=>false,
      confirmString="OK",
      cancelString="Cancel",
      buttonFontSize=32,
      labelFontSize=40,
      blockBackground=true
    }=config
    
    const itemHeight=100
    const height=(1+(title?1:0)+buttons.length)*itemHeight
   
    super(scene,x,y,{
      ...config,
      width,
      height,
      depth,
      blockBackground:blockBackground,
      blockerTweenDuration:300,
      blockAlpha:0.2,
      borderColor
    })
    
    this.top=y-height/2
    this.left=x-width/2
    
    const titleFontSize=48
    
    this.btnConfig={
      fontSize:buttonFontSize,
      width:200,
      height:80,
      depth:depth,
    }
    
    this.labelConfig={
      fontSize:labelFontSize,
      depth:depth+1,
      color:fontColor,
      fontFamily,
      origin:[0,0.5]
    }
      
    //Title
    if (title) {
      this.createLabel(width/2, itemHeight/2, title,{
        fontSize:titleFontSize,
        origin:[0.5,0.5]
      })
    }
    
    const buttonStartY=title?itemHeight*2:itemHeight*1
    
    buttons.forEach((btnData,i)=>{
      this.createButton(
        width/2,
        buttonStartY+i*itemHeight,
        btnData.label,
        {
          onClick:btnData.onClick
        }
      )
    })
  }
  
  createButton(x,y,string,config={}) {
    config = {
      ...this.btnConfig,
      onClick:()=>{},
      ...config
    }
    const btn = new Button(
      this.scene, 
      this.left+x,
      this.top+y,
      string,
      config
    )
    this.children.push(btn)
    return btn
  }
  
  createLabel(x,y,string,config={}) {
    config = {
      ...this.labelConfig,
      ...config
    }
    const label = this.scene.add.text(
      this.left+x,
      this.top+y,
      string,
      config
    )
      .setDepth(config.depth)
      .setOrigin(config.origin[0],config.origin[1])
    this.children.push(label)
    
    
    return label
  }
  
  
  destroy() {
    this.scene.tweens.add({
      targets:[this,this.label,this.cancel,this.confirm],
      y:"+=1080",
      duration:300,
      ease:Phaser.Math.Easing.Cubic.In,
      onComplete:()=>{
        super.destroy()
        
      }
    })
    this.scene.tweens.add({
      targets:this.bgBlocker,
      alpha:0,
      duration:300
    })
    
    
  }
  
}