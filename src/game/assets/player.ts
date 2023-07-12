import { Container, Graphics } from "pixi.js";

export class player extends Container{
    img: Graphics = new Graphics();

    constructor(x:number,y:number){
        super();
        this.img.lineStyle(1,"#579");
        this.img.beginFill("#919");
        this.img.drawRect(0,0,x,y);
        this.img.endFill();
        this.img.visible = false;
        this.addChild(this.img);

    }
}