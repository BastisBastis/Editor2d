//Helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 

//Data
import { Palette } from "../data/Palette" 
import { Objects } from "../data/Objects" 

//UI Elements
import { Button } from "../ui/Button"
import { ModalTextInput } from "../ui/ModalTextInput" 

const labelMarginX=20
const labelMarginY=20
const labelDeltaY=100
const fontSize=24
const fontColor=Palette.purple8

const iconY= 200
const iconBgSize=120
const iconSize=112


const buttonDeltaY=70
const buttonWidth=160
const buttonHeight=60
const buttonStartY=300

const attributeStartY=720
const attributeDeltaY=180
const attributeSize=24
const attributeValueX=labelMarginX+100

const depth=2000

export class SelectionWindow {
  
  constructor(scene, width,tile,position) {
    
    const cam=scene.cameras.main
    this.scene=scene
    this.width=width
    this.tile=tile
    this.tilePosition=position
    this.items=[]
    
    
    const bg = scene.add.rectangle(
      0,
      0,
      width,
      cam.height*1.5,
      Palette.blue1.hex
    ).setDepth(depth)
      .setOrigin(0,0)
      .setInteractive()
      .on("pointerdown",(p)=>{
        p.event.stopPropagation()
    })
    this.items.push(bg)
    this.bg=bg
    
    //Tile iabel
    const tileLabel=scene.add.text(
      labelMarginX,
      labelMarginY,
      `Column: ${position.column}
Row: ${position.row}
Layer: ${position.layer+1}
Level: ${position.level+1}`,
      {
        fontSize,
        color:fontColor,
        fontFamily:GlobalStuff.FontFamily
      }
    ).setOrigin(0,0)
      .setDepth(depth)
  
    this.items.push(tileLabel)
    
    const iconBg=scene.add.rectangle(
      width/2,
      iconY,
      iconBgSize,
      iconBgSize,
      0xffffff
    ).setDepth(depth)
    this.items.push(iconBg)
    
    if (tile) {
      const icon=scene.add.image(
        width/2,
        iconY,
        Objects[tile.oid].iconKey
      ).setDepth(depth)
      const imageSize=Math.max(icon.width,icon.height)
      icon.setScale(iconSize/imageSize)
      this.items.push(icon)
    }
    
    
    const buttonData=[
      {
        label:"Clear",
        onClick:()=>{
          EventCenter.emit("clearTile",position)
          //EventCenter.emit("tileSelected",{tile,position})
        }
      },
      {
        label:"Next layer",
        onClick:()=>{
          try { 
          EventCenter.emit("nextLayer")
          //this.nextLayer()
          } catch (er) {console.log(er.message,er.stack); throw er} 
        }
      },
      {
        label:"Add attribute",
        onClick:()=>{
          
          ModalTextInput.prompt(this.scene,{string:"Enter attribute name:"}).then(res=>{
            EventCenter.emit("addAttribute",{
              ...this.tilePosition,
              key:res
            })
            this.updateAttributes()
          }).catch(err=>{
            console.log(err.message)
          })
        }
      },
      {
        label:"Rotate CW",
        onClick:()=>{
            
          if (this.tile.attributes.rotation!==undefined) {
            EventCenter.emit("modifyAttribute",{
              ...this.tilePosition,
              key:"rotation",
              value:(tile.attributes.rotation+90)%360
            })
            this.updateAttributes()
          }
          
          
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
          this.updateAttributes()
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
    
    this.attributeGroups=[]
    
    this.updateAttributes()
    
    
    
    
    scene.input.setDraggable(bg)
    bg.on("drag",(p)=>{
      const scroll=(p.y-p.prevPosition.y)/1
      
      this.scroll(scroll)
    })
    
  }
  
  clearAttributes(){
    this.attributeGroups.forEach(group=>{
      group.forEach(item=>{
        item.destroy()
        this.items=this.items.filter(it=>it!==item)
      })
    })
    this.attributeGroups=[]
  }
  
  updateAttributes() {
    this.clearAttributes()
    let maxY=0
    Object.entries(this.tile.attributes).forEach(([k,v])=>{
      const items=this.addAttribute(k,v)
      items.forEach(item=>{
        const bottomY=item.y+item.height/2
        maxY=Math.max(bottomY,maxY)
      })
    })
    this.bg.height=Math.max(
      maxY-this.bg.y+labelMarginY,
      this.scene.cameras.main.height
    )
    this.scroll(0)
  }
  
  addAttribute(key, value,i=this.attributeGroups.length) {
    const attributeGroup=[]
      
    
    const keyLabel=this.scene.add.text(
      labelMarginX,
      this.bg.y+attributeStartY+i*attributeDeltaY,
      key,
      {
        fontSize:attributeSize,
        color:fontColor,
        fontFamily:GlobalStuff.FontFamily
      }
    ).setOrigin(0,0.5)
      .setDepth(depth)
    
    const valueLabel=this.scene.add.text(
      labelMarginX,
      this.bg.y+attributeStartY+i*attributeDeltaY+attributeSize,
      value,
      {
        fontSize:attributeSize,
        color:fontColor,
        fontFamily:GlobalStuff.FontFamily
      }
    ).setOrigin(0,0.5)
      .setDepth(depth)
    
    
      
    ;[
      {
        string:"EDIT",
        onClick:()=>{
          try { 
          ModalTextInput.prompt(this.scene).then(res=>{
            
            if (res.length>0 && res!= this.tile.attributes[key]) {
              EventCenter.emit("modifyAttribute",{
                ...this.tilePosition,
                key,
                value:res
              })
            }
            valueLabel.setText(this.tile.attributes[key])
          }).catch(err=>{
           console.log("hm",err.message)
          })
          
          
          } catch (er) {console.log(er.message,er.stack); throw er} 
        }
      },
      {
        string:"REMOVE",
        onClick:()=>{
          try { 
          EventCenter.emit("removeAttribute",{
            ...this.tilePosition,
            key,
          })
          this.updateAttributes()
          } catch (er) {console.log(er.message,er.stack); throw er} 
        }
      }
    ].forEach((data,j)=>{
      const btn=new Button(
        this.scene,
        (j+0.5)*this.width/2,
        this.bg.y+attributeStartY+i*attributeDeltaY+attributeSize*2+buttonHeight/2,
        data.string,
        {
          depth,
          onClick:data.onClick,
          width:buttonWidth*0.45,
          height:buttonHeight*0.8,
          fontSize:20
        }
      )
      
      this.items.push(btn)
      attributeGroup.push(btn)
    })
      
    this.items.push(keyLabel,valueLabel)
    attributeGroup.push(keyLabel,valueLabel)
    this.attributeGroups.push(attributeGroup)
    return attributeGroup
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