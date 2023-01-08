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
  result.walls=walls.map(w=>{return {start:w.start,direction:w.direction,length:w.length}})
  result.details=details
  
  const items=[]
  
  
  for (let i=0;i<details.levels;i++) {
    const columns=[]
    map.forEach((cells,x)=>{
      //const column=[]
      cells.forEach((cell,y)=>{
        cell[i].forEach(tile=>{
          console.log(tile)
          if (tile) {
            
            items.push({
              index:tile.oid,
              x,
              y,
              attributes:tile.attributes,
              level:i
            })
            
          }
          
        })
      })
      
    })
    
  }
  
  
  result.objects=items
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