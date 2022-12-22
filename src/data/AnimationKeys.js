const keys=[
  "idle",
  "walk",
  "run",
  "jump",
]

export const AnimationKeys = {}

keys.forEach((v,i)=>AnimationKeys[v]=i)

export const getAnimationKeyFromIndex=(index)=>{
  return Object.keys(AnimationKeys).find(key=>AnimationKeys[key]===index)
}