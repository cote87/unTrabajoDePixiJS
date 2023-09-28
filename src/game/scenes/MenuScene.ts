import { Assets, Point} from "pixi.js";
import { WindowBox } from "../../ui/WindowBox";
import { SceneManager } from "../../utils/SceneManager";
import { Scene } from "./Scene";



export class MenuScene extends Scene{

    constructor(manager:SceneManager){
        super();
        const app = manager.getApp();
        Assets.load(["bluePanel","greyPanel","cancelIcon","blueButton"]).then(
            () => {
                let window : WindowBox = new WindowBox("","Arcanoid","Purple","Play",250,450);
                window.scale=new Point(1.2,1.2);
                window.x = (app.screen.width - window.width)/2;
                window.y = (app.screen.height - window.height)/2;
                let buttonWB = window.button;
                //'none'/'passive'/'auto'/'static'/'dynamic'
                buttonWB.eventMode='dynamic';
                buttonWB.on('mousedown', () =>{
                    manager.changeScene(SceneManager.LV01);  
                });
            
                this.addChild(window); 
        });
    }

}