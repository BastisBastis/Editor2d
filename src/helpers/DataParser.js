import { Objects } from "../data/Objects" 
import { NextId } from "./IdGenerator" 

const parseRCDCData =data=>{
  const map=[]
  const levels=data.length
  
  data[0].forEach((rows,columnIndex)=>{
      const column=[]
      map.push(column)
      rows.forEach((cellData,rowIndex)=>{
        const cell=[]
        column.push(cell)
        for (let i=0;i<levels;i++) {
          const layers=[]
          cell.push(layers)
          layers.push(
            (cellData[0]>=0?{
              oid:cellData[0],
              attributes:{
                ...Objects[cellData[0].attributes],
                rotation:cellData[1]
              }
            }:null),
            null,
            null
          )
        }
      })
    })
  
  
  return {
    map:map,
    details:{
      title:"Unnamed level",
      width:25,
      height:14,
      levels:levels,
      wallThickness:0.2,
    },
    walls:[]
  }
}

const parseRobbers = (data)=>{
  const map=[]
  const levels=data.length
  
  data.levels[0].forEach((rows,columnIndex)=>{
      const column=[]
      map.push(column)
      rows.forEach((cellData,rowIndex)=>{
        const cell=[]
        column.push(cell)
        //console.log(cellData)
        //for (let i=0;i<levels;i++) {
          const levels=[]
          //cell.push(levels)
          const layers=[null,null,null]
          cell.push(layers)
          
          cellData.forEach((layer)=>{
            //console.log(layer)
            layers[layer.layer]={
              oid:layer.index,
              attributes:layer.attributes
            }
          })
          /*
          layers.push(
            (cellData[0]>=0?{
              oid:cellData[0],
              attributes:{
                ...Objects[cellData[0].attributes],
                rotation:cellData[1]
              }
            }:null),
            null,
            null
          )
          */
        //}
      })
    })
  
  data.walls.forEach(wall=>{
    wall.id=NextId()
  })
  
  const result= {
    map:map,
    details:{
      title:"Unnamed level",
      width:25,
      height:14,
      levels:data.levels.length,
      wallThickness:0.2,
    },
    walls:[]
  }
  result.walls=data.walls
  //console.log(map)
  
  return result
}

export const ParseLoadedData=data=>{
  try { 
  
  if (Array.isArray(data))
    return parseRCDCData(data)
  return parseRobbers(data)
  
  } catch (er) {console.log(er.message,er.stack); throw er} 
}