const keys=[
  "rectangle",
  "circle"
]

export const ShapeTypes = {}

keys.forEach((v,i)=>ShapeTypes[v]=i)

export const getShapeTypeFromIndex=(index)=>{
  return Object.keys(ShapeTypes).find(key=>ShapeTypes[key]===index)
}