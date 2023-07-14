import { Graphics } from "pixi.js";

export class ball extends Graphics{

    constructor(r:number){
        super();
        this.lineStyle(1,"black");
        this.beginFill("white");
        this.drawCircle(0,0,r);
        this.endFill();

    }
}