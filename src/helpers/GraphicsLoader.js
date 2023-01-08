import FloorTex2 from "../assets/images/TmpFloorTex1.png"
import FloorTex1 from "../assets/images/TmpFloorTex2.png"
import Object1_3d from "../assets/images/Tmp1-3d.png"
import Object1_topdown from "../assets/images/Tmp1topdown.png"
import Logo from "../assets/images/Logo.png" 
import RobberObjects from "../assets/images/RobberObjects.png" 


//RCDC
import Wall1Icon from "../assets/images/rcdc/Wall1Icon0.png"
import Wall1TD from "../assets/images/rcdc/Wall1TD0.png"
import Wall2Icon from "../assets/images/rcdc/Wall2Icon1.png"
import Wall2TD from "../assets/images/rcdc/Wall2TD1.png"
import Wall3Icon from "../assets/images/rcdc/Wall3Icon2.png"
import Wall3TD from "../assets/images/rcdc/Wall3TD2.png"
import Corner1Icon from "../assets/images/rcdc/Corner1Icon3.png"
import Corner1TD from "../assets/images/rcdc/Corner1TD3.png"
import DoorIcon from "../assets/images/rcdc/DoorIcon4.png"
import DoorTD from "../assets/images/rcdc/DoorTD4.png"
import Floor1Icon from "../assets/images/rcdc/Floor1Icon5.png"
import Floor1TD from "../assets/images/rcdc/Floor1TD5.png"
import Wall4Icon from "../assets/images/rcdc/Wall4Icon6.png"
import Wall4TD from "../assets/images/rcdc/Wall4TD6.png"
import Floor4Icon from "../assets/images/rcdc/Floor4Icon7.png"
import Floor4TD from "../assets/images/rcdc/Floor4TD7.png"
import Corner2Icon from "../assets/images/rcdc/Corner2Icon8.png"
import Corner2TD from "../assets/images/rcdc/Corner2TD8.png"
import Floor2Icon from "../assets/images/rcdc/Floor2Icon9.png"
import Floor2TD from "../assets/images/rcdc/Floor2TD9.png"
import Floor3Icon from "../assets/images/rcdc/Floor3Icon10.png"
import Floor3TD from "../assets/images/rcdc/Floor3TD10.png"
import Extra0Icon from "../assets/images/rcdc/Extra0Icon11.png"
import Extra0TD from "../assets/images/rcdc/Extra0TD11.png"
import Extra1Icon from "../assets/images/rcdc/Extra1Icon12.png"
import Extra1TD from "../assets/images/rcdc/Extra1TD12.png"
import Extra2Icon from "../assets/images/rcdc/Extra2Icon13.png"
import Extra2TD from "../assets/images/rcdc/Extra2TD13.png"
import Extra3Icon from "../assets/images/rcdc/Extra3Icon14.png"
import Extra3TD from "../assets/images/rcdc/Extra3TD14.png"
import Extra4Icon from "../assets/images/rcdc/Extra4Icon15.png"
import Extra4TD from "../assets/images/rcdc/Extra4TD15.png"
import Extra5Icon from "../assets/images/rcdc/Extra5Icon16.png"
import Extra5TD from "../assets/images/rcdc/Extra5TD16.png"
import Extra6Icon from "../assets/images/rcdc/Extra6Icon17.png"
import Extra6TD from "../assets/images/rcdc/Extra6TD17.png"


const testGraphics=[
  {
    url:FloorTex1,
    key:"floorTex1"
  },
  {
    url:FloorTex2,
    key:"floorTex2"
  },
  {
    url:Object1_3d,
    key:"tmpObject1-3d"
  },
  {
    url:Object1_topdown,
    key:"tmpObject1-topdown"
  },
]

const rcdcGraphics=[
  {
    url:Wall1Icon,
    key:"Wall1Icon"
  },
  {
    url:Wall1TD,
    key:"Wall1TD"
  },
  {
    url:Wall2Icon,
    key:"Wall2Icon"
  },
  {
    url:Wall2TD,
    key:"Wall2TD"
  },
  {
    url:Wall3Icon,
    key:"Wall3Icon"
  },
  {
    url:Wall3TD,
    key:"Wall3TD"
  },
  {
    url:Corner1Icon,
    key:"Corner1Icon"
  },
  {
    url:Corner1TD,
    key:"Corner1TD"
  },
  {
    url:DoorIcon,
    key:"DoorIcon"
  },
  {
    url:DoorTD,
    key:"DoorTD"
  },
  {
    url:Floor1Icon,
    key:"Floor1Icon"
  },
  {
    url:Floor1TD,
    key:"Floor1TD"
  },
  {
    url:Wall4Icon,
    key:"Wall4Icon"
  },
  {
    url:Wall4TD,
    key:"Wall4TD"
  },
  {
    url:Floor4Icon,
    key:"Floor4Icon"
  },
  {
    url:Floor4TD,
    key:"Floor4TD"
  },
  {
    url:Corner2Icon,
    key:"Corner2Icon"
  },
  {
    url:Corner2TD,
    key:"Corner2TD"
  },
  {
    url:Floor2Icon,
    key:"Floor2Icon"
  },
  {
    url:Floor2TD,
    key:"Floor2TD"
  },
  {
    url:Floor3Icon,
    key:"Floor3Icon"
  },
  {
    url:Floor3TD,
    key:"Floor3TD"
  },
  {
    url:Extra0Icon,
    key:"Extra0Icon"
  },
  {
    url:Extra0TD,
    key:"Extra0TD"
  },
  {
    url:Extra1Icon,
    key:"Extra1Icon"
  },
  {
    url:Extra1TD,
    key:"Extra1TD"
  },
  {
    url:Extra2Icon,
    key:"Extra2Icon"
  },
  {
    url:Extra2TD,
    key:"Extra2TD"
  },
  {
    url:Extra3Icon,
    key:"Extra3Icon"
  },
  {
    url:Extra3TD,
    key:"Extra3TD"
  },
  {
    url:Extra4Icon,
    key:"Extra4Icon"
  },
  {
    url:Extra4TD,
    key:"Extra4TD"
  },
  {
    url:Extra5Icon,
    key:"Extra5Icon"
  },
  {
    url:Extra5TD,
    key:"Extra5TD"
  },
  {
    url:Extra6Icon,
    key:"Extra6Icon"
  },
  {
    url:Extra6TD,
    key:"Extra6TD"
  },
]


export const PreloadGraphics=scene=>{
  try { 
  testGraphics.forEach(({url,key})=>{
    scene.load.image(key,url)
  })
  
  rcdcGraphics.forEach(({url,key})=>{
    scene.load.image(key,url)
  })
  scene.load.image("logo",Logo)
  scene.load.spritesheet("robbers",RobberObjects,{
    frameHeight:128,
    frameWidth:128
  })
  
  } catch (er) {console.log(er.message,er.stack); throw er} 
}