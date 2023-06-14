import { Container , Application, Point } from "pixi.js";

import { WindowBox } from "./WindowBox";

export class Scene extends Container {
    constructor(app : Application){
        super();
        
        const panelBox : WindowBox = new WindowBox();

       
        

        panelBox.scale=new Point(1.2,1.2);
        panelBox.x = (app.screen.width - panelBox.width)/2;
        panelBox.y = app.screen.height*0.05;
        
        

        this.addChild(panelBox);
        
    }
}