import Phaser from "phaser"

//helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"

//Data
import { Palette } from "../data/Palette" 

//UI
import { Button } from "../ui/Button"  
import { ModalTextInput } from "../ui/ModalTextInput" 

//Graphics
import FloorTex2 from "../assets/images/TmpFloorTex1.png"
import FloorTex1 from "../assets/images/TmpFloorTex2.png"
import Object1_3d from "../assets/images/Tmp1-3d.png"
import Object1_topdown from "../assets/images/Tmp1topdown.png"

const objects=[
  {
    key:"floor1",
    spriteKey:"floorTex1",
    iconKey:"floorTex1",
    layer:0,
    type:"decoration",
    attributes:{
      rotation:0
    }
  },
  {
    key:"floor2",
    spriteKey:"floorTex2",
    iconKey:"floorTex2",
    layer:0,
    type:"decoration",
    attributes:{
      rotation:0
    }
  },
  {
    key:"desk",
    spriteKey:"tmpObject1-topdown",
    iconKey:"tmpObject1-3d",
    layer:1,
    type:"object",
    attributes:{
      rotation:0
    }
  }
]

export default class Game extends Phaser.Scene {
  constructor() {
    super("editor")
  }
  
  preload() {
    this.load.rexWebFont({
      google: {
        families: [GlobalStuff.FontFamily]
      }
    });
    
    this.load.image("floorTex1",FloorTex1)
    this.load.image("floorTex2",FloorTex2)
    this.load.image("tmpObject1-3d",Object1_3d)
    this.load.image("tmpObject1-topdown",Object1_topdown)
  }
  
  create({
    
  }) {
    try { 
    //Background
    
    const bg=this.add.rectangle(
      640,
      360,
      1280*4,
      720*4,
      Palette.white.hex
    ).setScrollFactor(0,0)
    .setDepth(-10000)
    
    
    this.tileSize=50
    
    this.levelDetails={
      title:"Default level",
      width:25,
      height:14
    }
    
    
    this.setupTools()
    this.setupMap()
    this.setupGrid()
    this.setupClickDetection()
    this.setupUI()
    this.selectToolType("select")
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  setupUI() {
    const cam=this.cameras.main
    const toolbarWidth=180
    
    this.UIcam=this.cameras.add()
      .setViewport(
        cam.width-toolbarWidth,
        0,
        toolbarWidth,
        cam.height
      )
    //this.UIcam.scrollX=cam.width-toolbarWidth
      
    
    
    const toolbarColor=Palette.gray2.hex
    
    const selectedToolWidth=140
    const selectedToolHeight=100
    const selectedToolY=65
    
    const buttonDeltaY=70
    const buttonWidth=160
    const buttonHeight=60
    const buttonStartY=160
    
    this.toolbarBackground=this.add.rectangle(
      9,
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
            this.nextTool()
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
          this.selectToolType("select")
        }
      },
      {
        label:"Object",
        onClick:()=>{
          this.selectToolType("object")
        }
      },
      {
        label:"Decoration",
        onClick:()=>{
          this.selectToolType("decoration")
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
      cam.ignore(btn.items)
    })
    
    cam.ignore(this.toolbarBackground)
    cam.ignore(this.selectedToolButton.items)
  }
  
  setupClickDetection() {
    const cam=this.cameras.main
    
    const detector=this.add.rectangle(
      cam.centerX,
      cam.centerY,
      cam.width*4,
      cam.height*4,
      Palette.gray3.hex,
      0.2
    ).setScrollFactor(0,0)
      .setDepth(0)
      .setOrigin(0.5,0.5)
      .setInteractive()
      .on("pointerdown",(p,x,y)=>{
        
        const column=Math.floor((p.worldX)/this.tileSize)
        const row=Math.floor((p.worldY)/this.tileSize)
        this.tileClicked(column,row)
      })
    this.input.setDraggable(detector)
    detector.on("drag",(p,dx,dy)=>{
      if (this.selectedTool.key==="pan") {
        
        cam.scrollX-=(p.x-p.prevPosition.x)/1
        cam.scrollY-=(p.y-p.prevPosition.y)/1
      } else if (this.selectedTool.key==="zoom") {
        //console.log(cam.zoom)
        cam.zoom=Math.max(cam.zoom*(1-(p.y-p.prevPosition.y)/1000),0.25)
        
      }
    })
  }
  
  setupGrid() {
    const cam=this.cameras.main
    this.gridParts=[]
    const thickness=2
    const color=Palette.black.hex
    const alpha=0.3
    
    for (let i=1; i<=this.levelDetails.width;i++) {
      const x = i*this.tileSize
      this.gridParts.push(
        this.add.line(
          x,
          0,
          0,
          0,
          0,
          cam.height,
          color,
          alpha
        ).setOrigin(0.5,0)
          .setDepth(990)
      )
    }
    for (let i=1; i<=this.levelDetails.height;i++) {
      const y = i*this.tileSize
      this.gridParts.push(
        this.add.line(
          0,
          y,
          0,
          0,
          cam.width,
          0,
          color,
          alpha
        ).setOrigin(0,0.5)
          .setDepth(990)
      )
    }
  }
  
  toggleGrid(value) {
    value=value===undefined?!this.gridParts[0].visible:value
    this.gridParts.forEach(part=>part.setVisible(value))
  }
  
  setupMap() {
    /*
      Map structure
      2d array
      tile === map[column][row]
      levels:[
        [
          floor,
          standing,
          hanging
        ]
      ]
      each tile part (like floor)
        {
          Key
          Top down sprite
          attributes:{
            attributes from data file
          }
        }
    */
    
    
    this.map=[]
    for (let x=0; x< this.levelDetails.width; x++) {
      const rows=[]
      for (let y=0; y<this.levelDetails.height;y++) {
        const floorSprite=this.add.image(
          (x+0.5)*this.tileSize,
          (y+0.5)*this.tileSize,
          "floorTex1"
        ).setDepth(1)
          .setDisplaySize(
            this.tileSize,
            this.tileSize
          )
        rows.push(
          [
            [
              {
                oid:0,
                sprite:floorSprite,
                attributes:objects[0].attributes
              },null,null
            ]
          ]
        )
      }
      this.map.push(rows)
    }
  }
  
  tileClicked(col,row) {
    
    if (this.selectedTool.key==="select") {
      this.selectTile(col,row)
    } else if (["decoration","object"].includes(this.selectedTool.type)) {
      this.placeObject(col,row,this.selectedTool.key)
    }
  }
  
  placeObject(col,row,key) {
    try { 
    
    const object=objects.find(o=>o.key===key)
    const layer=object.layer
    const level=0
    const oid=objects.findIndex(o=>o.key===key)
    const tile= this.map[col][row][level][layer] || {}
    
    const sprite=this.add.image(
      (col+0.5)*this.tileSize,
      (row+0.5)*this.tileSize,
      object.spriteKey
    ).setDepth(layer+1)
      
    sprite.setScale(
        this.tileSize/Math.max(
          sprite.width,
          sprite.height
        )
    )
    
    if (tile.sprite)
      tile.sprite.destroy()
      
    tile.oid=oid
    tile.attributes=object.attributes
    tile.sprite=sprite
    
    this.map[col][row][level][layer]=tile
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  selectTile(col,row) {
    this.selectionMarker.x=(col+0.5)*this.tileSize
    this.selectionMarker.y=(row+0.5)*this.tileSize
    this.selectionMarker.setVisible(true)
    this.selectedTile={
      column:col,
      row,
      layer:0,
      level:0
    }
    this.showSelectionWindow()
  }
  
  deselect() {
    this.selectionMarker.setVisible(false)
    this.closeSelectionWindow()
  }
  
  nextTool() {
    try { 
    
    this.deselect()
    const toolType=this.selectedTool.type
    const index=(this.selectedTool.index+1)%this.tools[toolType].length
    this.selectedTool.index=index
    this.selectedTool.key=this.tools[toolType][index].key
    if (this.tools[toolType][index].icon) {
      
      this.selectedToolButton.setText("")
      this.selectedToolButton.setIcon(this.tools[toolType][index].icon)
      this.cameras.main.ignore(this.selectedToolButton.icon)
    } else {
      this.selectedToolButton.setIcon(null)
      this.selectedToolButton.setText(this.tools[toolType][index].label)
    }
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  selectToolType(key) {
    
    const tool=this.tools[key][0]
    
    this.selectedToolButton.setText(tool.label)
    this.selectedTool={
      type:key,
      key:tool.key,
      index:-1
    }
    this.nextTool()
  }
  
  setupTools() {
    this.tools={
      select:[
        {
          label:"Select",
          key:"select"
        },
        {
          label: "Pan",
          key: "pan"
        },
        {
          label: "Zoom",
          key: "zoom"
        },
      ],
      decoration:objects.filter(object=>object.type==="decoration").map(object=>{
        return {
          icon:object.iconKey,
          key:object.key
        }
      }),
      object:objects.filter(object=>object.type==="object").map(object=>{
        return {
          icon:object.iconKey,
          key:object.key
        }
      })
      
    }
    
    this.selectionMarker=this.add.rectangle(this.tileSize/2,this.tileSize/2,this.tileSize+4,this.tileSize+4)
      .setDepth(50)
      .setStrokeStyle(8,Palette.black.hex)
      .setVisible(false)
      
    
  }
  
  closeSelectionWindow() {
    if (this.selectionWindowItems) {
      this.selectionWindowItems.forEach(item=>item.destroy())
      
    }
    this.selectionWindowItems=[]
  }
  
  nextLayer() {
    this.selectedTile.layer=(this.selectedTile.layer+1)%3
    
    this.showSelectionWindow()
  }
  
  getObjectAt(col,row,layer,level) {
    const tile=this.map[col][row]
    if (level>=tile.length) {
      console.log("level out of bounds")
      return null
    }
    return tile[level][layer]
  }
  
  
  showSelectionWindow() {
    try { 
    this.closeSelectionWindow()
    const cam=this.UIcam
    
    const tile=this.getObjectAt(
      this.selectedTile.column,
      this.selectedTile.row,
      this.selectedTile.layer,
      this.selectedTile.level
    )
    
    
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
      cam.width,
      cam.height*1.5,
      Palette.blue1.hex
    ).setDepth(depth)
      .setOrigin(0,0)
      .setInteractive()
      .on("pointerdown",(p)=>{
        p.event.stopPropagation()
    })
    this.cameras.main.ignore(bg)
    this.selectionWindowItems.push(bg)
    
    //Tile iabel
    const tileLabel=this.add.text(
      labelMarginX,
      labelMarginY,
      `Column: ${this.selectedTile.column}
Row: ${this.selectedTile.row}
Layer: ${this.selectedTile.layer+1}
Level: ${this.selectedTile.level+1}`,
      {
        fontSize,
        color:fontColor,
        fontFamily:GlobalStuff.FontFamily
      }
    ).setOrigin(0,0)
      .setDepth(depth)
    this.cameras.main.ignore(tileLabel)
    this.selectionWindowItems.push(tileLabel)
    
    const iconBg=this.add.rectangle(
      cam.width/2,
      iconY,
      iconBgSize,
      iconBgSize,
      0xffffff
    ).setDepth(depth)
    this.cameras.main.ignore(iconBg)
    this.selectionWindowItems.push(iconBg)
    
    if (tile) {
      const icon=this.add.image(
        cam.width/2,
        iconY,
        objects[tile.oid].iconKey
      ).setDepth(depth)
      const imageSize=Math.max(icon.width,icon.height)
      icon.setScale(iconSize/imageSize)
      this.cameras.main.ignore(icon)
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
          this.nextLayer()
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
          this.deselect()
        }
      },
      
    ]
    
    const buttons=[]
      
      buttonData.forEach((data,i)=>{
      const btn=new Button(
        this,
        cam.width/2,
        buttonStartY+i*buttonDeltaY,
        data.label,
        {
          depth,
          onClick:data.onClick,
          width:buttonWidth,
          height:buttonHeight,
          fontSize:24
        }
      )//.setScrollFactor(0)
      buttons.push(btn)
      this.cameras.main.ignore(btn.items)
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
          (i+0.5)*cam.width/2,
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
        
        this.cameras.main.ignore(btn.items)
        this.selectionWindowItems.push(btn)
      })
        
      this.cameras.main.ignore([titleLabel,valueLabel])
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
  
  update(time,dt) {
    try { 
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}