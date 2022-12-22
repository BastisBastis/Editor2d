import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { PhysicsBody } from "../components/PhysicsBody" 
import { Movement } from "../components/Movement" 
import { Sprite } from "../components/Sprite" 


export const createMovementSystem=(world)=>{
  const movementQuery=defineQuery([Movement, PhysicsBody])
  
  return (world)=>{
    
    movementQuery(world).forEach(id=>{
      
      const body=world.bodies[id]
      if (!body)
        return
        
      body.body.setVelocityX(Movement.x[id]*Movement.speed[id])
      
      if (hasComponent(world,Sprite,id)) {
        
        if (Movement.x[id]<0)
          Sprite.flipX[id]=1
        else if (Movement.x[id]>0)
          Sprite.flipX[id]=0
      }
    })
    
    
    
    return world
  }
}