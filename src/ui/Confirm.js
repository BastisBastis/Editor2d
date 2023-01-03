import Phaser from "phaser"
import {GlobalStuff} from "../helpers/GlobalStuff"
import {EventCenter} from "../helpers/EventCenter"

import {Window} from "./Window"
import { Button } from "./Button"


import { Palette } from "../data/Palette" 

export class Confirm extends Window {
  
  constructor(
    scene,
    x=scene.cameras.main.centerX,
    y=scene.cameras.main.centerY,
    string="Polly wants a cracker?",
    config={}
  ) {
    
    const {
      width=1000,
      height=600,
      depth=1,
      fontFamily=GlobalStuff.FontFamily,
      fontColor="#000000",
      buttonFontColor=fontColor,
      hoverFontColor,
      borderColor=Palette.brown4.hex,
      onConfirm=()=>false,
      onCancel=()=>false,
      confirmString="OK",
      cancelString="Cancel",
      buttonFontSize=56,
      labelFontSize=64,
      blockBackground=true
    }=config
    
    
   
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
    
    const top=y-height/2
    const left=x-width/2
    
    const btnConfig={
      fontSize:buttonFontSize,
      width:156,
      height:100,
      depth:depth,
      borderColor:borderColor,
      backgroundColor:Palette.gray2.hex,
      fontColor:fontColor,
      hoverBackgroundColor:Palette.brown1.hex,
      downBackgroundColor:Palette.brown2.hex,
      downFontColor:fontColor,
    }
      
    this.label=scene.add.text(x,top+height*0.3,string,{
      fontSize:labelFontSize,
      fontFamily:fontFamily,
      color:fontColor,
      wordWrap:{
        width:width*0.9
      },
      align:"center"
    }).setOrigin(0.5,0.5)
      .setDepth(depth)
      
      
      
    this.cancel=new Button(scene,
        left+width*0.25,top+height*0.7,cancelString,{
          ...btnConfig,
          
          onClick:()=>{
            this.destroy()
            onCancel()
          }
        }
      )
      
      
      this.confirm=new Button(scene,
        left+width*0.75,top+height*0.7,confirmString,{
          ...btnConfig,
          
          onClick:()=>{
            this.destroy()
            onConfirm()
          }
        }
      )
    this.children.push(this.label,this.cancel,this.confirm)
  }
  
  static prompt(scene,x,y,string,config={}) {
    return new Promise((resolve,reject)=>{
      try { 
      const c=new Confirm(scene,x,y,string,{
        ...config,
        onCancel:()=>{
          resolve(0)
        },
        onConfirm:()=>{
          resolve(1)
        }
      })
      } catch (er) {console.log(er.message,er.stack); throw er} 
    })
  }
  
  destroy() {
    this.scene.tweens.add({
      targets:[this,this.label,this.cancel,this.confirm],
      y:"+=1080",
      duration:300,
      ease:Phaser.Math.Easing.Cubic.In,
      onComplete:()=>{
        try { 
        super.destroy()
        } catch (er) {console.log(er.message,er.stack); throw er} 
        /*
        this.label.destroy()
        this.cancel.destroy()
        this.confirm.destroy()
        */
      }
    })
    this.scene.tweens.add({
      targets:this.bgBlocker,
      alpha:0,
      duration:300
    })
    
    
  }
  
}