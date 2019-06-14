import TreeNode from './TreeNode';
import TreeRelation from './treeRelation';
import Point from './point';

export default class PartneredRelation implements TreeRelation {

    public static STROKE_STYLE = '#2e6f9a';
    public static LINE_WIDTH = 2;

    public id: string;
    public ctx: CanvasRenderingContext2D;
    public node1: TreeNode;
    public node2: TreeNode;

    constructor(ctx: CanvasRenderingContext2D, node1: TreeNode, node2: TreeNode) {
        this.ctx = ctx;

        if (node1.id < node2.id) {
            this.id = `${node1.id}-${node2.id}`;
        } else {
            this.id = `${node2.id}-${node1.id}`;
        }

        this.node1 = node1;
        this.node2 = node2;
    }

    public render() {

        // window.console.log(`PartneredRelation.Render() id:${this.id}`);
        let start;
        let end;

        if (this.node1.x && this.node2.x && this.node1.y && this.node2.y) {
            if (this.node1.x < this.node2.x) {
                start = new Point(
                    this.node1.x + this.node1.width,
                    this.node1.y + this.node1.height / 2,
                );

                end = new Point(
                    this.node2.x,
                    this.node2.y + this.node2.height / 2,
                );
            } else {
                start = new Point(
                    this.node2.x + this.node2.width,
                    this.node2.y + this.node2.height / 2,
                );

                end = new Point(
                    this.node1.x,
                    this.node1.y + this.node1.height / 2,
                );
            }

            this.ctx.beginPath();
            this.ctx.strokeStyle = PartneredRelation.STROKE_STYLE;
            this.ctx.lineWidth = PartneredRelation.LINE_WIDTH;

            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();
        }
    }
}

