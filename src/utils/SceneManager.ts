import { Application, Assets, Ticker } from "pixi.js";
import { Scene } from "../game/scenes/Scene";
import { MenuScene } from "../game/scenes/MenuScene";
import { Game } from "../game/scenes/Game";
import { AdaptableScreen } from "./AdaptableScreen";
import { GameAssets, UIAssets } from "../game/assets/assets";

export class SceneManager{
    
    app;
    scene:Scene;
    public static MENU = "menu";
    public static LV01 = "01";
    
    constructor(){
        Assets.addBundle("ui",UIAssets);
        Assets.addBundle("game",GameAssets);
        this.app = new Application({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: 0x34495e,
            width: 1280,
            height: 720,
        });
        const screen:AdaptableScreen = new AdaptableScreen();
        screen.adaptableScreen(this.app);
        let menuScene = new MenuScene(this);
        this.scene = menuScene;  
        this.app.ticker.add(() => {
            this.update();
        });
    }

    start():void{
        this.app.stage.addChild(this.scene);
    }

    changeScene(newScene:string):void{
        this.scene.removeListeners();
        this.scene.removeFromParent();
        switch(newScene){
            case SceneManager.LV01:
                this.scene=new Game(this,1);
                break;
            case SceneManager.MENU:
                this.scene=new MenuScene(this);
                break;
        }
        
        this.app.stage.addChild(this.scene);
    }

    getApp():Application{
        return this.app;
    }

    update(){
        this.scene.update(Ticker.shared.deltaMS,Ticker.shared.deltaTime);
    }
   
}
