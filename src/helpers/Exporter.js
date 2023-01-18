const downloadObjectAsJson=(exportObj, exportName)=>{
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }


const exportRCDCLevel=(
  details,
  map,
  walls,
)=>{
  
  const data=[]
  for (let i=0;i<details.levels;i++) {
    const columns=[]
    map.forEach(cells=>{
      const column=[]
      cells.forEach(cell=>{
        const tile=cell[i][0]
        let tileData
        if (tile)
          tileData=[tile.oid,tile.attributes.rotation||0]
        else
          tileData=[-1,0]
        column.push(tileData)
      })
      columns.push(column)
    })
    data.push(columns)
  }
  downloadObjectAsJson(data,details.title)
}

const exportFull=(
  details,
  map,
  walls
)=>{
  const result={}
  //console.log(details)
  result.walls=walls.map(w=>{return {
    start:w.start,
    direction:w.direction,
    length:w.length,
    texture:w.texture
    }})
  result.details=details
  
  const items=[]
  
  result.levels=[]
  
  for (let i=0;i<details.levels;i++) {
    const columns=[]
    result.levels.push(columns)
    map.forEach((cells,x)=>{
      const column=[]
      
      columns.push(column)
      cells.forEach((cell,y)=>{
        const layers=[]
        column.push(layers)
        cell[i].forEach((tile,layerIndex)=>{
          
          if (tile) {
            /*console.log(tile,{
              index:tile.oid,
              attributes:tile.attributes,
              level:i,
              layer:layerIndex
            })*/
            layers.push({
              index:tile.oid,
              attributes:tile.attributes,
              level:i,
              layer:layerIndex
            })
            
          }
          
        })
        
      })
      
    })
    
  }
  //console.log(result)
  
  //result.objects=items
  //
  downloadObjectAsJson(result,details.title)
}

export const exportLevel =(
  details,
  map,
  walls,
  {
    rcdc=false
  }={}
)=> {
  try { 
  if (rcdc)
    exportRCDCLevel(details,map,walls)
  else
    exportFull(details,map,walls)
    //console.log(walls.map(w=>{return {start:w.start,direction:w.direction,length:w.length} }))
  
  } catch (er) {console.log(er.message,er.stack); throw er} 
}