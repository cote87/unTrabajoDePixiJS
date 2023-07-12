import { Container, Graphics } from "pixi.js";

export class brick extends Container{
    img: Graphics = new Graphics();
    deleted:boolean;

    constructor(x:number,y:number){
        super();
        // Genera componentes de color aleatorios
        const red = Math.random() * 255;
        const green = Math.random() * 255;
        const blue = Math.random() * 255;

        // Crea un color aleatorio en formato hexadecimal
        const color = (red << 16) | (green << 8) | blue;


        this.img.lineStyle(1,"black");
        this.img.beginFill(color);
        this.img.drawRect(0,0,x,y);
        this.img.endFill();
        this.img.visible=false;
        this.deleted=false;

    }
}