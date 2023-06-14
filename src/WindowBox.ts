import { Container , NineSlicePlane, Texture, Text, Sprite, Point} from "pixi.js";
import { CharacterWithHat } from "./CharacterWithHat";
export class WindowBox extends Container{
    constructor(){
        super();
        //Dimensiones del cartel
        const widthPanel = 250;
        const heigthPanel = 500;

        //Header
        const headContainer : Container = new Container();

        const headBox = new NineSlicePlane(
            Texture.from("bluePanel"),
            35,35,35,35
        );
        headBox.height = 50;
        headBox.width = 250;

        const cancelIcon : Sprite = Sprite.from("cancelIcon");
        cancelIcon.position.x=205;
        cancelIcon.position.y=5;
        cancelIcon.width = 40;
        cancelIcon.height = 40;


        const title : Text = new Text("Game Over",{
            fill:"white",
            fontSize:35,
            align:"left",
        });
        title.position.x=10;
        title.position.y= (headBox.height - title.height)/2;

        headContainer.addChild(headBox);
        headContainer.addChild(title);
        headContainer.addChild(cancelIcon);
        headContainer.height = heigthPanel*0.1;
        headContainer.width = widthPanel;


        const bodyContainer : Container = new Container();
        
        const bodyBox = new NineSlicePlane(
            Texture.from("greyPanel"),
            35,35,35,35
        );
        bodyBox.width=250;
        bodyBox.height=300;

        const message : Text = new Text("You Win!",{
            fill:"Green",
            fontSize:50,
            align:"center",
        });
        message.position.y= 50;
        message.position.x= (bodyBox.width - message.width)/2;
        

        const buttonContainer : Container = new Container();
        const button : Sprite = Sprite.from("blueButton");
        const messageButton : Text = new Text("Jugar de nuevo",{
            fill:"White",
        });
        button.width = messageButton.width+10;
        button.height = messageButton.height+10;
        messageButton.position.x=5;
        messageButton.position.y=5;
        buttonContainer.position.x= (bodyBox.width - button.width)/2;
        buttonContainer.position.y= message.position.y + message.height + 15;
        buttonContainer.addChild(button);
        buttonContainer.addChild(messageButton);

        const characterWithHat : CharacterWithHat = new CharacterWithHat();
        characterWithHat.scale=new Point(0.8,0.8);
		characterWithHat.x = (bodyBox.width - characterWithHat.width)/2;
		characterWithHat.y = bodyBox.height - 100;

        bodyContainer.addChild(bodyBox);
        bodyContainer.addChild(message);
        bodyContainer.addChild(buttonContainer);
        bodyContainer.addChild(characterWithHat);
        bodyContainer.position.y=50;

        bodyBox.height = heigthPanel*0.8;
        bodyBox.width = widthPanel;
       

        
        this.addChild(bodyContainer);
        this.addChild(headContainer);
    }
}