import Phaser from "phaser"


//Helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
 

//Data
import { Palette } from "../data/Palette" 
import { Objects } from "../data/Objects" 

//UI Elements
import { Toolbar } from "../ui/Toolbar" 
import { SelectionWindow } from "../ui/SelectionWindow" 
import { WallTools } from "../ui/WallTools" 
import { WallSelectionWindow } from "../ui/WallSelectionWindow" 
import { LevelDetails } from "../ui/LevelDetails" 


export default class UI extends Phaser.Scene {
  
  constructor() {
    super("ui")
  }
  
  preload() {
    
  }
  
  create({
   map,
   width
  }) {
    try { 
    this.map=map
    this.toolbarWidth=width
    
    this.toolbar=new Toolbar(this,width)
    this.selectionWindow=null
    this.wallTools=null
    this.levelDetails=null
    
    this.setupEventListeners()
    
    EventCenter.emit("uiLoaded")
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  setupEventListeners() {
   EventCenter.on("tileSelected",this.showSelectionWindow,this)
   
   EventCenter.on("wallSelected",this.showWallSelectionWindow,this)
   
   EventCenter.on("deselected",this.closeSelectionWindow,this)
   
   EventCenter.on("toolSelected",this.handleToolSelected,this)
   
   EventCenter.on("showWallTools",this.showWallTools,this)
   
   EventCenter.on("closeWallTools",this.closeWallTools,this)
   
   EventCenter.on("showLevelDetails",this.showLevelDetails,this)
   
   EventCenter.on("closeLevelDetails",this.closeLevelDetails,this)
   
  }
  
  handleToolSelected(tooldata){
   this.toolbar.setTool(tooldata)
   if (this.wallTools)
    this.wallTools.setTool(tooldata)
  }
  
  showLevelDetails() {
   try { 
   this.levelDetails=new LevelDetails(this)
   } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  closeLevelDetails() {
    if (this.levelDetails)
     this.levelDetails.destroy()
    this.levelDetails=null
  }
 
  showWallTools() {
   this.wallTools=new WallTools(this,this.toolbarWidth)
  }
  
  closeWallTools() {
    if (this.wallTools)
     this.wallTools.destroy()
    this.wallTools=null
  }
  
  showSelectionWindow({
   tile,
   position
  }) {
    this.closeSelectionWindow()
    this.selectionWindow=new SelectionWindow(
     this,
     this.toolbarWidth,
     tile,
     position
    )
  }
  
  showWallSelectionWindow(wall) {
    try { 
    this.closeSelectionWindow()
    this.selectionWindow=new WallSelectionWindow(
     this,
     this.toolbarWidth,
     wall
    )
    
    } catch (er) {console.log(er.message,er.stack); throw er}
  }
  
  closeSelectionWindow() {
    if (this.selectionWindow)
     this.selectionWindow.destroy()
    this.selectionWindow=null
  }
  
  update(time,dt) {
    
    
    
  }
}