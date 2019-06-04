import Person from './person';
import store from '../store/store';
import Positionable from './positionable';

// Represents a person in the family tree
export default class TreeNode extends  Positionable {

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

    public readonly person: Person;
    public imagePath: string;
    public ancestors: TreeNode[];
    public descendants: TreeNode[];
    public partners: TreeNode[];
    public rendered: boolean;
    public selected: boolean;
    public wrappedName: string[];
    public photo: any;
    private readonly ctx: CanvasRenderingContext2D;


    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, person: Person) {
        super(TreeNode.width, TreeNode.height);
        this.ctx = ctx;

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
        this.wrappedName = this.wrapName(person.name);
        this.photo = null;
    }


    public Render() {

        window.console.log(`TreeNode: ${this.id} Render()`);
        window.console.log(`x:${this.x} y:${this.y}`);

        if (!this.x || !this.y) {
            return;
        }

        this.roundRect(this.x, this.y);

        this.ctx.fillStyle = '#000';
        this.ctx.font = `${TreeNode.fontSize}px Arial`;
        this.ctx.textBaseline = 'bottom';

        const left = this.x + TreeNode.leftTextMargin;
        const top = this.y + TreeNode.topTextMargin;
        for (let i = 0; i < this.wrappedName.length; i++ ) {
            this.ctx.fillText(this.wrappedName[i], left, top + (TreeNode.fontSize + 5) * i );
        }

        // Dev only
        this.ctx.fillText(`id:${this.id}`, left, top + (TreeNode.fontSize + 5) * (this.wrappedName.length + 1));
        this.ctx.fillText(`x:${this.x}`, left, top + (TreeNode.fontSize + 5) * (this.wrappedName.length + 2));

        if (this.photo) {
            this.ctx.drawImage(this.photo, this.x + TreeNode.leftMargin, this.y + TreeNode.topImageMargin);
        } else {
            this.photo = new Image();
            this.photo.src = this.imagePath;

            // Have to wait for photo to load before drawing it
            this.photo.onload = () => {
                if (this.x && this.y) {
                    this.ctx.drawImage(this.photo, this.x + TreeNode.leftMargin, this.y + TreeNode.topImageMargin);
                }
            };
        }

        this.rendered = true;
        this.ctx.save();
    }

    public clearRenderValues() {

        if (!this.selected) {
            this.ClearPosition();
        }

        this.rendered = false;

    }

    private wrapName(name: string): string[] {

        const wrappedName = new Array<string>();

        const maxWidth = TreeNode.width - (2 * TreeNode.leftTextMargin + 5);
        const words = name.split(' ');
        let currentLine = words[0];

        this.ctx.font = `${TreeNode.fontSize}px Arial`;

        for (const word of words) {
            const width = this.ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                wrappedName.push(currentLine);
                currentLine = word;
            }
        }
        wrappedName.push(currentLine);

        return wrappedName;
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
}
