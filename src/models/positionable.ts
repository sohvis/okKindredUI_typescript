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
        this.xMid = x + this.width / 2;
        this.xRight = x + this.width;
    }

    public setYPosition(y: number) {
        this.y = y;
        this.yMid = y + this.height / 2;
        this.yBottom = y + this.height;
    }

    public setCentreXPosition(xCentre: number) {
        this.xMid = xCentre;
        this.x = xCentre - this.width / 2;
        this.xRight = xCentre + this.width / 2;
    }

    public showBordersForDebugging(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = this.rainbow(ctx.canvas.width, this.x || 0);
        ctx.lineWidth = 1;

        ctx.moveTo(this.x || 0, this.y || 0);
        ctx.lineTo(this.xRight || 0, this.y || 0);
        ctx.lineTo(this.xRight || 0, this.yBottom || 0);
        ctx.lineTo(this.x || 0, this.yBottom || 0);
        ctx.lineTo(this.x || 0, this.y || 0);

        ctx.stroke();
    }

    private rainbow(numOfSteps: number, step: number) {
        // This function generates vibrant, "evenly spaced" colours (i.e. no clustering).
        let r;
        let g;
        let b;
        const h = step / numOfSteps;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const q = 1 - f;
        switch (i % 6) {
            case 0: r = 1; g = f; b = 0; break;
            case 1: r = q; g = 1; b = 0; break;
            case 2: r = 0; g = 1; b = f; break;
            case 3: r = 0; g = q; b = 1; break;
            case 4: r = f; g = 0; b = 1; break;
            default: r = 1; g = 0; b = q; break;
        }
        const c = '#' + ('00' + (Math.floor(r * 255)).toString(16)).slice(-2)
                + ('00' + (Math.floor(g * 255)).toString(16)).slice(-2)
                + ('00' + (Math.floor(b * 255)).toString(16)).slice(-2);
        return (c);
    }

}
