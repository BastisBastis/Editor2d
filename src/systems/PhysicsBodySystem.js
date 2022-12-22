import {
  defineQuery,
  enterQuery,
  hasComponent,
  exitQuery,
  removeEntity
} from "bitecs"

import Phaser from "phaser"

import { Position2d } from "../components/Position2d"
import { PhysicsBody } from "../components/PhysicsBody" 
import { Size2d } from "../components/Size2d" 


//Factories
import { createCollisionGroups,addToCollisionGroup } from "../factories/CollisionGroups" 

const getSize=(world,id) => {
  let size = {
    width:10,
    height:10
  }
  if (hasComponent(world,Size2d,id)) {
    size={
      width:Size2d.width[id],
      height:Size2d.height[id]
    }
  } else if (world.gameObjects[id]) {
    size={
      width:world.gameObjects[id].displayWidth,
      height:world.gameObjects[id].displayHeight
    }
  }
  
  return size
}


export const createPhysicsBodySystem=(world)=>{
  const scene=world.scene
  world.bodies={}
  
  createCollisionGroups(world)
  
  const bodyQuery = defineQuery([PhysicsBody,Position2d])
  const bodyEnterQuery= enterQuery(bodyQuery)
  const bodyExitQuery= exitQuery(bodyQuery)
  
  return world=>{
    
    bodyEnterQuery(world).forEach(id=>{
      
      const size=getSize(world,id)
      const body= scene.add.rectangle(
        Position2d.x[id],
        Position2d.y[id],
        size.width,
        size.height,
        0xffaaaa,
        0
      )
      addToCollisionGroup(body, PhysicsBody.collisionGroup[id])
      world.bodies[id]=body
      
    })
    
    return world
  }
}
