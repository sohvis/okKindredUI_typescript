import Person from './person';
import store from '../store/store';
import Positionable from './positionable';

// Represents a person in the family tree
export default class TreeNode extends  Positionable {

    // Person rectangle defaults
    public static WIDTH = 130;
    public static HEIGHT = 140;
    public static RECT_STROKE_STYLE = '#2e6f9a';
    public static RECT_LINE_WIDTH = 2;
    public static RECT_ROUNDED_CORNER_RADIUS = 15;
    public static LEFT_MARGIN = 25;
    public static SELECTED_RECT_FILL_STYLE = 'rgb(150, 222, 152)';
    public static RECT_FILL_STYLE = '#FFFAFA';
    public static MIN_SPACING = 60;

    // Image Defaults
    public static TOP_IMAGE_MARGIN = 10;

    // Text Defaults
    public static TOP_TEXT_MARGIN = 115;
    public static LEFT_TEXT_MARGIN = 10;
    public static FONT_SIZE = 12;

    public readonly id: string;

    public readonly person: Person;
    public imagePath: string;
    public ancestors: TreeNode[];
    public descendants: TreeNode[];
    public partners: TreeNode[];
    public addToTree: boolean;
    public selected: boolean;
    public wrappedName: string[];
    public photo: any;
    private readonly ctx: CanvasRenderingContext2D;


    constructor(ctx: CanvasRenderingContext2D, person: Person) {
        super(TreeNode.WIDTH, TreeNode.HEIGHT);
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

        this.addToTree = false;
        this.selected  = person.id === store.state.person_id;
        this.wrappedName = this.wrapName(person.name);
        this.photo = null;
    }


    public render() {

        //window.console.log(`TreeNode: ${this.id} Render()`);
        //window.console.log(`x:${this.x} y:${this.y}`);

        if (!this.x || !this.y) {
            return;
        }

        this.roundRect(this.x, this.y);

        this.ctx.fillStyle = '#000';
        this.ctx.font = `${TreeNode.FONT_SIZE}px Arial`;
        this.ctx.textBaseline = 'bottom';

        const left = this.x + TreeNode.LEFT_TEXT_MARGIN;
        const top = this.y + TreeNode.TOP_TEXT_MARGIN;
        for (let i = 0; i < this.wrappedName.length; i++ ) {
            this.ctx.fillText(this.wrappedName[i], left, top + (TreeNode.FONT_SIZE + 5) * i );
        }

        // Dev only
        this.ctx.fillText(`id:${this.id}`, left, top + (TreeNode.FONT_SIZE + 5) * (this.wrappedName.length + 1));
        this.ctx.fillText(`x:${this.x}`, left, top + (TreeNode.FONT_SIZE + 5) * (this.wrappedName.length + 2));

        if (this.photo) {
            this.ctx.drawImage(this.photo, this.x + TreeNode.LEFT_MARGIN, this.y + TreeNode.TOP_IMAGE_MARGIN);
        } else {
            this.photo = new Image();
            this.photo.src = this.imagePath;

            // Have to wait for photo to load before drawing it
            this.photo.onload = () => {
                if (this.x && this.y) {
                    this.ctx.drawImage(this.photo, this.x + TreeNode.LEFT_MARGIN, this.y + TreeNode.TOP_IMAGE_MARGIN);
                }
            };
        }

        this.ctx.save();
    }

    public clearRenderValues() {

        if (!this.selected) {
            this.clearPosition();
        }

        this.addToTree = false;
    }

    private wrapName(name: string): string[] {

        const wrappedName = new Array<string>();

        const maxWidth = TreeNode.WIDTH - (2 * TreeNode.LEFT_TEXT_MARGIN + 5);
        const words = name.split(' ');
        let currentLine = words[0];

        this.ctx.font = `${TreeNode.FONT_SIZE}px Arial`;

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
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

        let fillstyle = TreeNode.RECT_FILL_STYLE;

        if (this.selected) {
            fillstyle = TreeNode.SELECTED_RECT_FILL_STYLE;
        }

        const radius = TreeNode.RECT_ROUNDED_CORNER_RADIUS;
        const r = x + TreeNode.WIDTH;
        const b = y + TreeNode.HEIGHT;
        this.ctx.beginPath();
        this.ctx.strokeStyle = TreeNode.RECT_STROKE_STYLE;
        this.ctx.lineWidth = TreeNode.RECT_LINE_WIDTH;
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(r - radius, y);
        this.ctx.quadraticCurveTo(r, y, r, y + radius);
        this.ctx.lineTo(r, y + TreeNode.HEIGHT - radius);
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
