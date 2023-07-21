import { Circle, Point, Rectangle } from "pixi.js";

export class Colider {
    static circleVsRectangleCollision(circle:Circle,rectangle:Rectangle,tolerancy:number):boolean{
        
        let nearPoint: Point = new Point(circle.x,circle.y);
        let collision:boolean=false;

        if(circle.x < rectangle.x+tolerancy) nearPoint.x=rectangle.x;
        if(circle.x > (rectangle.x+rectangle.width-tolerancy)) nearPoint.x=rectangle.x+rectangle.width;

        if(circle.y < rectangle.y+tolerancy) nearPoint.y=rectangle.y;
        if(circle.y > (rectangle.y+rectangle.height-tolerancy)) nearPoint.y=rectangle.y+rectangle.height;

        let distancePow2 = Math.pow(circle.x-nearPoint.x,2)+Math.pow(circle.y-nearPoint.y,2);

        if(distancePow2 < Math.pow(circle.radius,2)) collision =true;

        return collision;
    };
}