import Phaser from "phaser"
import { EventCenter } from "../helpers/EventCenter"
import pad_generic from '../data/gamepadConfigs/pad_generic'
import pad_unlicensedSNES from '../data/gamepadConfigs/pad_unlicensedSNES'
import pad_xbox360 from '../data/gamepadConfigs/pad_xbox360'
import pad_dualshock from '../data/gamepadConfigs/pad_dualshock' 

const getMapConfig=(id)=> {
    id = id.toLowerCase();
    let padConfig = pad_generic;

    if (id.includes('081f') && id.includes('e401')) {
        padConfig = pad_unlicensedSNES;
    }
    else if (id.includes('xbox') && id.includes('360')) {
        padConfig = pad_xbox360;
    }
    else if (id.includes('054c')) {
        padConfig = pad_dualshock;
    }
    else {
        
    }
    return padConfig;
}

const vec2=new Phaser.Math.Vector2(0,0)

export default class GamepadHandler extends Phaser.Scene {
    constructor() {
        super("gamepadManager")
    }

    create() {
      
        this.deadZone=0.2
        this.leftStick={
            x:0,
            y:0,
            angle:0,
            magnitude:0
        }
        this.rightStick={
            x:0,
            y:0,
            angle:0,
            magnitude:0
        }
        this.leftStickdirections={
            up:false,
            down:false,
            left:false,
            right:false
        }
        this.rightStickdirections={
            up:false,
            down:false,
            left:false,
            right:false
        }
        this.directions={
            up:false,
            down:false,
            left:false,
            right:false
        }

        this.mapConfig=null
        
        this.buttons={}

        this.stickData=[
            {
                dir:"left",
                side:"left",
                axis:"x",
                factor:-1,
                stickDirections:this.leftStickdirections,
            },
            {
                dir:"right",
                side:"left",
                axis:"x",
                factor:1,
                stickDirections:this.leftStickdirections,
            },
            {
                dir:"up",
                side:"left",
                axis:"y",
                factor:-1,
                stickDirections:this.leftStickdirections,
            },
            {
                dir:"down",
                side:"left",
                axis:"y",
                factor:1,
                stickDirections:this.leftStickdirections,
            },
            {
                dir:"left",
                side:"right",
                axis:"x",
                factor:-1,
                stickDirections:this.rightStickdirections,
            },
            {
                dir:"right",
                side:"right",
                axis:"x",
                factor:1,
                stickDirections:this.rightStickdirections,
            },
            {
                dir:"up",
                side:"right",
                axis:"y",
                factor:-1,
                stickDirections:this.rightStickdirections,
            },
            {
                dir:"down",
                side:"right",
                axis:"y",
                factor:1,
                stickDirections:this.rightStickdirections,
            },
        ]
        this.input.gamepad.on("down",this.handleButtonDown,this)
        this.gamepad=null
    }

    handleButtonDown(pad, button, event) {
        Object.keys(this.mapConfig).find(key=>{
            this.mapConfig[key]==button.index
        })

        EventCenter.emit("gamepad-buttondown",{
            index:button.index,
            name:Object.keys(this.mapConfig.gamepadMapping).find(key=>this.mapConfig.gamepadMapping[key]==button.index)
        })
    }

    update() {
      try { 

        if (this.input.gamepad.getAll().length<1)
          return

        
        const gamepad = this.input.gamepad.getPad(0)
        if (!this.gamepad)
            this.gamepad=gamepad
        if (!this.mapConfig)
          this.mapConfig=getMapConfig(gamepad.id)

        ;["up", "down", "left", "right"].forEach(dir=>{
          if (this.directions[dir]!=gamepad[dir]) {
              
            this.directions[dir]=gamepad[dir]
            EventCenter.emit("gamepad-dir-"+(!gamepad[dir]?"up":"down"),dir)
          }
        })
        this.stickData.forEach(({dir,side, factor, stickDirections,axis})=>{
            const stick=gamepad[side+"Stick"]
            
            if (this[side+"Stick"].x!=stick.x||this[side+"Stick"].y!=stick.y) {
              this[side+"Stick"].x=stick.x
              this[side+"Stick"].y=stick.y
              vec2.x=stick.x
              vec2.y=stick.y
              this[side+"Stick"].angle=vec2.angle()
              this[side+"Stick"].magnitude=vec2.length()
              EventCenter.emit("gamepad-"+side+"Stick-update",{
                ...this[side+"Stick"]
              })
            }
            
            
            if (stick[axis]*factor>this.deadZone != stickDirections[dir]) {
              
                stickDirections[dir]=!stickDirections[dir]
                
                EventCenter.emit("gamepad-"+side+"Stick-dir-"+(stickDirections[dir]?"down":"up"),dir)
                
              
            }
        })
        
       } catch (er) {console.log(er.message,er.stack); throw er;} 
      }
}