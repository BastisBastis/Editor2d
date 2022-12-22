import Phaser from "phaser"
import {
  defineQuery,
  hasComponent
} from "bitecs"

//Components
import { Player } from "../components/Player" 
import { Movement } from "../components/Movement" 
import { Jump } from "../components/Jump" 

//Helpers
import { EventCenter } from "../helpers/EventCenter"

const jumpBuffer=100

export const createPlayerInputSystem=(
  world
)=>{
  
  const cursorVector=new Phaser.Math.Vector2(0,0)
  
  const movementCursors={
    up:false,
    down:false,
    left:false,
    right:false
  }
  
  const movementAxis={
    x:0,
    y:0
  }
  
  let requestingJump=false
  let newJumpRequest=false
  
  EventCenter.on("setMovementCursor",({cursor,value})=>{
    movementCursors[cursor]=value
  })
  
  EventCenter.on("setMovementAxis",data=>{
    movementAxis.x=data.x
    movementAxis.y=data.y
  })
  
  EventCenter.on("requestJump",()=>{
    requestingJump=true
    newJumpRequest=true
  })
  EventCenter.on("stopRequestingJump",()=>{
    requestingJump=false
  })
  
  const playerQuery=defineQuery([Player,Movement])
  
  
  return world=>{
    
    if (movementCursors.up || movementCursors.down) {
      movementAxis.y=0
        - (movementCursors.up?1:0)
        + (movementCursors.down?1:0)
    }
    if (movementCursors.left || movementCursors.right) {
      movementAxis.x=0
        - (movementCursors.left?1:0)
        + (movementCursors.right?1:0)
    }
    
    playerQuery(world).forEach(id=>{
      Movement.x[id]=movementAxis.x
      Movement.y[id]=movementAxis.y
      Jump.holdingJump[id]=requestingJump
      if (newJumpRequest) {
        Jump.bufferTimer[id]=jumpBuffer
        newJumpRequest=false
      }
      
    })
    
    return world;
  }
}
