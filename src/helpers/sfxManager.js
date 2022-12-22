import Phaser from "phaser"

import {EventCenter} from "./EventCenter"
import {GlobalStuff} from "./GlobalStuff"






export class SFXManager {
  constructor(scene) {
    scene.sound.setVolume(0.7)
    this.sounds={}
    this.volumes={
      //click:0.4,
    }
    
    //this.sounds.click=scene.sound.add("click")
    
    
    
    EventCenter.on("playAudio",data=>{
      //console.log("play: "+data.key)
    try { 
      this.sounds[data.key].play({
        
        volume:this.volumes[data.key]*GlobalStuff.SFXVolume/10 
      }) 
      } catch (er) {console.log(er.message,er.stack); throw er} 
    })
    
    EventCenter.on("stopAudio",data=>{
      
      scene.tweens.add({
        targets:this.sounds[data.key],
        duration:100,
        volume:0,
        onComplete:()=>{
          this.sounds[data.key].stop() 
        }
      })
      
    })
    
  }
  
  static preload(scene) {
    //scene.load.audio("click",ClickURL)
  }
}