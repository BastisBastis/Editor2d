//Helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 

//Data
import { Palette } from "../data/Palette" 
import { Objects , WallTextures} from "../data/Objects" 

//UI Elements
import { Button } from "../ui/Button"
import { ModalTextInput } from "../ui/ModalTextInput" 

const labelMarginX=20
const labelMarginY=20
const labelDeltaY=100
const fontSize=24
const fontColor=Palette.white.string

const iconY= 200
const iconBgSize=100
const iconSize=64


const buttonDeltaY=70
const buttonWidth=160
const buttonHeight=60
const buttonStartY=200

const attributeStartY=650
const attributeDeltaY=180
const attributeSize=24
const attributeValueX=labelMarginX+100

const depth=3000

export class WallSelectionWindow {
  
  constructor(scene, width,wall) {
    
    const cam=scene.cameras.main
    this.scene=scene
    this.width=width
    this.wall=wall
    this.items=[]
    
    
    const bg = scene.add.rectangle(
      0,
      0,
      width,
      cam.height*1.95,
      Palette.blue4.hex
    ).setDepth(depth)
      .setOrigin(0,0)
      .setInteractive()
      .on("pointerdown",(p)=>{
        p.event.stopPropagation()
    })
    this.items.push(bg)
    this.bg=bg
    
    //Data Label
    const dataLabel=scene.add.text(
      labelMarginX,
      labelMarginY,
      `Wall
Column: ${wall.start.column}
Row: ${wall.start.row}
Length: ${wall.length}
Direction: ${wall.direction}`,
      {
        fontSize,
        color:fontColor,
        fontFamily:GlobalStuff.FontFamily
      }
    ).setOrigin(0,0)
      .setDepth(depth)
  
    this.items.push(dataLabel)
    
    
    const buttonData=[
      {
        label:"Move up",
        onClick:()=>{
          EventCenter.emit("moveWall",{
            id:wall.id,
            dir:{
              x:0,
              y:-1
            }
          })
        }
      },
      {
        label:"Move down",
        onClick:()=>{
          EventCenter.emit("moveWall",{
            id:wall.id,
            dir:{
              x:0,
              y:1
            }
          })
        }
      },
      {
        label:"Move left",
        onClick:()=>{
          EventCenter.emit("moveWall",{
            id:wall.id,
            dir:{
              x:-1,
              y:0
            }
          })
        }
      },
      {
        label:"Move right",
        onClick:()=>{
          EventCenter.emit("moveWall",{
            id:wall.id,
            dir:{
              x:1,
              y:0
            }
          })
        }
      },
      {
        label:"Shorten",
        onClick:()=>{
          try { 
          EventCenter.emit("modifyWallLength",{
            id:wall.id,
            delta:-1
          })
          
          } catch (er) {console.log(er.message,er.stack); throw er} 
        }
      },
      {
        label:"Lengthen",
        onClick:()=>{
          EventCenter.emit("modifyWallLength",{
            id:wall.id,
            delta:1
          })
        }
      },
      {
        label:"Rotate",
        onClick:()=>{
          EventCenter.emit("rotateWall",wall.id)
        }
      },
      {
        label:"Delete",
        onClick:()=>{
          EventCenter.emit("deleteWall",wall.id)
        }
      },
      {
        label:"Deselect",
        onClick:()=>{
          try { 
          EventCenter.emit("deselect")
          } catch (er) {console.log(er.message,er.stack); throw er} 
        }
      },
      {
        label:"Undo",
        onClick:()=>{
          try { 
          EventCenter.emit("undo")
          } catch (er) {console.log(er.message,er.stack); throw er} 
        }
      },
      
    ]
    
    const buttons=[]
      
      buttonData.forEach((data,i)=>{
      const btn=new Button(
        scene,
        width/2,
        buttonStartY+i*buttonDeltaY,
        data.label,
        {
          depth,
          onClick:data.onClick,
          width:buttonWidth,
          height:buttonHeight,
          fontSize:24
        }
      )
      buttons.push(btn)
      this.items.push(btn)
      
    })
    
    
    
    const texturesY = buttons.at(-1).y + 80
    
    const tex1Label=scene.add.text(
      labelMarginX,
      texturesY,
      "N/W texture",
      {
        fontSize,
        color:fontColor,
        fontFamily:GlobalStuff.FontFamily
      }
    ).setOrigin(0,0)
      .setDepth(depth)
  
    this.items.push(tex1Label)
    
    this.tex1Btn = new Button(
        scene,
        width/2,
        texturesY+140,
        "",
        {
          depth,
          onClick:()=>{
            
            EventCenter.emit("nextWallTexture",{
              id:wall.id,
              key:"nw"
            })
            
            this.setWallTextureIcon(0)
          },
          width:buttonWidth,
          height:buttonWidth,
        }
      )
      this.setWallTextureIcon(0)
      
      
      this.items.push(this.tex1Btn)
      
      const tex2Label=scene.add.text(
      labelMarginX,
      texturesY+240,
      "S/E texture",
      {
        fontSize,
        color:fontColor,
        fontFamily:GlobalStuff.FontFamily
      }
    ).setOrigin(0,0)
      .setDepth(depth)
  
    this.items.push(tex2Label)
    
    this.tex2Btn = new Button(
        scene,
        width/2,
        texturesY+140+240,
        "",
        {
          depth,
          onClick:()=>{
            
            EventCenter.emit("nextWallTexture",{
              id:wall.id,
              key:"se"
            })
            
            this.setWallTextureIcon(1)
          },
          width:buttonWidth,
          height:buttonWidth,
        }
      )
    this.setWallTextureIcon(1)
    
    this.items.push(this.tex2Btn)
    
    scene.input.setDraggable(bg)
    bg.on("drag",(p)=>{
      const scroll=(p.y-p.prevPosition.y)/1
      
      this.scroll(scroll)
    })
    
  }
  
  setWallTextureIcon(index) {
    
    const key=["nw","se"][index]
    const btn=[this.tex1Btn,this.tex2Btn][index]
    
    
    btn.setIcon(WallTextures[this.wall.texture[key]].spriteKey,WallTextures[this.wall.texture[key]].spriteFrame)
  }
  
  
  scroll(scroll) {
    let dy=this.bg.y-(
          Math.min(
          Math.max(
            this.bg.y+scroll,
            this.scene.cameras.main.height-this.bg.height
          ),
          0
        )
      )
      
      
      this.items.forEach(item=>{
        item.y-=dy
      })
  }
  
  destroy() {
    this.items.forEach(item=>item.destroy())
  }
  
} 