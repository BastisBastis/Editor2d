import Phaser from "phaser"


//helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"
import { ActionManager } from "../helpers/ActionManager" 
import { NextId } from "../helpers/IdGenerator" 
import { exportLevel } from "../helpers/Exporter" 
import { ParseLoadedData } from "../helpers/DataParser" 

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
    loadedData
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
    
    if (loadedData) {
      const parsedData=ParseLoadedData(loadedData)
      this.map=parsedData.map
      this.levelDetails=parsedData.details
      this.walls=parsedData.walls
      this.updateTileGraphics()
      this.updateWallGraphics()
    } else {
      this.levelDetails={
        title:"Unnamed level",
        width:25,
        height:14,
        levels:1,
        wallThickness:0.2, //fraction of tile
      }
      this.setupMap()
      this.setupWalls()
    }
    
    
    this.addWallStart=null
    this.setupTools()
    
    this.setupGrid()
    //this.toggleGrid()
    this.setupClickDetection()
    //this.setupUI()
    this.actionManager = new ActionManager(this,this.map,this.walls)
    
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
   
   EventCenter.on("clearTile",this.clearTile,this)
   
   EventCenter.on("undo",this.undo,this)
   
   EventCenter.on("modifyAttribute",this.modifyAttribute,this)
   
   EventCenter.on("addAttribute",this.addAttribute,this)
   
   EventCenter.on("removeAttribute",this.removeAttribute,this)
   
   EventCenter.on("moveWall",this.moveWall,this)
   
   EventCenter.on("rotateWall",this.rotateWall,this)
   
   EventCenter.on("deleteWall",this.deleteWall,this)
   
   EventCenter.on("modifyWallLength",this.modifyWallLength,this)
   
   EventCenter.on("exportLevel",this.exportLevel,this)
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
        const cellX=(p.worldX/this.tileSize-column)
        const cellY=(p.worldY/this.tileSize-row)
        this.tileClicked(column,row,cellX,cellY)
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
        /*
        const floorSprite=this.add.image(
          (x+0.5)*this.tileSize,
          (y+0.5)*this.tileSize,
          Objects[0].spriteKey
        ).setDepth(1)
          .setDisplaySize(
            this.tileSize,
            this.tileSize
          )
          */
        rows.push(
          [
            [
              /*{
                oid:0,
                sprite:floorSprite,
                attributes:{...Objects[0].attributes}
              }*/null,null,null
            ]
          ]
        )
      }
      this.map.push(rows)
    }
  }
  
  updateTileGraphics(){
    this.map.forEach((rows,columnIndex)=>{
      rows.forEach((levels,rowIndex)=>{
        levels.forEach((level,levelIndex)=>{
          level.forEach((layer,layerIndex)=>{
            if (layer) {
              if (layer.sprite)
                layer.sprite.destroy()
              layer.sprite= this.add.image(
              (columnIndex+0.5)*this.tileSize,
              (rowIndex+0.5)*this.tileSize,
              Objects[layer.oid].sprite
            )
            
            if (Objects[layer.oid].spriteFrame!==undefined)
              layer.sprite.setFrame(Objects[layer.oid].spriteFrame)
            layer.sprite.setDepth(layerIndex+1)
              .setDisplaySize(
                this.tileSize,
                this.tileSize
            )
              .setAngle(layer.attributes.rotation||0)
            }
          }) 
        })
      })
    })
  }
  
  setupWalls() {
    /*
      Wall structure:
      [
        {
          id: int
          start: {
            column,
            row
          },
          direction: "x" || "z",
          length:1,
          textures: {
            nw,
            se
          }
        },
        graphics:Phaser.GameObjects.Rectangle
      ]
    */
    //Create array
    this.walls=[]
    this.selectedWall=null
    
    //Add walls
    this.walls.push(
      { //North
        id:NextId(),
        start: {
          column:0,
          row:0
        },
        direction:"x",
        length:this.levelDetails.width,
        texture:{
          nw:"floorTex1",
          se:"floorTex1"
        }
      },
      { //South
        id:NextId(),
        start: {
          column:0,
          row:this.levelDetails.height
        },
        direction:"x",
        length:this.levelDetails.width,
        texture:{
          nw:"floorTex1",
          se:"floorTex1"
        }
      },
      { //West
        id:NextId(),
        start: {
          column:0,
          row:0
        },
        direction:"y",
        length:this.levelDetails.height,
        texture:{
          nw:"floorTex1",
          se:"floorTex1"
        }
      },
      { //West
        id:NextId(),
        start: {
          column:this.levelDetails.width,
          row:0
        },
        direction:"y",
        length:this.levelDetails.height,
        texture:{
          nw:"floorTex1",
          se:"floorTex1"
        }
      }
    )
    
    //Update graphics
    this.updateWallGraphics()
  }
  
  updateWallGraphics() {
    //Set wall graphic Data
    const thickness=this.levelDetails.wallThickness*this.tileSize,
      color=Palette.red1.hex,
      selectedColor=Palette.blue1.hex,
      depth=100
    
    
    //create wall graphics
    this.walls.forEach(wallData=>{
      if (wallData.graphics)
        wallData.graphics.destroy()
      
      const x=wallData.start.column*this.tileSize
      const y=wallData.start.row  *this.tileSize
      
      const width = wallData.direction==="x"
        ?wallData.length*this.tileSize
        :thickness
      const height = wallData.direction==="y"
        ?wallData.length*this.tileSize
        :thickness
      const origin=wallData.direction==="x"
        ?[0,0.5]:[0.5,0]
        
      const wallColor=(this.selectedWall) && this.selectedWall.id===wallData.id?selectedColor:color
      
        
      const wall = this.add.rectangle(x,y,width,height,wallColor)
        .setDepth(depth)
        .setOrigin(origin[0],origin[1])
      wallData.graphics=wall
      
    })
  }
  
  
  
  tileClicked(col,row,cellX,cellY) {
    
    
    if (this.selectedTool.key==="select") {
      
      this.selectTile(col,row)
    } else if (this.selectedTool.key==="wallSelect") {
      col=cellX<0.5?col:col+1
      row=cellY<0.5?row:row+1
      this.selectWall(col,row)
      
    } else if (this.selectedTool.key==="addWall") {
      try { 
      col=cellX<0.5?col:col+1
      row=cellY<0.5?row:row+1
      this.performAddWallAction(col,row)
      } catch (er) {console.log(er.message,er.stack); throw er} 
    } else if (this.selectToolType==="select" || this.selectToolType==="wallSelect") {
      return
    }
    else {
      this.actionManager.execute(this.selectedTool.action,
      {
        data:this.selectedTool,
        column:col,
        row
      })
      //this.placeObject(col,row,this.selectedTool.key)
    }
  }
  
  modifyWallLength(args) {
    this.actionManager.execute("modifyWallLength",args)
    this.updateWallGraphics()
  }
  
  deleteWall(id) {
    this.actionManager.execute("deleteWall",id)
    this.deselect()
  }
  
  rotateWall(id) {
    this.actionManager.execute("rotateWall",id)
    this.updateWallGraphics()
  }
  
  moveWall(args) {
    this.actionManager.execute("moveWall",args)
    this.updateWallGraphics()
  }
  
  removeAttribute(args) {
    this.actionManager.execute("removeAttribute",args)
  }
  
  addAttribute(args) {
    
    this.actionManager.execute("addAttribute",args)
  }
  
  modifyAttribute(args) {
    
    this.actionManager.execute("modifyAttribute",args)
    if (args.key==='rotation') {
      this.map[args.column][args.row][args.level][args.layer].sprite.angle=args.value
    }
  }
  
  clearTile(position) {
    this.actionManager.execute("clearTile",position)
    try { 
    this.nextLayer()
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  performAddWallAction(column,row) {
    if (!this.addWallStart) {
      const radius=10
      const color=Palette.green1.hex
      this.addWallStart={
        column,
        row,
        graphics:this.add.circle(
          column*this.tileSize,
          row*this.tileSize,
          radius,
          color
        ).setDepth(2000)
          .setOrigin(0.5,0.5)
      }
    } else {
      const dCol=column-this.addWallStart.column
      const dRow=row-this.addWallStart.row
      const direction = Math.abs(dRow)<=Math.abs(dCol)?"x":"y"
      
      this.actionManager.execute("addWall",{
        column: direction==="x"?Math.min(column,this.addWallStart.column):this.addWallStart.column,
        row:direction==="y"?Math.min(row,this.addWallStart.row):this.addWallStart.row,
        length:direction==="y"?Math.abs(dRow):Math.abs(dCol),
        direction
      })
      this.removeAddWallStart()
      this.updateWallGraphics()
    }
  }
  
  selectTile(col,row) {
    try { 
    this.selectionMarker.x=(col+0.5)*this.tileSize
    this.selectionMarker.y=(row+0.5)*this.tileSize
    this.selectionMarker.setVisible(true)
    this.selectedTile={
      column:col,
      row,
      layer:-1,
      level:0
    }
    this.nextLayer()
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  selectWall(column,row) {
    try { 
    
    let wall
    for (const wallData of this.walls) {
      
      if (wallData.direction==="x"){
        if (
          wallData.start.row===row
          &&wallData.start.column<=column
          &&wallData.start.column+wallData.length>column
        ) {
          wall=wallData
          break
        }
      } else {
        if (
          wallData.start.column===column
          &&wallData.start.row<=row
          &&wallData.start.row+wallData.length>row
        ) {
          wall=wallData
          break
        }
      }
    }
    if (wall) {
      
      this.deselect()
      this.selectedWall=wall
      //wall.graphics.setFillStyle(0x0000ff)
      this.updateWallGraphics()
      EventCenter.emit("wallSelected",wall)
    }
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  deselect() {
    this.selectionMarker.setVisible(false)
    EventCenter.emit("deselected")
    this.selectedWall=null
    this.removeAddWallStart()
    this.updateWallGraphics()
    
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
      frame:this.tools[toolType][index].iconFrame,
      label:this.tools[toolType][index].label
    })
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  selectToolType(key) {
    
    const tool=this.tools[key][0]
    
    this.selectedTool={
      type:key,
      key:tool.key,
      index:-1,
      action:tool.action
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
      wallSelect:[
        {
          label:"Select",
          key:"wallSelect"
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
      addWall:[
        {
          label:"Add Wall",
          key:"addWall"
        }
      ],
      decoration:Objects.filter(object=>object.type==="decoration").map(object=>{
        return {
          icon:object.iconKey,
          iconFrame:object.iconFrame,
          key:object.key,
          action:"placeObject"
        }
      }),
      object:Objects.filter(object=>object.type==="object").map(object=>{
        return {
          icon:object.iconKey,
          iconFrame:object.iconFrame,
          key:object.key,
          action:"placeObject"
        }
      })
      
    }
    
    this.selectionMarker=this.add.rectangle(this.tileSize/2,this.tileSize/2,this.tileSize+4,this.tileSize+4)
      .setDepth(50)
      .setStrokeStyle(8,Palette.black.hex)
      .setVisible(false)
      
    
  }
  
  
  
  nextLayer() {
    let counter=0
    this.selectedTile.layer=(this.selectedTile.layer+1)%3
    let tile=this.getObjectAt(
        this.selectedTile.column,
        this.selectedTile.row,
        this.selectedTile.layer,
        this.selectedTile.level)
    while (!tile) {
      counter++
      if (counter>3) {
        console.log("Tile gone missing?")
        this.deselect()
        return
      }
      this.selectedTile.layer=(this.selectedTile.layer+1)%3
      tile=this.getObjectAt(
        this.selectedTile.column,
        this.selectedTile.row,
        this.selectedTile.layer,
        this.selectedTile.level
      )
    }
    
    EventCenter.emit("tileSelected",{
      tile,
      position:{...this.selectedTile}
    })
  }
  
  removeAddWallStart() {
    if (this.addWallStart && this.addWallStart.graphics) {
      this.addWallStart.graphics.destroy()
      this.addWallStart=null
    }
  }
  
  getObjectAt(col,row,layer,level) {
    const tile=this.map[col][row]
    if (level>=tile.length) {
      console.log("level out of bounds")
      return null
    }
    return tile[level][layer]
  }
  
  exportLevel(config){
    console.log(config)
    exportLevel(
      this.levelDetails,
      this.map,
      this.walls,
      config
    )
  }
  
  undo(){
    this.actionManager.undo()
    this.updateWallGraphics()
    this.removeAddWallStart()
  }
  
  update(time,dt) {
    try { 
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}