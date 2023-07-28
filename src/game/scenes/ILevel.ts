export interface ILevel{

    update(deltaMS:number,deltaTime:number):number;
    resetGame():void;
    getScore():number;
    removeListeners():void;
}