import { Container , NineSlicePlane, Texture, Text, Sprite} from "pixi.js";
export class WindowBox extends Container{

    button : Sprite = Sprite.from("blueButton");
    cancelIcon : Sprite = Sprite.from("cancelIcon");

    constructor(titleText:string,contentText:string,colorText:string,buttonText:string,widthPanel:number,heigthPanel:number){
        super();
        
        let fontSize = widthPanel/10;
        let bodyBoxHeight=heigthPanel;
        let bodyPositionY=0;

        if(titleText != ""){

            //Header

            let headContainer : Container = new Container();
            let headBox = new NineSlicePlane(
                Texture.from("bluePanel"),
                35,35,35,35
            );
            headBox.width = widthPanel;
            headBox.height = heigthPanel/10;

            
            let largeSquare =  headBox.height * 0.8;
            let marginIcon = (headBox.height-largeSquare)/2;
            this.cancelIcon.height = largeSquare;
            this.cancelIcon.width = largeSquare;
            this.cancelIcon.position.x = widthPanel - (largeSquare + marginIcon); 
            this.cancelIcon.position.y = marginIcon;
            
            let title : Text = new Text(titleText,{
                fill:"white",
                fontSize:fontSize,
                align:"left",
            });
            title.position.x=10;
            title.position.y= (headBox.height - title.height)/2;

            headContainer.addChild(headBox);
            headContainer.addChild(title);
            headContainer.addChild(this.cancelIcon);
            headContainer.height = heigthPanel*0.1;
            headContainer.width = widthPanel;
            this.addChild(headContainer);

            bodyBoxHeight = heigthPanel*0.9;
            bodyPositionY = headBox.height;

        }

        //Body

        const bodyContainer : Container = new Container();
        
        const bodyBox = new NineSlicePlane(
            Texture.from("greyPanel"),
            30,30,30,30
        );
        bodyBox.width=widthPanel;
        bodyBox.height=bodyBoxHeight;

        const message : Text = new Text(contentText,{
            fill:colorText,
            fontSize:fontSize*1.5,
            align:"center",
        });
        message.position.y= heigthPanel/10;
        message.position.x= (bodyBox.width - message.width)/2;
        

        const buttonContainer : Container = new Container();
        
        const messageButton : Text = new Text(buttonText,{
            fill:"White",
            fontSize:fontSize*1.5,
        });
        this.button.width = messageButton.width+10;
        this.button.height = messageButton.height+10;
        

        messageButton.position.x=5;
        messageButton.position.y=5;
        buttonContainer.position.x= (bodyBox.width - this.button.width)/2;
        buttonContainer.position.y= ((bodyBox.height + message.position.y + message.height)/2) - (this.button.height/2);
        buttonContainer.addChild(this.button);
        buttonContainer.addChild(messageButton);

        bodyContainer.addChild(bodyBox);
        bodyContainer.addChild(message);
        bodyContainer.addChild(buttonContainer);
        bodyContainer.position.y=bodyPositionY;
       
        this.addChild(bodyContainer);
    }

}