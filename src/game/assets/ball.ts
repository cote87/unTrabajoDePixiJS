import { Graphics, Point } from "pixi.js";

export class ball extends Graphics{
    radio;
    direction:Point = new Point(0,0);
    velocity:number = 0;
    constructor(r:number){
        super();
        this.radio = r;
        this.lineStyle(1,"black");
        this.beginFill("white");
        this.drawCircle(0,0,r);
        this.endFill();
    }
}