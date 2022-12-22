import {
  defineQuery,
  enterQuery
} from "bitecs"

//components
import { Player } from "../components/Player" 
import { Position2d } from "../components/Position2d" 
import { Movement } from "../components/Movement" 


const buffer=50
const lerpAlpha=0.2
const lookahead=0

export const createCameraSystem=(world)=>{
  const playerQuery=defineQuery([Player,Position2d,Movement])
  const playerEnterQuery=enterQuery(playerQuery)
  
  const cam = world.scene.cameras.main
  
  let dummy
  let dummyDelta
  
  const setupDummy=(player)=>{
    dummy=world.scene.add.rectangle(player.x,player.y,10,10,0xffff00,1)
    cam.startFollow(
      dummy,
      false, //roundPixels
      lerpAlpha
    )
  }
  
  return (world)=>{
    
    playerEnterQuery(world).forEach(id=>{
      const player=world.gameObjects[id]
      setupDummy(player)
    })
    
    playerQuery(world).forEach(id=>{
      
      dummy.x=Math.max(
        dummy.x,
        Position2d.x[id]-buffer
      )
      dummy.x=Math.min(
        dummy.x,
        Position2d.x[id]+buffer
      )
      
      cam.setFollowOffset(
        Math.sign(-Movement.x[id]/Movement.speed[id])*lookahead, 
        0
      )
    })
    
    return world
  }
}