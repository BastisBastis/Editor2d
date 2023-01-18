import UndoManager from "undo-manager"
import { Objects, WallTextures } from "../data/Objects" 
import { EventCenter } from "../helpers/EventCenter" 
import { NextId } from "../helpers/IdGenerator" 

export class ActionManager {
  
  constructor(scene, map,walls) {
    this.scene=scene
    this.map=map
    this.walls=walls
    this.undoManager = new UndoManager()
  }
  
  execute(action,args) {
    //console.log("execute: ",action,args)
    try { 
    switch(action) {
      case "placeObject":
        this.placeObject(args.column,args.row,args.data.key)
        break
      case "clearTile":
        this.clearTile(args)
        break
      case "modifyAttribute":
        
        this.modifyAttribute(
          args,
          args.key,
          args.value
        )
        break
      case "addAttribute":
        
        this.addAttribute(
          args,
          args.key,
        )
        break
      case "removeAttribute":
        this.removeAttribute(
          args,
          args.key,
        )
        break
      case "moveWall":
        this.moveWall(
          args.id,
          args.dir,
        )
        break
      case "rotateWall":
        this.rotateWall(
          args
        )
        break
      case "deleteWall":
        this.deleteWall(
          args
        )
        break
      case "addWall":
        this.addWall(
          args
        )
        break
      case "modifyWallLength":
        this.modifyWallLength(
          args
        )
        break
      case "nextWallTexture":
        this.nextWallTexture(
          args
        )
        break
    }
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  nextWallTexture({id,key}) {
    
    if (!this.walls.some(wall=>{
      return wall.id===id
    })) {
      EventCenter.emit("error","Cannot find wall with id "+id)
      return
    }
    const wallIndex = this.walls.findIndex(wall=>wall.id===id)
    
    const currentTexture = this.walls[wallIndex].texture[key]
    const nextTexture = (currentTexture+1) % WallTextures.length
    
    this.executeSetWallTexture(id,key,nextTexture)
    
    this.undoManager.add({
      undo:()=>{
        this.executeSetWallTexture(id,key,currentTexture)
      },
      redo:()=>{
        this.executeSetWallTexture(id,key,nextTexture)
      }
    })
  }
  
  executeSetWallTexture(id, key, texture) {
    const wallIndex = this.walls.findIndex(wall=>wall.id===id)
    this.walls[wallIndex].texture[key] = texture
    
  }
  
  modifyWallLength({id,delta}) {
    if (!this.walls.some(wall=>{
      return wall.id===id
    })) {
      EventCenter.emit("error","Cannot find wall with id "+id)
      return
    }
    this.executeModifyWallLength(id,delta)
    this.undoManager.add({
      undo:()=>{
        this.executeModifyWallLength(id,-delta)
      },
      redo:()=>{
        this.executeModifyWallLength(id,delta)
      }
    })
  }
  
  executeModifyWallLength(id,delta) {
    const wall=this.walls.find(wall=>wall.id===id)
    wall.length+=delta
  }
  
  addWall(args) {
    
    args.id=NextId()
    const copy={...args}
    
    this.executeAddWall(args)
    this.undoManager.add({
      undo:()=>{
        this.executeDeleteWall(args.id)
      },
      redo:()=>{
        this.executeAddWall(copy)
      }
    })
  }
  
  executeAddWall(args) {
    
    this.walls.push({
      id:args.id,
        start: {
          column:args.column,
          row:args.row
        },
        direction:args.direction,
        length:args.length,
        texture:{
          nw:0,
          se:0
        }
    })
  }
  
  deleteWall(id) {
    const wall = this.walls.find(wall=>wall.id===id)
    if (!wall) {
      EventCenter.emit("error","Cannot find wall with id "+id)
      return
    }
    
    const wallCopy={
      id:id,
      ...wall.start,
      direction:wall.direction,
      length:wall.length,
      textures: {...wall.textures}
    }
    
    
    this.executeDeleteWall(id)
    this.undoManager.add({
      undo:()=>{
        this.executeAddWall(wallCopy)
      },
      redo:()=>{
        this.executeDeleteWall(id)
      }
    })
  }
  
  executeDeleteWall(id) {
    const index = this.walls.findIndex(wall=>wall.id===id)
    console.log(index)
    this.walls[index].graphics.destroy()
    this.walls.splice(index,1)
  }
  
  rotateWall(id) {
    if (!this.walls.some(wall=>{
      return wall.id===id
    })) {
      EventCenter.emit("error","Cannot find wall with id "+id)
      return
    }
    this.executeRotateWall(id)
    this.undoManager.add({
      undo:()=>{
        this.executeRotateWall(id)
      },
      redo:()=>{
        this.executeRotateWall(id)
      }
    })
  }
  
  executeRotateWall(id) {
    const wall=this.walls.find(wall=>wall.id===id)
    wall.direction=wall.direction==="x"?"y":"x"
  }
  
  moveWall(id,dir) {
    if (!this.walls.some(wall=>{
      return wall.id===id
    })) {
      EventCenter.emit("error","Cannot find wall with id "+id)
      return
    }
    
    this.executeMoveWall(id,dir)
    
    this.undoManager.add({
      undo:()=>{
        this.executeMoveWall(id,{
          x:-dir.x,
          y:-dir.y
        })
      },
      redo:()=>{
        this.executeMoveWall(id,dir)
      }
    })
  }
  
  executeMoveWall(id,dir) {
    const wall=this.walls.find(wall=>wall.id===id)
    wall.start.column+=dir.x
    wall.start.row+=dir.y
  }
  
  removeAttribute(position,key) {
    const tile=this.getObjectAt(
      position.column,
      position.row,
      position.layer,
      position.level
    )
    const oldValue=tile.attributes[key] 
    this.executeRemoveAttribute(position,key)
    
    this.undoManager.add({
      undo:()=>{
        this.executeAddAttribute(position,key,oldValue)
      },
      redo:()=>{
        this.executeRemoveAttribute(position,key)
      }
    })
  }
  
  executeRemoveAttribute(position,key) {
    const tile=this.getObjectAt(
      position.column,
      position.row,
      position.layer,
      position.level
    )
    
    delete tile.attributes[key]
  }
  
  addAttribute(position,key,value=0) {
    if (value===null)
      return
    const tile=this.getObjectAt(
      position.column,
      position.row,
      position.layer,
      position.level
    )
    const oldValue=tile.attributes[key] 
    if (oldValue) {
      EventCenter.emit("error","Object already has an attribute with that name.")
      return
    }
    
    this.executeAddAttribute(position,key,value)
    
    this.undoManager.add({
      undo:()=>{
        this.executeRemoveAttribute(position,key,value)
      },
      redo:()=>this.executeAddAttribute(position,key)
    })
  }
  
  executeAddAttribute(position,key,value) {
    const tile=this.getObjectAt(
      position.column,
      position.row,
      position.layer,
      position.level
    )
    
    tile.attributes[key]=value
  }
  
  modifyAttribute(position,key,value) {
    
    const tile=this.getObjectAt(
      position.column,
      position.row,
      position.layer,
      position.level
    )
    const oldValue=tile.attributes[key] 
    
    this.executeModifyAttribute(position,key,value)
    
    this.undoManager.add({
      undo:()=>{
        this.executeModifyAttribute(position,key,oldValue)
      },
      redo:()=>this.executeModifyAttribute(position,key,value)
    })
  }
  
  executeModifyAttribute(position,key,value) {
    const tile=this.getObjectAt(
      position.column,
      position.row,
      position.layer,
      position.level
    )
    
    tile.attributes[key]=value
  }
  
  clearTile({column,row,layer,level}) {
    let oldTileObject=this.getObjectAt(column,row,layer,level)
    if (!oldTileObject)
      return
    oldTileObject= {...oldTileObject}
    const oldObject=Objects[oldTileObject.oid]
    
    
    this.executeClearTile({column,row,layer,level})
    
    this.undoManager.add({
      undo:()=>{
        this.executePlaceObject({column,row,layer,level,
          object:oldObject,
          oid:oldTileObject.oid
         })
      },
      redo:()=>{
        this.executeClearTile({column,row,layer,level})
      }
    })
  }
  
  executeClearTile({column,row,layer,level}) {
    const tile = this.getObjectAt(column,row,layer,level)
    if (tile && tile.sprite)
      tile.sprite.destroy()
      
    this.map[column][row][level][layer]=null
  }
  
  placeObject(column,row,key) {
    const object=Objects.find(o=>o.key===key)
    const layer=object.layer
    const level=0
    const oidToPlace=Objects.findIndex(o=>o.key===key)
    
    let oldTileObject=this.getObjectAt(column,row,layer,level)
    oldTileObject= oldTileObject?{...oldTileObject}:null
    
    
    
    this.executePlaceObject({
      column,row,layer,level,object,
      oid:oidToPlace
    })
    
    
    const oldOid= oldTileObject?oldTileObject.oid:null
    if (oldOid===oidToPlace)
      return
    
    const oldObject=oldTileObject?Objects[oldOid]:null
    
    this.undoManager.add({
      undo:()=>{
        if (oldTileObject) {
          
          this.executePlaceObject(
            {
              column,
              row,
              layer,
              level,
              object:oldObject,
              oid:oldOid
            }
          )
        } else {
          this.executeClearTile({column,row,layer,level})
        }
      },
      redo:()=>{
        this.executePlaceObject({
          column,row,layer,level,object,
          oid:oidToPlace
        })
      }
    })
  }
  
  
  executePlaceObject({column,row,layer,level,object,oid}) {
    const tile= this.map[column][row][level][layer] || {}
    
    const sprite=this.scene.add.image(
      (column+0.5)*this.scene.tileSize,
      (row+0.5)*this.scene.tileSize,
      object.spriteKey
    ).setDepth(layer+1)
    
    if (object.spriteFrame!==undefined)
      sprite.setFrame(object.spriteFrame)
      
    sprite.setScale(
        this.scene.tileSize/Math.max(
          sprite.width,
          sprite.height
        )
    )
    
    if (tile.sprite)
      tile.sprite.destroy()
      
    tile.oid=oid
    tile.attributes={...object.attributes}
    tile.sprite=sprite
    
    this.map[column][row][level][layer]=tile
  }
  
  getObjectAt(col,row,layer,level) {
    const tile=this.map[col][row]
    if (level>=tile.length) {
      console.log("level out of bounds")
      return null
    }
    return tile[level][layer]
  }
  
  undo() {
    this.undoManager.undo()
  }
}