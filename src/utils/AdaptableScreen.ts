import { Application } from "pixi.js";

export class AdaptableScreen{
    adaptableScreen(app:Application){
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
    }
}

