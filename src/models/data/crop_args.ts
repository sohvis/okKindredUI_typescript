export default class CropArgs {

    public personId: string;
    public naturalWidth: number;
    public naturalHeight: number;
    public displayWidth: number;
    public displayHeight: number;
    public clockwiseRotation: number;

    public file: File;

    public cropDisplayX: number;
    public cropDisplayY: number;
    public cropDisplayWidth: number;
    public cropDisplayHeight: number;

    public get cropX(): number {
        return Math.round(this.cropDisplayX * (this.naturalWidth / this.displayWidth));
    }

    public get cropY(): number {
        return Math.round(this.cropDisplayY * (this.naturalHeight / this.displayHeight));
    }

    public get cropWidth(): number {
        return Math.round(this.cropDisplayWidth * (this.naturalWidth / this.displayWidth));
    }

    public get cropHeight(): number {
        return Math.round(this.cropDisplayHeight * (this.naturalHeight / this.displayHeight));
    }

    public get antiClockwiseRotation(): number {
        return 360 - this.clockwiseRotation;
    }

    constructor(
        personId: string,
        img: HTMLImageElement,
        file: File,
        jcropPos: any,
        clockwiseRotation: number) {

            this.personId = personId;
            this.naturalHeight = img.naturalHeight;
            this.naturalWidth = img.naturalWidth;
            this.displayHeight = img.height;
            this.displayWidth = img.width;

            this.file = file;
            this.cropDisplayX = jcropPos.x;
            this.cropDisplayY = jcropPos.y;
            this.cropDisplayWidth = jcropPos.w;
            this.cropDisplayHeight = jcropPos.h;
            this.clockwiseRotation = clockwiseRotation;

    }
}
