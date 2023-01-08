//Helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 

//Data
import { Palette } from "../data/Palette" 
import { Objects } from "../data/Objects" 

//UI Elements
import { Button } from "../ui/Button"

export class Toolbar {
  
  constructor(scene, width) {
    
    
    const cam=scene.cameras.main
    
    const bgColor=Palette.blue4.hex
    
    const selectedToolWidth=140
    const selectedToolHeight=100
    const selectedToolY=65
    
    const buttonDeltaY=70
    const buttonWidth=160
    const buttonHeight=60
    const buttonStartY=160
    
    const background=scene.add.rectangle(
      0,
      0,
      width,
      cam.height,
      bgColor,
    )//.setScrollFactor(0,0)
      .setDepth(1000)
      .setOrigin(0,0)
      .setInteractive()
      .on("pointerdown",(p)=>{
        p.event.stopPropagation()
    })
    
    this.selectedToolButton=new Button(
        scene,
        width/2,
        selectedToolY,
        "",
        {
          onClick:()=>{
            try { 
            EventCenter.emit("nextTool")
            } catch (er) {console.log(er.message,er.stack); throw er} 
          },
          width:selectedToolWidth,
          height:selectedToolHeight,
          fontSize:24,
          depth:1001
        }
      )//.setScrollFactor(0)
    
    const buttonData=[
      {
        label:"Select",
        onClick:()=>{
          EventCenter.emit("selectToolType","select")
          //this.selectToolType("select")
        }
      },
      {
        label:"Object",
        onClick:()=>{
          EventCenter.emit("selectToolType","object")
          //this.selectToolType("object")
        }
      },
      {
        label:"Decoration",
        onClick:()=>{
          EventCenter.emit("selectToolType","decoration")
          //this.selectToolType("decoration")
        }
      },
      {
        label:"Walls",
        onClick:()=>{
          EventCenter.emit("showWallTools")
        }
      },
      {
        label:"Trigger",
        onClick:()=>{
          console.log("Trigger")
        }
      },
      {
        label:"Undo",
        onClick:()=>{
          try { 
          EventCenter.emit("undo")
          } catch (er) {console.log(er.message,er.stack); throw er} 
        }
      },
      {
        label:"Details",
        onClick:()=>{
          EventCenter.emit("showLevelDetails")
        }
      },
      {
        label:"Settings",
        onClick:()=>{
          console.log("Settings")
        }
      },
    ]
    
    
    
    this.buttons=[]
    
    buttonData.forEach((data,i)=>{
      const btn=new Button(
        scene,
        width/2,
        buttonStartY+i*buttonDeltaY,
        data.label,
        {
          depth:1001,
          onClick:data.onClick,
          width:buttonWidth,
          height:buttonHeight,
          fontSize:24
        }
      )//.setScrollFactor(0)
      this.buttons.push(btn)
    })

  }
  
  setTool(toolData) {
   
   if (toolData.icon) {
      
      this.selectedToolButton.setText("")
      this.selectedToolButton.setIcon(toolData.icon,toolData.frame)
    } else {
      this.selectedToolButton.setIcon(null)
      this.selectedToolButton.setText(toolData.label)
    }
  }
  
} 