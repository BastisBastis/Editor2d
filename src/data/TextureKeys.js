const keys=[
  "player"
]

export const TextureKeys = {}

keys.forEach((v,i)=>TextureKeys[v]=i)

export const getTextureKeyFromIndex=(index)=>{
  return Object.keys(TextureKeys).find(key=>TextureKeys[key]===index)
}