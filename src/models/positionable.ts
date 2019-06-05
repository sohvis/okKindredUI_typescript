export default abstract class Positionable {

    public x: number | null;
    public xMid: number | null;
    public xRight: number | null;
    public WIDTH: number;

    public y: number | null;
    public yMid: number | null;
    public yBottom: number | null;
    public HEIGHT: number;

    constructor(width: number, height: number) {
        this.x = null;
        this.xMid = null;
        this.xRight = null;
        this.y = null;
        this.yMid = null;
        this.yBottom = null;
        this.WIDTH = width;
        this.HEIGHT = height;
    }

    public clearPosition() {
        this.x = null;
        this.xMid = null;
        this.xRight = null;
        this.y = null;
        this.yMid = null;
        this.yBottom = null;
    }

    public setXYPosition(x: number, y: number) {
        this.setXPosition(x);
        this.setYPosition(y);
    }

    public setXPosition(x: number) {
        this.x = x;
        this.xMid = x + this.WIDTH / 2;
        this.xRight = x + this.WIDTH;
    }

    public setYPosition(y: number) {
        this.y = y;
        this.yMid = y + this.HEIGHT / 2;
        this.yBottom = this.HEIGHT;
    }

    public setCentreXPosition(xCentre: number) {
        this.xMid = xCentre;
        this.x = xCentre - this.WIDTH / 2;
        this.xRight = xCentre + this.WIDTH / 2;
    }

}
