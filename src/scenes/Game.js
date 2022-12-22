import Phaser from "phaser"
import {
  createWorld,
  deleteWorld
} from "bitecs"

//factories
import { createLevel } from "../factories/Level" 
import { createPlayer } from "../factories/Player" 

//helpers
import { SystemManager } from "../helpers/SystemManager"
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"

//Data
import { Palette } from "../data/Palette" 

export default class Game extends Phaser.Scene {
  constructor() {
    super("game")
  }
  
  preload() {
    
  }
  
  create({
    
  }) {
    try { 
    //Background
    this.add.rectangle(960,540,1920,1080,Palette.blue1.hex).setScrollFactor(0,0)
    
    this.world=createWorld()
    this.world.scene=this
    
    createPlayer(this.world)
    createLevel(this.world)
    
    
    this.systemManager=new SystemManager(this.world)
    this.scene.launch("ui")
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  update(time,dt) {
    try { 
    this.systemManager.update()
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}