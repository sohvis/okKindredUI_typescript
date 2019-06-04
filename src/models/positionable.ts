export default abstract class Positionable {

    public x: number | null;
    public xMid: number | null;
    public xRight: number | null;
    public width: number;

    public y: number | null;
    public yMid: number | null;
    public yBottom: number | null;
    public height: number;

    constructor(width: number, height: number) {
        this.x = null;
        this.xMid = null;
        this.xRight = null;
        this.y = null;
        this.yMid = null;
        this.yBottom = null;
        this.width = width;
        this.height = height;
    }

    public ClearPosition() {
        this.x = null;
        this.xMid = null;
        this.xRight = null;
        this.y = null;
        this.yMid = null;
        this.yBottom = null;
    }

    public SetXYPosition(x: number, y: number) {
        this.SetXPosition(x);
        this.SetYPosition(y);
    }

    public SetXPosition(x: number) {
        this.x = x;
        this.xMid = x + this.width / 2;
        this.xRight = x + this.width;
    }

    public SetYPosition(y: number) {
        this.y = y;
        this.yMid = y + this.height / 2;
        this.yBottom = this.height;
    }

    public SetCentreXPosition(xCentre: number) {
        this.xMid = xCentre;
        this.x = xCentre - this.width / 2;
        this.xRight = xCentre + this.width / 2;
    }

}
