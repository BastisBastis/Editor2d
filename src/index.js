import Phaser from 'phaser'
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js'


import Game from "./scenes/Game"
import UI from "./scenes/UI"
import Loading from "./scenes/Loading"
import GamepadHandler from "./scenes/GamepadHandler"
import Editor from "./scenes/Editor"

try { 



const config = {
    type: Phaser.WEBGL,
    transparent:false,
    parent:"phaserContainer",
    fps: {
      //limit: 60
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      height: 720,
      width: 1280,
    }, 
    input:{
      gamepad:true
    },
    physics: {
      default: "arcade",
      arcade:{
        
        debug:false
      }
    },
    scene: [
      Editor,
      Loading,
      Game,
      UI,
      GamepadHandler
    ],
    dom: {
        createContainer: true
    },    
    plugins: {
      global: [{
        key: 'rexWebFontLoader',
        plugin: WebFontLoaderPlugin,
        start: true
      },
     
      ]
    }
};


  const game = new Phaser.Game(config);
  
} catch (er) {console.log(er.message,er.stack); throw er} 
