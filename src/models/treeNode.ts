import Person from './person';
import store from '../store/store';

// Represents a person in the family tree
export default class TreeNode {

    // Person rectangle defaults
    public static width = 130;
    public static height = 140;
    public static rectStrokeStyle = '#2e6f9a';
    public static rectLineWidth = 2;
    public static rectRoundedCornerRadius = 15;
    public static leftMargin = 25;
    public static selectedRectFillstyle = 'rgb(150, 222, 152)';
    public static rectFillstyle = '#FFFAFA';
    public static minSpacing = 60;

    // Image Defaults
    public static topImageMargin = 10;

    // Text Defaults
    public static topTextMargin = 115;
    public static leftTextMargin = 10;
    public static fontSize = 12;

    public readonly id: number;
    private readonly ctx: CanvasRenderingContext2D;

    public readonly person: Person;
    public imagePath: string;
    public ancestors: TreeNode[];
    public descendants: TreeNode[];
    public partners: TreeNode[];
    public rendered: boolean;
    public selected: boolean;
    public wrappedName: string[];
    public photo: any;

    // Positioning
    private _x: number | null;
    private _y: number | null;
    private _midpoint: number | null;

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get midPoint() {
        return this._midpoint;
    }

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, person: Person) {
        this.ctx = ctx;
        this._x = null;
        this._y = null;
        this._midpoint = null;

        this.person = person;
        this.id = person.id;

        this.imagePath = person.small_thumbnail;
        if (!person.small_thumbnail) {
            this.imagePath = 'img/portrait_80.png';
        }

        this.ancestors = new Array<TreeNode>();
        this.descendants = new Array<TreeNode>();
        this.partners = new Array<TreeNode>();

        this.rendered = false;
        this.selected  = person.id === store.state.person_id;
        this.wrappedName = new Array<string>();
        this.photo = null;
    }

    public wrapName(name: string) {

        const maxWidth = TreeNode.width - (2 * TreeNode.leftTextMargin + 5);
        const words = name.split(' ');
        let currentLine = words[0];

        this.ctx.font = `${TreeNode.fontSize}px Arial`;

        for (const word of words) {
            const width = this.ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                this.wrappedName.push(currentLine);
                currentLine = word;
            }
        }
        this.wrappedName.push(currentLine);
    }

    public SetPosition(x: number, y:number) {
        this._x = x;
        this._y = y;

        this._midpoint = this._x + TreeNode.width / 2;
    }

    public Render() {

        window.console.log(`TreeNode: ${this.id} Render()`);
        window.console.log(`x:${this._x} y:${this._y}`);

        if (!this._x || !this._y) {
            return;
        }

        this.roundRect(this._x, this._y);

        this.ctx.fillStyle = '#000';
        this.ctx.font = `${TreeNode.fontSize}px Arial`;
        this.ctx.textBaseline = 'bottom';

        const left = this._x + TreeNode.leftTextMargin;
        const top = this._y + TreeNode.topTextMargin;
        for (let i = 0; i < this.wrappedName.length; i++ ) {
            this.ctx.fillText(this.wrappedName[i], left, top + (TreeNode.fontSize + 5) * i );
        }

        // Dev only
        this.ctx.fillText(`id:${this.id}`, left, top + (TreeNode.fontSize + 5) * (this.wrappedName.length + 1));
        this.ctx.fillText(`x:${this.x}`, left, top + (TreeNode.fontSize + 5) * (this.wrappedName.length + 2));

        if (this.photo) {
            this.ctx.drawImage(this.photo, this._x + TreeNode.leftMargin, this._y + TreeNode.topImageMargin);
        } else {
            this.photo = new Image();
            this.photo.src = this.imagePath;

            // Have to wait for photo to load before drawing it
            this.photo.onload = () => {
                if (this._x && this._y) {
                    this.ctx.drawImage(this.photo, this._x + TreeNode.leftMargin, this._y + TreeNode.topImageMargin);
                }
            };
        }

        this.rendered = true;
        this.ctx.save();
    }

    private roundRect(x: number, y: number) {

        let fillstyle = TreeNode.rectFillstyle;

        if (this.selected) {
            fillstyle = TreeNode.selectedRectFillstyle;
        }

        const radius = TreeNode.rectRoundedCornerRadius;
        const r = x + TreeNode.width;
        const b = y + TreeNode.height;
        this.ctx.beginPath();
        this.ctx.strokeStyle = TreeNode.rectStrokeStyle;
        this.ctx.lineWidth = TreeNode.rectLineWidth;
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(r - radius, y);
        this.ctx.quadraticCurveTo(r, y, r, y + radius);
        this.ctx.lineTo(r, y + TreeNode.height - radius);
        this.ctx.quadraticCurveTo(r, b, r - radius, b);
        this.ctx.lineTo(x + radius, b);
        this.ctx.quadraticCurveTo(x, b, x, b - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.stroke();
        this.ctx.fillStyle = fillstyle;
        this.ctx.fill();
    }

    public clearRenderValues() {

        if (!this.selected) {
            this.x = null;
            this.y = null;
        }

        this.rendered = false;

    }
}
