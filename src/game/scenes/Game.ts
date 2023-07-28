import { SceneManager } from "../../utils/SceneManager";
import { Scene } from "./Scene";
import { brick } from "../assets/brick";
import { Level01Area } from "./Level01Area";
import { Application } from "pixi.js";
import { WindowBox } from "../../ui/WindowBox";
import { InfoBox } from "../../ui/InfoBox";


export class Game extends Scene{
    static LOSS = "loss";
    static WIN = "win";
    private statusGame:number;
    private manager: SceneManager;
    private app: Application;
    private currentLevel;
    private infoBox:InfoBox;

    constructor(sceneManager:SceneManager,level:number){
        super();
        this.manager = sceneManager;
        this.app = this.manager.app;
        let border = (this.app.screen.height*0.1)/2;
        switch(level){
            case 1:
                this.currentLevel = new Level01Area(this.app.screen.width*0.6,this.app.screen.height*0.9);
                this.currentLevel.position.y = border;
                this.currentLevel.position.x = border;
                this.addChild(this.currentLevel);
                brick;
        }
        this.statusGame = this.currentLevel?.winCounter as number;
        let infoBoxWidth = this.app.screen.width - (this.currentLevel?.width as number) - (border*2);
        this.infoBox = new InfoBox(infoBoxWidth,this.app.screen.height*0.9);
        this.infoBox.position.y = border;
        this.infoBox.position.x = border+(this.currentLevel?.width as number);
        this.addChild(this.infoBox);


    }

    windows(condition:string){
  
        switch(condition){

            case Game.LOSS : 
                let w01 : WindowBox = new WindowBox("Game Over","Final Score:\n"+this.currentLevel?.getScore(),"Red","Retry",300,450);

                w01=this.app.stage.addChild(w01);
                let buttonW = w01.button;
                let cancelIcon = w01.cancelIcon;

                w01.x = (this.app.screen.width - w01.width)/2;
                w01.y = (this.app.screen.height - w01.height)/2;

                //'none'/'passive'/'auto'/'static'/'dynamic'
                buttonW.eventMode='dynamic';
                buttonW.on('mousedown', () =>{ 
                    w01.removeFromParent();
                    this.currentLevel?.resetGame();
                    this.statusGame = this.currentLevel?.winCounter as number;
                });

                //'none'/'passive'/'auto'/'static'/'dynamic'
                cancelIcon.eventMode='dynamic';
                cancelIcon.on('mousedown', () =>{ 
                    w01.removeFromParent();
                    this.manager.changeScene(SceneManager.MENU);     
                });
                
                break;

            case Game.WIN :
                let w : WindowBox = new WindowBox("You Win!","Final Score:\n"+this.currentLevel?.getScore(),"Green","Retry",300,450);

                w=this.app.stage.addChild(w);
                let wbutton = w.button;
                let wCancelIcon = w.cancelIcon;

                w.x = (this.app.screen.width - w.width)/2;
                w.y = (this.app.screen.height - w.height)/2;

                //'none'/'passive'/'auto'/'static'/'dynamic'
                wbutton.eventMode='dynamic';
                wbutton.on('mousedown', () =>{ 
                    w.removeFromParent();
                    this.currentLevel?.resetGame();
                    this.statusGame = this.currentLevel?.winCounter as number;
                });

                //'none'/'passive'/'auto'/'static'/'dynamic'
                wCancelIcon.eventMode='dynamic';
                wCancelIcon.on('mousedown', () =>{ 
                    w.removeFromParent();
                    this.manager.changeScene(SceneManager.MENU);     
                });
                
                break;
           
        }
        
    }
    override update(deltaMS: number, deltaTime: number): void {
        this.infoBox.update(this.currentLevel?.getScore() as number , this.currentLevel?.getLives() as number);
        if(this.statusGame > 0){
            
            this.statusGame = this.currentLevel?.update(deltaMS,deltaTime) as number;
            if(this.statusGame == 0){
                this.windows(Game.WIN);  
              }
            if(this.statusGame < 0){
                this.windows(Game.LOSS);
            }        
        }
            
    }
    /* OLD/////////////////
    static GAMEOVER = "gameover";
    static WIN = "win";
    app;
    manager;

    player:player;
    playerWhidth = 170;
    playerHeight = 20;

    ball:ball;
    ballRadio = 6;

    bricks:DataMatrix<brick>;
    brickWhidth = 60;
    brickHeight = 30;
    brickColCount: number =6;
    brickRowCount: number =5;
    brickInnerSpace: number = 5;

    gameAreaContainer:Container;

    leftPressed;
    rightPressed;
    
    ballDirection:Point;
    ballLastPosition:Point;
    velocity = 6;

    winCounter:number;
    score;
    scoreText;
    gameOver = false;
    pause = true;

    setPause;
    pressLeft;
    leaveLeft;
    pressRight;
    leaveRight;

    constructor(manager:SceneManager,gameAreaContainer:Container){
        super();
        //Container del levelXX
        this.gameAreaContainer = gameAreaContainer;
        // Objetos utiles
        this.manager= manager;
        const app = manager.getApp();
        this.app = app;

        //Controles
        this.leftPressed = false;
        this.rightPressed = false;

        //Seteo de variables
        let mod = 1.41;
        this.ballDirection = new Point(1/mod,1/mod);
        this.winCounter=this.brickColCount*this.brickRowCount;
        this.score = 0;
        let score = "Score:"+this.score;
        this.scoreText = new Text(score,{
            fill:"green",
            fontSize:30,
            align:"left"
        });
        this.scoreText.position.x=10;
        this.scoreText.position.y=10;
        this.ballLastPosition=new Point();

        //Elementos del juego
        this.player = new player(this.playerWhidth,this.playerHeight);
        this.ball = new ball(this.ballRadio);
        this.bricks = new DataMatrix(this.brickColCount,this.brickRowCount);
        for(let i=0;i<this.bricks.rows;i++){
            for(let j=0;j<this.bricks.cols;j++){
                let aBrick : brick = new brick(this.brickWhidth,this.brickHeight);
                this.bricks.setValue(i,j, aBrick);
                this.addChild(aBrick); 
            }
        }

        //Agregar elementos al container
        this.addChild(this.player);
        this.addChild(this.ball);
        this.addChild(this.scoreText);

        //Seteo del nivel
        this.setGame();

        //Listeners

        this.setPause =  (event:KeyboardEvent)=>{
            if (event.key === '' || event.key === ' '){
                this.pause=false;
            }
        };
    
        this.pressLeft = (event:KeyboardEvent)=>{
            if (event.key === 'a' || event.key === 'A'){
                this.leftPressed = true;
            }
        };
        this.leaveLeft = (event:KeyboardEvent)=>{
            if (event.key === 'a' || event.key === 'A'){
                this.leftPressed = false;
            }
        };
        this.pressRight = (event:KeyboardEvent)=>{
            if (event.key === 'd' || event.key === 'D'){
                this.rightPressed = true;
            }
        };
        this.leaveRight = (event:KeyboardEvent)=>{
            if (event.key === 'd' || event.key === 'D'){
                this.rightPressed = false;
            }
        };

        document.addEventListener('keypress',this.setPause);
        document.addEventListener('keypress', this.pressLeft);
        document.addEventListener('keyup', this.leaveLeft);
        document.addEventListener('keypress', this.pressRight);
        document.addEventListener('keyup', this.leaveRight);
        
    }

    setGame() {
        this.pause = true;
        this.winCounter=this.brickColCount*this.brickRowCount;
        this.gameOver = false;
        this.score = 0;
        this.player.position.x = this.app.screen.width /2 - (this.playerWhidth/2) ;
        this.player.position.y = this.app.screen.height - (this.playerHeight+20);
        this.ball.position.x = (this.app.screen.width/2) ;
        this.ball.position.y = this.app.screen.height - (this.playerHeight+this.ballRadio+20);
        this.ballLastPosition.x = this.ball.position.x;
        this.ballLastPosition.y = this.ball.position.y;
        this.ballDirection.x=1;
        this.ballDirection.y=-1;
        let finalSize = (this.brickColCount*this.brickWhidth)+(this.brickInnerSpace*(this.brickColCount-1));
        let borderSizeX = (this.app.screen.width - finalSize)/2;
        for(let i=0;i<this.bricks.rows;i++){
            for(let j=0;j<this.bricks.cols;j++){
                let aBrick:brick = this.bricks.getValue(i,j);
                aBrick.position.x = borderSizeX + (aBrick.width+this.brickInnerSpace) * i;
                aBrick.position.y = 50 + (aBrick.height+this.brickInnerSpace) * j;
                if(!aBrick.visible){
                    aBrick.visible=true;
                    this.addChild(aBrick);
                }
            }
        }
    }



    public override update(_deltaFrame: number, _deltaTime: number): void {

        //Win Condition
        if(this.winCounter==0 && !this.gameOver){
            this.windows(Game.WIN);
            this.pause=true;
            this.gameOver=true;
        }

        //UI game
        this.scoreText.text= "Score:"+this.score;

        //Collisions
            
        let ballHitBox:Circle = new Circle(this.ball.x,this.ball.y,this.ballRadio);
        let playerHitBox:Rectangle = new Rectangle(this.player.x,this.player.y,this.player.width,this.player.height);
        
        // Ball vs Player
        if(Colider.circleVsRectangleCollision(ballHitBox,playerHitBox,0)){
            if(this.ballDirection.y > 0){
                // player : [------X------]
                // X : centerPlayer
                // ------ : lengthSector
                // x : ballHitBox.x = (  x  )
                // difference = distance within X and x
                let centerPlayer = playerHitBox.x + (playerHitBox.width/2);
                let difference = ballHitBox.x - centerPlayer;
                let lengthSector = playerHitBox.width/2;

                // Redirección del eje x del vector dirección de ball, en base a la distancia del centro de player.
                let redirectionX = (difference/lengthSector)*2;

                //Recálculo del vector dirección para que vuelva a ser unitario y no se genere un cambio indeseado de aceleración.
                let redirectionY = - Math.sqrt(1+Math.pow(redirectionX,2));
                let module = Math.sqrt(Math.pow(redirectionX,2)+Math.pow(redirectionY,2));
                this.ballDirection.x = redirectionX/module;               
                this.ballDirection.y = redirectionY/module;
            }
        }

        // Ball vs Brick
        // La razón por la cual se usa un booleano changeDirection para realizar el cambio de dirección de ball
        // es porque ball en ocasiones colisiona con mas de 1 brick, lo cual generaría que la dirección no cambie
        // por eso solo va a cambiar en base a la ultima colisión detectada en este frame, o sea lastHitBox.
        let changeDirection=false;
        let lastHitbox:Rectangle = new Rectangle(0,0,1,1);
        for(let i=0;i<this.bricks.rows;i++){
            for(let j=0;j<this.bricks.cols;j++){
                let aBrick = this.bricks.getValue(i,j);
                if(aBrick.visible){
                    let brickHitbox = new Rectangle(aBrick.x,aBrick.y,aBrick.width,aBrick.height);
                    if(Colider.circleVsRectangleCollision(ballHitBox,brickHitbox,0)){
                        lastHitbox=brickHitbox;
                        aBrick.visible=false;
                        changeDirection=true;
                        this.score+=100;
                        this.winCounter--;
                    }
                }
            }
        }
        if(changeDirection) this.bounceBricks(ballHitBox,lastHitbox,this.ballDirection);
        this.ballLastPosition.x=this.ball.x;
        this.ballLastPosition.y=this.ball.y;
        
        //Movimiento de Ball y comportamiento cuando colisiona con la Screen           
        if(!this.pause && !this.gameOver){

            if(this.ballDirection.x < 0){
                this.ball.position.x = this.ball.position.x + this.ballDirection.x *this.velocity;
                if((this.ball.position.x - this.ballRadio) <= 0){
                    this.ballDirection.x = -this.ballDirection.x;
                }
            }
            else{
                this.ball.position.x = this.ball.position.x + this.ballDirection.x*this.velocity;
                if((this.ball.position.x + this.ballRadio) >= this.app.screen.width){
                    this.ballDirection.x = -this.ballDirection.x;
                }
            }

            if(this.ballDirection.y < 0 ){
                this.ball.position.y = this.ball.position.y + this.ballDirection.y*this.velocity;
                if((this.ball.position.y - this.ballRadio) <= 0){       
                    this.ballDirection.y = -this.ballDirection.y;
                }
            }
            else{
                this.ball.position.y = this.ball.position.y + this.ballDirection.y*this.velocity;
                if((this.ball.position.y + this.ballRadio) < this.app.screen.height+(this.ballRadio*3)){
                    if((this.ball.position.y + this.ballRadio) > this.app.screen.height+(this.ballRadio*2)){
                            if(this.gameOver == false){
                                this.windows(Game.GAMEOVER);
                                this.gameOver = true;
                            }              
                        } 
                    }
                }

            //Movimiento de Player
            if(this.leftPressed){
                if(this.player.position.x > 0)
                    this.player.position.x = this.player.position.x - (20);
            }
            if(this.rightPressed){
                if(this.player.position.x < (this.app.screen.width - this.playerWhidth))
                    this.player.position.x = this.player.position.x + (20);
            }  

        }
    }

    // Función que se encarga del rebote de la pelota con los Bricks

    bounceBricks(ball:Circle,brick:Rectangle,direction:Point):void{
        let tempDirection :Point = new Point(direction.x,direction.y);        
        let ballActualPoint = new Point(ball.x,ball.y);
        let m =MathFunctions.linealM(this.ballLastPosition,ballActualPoint);

        let b =MathFunctions.linealB(m,ballActualPoint);
        let cornerX = 0;
        let y = 0;
       
        //Separar caso segun origen de la pelota
        //Si viene desde arriba a la izquierda
        if(tempDirection.x>0 && tempDirection.y>0){
            cornerX = brick.x;
            y = MathFunctions.linealY(m,b,cornerX);
            if(y>=brick.y){
                direction.x = -direction.x;
            }
            if(y<=brick.y){
                direction.y = -direction.y;
            }
        }
        //Si viene desde arriba a la derecha
        if(tempDirection.x<0 && tempDirection.y>0){
            cornerX = brick.x+brick.width;
            y = MathFunctions.linealY(m,b,cornerX);
            if(y>=brick.y){
                direction.x = -direction.x;
            }
            if(y<=brick.y){
                direction.y = -direction.y;
            }
        }
        //Si viene desde abajo a la izquierda
        if(tempDirection.x>0 && tempDirection.y<0){
            cornerX = brick.x;
            y = MathFunctions.linealY(m,b,cornerX);
            if(y<=(brick.y+brick.height)){
                direction.x = -direction.x;
            }
            if(y>=(brick.y+brick.height)){
                direction.y = -direction.y;
            }
        }
        //Si viene desde abajo a la derecha
        if(tempDirection.x<0 && tempDirection.y<0){
            cornerX = brick.x+brick.width;
            y = MathFunctions.linealY(m,b,cornerX);
            if(y<=brick.y){
                direction.x = -direction.x;
            }
            if(y>=brick.y){
                direction.y = -direction.y;
            }
        }
    }

    //Función que crea una ventana emergente en escena (mejorable)

    windows(condition:string){
  
        switch(condition){

            case Game.GAMEOVER : 
                let w01 : WindowBox = new WindowBox("Game Over","Final Score:\n"+this.score,"Red","Retry",300,450);

                w01=this.app.stage.addChild(w01);
                let buttonW = w01.button;
                let cancelIcon = w01.cancelIcon;

                w01.x = (this.app.screen.width - w01.width)/2;
                w01.y = this.app.screen.height*0.05;

                //'none'/'passive'/'auto'/'static'/'dynamic'
                buttonW.eventMode='dynamic';
                buttonW.on('mousedown', () =>{ 
                    w01.removeFromParent();
                    this.setGame();
                });

                //'none'/'passive'/'auto'/'static'/'dynamic'
                cancelIcon.eventMode='dynamic';
                cancelIcon.on('mousedown', () =>{ 
                    w01.removeFromParent();
                    this.manager.changeScene(SceneManager.MENU);     
                });
                
                break;

            case Game.WIN :
                let w : WindowBox = new WindowBox("You Win!","Final Score:\n"+this.score,"Green","Retry",300,450);

                w=this.app.stage.addChild(w);
                let wbutton = w.button;
                let wCancelIcon = w.cancelIcon;

                w.x = (this.app.screen.width - w.width)/2;
                w.y = this.app.screen.height*0.05;

                //'none'/'passive'/'auto'/'static'/'dynamic'
                wbutton.eventMode='dynamic';
                wbutton.on('mousedown', () =>{ 
                    w.removeFromParent();
                    this.setGame();
                });

                //'none'/'passive'/'auto'/'static'/'dynamic'
                wCancelIcon.eventMode='dynamic';
                wCancelIcon.on('mousedown', () =>{ 
                    w.removeFromParent();
                    this.manager.changeScene(SceneManager.MENU);     
                });
                
                break;
           
        }
        
    }
    override removeListeners(): void {
        document.removeEventListener('keypress',this.setPause);
        document.removeEventListener('keypress', this.pressLeft);
        document.removeEventListener('keyup', this.leaveLeft);
        document.removeEventListener('keypress', this.pressRight);
        document.removeEventListener('keyup', this.leaveRight);
    }
*/


}