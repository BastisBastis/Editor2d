//Helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 

//Data
import { Palette } from "../data/Palette" 
import { Objects } from "../data/Objects" 

//UI Elements
import { Button } from "../ui/Button"

export class WallTools {
  
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
    
    
    const depth=2000
    
    this.items=[]
    
    const background=scene.add.rectangle(
      0,
      0,
      width,
      cam.height,
      bgColor,
    )//.setScrollFactor(0,0)
      .setDepth(depth)
      .setOrigin(0,0)
      .setInteractive()
      .on("pointerdown",(p)=>{
        p.event.stopPropagation()
    })
    
    this.items.push(background)
    
    this.selectedToolButton=new Button(
        scene,
        width/2,
        selectedToolY,
        "Select",
        {
          onClick:()=>{
            try { 
            EventCenter.emit("nextTool")
            } catch (er) {console.log(er.message,er.stack); throw er} 
          },
          width:selectedToolWidth,
          height:selectedToolHeight,
          fontSize:24,
          depth:depth
        }
      )
    this.items.push(this.selectedToolButton)
    
    const buttonData=[
      {
        label:"Select wall",
        onClick:()=>{
          EventCenter.emit("selectToolType","wallSelect")
        }
      },
      {
        label:"Add wall",
        onClick:()=>{
          EventCenter.emit("selectToolType","addWall")
        }
      },
      {
        label:"Add door",
        onClick:()=>{
          //EventCenter.emit("selectToolType","decoration")
          //this.selectToolType("decoration")
        }
      },
      {
        label:"Add window",
        onClick:()=>{
          //EventCenter.emit("showWallTools")
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
        label:"Back",
        onClick:()=>{
          EventCenter.emit("deselect")
          EventCenter.emit("closeWallTools")
          EventCenter.emit("selectToolType","select")
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
          depth:depth,
          onClick:data.onClick,
          width:buttonWidth,
          height:buttonHeight,
          fontSize:24
        }
      )//.setScrollFactor(0)
      this.buttons.push(btn)
      this.items.push(btn)
    })
    
    
    
    EventCenter.emit("selectToolType","wallSelect")

  }
  
  setTool(toolData) {
   
   if (toolData.icon) {
      
      this.selectedToolButton.setText("")
      this.selectedToolButton.setIcon(toolData.icon)
    } else {
      this.selectedToolButton.setIcon(null)
      this.selectedToolButton.setText(toolData.label)
    }
  }
  
  destroy() {
    this.items.forEach(item=>{
      item.destroy()
    })
  }
} 