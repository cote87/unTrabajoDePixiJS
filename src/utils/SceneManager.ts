import { Application, Ticker } from "pixi.js";
import { Scene } from "../game/scenes/Scene";
import { MenuScene } from "../game/scenes/MenuScene";
import { Level01Scene } from "../game/scenes/Level01Scene";
import { AdaptableScreen } from "./AdaptableScreen";


export class SceneManager{
    
    app;
    scene:Scene;
    public static MENU = "menu";
    public static LV01 = "01";
    
    constructor(){

        this.app = new Application({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: 0x34495e,
            width: 800,
            height: 600,
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
        this.scene.removeFromParent();
        switch(newScene){
            case SceneManager.LV01:
                this.scene=new Level01Scene(this);
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
