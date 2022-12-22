import { createGameObjectSystem } from "../systems/GameObjectSystem" 
import { createPhysicsBodySystem } from "../systems/PhysicsBodySystem" 
import { createPositionSystem } from "../systems/PositionSystem" 
import { createPlayerInputSystem } from "../systems/PlayerInputSystem" 
import { createMovementSystem } from "../systems/MovementSystem" 
import { createJumpSystem } from "../systems/JumpSystem" 
import { createCameraSystem } from "../systems/CameraSystem" 
import { createAnimationSystem } from "../systems/AnimationSystem" 

export class SystemManager {
  constructor(world) {
    this.world=world
    
    this.systems=[
      createPlayerInputSystem(world),
      createMovementSystem(world),
      createJumpSystem(world),
      createGameObjectSystem(world),
      createPhysicsBodySystem(world),
      createPositionSystem(world),
      createCameraSystem(world),
      createAnimationSystem(world),
    ]
  }
  
  update() {
    this.systems.forEach(system=>{
      system(this.world)
    })
  }
}