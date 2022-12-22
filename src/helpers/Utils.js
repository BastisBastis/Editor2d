export const degToRad=(degrees)=>{
  return degrees*(Math.PI/180)
}

export const getDistance=(a,b) =>{
  const xDist=a.x-b.x
  const yDist=a.y-b.y
  
  return Math.sqrt(xDist*xDist+yDist*yDist)
}
  
export const getNormalizedVector2=(vec) =>{
  const length=Math.sqrt(vec.x*vec.x+vec.y*vec.y)
  if (length===0)
    return {x:0,y:0}
  
  return {
    x:vec.x/length,
    y:vec.y/length
  }
}

export const getAngleFromVector=(vec) => {
  return Math.atan2(vec.y,vec.x)
}

export const getVectorFromAngle=(angle,length=1) => {
  const vec={
    x:Math.cos(angle)*length,
    y:Math.sin(angle)*length
  }
  return vec
}

export const radToDeg=(rad) =>{
  return rad/(Math.PI/180)
}
  
export const shuffleArray=(array) =>{
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  return array
}

export const rotateVector2=(vec,angle,origin={x:0,y:0})=>{
  const x=vec.x * Math.cos(angle) - vec.y * Math.sin(angle)
  const y = vec.x * Math.sin(angle) + vec.y * Math.cos(angle)
  vec.x=x
  vec.y=y
  return vec;
  
}

export const lerpColor = (a, b, amount) => {
    const ar = a >> 16,
          ag = a >> 8 & 0xff,
          ab = a & 0xff,

          br = b >> 16,
          bg = b >> 8 & 0xff,
          bb = b & 0xff,

          rr = ar + amount * (br - ar),
          rg = ag + amount * (bg - ag),
          rb = ab + amount * (bb - ab);

    return (rr << 16) + (rg << 8) + (rb | 0);
}

export const clamp=(value,max) => {
  return Math.min(value,max)
}

export const minClamp=(value,min) => {
  return Math.max(value,min)
}

export const minMaxClamp=(value,min,max) => {
  return clamp(max,minClamp(value,min))
}

export const lerpRadians=(A, B, w)=>{
    let CS = (1-w)*Math.cos(A) + w*Math.cos(B);
    let SN = (1-w)*Math.sin(A) + w*Math.sin(B);
    return Math.atan2(SN,CS);
}

export const getDegreeDiff=(a,b) =>{
  while (a<0)
    a+=360
  while (b<0)
    b+=360
  a%=360
  b%=360
  let delta=Math.abs(a-b)
  if (delta>180)
    delta=360-delta
  return delta
}

