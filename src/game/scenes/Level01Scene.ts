import { Circle, Point, Rectangle, Text} from "pixi.js";
import { player } from "../assets/player";
import { ball } from "../assets/ball";
import { SceneManager } from "../../utils/SceneManager";
import { Scene } from "./Scene";
import { WindowBox } from "../../ui/WindowBox";
import { Colider } from "../../utils/Colider";
import { brick } from "../assets/brick";
import { DataMatrix } from "../../utils/DataMatrix";


export class Level01Scene extends Scene{
    static GAMEOVER = "gameover";
    static WIN = "win";
    app;
    manager;

    player:player;
    playerWhidth = 200;
    playerHeight = 30;

    ball:ball;
    ballRadio = 15;

    bricks:DataMatrix<brick>;
    brickWhidth = 100;
    brickHeight = 30;
    brickColCount: number =6;
    brickRowCount: number =5;

    leftPressed;
    rightPressed;
    
    ballDirection;
    velocity = 8;

    winCounter:number;
    score;
    scoreText;
    gameOver = false;
    pause = true;

    constructor(manager:SceneManager){
        super();
        // Objetos utiles
        this.manager= manager;
        const app = manager.getApp();
        this.app = app;

        //Seteo de variables
        this.leftPressed = false;
        this.rightPressed = false;
        let mod = Math.sqrt(2);
        this.ballDirection = new Point(1/mod,1/mod);
        this.winCounter=this.brickColCount*this.brickRowCount;
        this.score = 0;
        let score = "Score:"+this.score;
        this.scoreText = new Text(score,{
            fill:"green",
            fontSize:10,
            align:"left"
        });
        this.scoreText.position.x=10;
        this.scoreText.position.y=10;

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
        document.addEventListener('keypress', (event)=>{
            if (event.key === '' || event.key === ' '){
                this.pause=false;
            }
        });
        document.addEventListener('keypress', (event)=>{
            if (event.key === 'a' || event.key === 'A'){
                this.leftPressed = true;
            }
        });
       
        document.addEventListener('keypress', (event)=>{
            if (event.key === 'd' || event.key === 'D'){
                this.rightPressed = true;
            }
        });

        document.addEventListener('keyup', (event)=>{
            if (event.key === 'a' || event.key === 'A'){
                this.leftPressed = false;
            }
        });

        document.addEventListener('keyup', (event)=>{
            if (event.key === 'd' || event.key === 'D'){
                this.rightPressed = false;
            }
        });
        
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
        this.ballDirection.x=1;
        this.ballDirection.y=-1;
        for(let i=0;i<this.bricks.rows;i++){
            for(let j=0;j<this.bricks.cols;j++){
                let aBrick:brick = this.bricks.getValue(i,j);
                aBrick.position.x = 94 + (aBrick.width+4) * i;
                aBrick.position.y = 40 + (aBrick.height+4) * j;
                if(!aBrick.visible){
                    aBrick.visible=true;
                    this.app.stage.addChild(aBrick);
                }
            }
        }
    }



    public override update(_deltaFrame: number, _deltaTime: number): void {

        console.log(this.ballDirection.x+","+this.ballDirection.y);

        //Win Condition
        if(this.winCounter==0 && !this.gameOver){
            console.log("You Win!");
            this.windows(Level01Scene.WIN);
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
                    if(Colider.circleVsRectangleCollision(ballHitBox,brickHitbox,this.velocity*2)){
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
                                console.log("game over");
                                this.windows(Level01Scene.GAMEOVER);
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
        let margin = ball.radius/2;
        if(ball.x >= (brick.x-margin) && ball.x <= (brick.x+brick.width+margin)){
            direction.y=-direction.y;
        }
        if(ball.y >= (brick.y-margin) && ball.y <= (brick.y+brick.height+margin)){
            console.log("margin="+margin);
            console.log("radio="+ball.radius);
            console.log("rango s/m = "+brick.y+" a "+ (brick.y+brick.height));
            console.log("entro, ball="+ball.y+" rango="+(brick.y-margin)+" a "+(brick.y+brick.height+margin));
            direction.x=-direction.x;
        }
    }

    //Función que crea una ventana emergente en escena (mejorable)

    windows(condition:string){
  
        switch(condition){

            case Level01Scene.GAMEOVER : 
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

            case Level01Scene.WIN :
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
}