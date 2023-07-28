import { Assets, Container, Sprite, Text } from "pixi.js";

export class InfoBox extends Container{
    private heightBox;
    private widthBox;
    private scoreText : Text;
    private liveText : Text;

    
    constructor(widthBox:number , heightBox:number){
        super();
        this.widthBox = widthBox;
        this.heightBox = heightBox;

        this.scoreText = new Text("0",{
            fill:"blue",
            fontSize:this.heightBox*0.05,
            align:"center"
        });
        this.liveText = new Text("x 3",{
            fill:"red",
            fontSize:this.heightBox*0.05,
            align:"center"
        });

        Assets.load(["panelInfo","heart"]).then(
            () => {
                let panelSprite:Sprite = Sprite.from("panelInfo");
                panelSprite.width = this.widthBox;
                panelSprite.height = heightBox;
                this.addChild(panelSprite);

                //Score
                this.scoreText.position.x=(widthBox-this.scoreText.width)/2;
                this.scoreText.position.y=170;
                this.addChild(this.scoreText);

                //Lives
                this.liveText.position.x=(widthBox-this.scoreText.width)/2;
                this.liveText.position.y=330;
                this.addChild(this.liveText);
            }
        );
    }

    update(score:number,lives:number){
        this.scoreText.text = score;
        this.scoreText.position.x=(this.widthBox-this.scoreText.width)/2;
        let liveString = "x "+lives;
        this.liveText.text=liveString;

    }

}