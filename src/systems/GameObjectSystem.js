import {
  defineQuery,
  enterQuery,
  exitQuery,
  hasComponent
} from "bitecs"

//Components
import { Shape } from "../components/Shape" 
import { Position2d } from "../components/Position2d" 
import { Size2d } from "../components/Size2d" 
import { PhysicsBody } from "../components/PhysicsBody" 
import { Color } from "../components/Color" 
import { Sprite } from "../components/Sprite" 
import { Scale2d } from "../components/Scale2d" 

//Data
import { ShapeTypes } from "../data/ShapeTypes" 
import { getTextureKeyFromIndex } from "../data/TextureKeys" 


export const createGameObjectSystem =(world)=>{
  
  world.gameObjects={}
  
  const shapeQuery=defineQuery([Shape,Position2d,Size2d,Color])
  const shapeEnterQuery=enterQuery(shapeQuery)
  
  const spriteQuery=defineQuery([Sprite,Position2d,Size2d,Color])
  const spriteEnterQuery=enterQuery(spriteQuery)
  
  return world=>{
    
    shapeEnterQuery(world).forEach(id=>{
      let object
      switch (Shape.type[id]) {
        case ShapeTypes.rectangle:
          object=world.scene.add.rectangle(
            Position2d.x[id],
            Position2d.y[id],
            Size2d.width[id],
            Size2d.height[id],
            Color.hex[id]
          )
          break
        case ShapeTypes.circle:
          object=world.scene.add.circle(
            Position2d.x[id],
            Position2d.y[id],
            Size2d.radius[id],
            Color.hex[id]
          )
          break
      }
      
      world.gameObjects[id]=object
    })
    
    spriteEnterQuery(world).forEach(id=>{
      const sprite=world.scene.add.sprite(
        Position2d.x[id],
        Position2d.y[id],
        getTextureKeyFromIndex(Sprite.texture[id]),
        Sprite.frame[id]
      )
        .setFlipX(Sprite.flipX[id]>0)
      if (hasComponent(world,Scale2d,id))
        sprite.setScale(
          Scale2d.x[id],
          Scale2d.y[id]
        )
        
      world.gameObjects[id]=sprite
      sprite.play("player-run")
      
    })
    
    spriteQuery(world).forEach(id=>{
      
      const sprite=world.gameObjects[id]
      if (!sprite)
        return
      sprite.setFlipX(Sprite.flipX[id]===1)
    })
    
    return world
  }
  
}