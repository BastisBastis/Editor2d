import FloorTex2 from "../assets/images/TmpFloorTex1.png"
import FloorTex1 from "../assets/images/TmpFloorTex2.png"
import Object1_3d from "../assets/images/Tmp1-3d.png"
import Object1_topdown from "../assets/images/Tmp1topdown.png"




export const PreloadGraphics=scene=>{
  scene.load.image("floorTex1",FloorTex1)
  scene.load.image("floorTex2",FloorTex2)
  scene.load.image("tmpObject1-3d",Object1_3d)
  scene.load.image("tmpObject1-topdown",Object1_topdown)
}