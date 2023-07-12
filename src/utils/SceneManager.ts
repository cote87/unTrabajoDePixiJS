import { Application, Ticker } from "pixi.js";
import { Scene } from "../game/scenes/Scene";
import { MenuScene } from "../game/scenes/MenuScene";
import { Level01Scene } from "../game/scenes/Level01Scene";


export class SceneManager{
    
    app;
    scene:Scene;
    listOfScenes:Map<string,Scene> = new Map<string,Scene>();
    public static MENU = "menu";
    public static LV01 = "01";
    
    constructor(application:Application){
        this.app = application;
        let menuScene = new MenuScene(this);
        this.listOfScenes.set("menu",menuScene);
        this.scene = menuScene;   
        this.app.ticker.add(() => {
            this.update();
        });
    }

    start():void{
        this.app.stage.addChild(this.scene);
        this.scene.setVisible(true);
    }

    changeScene(newScene:string):void{

        this.scene.setVisible(false);

        if(this.listOfScenes.get(newScene) == null){
            switch(newScene){
                case SceneManager.LV01:
                        this.listOfScenes.set(newScene,new Level01Scene(this));
                    break;
            }
        }
            
        this.scene = this.listOfScenes.get(newScene) as Scene;
        this.scene.setVisible(true);
    }

    getApp():Application{
        return this.app;
    }

    update(){
        this.scene.update(Ticker.shared.deltaMS,Ticker.shared.deltaTime);
    }
   
}
