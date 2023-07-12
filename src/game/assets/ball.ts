import { Container, Graphics } from "pixi.js";

export class ball extends Container{
    img: Graphics = new Graphics();

    constructor(r:number){
        super();
        this.img.lineStyle(1,"black");
        this.img.beginFill("white");
        this.img.drawCircle(0,0,r);
        this.img.endFill();
        this.img.visible=false;

    }
}