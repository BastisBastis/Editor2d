import {
  defineQuery,
  hasComponent
} from "bitecs"

//components
import { Sprite } from "../components/Sprite" 
import { Movement } from "../components/Movement" 
import { Animation } from "../components/Animation" 

import { getTextureKeyFromIndex } from "../data/TextureKeys" 

export const createAnimationSystem=(world)=>{
  const animationQuery=defineQuery([Animation, Sprite])
  
  return (world)=>{
    
    animationQuery(world).forEach(id=>{
      
      let animationKey=null
      
      if (hasComponent(world,Movement,id)) {
        if (Movement.x[id]===0)
          animationKey="idle"
        else
          animationKey="run"
      }
      
      const sprite=world.gameObjects[id]
      if (!animationKey || !sprite)
        return
        
      sprite.play(getTextureKeyFromIndex(Sprite.texture[id])+"-"+animationKey,true)
    })
    
    return world
  }
}