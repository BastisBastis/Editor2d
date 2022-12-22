import Phaser from "phaser"



export default class BgBlocker extends Phaser.GameObjects.Rectangle {
  
  constructor (scene,depth=1,blockAlpha=0,onClick=undefined,tweenDuration) {
    const cam=scene.cameras.main;
    
    super(scene,0,0,cam.width,cam.height,0x000000,1)
    scene.add.existing(this)
    
    this.alpha=blockAlpha
    this.setOrigin(0,0)
    this.setDepth(depth-1)
    this.setInteractive()
    this.on("pointerdown",e=>{
      e.event.stopPropagation()
      e.event.preventDefault()
      if (onClick)
        onClick()
        return false
    }).on("pointerup",e=>{
      e.event.stopPropagation()
      e.event.preventDefault()
    }).on("pointermove",e=>{
      e.event.stopPropagation()
      e.event.preventDefault()
    })
    
    if (tweenDuration>0) {
      this.alpha=0
      scene.tweens.add({
        targets:this,
        alpha:blockAlpha,
        duration:tweenDuration
      })
    }
      
  }
  
}