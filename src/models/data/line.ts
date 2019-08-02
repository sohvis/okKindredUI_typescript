import Point from '../tree/point';

export default class Line {

    public start: Point
    public end: Point
    public strokeStyle: string;
    public lineWidth: number;

    constructor(start: Point, end: Point, strokeStyle: string, lineWidth: number) {
        window.console.log(`Line constructor()`);
        this.start = start;
        this.end = end;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        window.console.log(`Line.draw()`);
        window.console.log(this);
        ctx.beginPath();

        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;

        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
    }
}