export default abstract class Positionable {

    public x: number;
    public xMid: number;
    public xRight: number;
    public width: number;
    public widthAndSpacing: number;
    public leftMarginStart: number;
    public rightMarginEnd: number;

    public y: number;
    public yMid: number;
    public yBottom: number;
    public height: number;

    public hasXValue: boolean;
    public hasYValue: boolean;
    public spacing: number;
    protected disabled: boolean;

    constructor(width: number, height: number, spacing: number) {
        this.x = 0;
        this.xMid = 0;
        this.xRight = 0;
        this.leftMarginStart = 0;
        this.rightMarginEnd = 0;
        this.y = 0;
        this.yMid = 0;
        this.yBottom = 0;
        this.width = width;
        this.height = height;
        this.hasXValue = false;
        this.hasYValue = false;
        this.spacing = spacing;
        this.widthAndSpacing = width + spacing * 2;
        this.disabled = false;
    }

    public abstract setDisabled(disabled: boolean): void;

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
        this.updateMargins();
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
        this.updateMargins();
        this.hasXValue = true;
    }

    public updateSpacing(spacing: number) {
        this.spacing = spacing;
        this.widthAndSpacing = this.width + spacing * 2;
        this.updateMargins();
    }

    public showBordersForDebugging(ctx: CanvasRenderingContext2D) {

        ctx.beginPath();
        ctx.strokeStyle = this.rainbow(ctx.canvas.width, this.x );
        ctx.lineWidth = 1;
        ctx.fillStyle = ctx.strokeStyle;

        ctx.moveTo(this.leftMarginStart , this.y );
        ctx.lineTo(this.x , this.y );
        ctx.lineTo(this.x , this.yBottom );
        ctx.lineTo(this.leftMarginStart , this.yBottom );
        ctx.lineTo(this.leftMarginStart , this.y );
        ctx.fill();

        ctx.moveTo(this.xRight , this.y );
        ctx.lineTo(this.rightMarginEnd , this.y );
        ctx.lineTo(this.rightMarginEnd , this.yBottom );
        ctx.lineTo(this.xRight , this.yBottom );
        ctx.lineTo(this.xRight , this.y );
        ctx.fill();

        ctx.stroke();
    }

    public isOverlapped(otherPositionable: Positionable): boolean {

        // Overlapped right
        if (this.x < otherPositionable.x) {
            if (this.rightMarginEnd > otherPositionable.leftMarginStart) {
                return true;
            }
        } else {
            // Overlapped on the left
            if (this.leftMarginStart < otherPositionable.rightMarginEnd) {
                return true;
            }
        }

        return false;
    }

    protected rainbow(numOfSteps: number, step: number) {
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
        const c = `rgba(${r * 255},${g * 255},${b * 255}, 0.4`;

        return (c);
    }

    private updateMargins() {
        this.leftMarginStart = this.x - this.spacing;
        this.rightMarginEnd = this.xRight + this.spacing;
    }

}
