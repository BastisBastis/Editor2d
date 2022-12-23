import Phaser from "phaser"

//helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"

//Data
import { Palette } from "../data/Palette" 

export default class Game extends Phaser.Scene {
  constructor() {
    super("editor")
  }
  
  preload() {
    
  }
  
  create({
    
  }) {
    try { 
    //Background
    
    this.add.rectangle(
      640,
      360,
      1280,
      720,
      Palette.white.hex
    ).setScrollFactor(0,0)
    .setDepth(-10000)
    
    this.tileSize=50
    
    this.levelDetails={
      title:"Default level",
      width:25,
      height:14
    }
    this.setupMap()
    this.setupGrid()
    this.setupClickDetection()
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  setupClickDetection() {
    const cam=this.cameras.main
    this.add.rectangle(
      0,
      0,
      cam.width,
      cam.height,
      Palette.grey3.hex,
      0
    ).setScrollFactor(0,0)
      .setDepth(0)
      .setOrigin(0,0)
      .setInteractive()
      .on("pointerdown",(p)=>{
        const column=Math.floor((p.x+cam.scrollX)/this.tileSize)
        const row=Math.floor((p.y+cam.scrollY)/this.tileSize)
        this.tileClicked(column,row)
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
      )
    }
    
    
  }
  
  toggleGrid(value) {
    value=value===undefined?!this.gridParts[0].visible:value
    this.gridParts.forEach(part=>part.setVisible(value))
  }
  
  setupMap() {
    
  }
  
  tileClicked(col,row) {
    
    console.log(col,row)
  }
  
  update(time,dt) {
    try { 
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}