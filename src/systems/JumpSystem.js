import {
  defineQuery
} from "bitecs"

//components
import { PhysicsBody } from "../components/PhysicsBody" 
import { Jump } from "../components/Jump" 

const coyoteTimer=100

export const createJumpSystem=(world)=>{
  const jumpQuery=defineQuery([Jump, PhysicsBody])
  
  return (world)=>{
    const dt = world.scene.game.loop.delta
    
    jumpQuery(world).forEach(id=>{
      const body = world.bodies[id]
      if (!body)
        return
        
      if (Jump.bufferTimer[id]>=0)
        Jump.bufferTimer[id]-=dt
        
      if (body.body.blocked.down)
        Jump.coyoteTimer[id]=coyoteTimer
      else if (Jump.coyoteTimer[id]>=0)
        Jump.coyoteTimer[id]-=dt
      
      if (Jump.bufferTimer[id]>0 && Jump.coyoteTimer[id]>0) {
        //start jump
        Jump.bufferTimer[id]=-1
        Jump.coyoteTimer[id]=-1
        Jump.currentJumpTimer[id]=Jump.maxJumpTime[id]
        body.body.setVelocityY(Jump.jumpVelocity[id])
      }
      
      //Reser current timer if button is released
      if (Jump.currentJumpTimer[id]>=0) {
        if (!Jump.holdingJump[id])
          Jump.currentJumpTimer[id]=-1
        else {
          //body.body.setVelocityY(Jump.jumpVelocity[id])
          Jump.currentJumpTimer[id]-=dt
        }
      } 
        
        
      
      /*
      Jump.bufferTimer[id]=-1
      Jump.coyoteTimer[id]=-1
      Jump.jumpVelocity[id]=-50
      Jump.maxJumpTime[id]=1000
      Jump.currentJumpTimer[id]=-1
      Jump.fallingGravityMod[id]=3
      Jump.holdingJump[id]=0
      */
      
      
      body.body.setGravity(0,
        Jump.currentJumpTimer[id]<0
        //body.body.velocity.y>-200
          ?world.scene.physics.world.gravity.y*Jump.fallingGravityMod[id]
          :0
      )
      
      
    })
    
    
    
    return world
  }
}