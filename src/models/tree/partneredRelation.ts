import TreeNode from './treeNode';
import TreeRelation from './treeRelation';
import Point from './point';

export default class PartneredRelation implements TreeRelation {

    public static STROKE_STYLE = '#2e6f9a';
    public static DISABLED_STROKE_STYLE = '#333';
    public static LINE_WIDTH = 2;

    public static HEIGHT = 20;

    public id: string;
    public disabled: boolean;
    public ctx: CanvasRenderingContext2D;
    public node1: TreeNode;
    public node2: TreeNode;

    constructor(ctx: CanvasRenderingContext2D, node1: TreeNode, node2: TreeNode) {
        this.ctx = ctx;
        this.disabled = false;

        if (node1.id < node2.id) {
            this.id = `${node1.id}-${node2.id}`;
        } else {
            this.id = `${node2.id}-${node1.id}`;
        }

        this.node1 = node1;
        this.node2 = node2;
    }

    public render() {

        // // window.console.log(`PartneredRelation.Render() id:${this.id}`);

        // Sort nodes into order left to right
        const nodes = [this.node1, this.node2];
        nodes.sort((a, b) => (a.x) - (b.x));

        // bottom of node 1
        const point1 = new Point(
            nodes[0].xMid,
            nodes[1].yBottom,
        );

        const point2 = new Point(
            point1.x,
            point1.y + PartneredRelation.HEIGHT,
        );

        const point3 = new Point(
            nodes[1].xMid,
            point2.y,
        );

        const point4 = new Point(
            point3.x,
            nodes[1].yBottom,
        );

        this.ctx.beginPath();

        let strokeStyle = PartneredRelation.STROKE_STYLE;
        if (this.disabled) {
            strokeStyle = PartneredRelation.DISABLED_STROKE_STYLE;
        }

        this.ctx.strokeStyle = strokeStyle;
        this.ctx.lineWidth = PartneredRelation.LINE_WIDTH;

        this.ctx.moveTo(point1.x, point1.y);
        this.ctx.lineTo(point2.x, point2.y);
        this.ctx.lineTo(point3.x, point3.y);
        this.ctx.lineTo(point4.x, point4.y);
        this.ctx.stroke();

    }
}

