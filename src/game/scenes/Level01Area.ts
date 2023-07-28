import { Assets, Circle, Container,  Graphics,  Point, Rectangle, Sprite } from "pixi.js";
import { DataMatrix } from "../../utils/DataMatrix";
import { player } from "../assets/player";
import { ball } from "../assets/ball";
import { brick } from "../assets/brick";
import { Colider } from "../../utils/Colider";
import { MathFunctions } from "../../utils/MathFunctions";
import { ILevel } from "./ILevel";


export class Level01Area extends Container implements ILevel{
    private player;
    private playerWhidth = 120;
    private playerHeight = 15;

    private ball;
    private bricks:DataMatrix<brick>;
    private score:number=0;
    private ballLastPosition = new Point();
    private pause:boolean = true;
    public winCounter:number = 0;
    private widthLevel;
    private heightLevel;
    private brickWhidth;
    private brickHeight;
    private lives:number = 0;

    //Controles
    private leftPressed = false;
    private rightPressed = false;
    //Funciones Listeners
    private setPause;
    private pressLeft;
    private leaveLeft;
    private pressRight;
    private leaveRight;

    constructor(widthLevel:number , heightLevel:number){
        super();
        this.widthLevel = widthLevel;
        this.heightLevel = heightLevel;
        /*let background = new Graphics();
        background.beginFill("lightblue");
        background.drawRect(0,0,this.widthLevel ,this.heightLevel);
        background.endFill();*/
        //this.addChild(background);
        //Parametros
        let ballRadio = 5;
        let brickColCount = 8;
        let brickRowCount = 6;
        this.brickWhidth = this.playerWhidth/2;
        this.brickHeight = this.playerHeight;
        //Elementos del juego
        this.player = new player();
        this.player.width = this.playerWhidth;
        this.player.height = this.playerHeight;
        
        this.ball = new ball(ballRadio);
        this.ball.velocity = 6;
        
        this.bricks = new DataMatrix(brickRowCount,brickColCount);

            for(let i=0;i<this.bricks.rows;i++){
                for(let j=0;j<this.bricks.cols;j++){
                    let aBrick : brick = new brick();
                    aBrick.width=this.brickWhidth;
                    aBrick.height=this.brickHeight;
                    this.bricks.setValue(i,j, aBrick);
                    //this.addChild(aBrick); 
                }
            }
            let border = new Graphics();
            border.lineStyle(6,"lightblue");
            border.drawRect(0,0,this.widthLevel ,this.heightLevel);
            this.addChild(border);
            //Listeners
            this.setPause =  (event:KeyboardEvent)=>{
                if (event.key === '' || event.key === ' '){
                    this.pause=false;
                }
            };

            Assets.load("background").then(
                () =>{
                    let bg:Sprite = Sprite.from("background");
                    bg.width = this.widthLevel;
                    bg.height = this.heightLevel;
                    this.addChild(bg);
                    this.addChild(this.player);
                    this.addChild(this.ball);
                    for(let i=0;i<this.bricks.rows;i++){
                        for(let j=0;j<this.bricks.cols;j++){
                            this.addChild(this.bricks.getValue(i,j)); 
                        }
                    }
                }
            );
    
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

        this.resetGame();

    }

    removeListeners(): void {
        document.removeEventListener('keypress',this.setPause);
        document.removeEventListener('keypress', this.pressLeft);
        document.removeEventListener('keyup', this.leaveLeft);
        document.removeEventListener('keypress', this.pressRight);
        document.removeEventListener('keyup', this.leaveRight);
    }

    public resetGame():void{
        this.lives = 3;
        this.score = 0;  
        this.setGame();
        let brickInnerSpace = 5;
        let finalSize = (this.bricks.cols*this.brickWhidth)+(brickInnerSpace*(this.bricks.cols-1));
        let borderSizeX = (this.widthLevel - finalSize)/2;
        for(let i=0;i<this.bricks.rows;i++){
            for(let j=0;j<this.bricks.cols;j++){
                let aBrick : brick = this.bricks.getValue(i,j);
                aBrick.position.x = borderSizeX + (this.brickWhidth+brickInnerSpace) * j;
                aBrick.position.y = this.heightLevel*0.05 + (this.brickHeight+brickInnerSpace) * i;
                if(!aBrick.visible){
                    aBrick.visible=true;
                    this.addChild(aBrick);
                }
            }
        }
        this.winCounter=this.bricks.cols*this.bricks.rows;
    }

    setGame(){
        console.log("w:"+this.widthLevel+" h: "+this.heightLevel);
        console.log("pw: "+this.playerWhidth+" ph: "+this.playerHeight);    
        this.pause = true;
        this.player.x= (this.widthLevel/2) - (this.playerWhidth/2);
        this.player.y= this.heightLevel - (this.playerHeight + this.heightLevel*0.01);
        this.ball.position.x = this.player.position.x+this.playerWhidth/2;
        this.ball.position.y = this.player.position.y-(this.ball.radio);
        let sign = 1;
        if (Math.random()> 0.5){
            sign = -1;
        }
        this.ball.direction = new Point(sign*4/5,3/5);
        this.ballLastPosition.x = this.ball.position.x;
        this.ballLastPosition.y = this.ball.position.y;
    }

    public getScore():number{
        return this.score;
    }

    public getLives():number{
        return this.lives;
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

    update(_deltaMS: number, _deltaFrame: number): number {      
        if(this.winCounter>0 && !this.pause){

            //Movimiento de Player
            if(this.leftPressed){
                if(this.player.position.x > 0)
                    if(this.player.position.x - (20) <=0)
                        this.player.position.x = 0;
                    else
                        this.player.position.x = this.player.position.x - (20);
            }
            if(this.rightPressed){
                if(this.player.position.x < (this.widthLevel - this.player.width))
                if(this.player.position.x + (20) >= this.widthLevel- this.player.width)
                    this.player.position.x = this.widthLevel - this.player.width;
                else    
                    this.player.position.x = this.player.position.x + (20);
            }  

            //Movimiento de Ball y comportamiento cuando colisiona con la Screen      
            let totalBricks = this.bricks.cols * this.bricks.rows;
            let difficult = this.ball.velocity * ((totalBricks - this.winCounter)/totalBricks);     
            if(this.ball.direction.x < 0){
                this.ball.position.x = this.ball.position.x + this.ball.direction.x *(this.ball.velocity + difficult);
                if((this.ball.position.x - this.ball.radio) <= 0){
                    this.ball.direction.x = -this.ball.direction.x;
                }
            }
            else{
                this.ball.position.x = this.ball.position.x + this.ball.direction.x*(this.ball.velocity + difficult);
                if((this.ball.position.x + this.ball.radio) >= this.widthLevel){
                    this.ball.direction.x = -this.ball.direction.x;
                }
            }

            if(this.ball.direction.y < 0 ){
                this.ball.position.y = this.ball.position.y + this.ball.direction.y*(this.ball.velocity + difficult);
                if((this.ball.position.y - this.ball.radio) <= 0){       
                    this.ball.direction.y = -this.ball.direction.y;
                }
            }
            else{
                this.ball.position.y = this.ball.position.y + this.ball.direction.y*(this.ball.velocity + difficult);
                if((this.ball.position.y + this.ball.radio) < this.heightLevel+(this.ball.radio*3)){
                    if((this.ball.position.y + this.ball.radio) > this.heightLevel){
                        this.ball.position.y = this.heightLevel-this.ball.radio;
                        if(this.lives <= 1){
                            this.lives--;
                            this.winCounter = -1;  
                        }
                        else{
                            this.lives--;
                            this.setGame();
                        }     
                    } 
                }
            }

            //Hitboxs
            let ballHitBox:Circle = new Circle(this.ball.x,this.ball.y,this.ball.radio);
            let playerHitBox:Rectangle = new Rectangle(this.player.x,this.player.y,this.player.width,this.player.height);

            // Ball vs Player
            if(Colider.circleVsRectangleCollision(ballHitBox,playerHitBox,0)){
                if(this.ball.direction.y > 0){
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
                    this.ball.direction.x = redirectionX/module;               
                    this.ball.direction.y = redirectionY/module;
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
            if(changeDirection) this.bounceBricks(ballHitBox,lastHitbox,this.ball.direction);
            this.ballLastPosition.x=this.ball.x;
            this.ballLastPosition.y=this.ball.y;

            
            }

        // winCounter > 0 : game in progress
        // winCounter <= 0 : game over
        // winCounter = 0 : win
        // winCounter < 0 : lose
        return this.winCounter;
    }
}