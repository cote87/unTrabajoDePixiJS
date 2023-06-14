import { Container , Sprite} from "pixi.js";

export class CharacterWithHat extends Container{
    constructor(){
        super();

        const character: Sprite = Sprite.from("myAmongUs");
		const hat : Sprite = Sprite.from("eggHat");

        character.height = 200;
		character.width = 200;
		character.x = 0;
		character.y = 0;

		hat.angle=-20
		hat.x = 30;
		hat.y = 10;
		
		this.addChild(character);
		this.addChild(hat);

    }

}