import {Graphics } from "pixi.js";

export class brick extends Graphics{

    constructor(x:number,y:number){
        super();
        // Genera componentes de color aleatorios
        const red = Math.random() * 255;
        const green = Math.random() * 255;
        const blue = Math.random() * 255;

        // Crea un color aleatorio en formato hexadecimal
        const color = (red << 16) | (green << 8) | blue;


        this.lineStyle(1,"black");
        this.beginFill(color);
        this.drawRect(0,0,x,y);
        this.endFill();

    }
}