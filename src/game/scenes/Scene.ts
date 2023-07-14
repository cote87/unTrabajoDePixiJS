import { Container } from "pixi.js";
import { IUpdateable } from "../../utils/IUpdateable";

export class Scene extends Container implements IUpdateable{

    constructor(){
        super();
    }

    update(_deltaFrame: number, _deltaTime: number): void {
        
    }
    
}