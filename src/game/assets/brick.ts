import {Assets, Container, Sprite} from "pixi.js";

export class brick extends Container{
    constructor(){
        super();
        Assets.load("brick").then(
            () => {
                let brickSprite:Sprite = Sprite.from("brick");
                this.addChild(brickSprite);
            }
        );
    }
}