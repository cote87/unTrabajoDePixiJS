import { Graphics } from "pixi.js";

export class player extends Graphics{

    constructor(x:number,y:number){
        super();
        this.lineStyle(1,"#579");
        this.beginFill("#919");
        this.drawRect(0,0,x,y);
        this.endFill();

    }
}