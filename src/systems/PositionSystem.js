import {
  defineQuery
} from "bitecs"

//components
import { Position2d } from "../components/Position2d" 

export const createPositionSystem=(world)=>{
  const posQuery=defineQuery([Position2d])
  
  return (world)=>{
    
    posQuery(world).forEach(id=>{
      
      const body=world.bodies[id]
      if (!body)
        return
        
      Position2d.x[id]=body.x
      Position2d.y[id]=body.y
      
      const gameObject=world.gameObjects[id]
      if (!gameObject)
        return
      
      
      
      gameObject.x=Position2d.x[id]
      gameObject.y=Position2d.y[id]
      
    })
    
    
    
    return world
  }
}