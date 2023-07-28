import { Assets, Container, Sprite } from "pixi.js";

export class player extends Container{
    constructor(){
        super();
        Assets.load("player").then(
            () => {
                let playerSprite:Sprite = Sprite.from("player");
                this.addChild(playerSprite);
            }
        );

    }
}