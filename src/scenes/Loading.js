import Phaser from "phaser"

//graphics


//helpers

import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { preloadGraphics } from "../helpers/GraphicsLoader" 

//Animations
import { setupPlayerAnimations } from "../factories/Player" 

//Data
import { Palette } from "../data/Palette" 



export default class Loading extends Phaser.Scene {
  constructor() {
    super("loading")
  }
  
  preload() {
    this.load.rexWebFont({
      google: {
        families: [GlobalStuff.FontFamily]
          //families: ['Acme']
      }
    });
    this.load.on('webfontactive', (fileObj, familyName) =>{
      const cam=this.cameras.main
      const bg =this.add.rectangle(0,0,cam.width,cam.height,Palette.blue1.hex).setOrigin(0,0).setAlpha(0)
      this.tweens.add({
        targets:bg,
        alpha:1,
        duration:250,
        
      })
      
      const label=this.add.text(cam.centerX,cam.centerY,"LOADING...",{
        fontSize:128,
        fontFamily:GlobalStuff.FontFamily,
        color:Palette.black.string
      }).setOrigin(0.5,0.5).setAlpha(0)
      this.tweens.add({
        targets:label,
        alpha:1,
        duration:1000,
        repeat:-1,
        yoyo:true
      })
    })
      
    
    preloadGraphics(this)
    MusicManager.preload(this)
    SFXManager.preload(this)
    


  }
  
  create() {
    MusicManager.setup(this)
    MusicManager.play(0,this)
    setupPlayerAnimations(this)
    this.fadeOut(500)
    setTimeout(()=>{
      this.scene.start("game")
    },500)
  }
  
  fadeOut(duration) {
    const blockAlpha={a:0}
    const blocker=this.add.rectangle(0,0,1920,1080,0x000000,1).setOrigin(0,0).setDepth(1000)
    blocker.setAlpha(0)
    this.tweens.add({
      targets:blockAlpha,
      a:1,
      duration:duration,
      onUpdate:()=>{
        try { 
        blocker.setAlpha(blockAlpha.a)
        } catch (er) {console.log(er.message,er.stack); throw er} 
      }
    })
  }
  
}