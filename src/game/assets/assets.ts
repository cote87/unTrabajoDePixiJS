import { Graphics } from "pixi.js";

export let CharacterAssets= {
    eggHat: "./character/egghat.webp",
    myAmongUs: "./character/amongus.png"
};
export let UIAssets = {
    bluePanel: "./ui/blue_panel.png",
    greyPanel: "./ui/grey_panel.png",
    cancelIcon: "./ui/blue_boxCross.png",
    blueButton: "./ui/blue_button01.png"
}

let block:Graphics = new Graphics();
block.lineStyle(1,"black");
block.beginFill("red");
block.drawRect(0,0,60,20);
block.endFill();

let player:Graphics = new Graphics();
player.lineStyle(1,"black");
player.beginFill("blue");
player.drawRect(0,0,120,20);
player.endFill();


let ball:Graphics = new Graphics();
ball.lineStyle(1,"black");
ball.beginFill("black");
ball.drawCircle(0,0,10);
ball.endFill();

export let ElementsAssets ={
    block: block,
    ball: ball,
    player: player
}
