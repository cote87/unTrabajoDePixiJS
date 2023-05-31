import { Application, Sprite, Assets} from 'pixi.js'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 640,
	height: 480
});

Assets.add("Clampy", "./clampy.png");
Assets.add("myCharmander", "./charmander.jpg");

Assets.load(["Clampy","myCharmander"]).then(
	() => {
		const clampy: Sprite = Sprite.from("myCharmander");
		console.log("Hola mundo!",clampy.width,clampy.height);
		clampy.anchor.set(0.5);
		clampy.x = 300;
		clampy.y = 300;
		app.stage.addChild(clampy);
});