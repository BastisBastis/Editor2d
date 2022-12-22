//import Main1URL from "./assets/music/Main1.m4a"

const trackData = [
  /*
  {
    key:"main1",
    group:"main",
    url:Main1URL,
    volume:0.5
  },
  */
]

export const MusicManager={
    tracks:[]
 }
 
 
 MusicManager.play=(index,scene)=>{
   if (index>=MusicManager.tracks.length)
     return
   const currentTrackIndex= MusicManager.tracks.findIndex(track=>track.isPlaying)
   
   
   if (index===currentTrackIndex)
     return
   
   const nextTrack=MusicManager.tracks[index]
   nextTrack.ref.setVolume(0)
   nextTrack.volume=0
   nextTrack.ref.play()
   nextTrack.isPlaying=true
   
   let  fadeDuration=100
   if (currentTrackIndex>-1) {
     
     const currentTrack=MusicManager.tracks[currentTrackIndex]
     
     if (currentTrack.group===nextTrack.group) {
       fadeDuration=1000
       nextTrack.ref.setSeek(currentTrack.ref.seek)
     } else {
       nextTrack.ref.setSeek(0)
     }
     
     
     scene.tweens.add({
       targets:currentTrack,
       volume:0,
       duration:fadeDuration,
       //ease:Phaser.Math.Easing.Cubic.Out,
       onUpdate:()=>{
         
         currentTrack.ref.setVolume(currentTrack.volume)
       },
       onComplete:()=>{
         
         currentTrack.isPlaying=false
         currentTrack.ref.stop()
       }
     })
   }
   
   
   
   
   scene.tweens.add({
       targets:nextTrack,
       volume:1,
       duration:fadeDuration,
       onUpdate:()=>{
         nextTrack.ref.setVolume(nextTrack.volume)
       }
       
     })
 }
 
 
 MusicManager.setup=(scene)=>{
   scene.sound.setVolume(0.7)
   if (MusicManager.tracks.length>0)
     return
   trackData.forEach(track=>{
     
     MusicManager.tracks.push({
       group:track.group,
       isPlaying:false,
       volume:track.volume,
       ref:scene.sound.add(track.key,{
         loop:true
       })
     })
   })
 }
 
 MusicManager.preload=(scene)=>{
   
   trackData.forEach(track=>{
     scene.load.audio(track.key,track.url)
   })
 }
