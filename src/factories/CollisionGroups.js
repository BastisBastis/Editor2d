

export const CollisionGroupKeys={
  player:0,
  ground:1
}

let collisionGroups

export const createCollisionGroups =(world)=>{
  const scene=world.scene
  collisionGroups={}
  
  collisionGroups[CollisionGroupKeys.player]=scene.physics.add.group()
  collisionGroups[CollisionGroupKeys.ground]=scene.physics.add.staticGroup()
  
  //Player Collisions
  scene.physics.add.collider(
    collisionGroups[CollisionGroupKeys.player],
    collisionGroups[CollisionGroupKeys.ground]
    
  )
}

export const addToCollisionGroup =(gameObject,index) => {
  collisionGroups[index].add(gameObject)
}