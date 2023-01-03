import Phaser from "phaser"


//helpers
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"
import { PromptFile } from "../helpers/FileLoader" 


//Data
import { Palette } from "../data/Palette" 

//UI
import { Button } from "../ui/Button"  
import { ModalTextInput } from "../ui/ModalTextInput" 
import { VerticalButtonsWindow } from "../ui/VerticalButtonsWindow" 


export default class MainMenu extends Phaser.Scene {
  
  constructor(){
    super("mainMenu")
  }
  
  create() {
    
    const bg=this.add.rectangle(
      640,
      360,
      1280,
      720,
      Palette.blue4.hex
    )
      .setDepth(-10000)
    
    this.logo =this.add.image(
      640,
      160,
      "logo"
    ).setScale(0.5)
    
    const buttonStartY=400
    const buttonDeltaY=200
    const buttonWidth=400
    const buttonHeight=100
    const buttonFontSize=54
    
    ;[
      {
        label:"NEW LEVEL",
        onClick:()=>this.startEditor()
      },
      {
        label:"LOAD LEVEL",
        onClick:()=>{
          //Get data Input
          try { 
          PromptFile().then(res=>{
            
            this.startEditor(JSON.parse(res,true))
          }).catch(er=>alert("Something went wrong, perhaps a corrupted JSON-file?"))
          
          
          } catch (er) {console.log(er.message,er.stack); throw er} 
        }
      }
    ].forEach((btn,i)=>{
      const button=new Button(
        this,
        640,
        buttonStartY+i*buttonDeltaY,
        btn.label,
        {
          onClick:btn.onClick,
          width:buttonWidth,
          height:buttonHeight,
          fontSize:buttonFontSize,
          backgroundColor:Palette.white.hex,
          fontColor:Palette.blue3.string,
          hoverBackgroundColor:Palette.green1.hex
        }
      )
    })
    
    
    
  }
  
  startEditor(data) {
    
    this.scene.start("editor",{
      loadedData:data
    })
  }
  
}