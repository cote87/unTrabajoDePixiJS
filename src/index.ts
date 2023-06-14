
import { Application, Assets } from 'pixi.js'
import { Scene } from './Scene';
import { CharacterAssets, UIAssets } from './assets';



const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 800,
	height: 600,
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

Assets.addBundle("characterWithHat",CharacterAssets);
Assets.addBundle("UI",UIAssets);

Assets.load(["myAmongUs","eggHat","bluePanel","greyPanel","cancelIcon","blueButton"]).then(
	() => {
		const myScene:Scene = new Scene(app);
		app.stage.addChild(myScene);
		
});