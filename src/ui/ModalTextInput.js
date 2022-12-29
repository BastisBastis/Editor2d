import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';
import Phaser from "phaser"
import {GlobalStuff} from "../helpers/GlobalStuff"
import {EventCenter} from "../helpers/EventCenter"

import {Window} from "./Window"
import { Button } from "./Button"


import { Palette } from "../data/Palette" 

export class ModalTextInput extends Window {
  
  constructor(
    scene,
    config={}
  ) {
    
    const {
      string="Enter text",
      x=scene.cameras.main.centerX,
      y=scene.cameras.main.centerY,
      width=600,
      height=400,
      depth=1,
      fontFamily=GlobalStuff.FontFamily,
      fontColor="#000000",
      buttonFontColor=fontColor,
      hoverFontColor,
      borderColor=Palette.black.hex,
      onConfirm=()=>false,
      onCancel=()=>false,
      confirmString="OK",
      cancelString="Cancel",
      buttonFontSize=32,
      labelFontSize=40,
      blockBackground=true,
      inputFontSize=24,
      inputBorderThickness=2,
      inputBorderColor=fontColor,
      inputFontColor=fontColor,
      inputBackground=Palette.gray3.string,
      inputMaxCharacters=24,
      stackButtons=false
    }=config
    
    
   
    super(scene,x,y,{
      ...config,
      width,
      height,
      depth,
      borderThickness:2,
      blockBackground:blockBackground,
      blockerTweenDuration:300,
      blockAlpha:0.2,
      borderColor
    })
    
    const top=y-height/2
    const left=x-width/2
    
    const btnConfig={
      fontSize:buttonFontSize,
      width:100,
      height:60,
      depth:depth,
      borderColor:borderColor,
      backgroundColor:Palette.white.hex,
      fontColor:fontColor,
      hoverBackgroundColor:Palette.red1.hex,
      downBackgroundColor:Palette.green1.hex,
      downFontColor:fontColor,
    }
      
    this.label=scene.add.text(x,top+height*0.2,string,{
      fontSize:labelFontSize,
      fontFamily:fontFamily,
      color:fontColor,
      wordWrap:{
        width:width*0.9
      },
      align:"center"
    }).setOrigin(0.5,0.5)
      .setDepth(depth)
      
      
    this.inputText = new InputText(scene, x, y, width*0.8, height*0.2, {
      backgroundColor: inputBackground,
      fontFamily: fontFamily,
      fontSize: inputFontSize+"px",
      border:inputBorderThickness+"px",
      borderColor:inputBorderColor,
      color:inputFontColor,
      
      //paddingTop: "0px",
      //paddingBottom: "0px",
      align: "center",
      maxLength:inputMaxCharacters,
      id: "modalInput"
    }).setOrigin(0.5, 0.5)
      .setDepth(depth)
    scene.add.existing(this.inputText)
      
      
    const buttonPos=[
      {
        x:stackButtons?x:left+width*0.75,
        y:top+height*(stackButtons?0.75:0.8)
      },
      {
        x:stackButtons?x:left+width*0.25,
        y:top+height*(stackButtons?0.9:0.8)
      }
    ]
      
    this.cancel=new Button(scene,
      buttonPos[1].x,
      buttonPos[1].y,
      cancelString,{
        ...btnConfig,
        
        onClick:()=>{
          this.destroy()
          onCancel()
        }
      }
    )
      
     
    this.confirm=new Button(scene,
      buttonPos[0].x,
      buttonPos[0].y,
      confirmString,{
        ...btnConfig,
        
        onClick:()=>{
          this.destroy()
          onConfirm()
        }
      }
    )
     
    this.children.push(
      this.label,
      this.inputText,
      this.cancel.items,
      this.confirm.items
    )
  }
  
  static prompt(scene,config={}) {
    return new Promise((resolve,reject)=>{
      try { 
      const c=new ModalTextInput(scene,{
        ...config,
        onCancel:()=>{
          resolve(null)
        },
        onConfirm:()=>{
          resolve(this.inputText.value)
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
        super.destroy()
        this.label.destroy()
        this.cancel.destroy()
        this.confirm.destroy()
        this.inputText.destroy()
      }
    })
    this.scene.tweens.add({
      targets:this.bgBlocker,
      alpha:0,
      duration:300
    })
    
    
  }
  
}

/*
this.inputText = new InputText(scene, x, y, width*0.8, height*0.2, {
      backgroundColor: inputBackground,
      fontFamily: fontFamily,
      fontSize: inputFontSize+"px",
      border:inputBorderThickness+"px",
      borderColor:inputBorderColor,
      color:inputFontColor,
      
      //paddingTop: "0px",
      //paddingBottom: "0px",
      align: "center",
      maxLength:inputMaxCharacters,
      id: "modalInput"
    }).setOrigin(0.5, 0.5)
      .setDepth(depth)
    scene.add.existing(this.inputText)
*/
