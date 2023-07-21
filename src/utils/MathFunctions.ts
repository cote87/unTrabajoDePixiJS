import { Point } from "pixi.js";

export class MathFunctions{
    static linealM(p1:Point,p2:Point):number{
        return (p1.y-p2.y)/(p1.x-p2.x);
    }
    static linealB(m:number,p:Point):number{
        return p.y-(m*p.x);
    }
    static linealY(m:number,b:number,x:number):number{
        return (m*x)+b;
    }
}