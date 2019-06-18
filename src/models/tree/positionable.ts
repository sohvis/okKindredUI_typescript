export default abstract class Positionable {

    public x: number;
    public xMid: number;
    public xRight: number;
    public width: number;

    public y: number;
    public yMid: number;
    public yBottom: number;
    public height: number;

    public hasXValue: boolean;
    public hasYValue: boolean;

    constructor(width: number, height: number) {
        this.x = 0;
        this.xMid = 0;
        this.xRight = 0;
        this.y = 0;
        this.yMid = 0;
        this.yBottom = 0;
        this.width = width;
        this.height = height;
        this.hasXValue = false;
        this.hasYValue = false;
    }

    public clearPosition() {
        this.x = 0;
        this.xMid = 0;
        this.xRight = 0;
        this.y = 0;
        this.yMid = 0;
        this.yBottom = 0;
        this.hasXValue = false;
        this.hasYValue = false;
    }

    public setXYPosition(x: number, y: number) {
        this.setXPosition(x);
        this.setYPosition(y);
    }

    public setXPosition(x: number) {
        this.x = x;
        this.xMid = x + this.width / 2;
        this.xRight = x + this.width;
        this.hasXValue = true;
    }

    public setYPosition(y: number) {
        this.y = y;
        this.yMid = y + this.height / 2;
        this.yBottom = y + this.height;
        this.hasYValue = true;
    }

    public setCentreXPosition(xCentre: number) {
        this.xMid = xCentre;
        this.x = xCentre - this.width / 2;
        this.xRight = xCentre + this.width / 2;
        this.hasXValue = true;
    }

    public showBordersForDebugging(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = this.rainbow(ctx.canvas.width, this.x );
        ctx.lineWidth = 1;

        ctx.moveTo(this.x , this.y );
        ctx.lineTo(this.xRight , this.y );
        ctx.lineTo(this.xRight , this.yBottom );
        ctx.lineTo(this.x , this.yBottom );
        ctx.lineTo(this.x , this.y );

        ctx.stroke();
    }

    public isOverlapped(otherPositionable: Positionable, border: number): boolean {

        // Overlapped right
        if (this.x < otherPositionable.x) {
            if (this.xRight > otherPositionable.x + border) {
                return true;
            }
        } else {
            // Overlapped on the left
            if (this.x < otherPositionable.xRight + border) {
                return true;
            }
        }

        return false;
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
