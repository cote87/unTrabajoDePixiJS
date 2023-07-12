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

    public player;
    public ball;

    public playerWhidth = 200;
    public playerHeight = 30;
    public ballRadio = 15;
    public brickWhidth = 100;
    public brickHeight = 30;

    brickColCount: number =6;
    brickRowCount: number =5;

    public bricks:DataMatrix<brick>;

    public leftPressed = false;
    public rightPressed = false;
    
    public ballDirection;
    public app;
    public manager;
    public velocity = 8;

    static GAMEOVER = "gameover";
    static WIN = "win";

    winCounter:number;

    score = 0;
    scoreText;

    gameOver = false;
    pause = true;

    constructor(manager:SceneManager){
        super();
        this.manager= manager;
        const app = manager.getApp();
        this.app = app;

        let mod = Math.sqrt(2);
        this.ballDirection = new Point(1/mod,1/mod);

        this.winCounter=this.brickColCount*this.brickRowCount;
        let score = "Score:"+this.score;
        this.scoreText = new Text(score,{
            fill:"green",
            fontSize:10,
            align:"left"
        });
        this.scoreText.position.x=10;
        this.scoreText.position.y= 10;

        this.player = new player(this.playerWhidth,this.playerHeight);
        this.ball = new ball(this.ballRadio);
        
        this.bricks = new DataMatrix(this.brickColCount,this.brickRowCount);
        for(let i=0;i<this.bricks.rows;i++){
            for(let j=0;j<this.bricks.cols;j++){
                let aBrick : brick = new brick(this.brickWhidth,this.brickHeight);
                this.bricks.setValue(i,j, aBrick);
                app.stage.addChild(aBrick.img); 
            }
        }

        app.stage.addChild(this.player.img);
        app.stage.addChild(this.ball.img);
        this.app.stage.addChild(this.scoreText);

        this.setGame();

        document.addEventListener('keypress', (event)=>{
            if (event.key === '' || event.key === ' '){
                if(this.pause){
                    this.pause=false;
                }
                else{
                    this.pause=true;
                }
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
        this.winCounter=this.brickColCount*this.brickRowCount;
        this.gameOver = false;
        this.score = 0;
        this.player.img.position.x = this.app.screen.width /2 - (this.playerWhidth/2) ;
        this.player.img.position.y = this.app.screen.height - (this.playerHeight+20);
        this.ball.img.position.x = (this.app.screen.width/2) ;
        this.ball.img.position.y = this.app.screen.height - (this.playerHeight+this.ballRadio+20);
        this.ballDirection.x=1;
        this.ballDirection.y=-1;
        for(let i=0;i<this.bricks.rows;i++){
            for(let j=0;j<this.bricks.cols;j++){
                let aBrick:brick = this.bricks.getValue(i,j);
                aBrick.img.position.x = 94 + (aBrick.img.width+2) * i;
                aBrick.img.position.y = 40 + (aBrick.img.height+2) * j;
                if(aBrick.deleted){
                    aBrick.deleted=false;
                    this.app.stage.addChild(aBrick.img);
                }
            }
        }
    }

    override setVisible(bool:boolean){
        this.ball.img.visible = bool;
        this.player.img.visible= bool;
        for(let i=0;i<this.bricks.rows;i++){
            for(let j=0;j<this.bricks.cols;j++){
                this.bricks.getValue(i,j).img.visible=bool;
            }
        }
        this.scoreText.visible=bool;
        this.setGame(); 
    }

    public override update(_deltaFrame: number, _deltaTime: number): void {

        console.log(this.ballDirection.x+","+this.ballDirection.y);

        if(this.winCounter==0 && !this.gameOver){
            console.log("You Win!");
            this.windows(Level01Scene.WIN);
            this.pause=true;
            this.gameOver=true;
        }
        
            this.scoreText.text= "Score:"+this.score;
            

            let ballHitBox:Circle = new Circle(this.ball.img.x,this.ball.img.y,this.ballRadio);
            let playerHitBox:Rectangle = new Rectangle(this.player.img.x,this.player.img.y,this.player.img.width,this.player.img.height);
            if(Colider.circleVsRectangleCollision(ballHitBox,playerHitBox,0)){
                if(this.ballDirection.y > 0){
                    let centerPlayer = playerHitBox.x + (playerHitBox.width/2);
                    let diference = ballHitBox.x - centerPlayer;
                    let lengthSector = playerHitBox.width/2;

                    let redirectionX = (diference/lengthSector)*2;

                    let redirectionY = - Math.sqrt(1+Math.pow(redirectionX,2));
                    let module = Math.sqrt(Math.pow(redirectionX,2)+Math.pow(redirectionY,2));

                    this.ballDirection.x = redirectionX/module;               
                    this.ballDirection.y = redirectionY/module;
                }
            }
            let changeDirection=false;
            let lastHitbox:Rectangle = new Rectangle(0,0,1,1);
            for(let i=0;i<this.bricks.rows;i++){
                for(let j=0;j<this.bricks.cols;j++){
                    let aBrick = this.bricks.getValue(i,j);
                    if(!aBrick.deleted){
                        let brickImg= aBrick.img;
                        let brickHitbox = new Rectangle(brickImg.x,brickImg.y,brickImg.width,brickImg.height);
                        if(Colider.circleVsRectangleCollision(ballHitBox,brickHitbox,this.velocity*2)){
                            lastHitbox=brickHitbox;
                            brickImg.removeFromParent();
                            aBrick.deleted=true;
                            changeDirection=true;
                            this.score+=100;
                            this.winCounter--;
                        }
                    }
                }
            }

            if(changeDirection) this.bounceBricks(ballHitBox,lastHitbox,this.ballDirection);
            
            if(!this.pause && !this.gameOver){
                if(this.ballDirection.x < 0){
                    this.ball.img.position.x = this.ball.img.position.x + this.ballDirection.x *this.velocity;
                    if((this.ball.img.position.x - this.ballRadio) <= 0){
                        this.ballDirection.x = -this.ballDirection.x;
                    }
                }
                else{
                    this.ball.img.position.x = this.ball.img.position.x + this.ballDirection.x*this.velocity;
                    if((this.ball.img.position.x + this.ballRadio) >= this.app.screen.width){
                        this.ballDirection.x = -this.ballDirection.x;
                    }
                }

                if(this.ballDirection.y < 0 ){
                    this.ball.img.position.y = this.ball.img.position.y + this.ballDirection.y*this.velocity;
                    if((this.ball.img.position.y - this.ballRadio) <= 0){       
                        this.ballDirection.y = -this.ballDirection.y;
                    }
                }
                else{
                    this.ball.img.position.y = this.ball.img.position.y + this.ballDirection.y*this.velocity;
                    if((this.ball.img.position.y + this.ballRadio) < this.app.screen.height+(this.ballRadio*3)){
                        if((this.ball.img.position.y + this.ballRadio) > this.app.screen.height+(this.ballRadio*2)){
                                if(this.gameOver == false){
                                    console.log("game over");
                                    this.windows(Level01Scene.GAMEOVER);
                                    this.gameOver = true;
                                }              
                        } 
                    }
                }
            }
            if(this.leftPressed){
                if(this.player.img.position.x > 0)
                    this.player.img.position.x = this.player.img.position.x - (20);
            }
    
            if(this.rightPressed){
                if(this.player.img.position.x < (this.app.screen.width - this.playerWhidth))
                    this.player.img.position.x = this.player.img.position.x + (20);
            }  
        
    }

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
                    this.setVisible(false);
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
                    this.setVisible(false);
                });
                
                break;
           
        }
        
    }
    bounceBricks(ball:Circle,brick:Rectangle,direction:Point):void{
        if(ball.x >= brick.x && ball.x <= brick.x+brick.width){
            direction.y=-direction.y;
        }
        else{
            direction.x=-direction.x;
        }
    }

}