import { Objects } from "../data/Objects" 

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

export const ParseLoadedData=data=>{
  if (Array.isArray(data))
    return parseRCDCData(data)
}