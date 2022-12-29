import Phaser from "phaser"


//Helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
 

//Data
import { Palette } from "../data/Palette" 
import { Objects } from "../data/Objects" 

//UI Elements
import { Button } from "../ui/Button"  
import { ModalTextInput } from "../ui/ModalTextInput" 

export default class UI extends Phaser.Scene {
  
  constructor() {
    super("ui")
  }
  
  preload() {
    
  }
  
  create({
   map,
   width
  }) {
    try { 
    this.map=map
    this.toolbarWidth=width
    
    this.setupToolbar(width)
    
    this.setupEventListeners()
    
    EventCenter.emit("uiLoaded")
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  setupEventListeners() {
   EventCenter.on("tileSelected",this.showSelectionWindow,this)
   
   EventCenter.on("tileDeselected",this.closeSelectionWindow,this)
   
   EventCenter.on("toolSelected",this.setTool,this)
   
  }
  
  setupToolbar(toolbarWidth) {
    const cam=this.cameras.main
    
    const toolbarColor=Palette.gray2.hex
    
    const selectedToolWidth=140
    const selectedToolHeight=100
    const selectedToolY=65
    
    const buttonDeltaY=70
    const buttonWidth=160
    const buttonHeight=60
    const buttonStartY=160
    
    this.toolbarBackground=this.add.rectangle(
      0,
      0,
      toolbarWidth,
      cam.height,
      toolbarColor,
    )//.setScrollFactor(0,0)
      .setDepth(1000)
      .setOrigin(0,0)
      .setInteractive()
      .on("pointerdown",(p)=>{
        p.event.stopPropagation()
    })
    
    this.selectedToolButton=new Button(
        this,
        toolbarWidth/2,
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
        label:"Character",
        onClick:()=>{
          console.log("Character")
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
          console.log("Undo")
        }
      },
      {
        label:"Details",
        onClick:()=>{
          console.log("Details")
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
        this,
        toolbarWidth/2,
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
      this.selectedToolButton.setIcon(toolData.icon)
    } else {
      this.selectedToolButton.setIcon(null)
      this.selectedToolButton.setText(toolData.label)
    }
  }
  
  showSelectionWindow({
   tile,
   position
  }) {
    try { 
    this.closeSelectionWindow()
    const cam=this.cameras.main
    
    
    
    
    const labelMarginX=20
    const labelMarginY=20
    const labelDeltaY=100
    const fontSize=24
    const fontColor=Palette.purple8
    
    const iconY= 200
    const iconBgSize=100
    const iconSize=64
    
    
    const buttonDeltaY=70
    const buttonWidth=160
    const buttonHeight=60
    const buttonStartY=300
    
    const attributeStartY=580
    const attributeDeltaY=180
    const attributeSize=24
    const attributeValueX=labelMarginX+100
    
    const depth=2000
    const bg = this.add.rectangle(
      0,
      0,
      this.toolbarWidth,
      cam.height*1.5,
      Palette.blue1.hex
    ).setDepth(depth)
      .setOrigin(0,0)
      .setInteractive()
      .on("pointerdown",(p)=>{
        p.event.stopPropagation()
    })
        this.selectionWindowItems.push(bg)
    
    //Tile iabel
    const tileLabel=this.add.text(
      labelMarginX,
      labelMarginY,
      `Column: ${position.column}
Row: ${position.row}
Layer: ${position.layer+1}
Level: ${position.level+1}`,
      {
        fontSize,
        color:fontColor,
        fontFamily:GlobalStuff.FontFamily
      }
    ).setOrigin(0,0)
      .setDepth(depth)
  
    this.selectionWindowItems.push(tileLabel)
    
    const iconBg=this.add.rectangle(
      this.toolbarWidth/2,
      iconY,
      iconBgSize,
      iconBgSize,
      0xffffff
    ).setDepth(depth)
    this.selectionWindowItems.push(iconBg)
    
    if (tile) {
      const icon=this.add.image(
        this.toolbarWidth/2,
        iconY,
        Objects[tile.oid].iconKey
      ).setDepth(depth)
      const imageSize=Math.max(icon.width,icon.height)
      icon.setScale(iconSize/imageSize)
      this.selectionWindowItems.push(icon)
    }
    
    
    const buttonData=[
      {
        label:"Clear",
        onClick:()=>{
          console.log("clear")
        }
      },
      {
        label:"Next layer",
        onClick:()=>{
          try { 
          EventCenter.emit("nextLayer")
          //this.nextLayer()
          } catch (er) {console.log(er.message,er.stack); throw er} 
        }
      },
      {
        label:"Add attribute",
        onClick:()=>{
          
          addAttribute("NewAttributr",0)
        }
      },
      {
        label:"Deselect",
        onClick:()=>{
          EventCenter.emit("deselect")
        }
      },
      
    ]
    
    const buttons=[]
      
      buttonData.forEach((data,i)=>{
      const btn=new Button(
        this,
        this.toolbarWidth/2,
        buttonStartY+i*buttonDeltaY,
        data.label,
        {
          depth,
          onClick:data.onClick,
          width:buttonWidth,
          height:buttonHeight,
          fontSize:24
        }
      )
      buttons.push(btn)
      this.selectionWindowItems.push(btn)
      
    })
    
    let attributeCounter=0
    
    const addAttribute=(title, value)=>{
      
      const attributeIndex=attributeCounter
      const titleLabel=this.add.text(
        labelMarginX,
        bg.y+attributeStartY+attributeCounter*attributeDeltaY,
        title,
        {
          fontSize:attributeSize,
          color:fontColor,
          fontFamily:GlobalStuff.FontFamily
        }
      ).setOrigin(0,0.5)
        .setDepth(depth)
      
      const valueLabel=this.add.text(
        labelMarginX,
        bg.y+attributeStartY+attributeCounter*attributeDeltaY+attributeSize,
        value,
        {
          fontSize:attributeSize,
          color:fontColor,
          fontFamily:GlobalStuff.FontFamily
        }
      ).setOrigin(0,0.5)
        .setDepth(depth)
      
        
      ;[
        {
          string:"EDIT",
          onClick:()=>{
            try { 
            ModalTextInput.prompt(this).then(res=>{
              console.log(res)
            }).catch(rej=>{
             console.log("hm")
            })
            
            
            } catch (er) {console.log(er.message,er.stack); throw er} 
          }
        },
        {
          string:"REMOVE",
          onClick:()=>{
            console.log("Renove attribute "+attributeIndex)
          }
        }
      ].forEach((data,i)=>{
        const btn=new Button(
          this,
          (i+0.5)*this.toolbarWidth/2,
          bg.y+attributeStartY+attributeCounter*attributeDeltaY+attributeSize*2+buttonHeight/2,
          data.string,
          {
            depth,
            onClick:data.onClick,
            width:buttonWidth*0.45,
            height:buttonHeight*0.8,
            fontSize:20
          }
        )
        
        this.selectionWindowItems.push(btn)
      })
        
      this.selectionWindowItems.push(titleLabel,valueLabel)
      attributeCounter++
    }
    
    addAttribute("Svängom",50)
    addAttribute("Huppwtihipp","Laban")
    
    
    this.input.setDraggable(bg)
    bg.on("drag",(p)=>{
      const scroll=(p.y-p.prevPosition.y)/1
      let dy=bg.y-(
          Math.min(
          Math.max(
            bg.y+scroll,
            cam.height-bg.height
          ),
          0
        )
      )
      
      
      this.selectionWindowItems.forEach(item=>{
        item.y-=dy
      })
      
    })
    
    } catch (er) {console.log(er.message,er.stack); throw er}
  }
  
  closeSelectionWindow() {
    if (this.selectionWindowItems) {
      this.selectionWindowItems.forEach(item=>item.destroy())
      
    }
    this.selectionWindowItems=[]
  }
  
  update(time,dt) {
    
    
    
  }
}