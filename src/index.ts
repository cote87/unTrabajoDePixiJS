
import { Application } from 'pixi.js'
import { AdaptableScreen } from './utils/AdaptableScreen';
import { SceneManager } from './utils/SceneManager';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x34495e,
	width: 800,
	height: 600,
});

const screen:AdaptableScreen = new AdaptableScreen();
screen.adaptableScreen(app);

const manager:SceneManager= new SceneManager(app);
manager.start();

