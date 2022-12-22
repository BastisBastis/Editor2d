import {
  addEntity,
  addComponent
} from "bitecs"

//Components
import { Shape } from "../components/Shape" 
import { Position2d } from "../components/Position2d" 
import { Size2d } from "../components/Size2d" 
import { PhysicsBody } from "../components/PhysicsBody" 
import { Color } from "../components/Color" 

//Data
import { ShapeTypes } from "../data/ShapeTypes"
import { CollisionGroupKeys } from "../factories/CollisionGroups" 


export const createLevel=(world)=>{
  const tileSize={
    width:64,
    height:64
  }
  for (let i=0;i<100;i++) {
    if (i%16>10)
      i+=4
    const id= addEntity(world)
    addComponent(world,Position2d,id)
    addComponent(world,Size2d,id)
    addComponent(world,Color,id)
    addComponent(world,Shape,id)
    addComponent(world,PhysicsBody,id)
    
    Position2d.x[id]=(i+0.5)*tileSize.width
    Position2d.y[id]=world.scene.cameras.main.height-tileSize.height/2
    
    Size2d.width[id]=tileSize.width
    Size2d.height[id]=tileSize.height
    
    Color.hex[id]=0x338833
    
    Shape.type[id]=ShapeTypes.rectangle
    
  PhysicsBody.collisionGroup[id]=CollisionGroupKeys.ground
  }
  
  world.scene.cameras.main.setBounds(
    0,0,
    100*tileSize.width,
    world.scene.cameras.main.height
  )
}