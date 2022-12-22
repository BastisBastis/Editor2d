import {
  addEntity,
  addComponent
} from "bitecs"

//Components
import { Sprite } from "../components/Sprite" 
import { Position2d } from "../components/Position2d" 
import { Size2d } from "../components/Size2d" 
import { PhysicsBody } from "../components/PhysicsBody" 
import { Color } from "../components/Color" 
import { Movement } from "../components/Movement"
import { Player } from "../components/Player" 
import { Jump } from "../components/Jump" 
import { Scale2d } from "../components/Scale2d" 
import { Animation } from "../components/Animation" 

//Data
import { CollisionGroupKeys } from "../factories/CollisionGroups" 
import { TextureKeys } from "../data/TextureKeys" 
import { AnimationKeys } from "../data/AnimationKeys" 

export const createPlayer=(world)=>{
  
  
  const id= addEntity(world)
  addComponent(world, Position2d, id)
  addComponent(world, Size2d, id)
  addComponent(world, Color, id)
  addComponent(world, Sprite, id)
  addComponent(world, PhysicsBody, id)
  addComponent(world, Player, id)
  addComponent(world, Movement, id)
  addComponent(world, Jump, id)
  addComponent(world, Scale2d, id)
  addComponent(world, Animation, id)
  
  Position2d.x[id]=100
  Position2d.y[id]=540
  
  Size2d.width[id]=64
  Size2d.height[id]=128
  
  Scale2d.x[id]=.5
  Scale2d.y[id]=.5
  
  Color.hex[id]=0x993333
  
  Sprite.texture[id]=TextureKeys.player
  Sprite.frame[id]=1
  Sprite.flipX[id]=0
  
  PhysicsBody.collisionGroup[id]=CollisionGroupKeys.player
  
  Movement.x[id]=0
  Movement.y[id]=0
  Movement.speed[id]=5
  
  Jump.bufferTimer[id]=-1
  Jump.coyoteTimer[id]=-1
  Jump.jumpVelocity[id]=-1000
  Jump.maxJumpTime[id]=300
  Jump.currentJumpTimer[id]=-1
  Jump.fallingGravityMod[id]=2
  Jump.holdingJump[id]=0
  
  setupPlayerAnimations(world.scene)
}

export const setupPlayerAnimations=(scene) => {
  scene.anims.create({
    key:"player-idle",
    duration:10,
    frames:[{
      key:"player",
      frame:16
    }]
  })
  
  scene.anims.create({
    key:"player-run",
    frameRate:24,
    frames:scene.anims.generateFrameNumbers("player",{
      start:0,
      end:15
    }),
    repeat:-1
  })
  
  
}