
import { Application, Sprite, Assets, Container} from 'pixi.js'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 1280,
	height: 720,
});

window.addEventListener("resize",
() => {
		const scaleX = window.innerWidth / app.screen.width;
		const scaleY = window.innerHeight / app.screen.height;
		const scale = Math.min(scaleX,scaleY);
		
		const gameWidth = app.screen.width * scale;
		const gameHeight = app.screen.height * scale;

		app.view.style!.width = gameWidth+"px";
		app.view.style!.height = gameHeight+"px";
		
		const marginWidth = (window.innerWidth - gameWidth)/2;
		const marginHeight = (window.innerHeight - gameHeight)/2;

		(app.view.style as any).marginLeft = marginWidth;
		(app.view.style as any).marginTop = marginHeight;
		
});
window.dispatchEvent(new Event("resize"));

Assets.add("eggHat", "./egghat.webp");
Assets.add("myAmongUs", "./amongus.png");

Assets.load(["myAmongUs","eggHat"]).then(
	() => {
		const character: Sprite = Sprite.from("myAmongUs");
		const hat : Sprite = Sprite.from("eggHat");

		character.height = 200;
		character.width = 200;
		character.anchor.set(0);
		character.x = 0;
		character.y = 0;

		hat.anchor.set(0);
		hat.angle=-20
		hat.x = 30;
		hat.y = 10;
		
		const characterWithHat : Container = new Container();
		characterWithHat.addChild(character);
		characterWithHat.addChild(hat);

		characterWithHat.x = 500;
		characterWithHat.y = 500;

		app.stage.addChild(characterWithHat);
		
});