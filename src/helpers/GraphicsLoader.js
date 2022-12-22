import Player from "../assets/images/RunSkeleton.png" 

export const preloadGraphics = (scene)=>{
  scene.load.spritesheet("player",Player,{
    frameWidth:256,
    frameHeight:256
  })
}