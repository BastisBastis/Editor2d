import Phaser from "phaser"

//helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"

//Data
import { Palette } from "../data/Palette" 
import { Objects } from "../data/Objects" 

//UI
import { Button } from "../ui/Button"  
import { ModalTextInput } from "../ui/ModalTextInput" 

//Graphics




export default class Game extends Phaser.Scene {
  constructor() {
    super("editor")
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
    
    const uiWidth=180
    this.cameras.main.setViewport(
      uiWidth,
      0,
      this.cameras.main.width,
      this.cameras.main.height
    )
    
    
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
    //this.setupUI()
    this.setupEventListeners()
    
    this.scene.launch("ui",{
      map:this.map,
      width:uiWidth
    })
    
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  setupEventListeners() {
   
   EventCenter.on("nextTool",this.nextTool,this)
   
   EventCenter.on("nextLayer",this.nextLayer,this)
   
   EventCenter.on("uiLoaded",this.handleUILoaded,this)
   
   EventCenter.on("selectToolType",this.selectToolType,this)
   
   EventCenter.on("deselect",this.deselect,this)
   
  }
  
  handleUILoaded() {
    this.selectToolType("select")
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
                attributes:Objects[0].attributes
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
    
    const object=Objects.find(o=>o.key===key)
    const layer=object.layer
    const level=0
    const oid=Objects.findIndex(o=>o.key===key)
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
    try { 
    this.selectionMarker.x=(col+0.5)*this.tileSize
    this.selectionMarker.y=(row+0.5)*this.tileSize
    this.selectionMarker.setVisible(true)
    this.selectedTile={
      column:col,
      row,
      layer:0,
      level:0
    }
    EventCenter.emit("tileSelected",{
      tile:this.getObjectAt(col,row,0,0),
      position:{...this.selectedTile}
    })
    //this.showSelectionWindow()
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  deselect() {
    this.selectionMarker.setVisible(false)
    EventCenter.emit("tileDeselected")
    
  }
  
  nextTool() {
    try { 
    
    
    this.deselect()
    const toolType=this.selectedTool.type
    const index=(this.selectedTool.index+1)%this.tools[toolType].length
    this.selectedTool.index=index
    this.selectedTool.key=this.tools[toolType][index].key
    
    EventCenter.emit("toolSelected",{
      ...this.selectedTool,
      icon:this.tools[toolType][index].icon,
      label:this.tools[toolType][index].label
    })
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  selectToolType(key) {
    
    const tool=this.tools[key][0]
    
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
      decoration:Objects.filter(object=>object.type==="decoration").map(object=>{
        return {
          icon:object.iconKey,
          key:object.key
        }
      }),
      object:Objects.filter(object=>object.type==="object").map(object=>{
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
  
  
  
  nextLayer() {
    this.selectedTile.layer=(this.selectedTile.layer+1)%3
    
    EventCenter.emit("tileSelected",{
      tile:this.getObjectAt(
        this.selectedTile.column,
        this.selectedTile.row,
        this.selectedTile.layer,
        this.selectedTile.level),
      position:{...this.selectedTile}
    })
  }
  
  getObjectAt(col,row,layer,level) {
    const tile=this.map[col][row]
    if (level>=tile.length) {
      console.log("level out of bounds")
      return null
    }
    return tile[level][layer]
  }
  
  
  
  
  update(time,dt) {
    try { 
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}