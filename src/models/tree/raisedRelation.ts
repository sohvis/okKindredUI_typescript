import TreeNode from './TreeNode';
import TreeRelation from './treeRelation';
import Point from './point';
import PartneredRelation from './partneredRelation';

export default class RaisedRelation implements TreeRelation {

    public static INFLECTION_HEIGHT = 40;

    public id: string;
    public ctx: CanvasRenderingContext2D;
    public fromNodes: TreeNode[];
    public toNode: TreeNode;

    constructor(ctx: CanvasRenderingContext2D, fromNodes: TreeNode[], toNode: TreeNode) {
        this.ctx = ctx;
        const fromIds = fromNodes.map((item) => item.id);
        const fromIdsFormatted = fromIds.sort().join('|');
        this.id = `${fromIdsFormatted}-${toNode.id}`;
        this.fromNodes = fromNodes;
        this.toNode = toNode;
    }

    public render() {
        // window.console.log(`RaisedRelation.render()`);

        // Sort nodes that have a position in horizontal order
        const fromNodes = this.fromNodes
            .filter((n) => n.hasXValue && n.hasYValue)
            .sort((a, b) => a.x - b.x);

        // TODO split into groups

        if (fromNodes.length > 1) {
            this.renderMultipleAncestors(fromNodes);
        } else {
            this.renderSingleAncestor(fromNodes[0]);
        }
    }

    private renderSingleAncestor(fromNode: TreeNode) {

        const point1 = new Point(
            fromNode.xMid,
            fromNode.yBottom,
        );

        const point2 = new Point(
            point1.x,
            point1.y + RaisedRelation.INFLECTION_HEIGHT,
        );

        const point3 = new Point(
            this.toNode.xMid,
            point2.y,
        );

        const point4 = new Point(
            point3.x,
            this.toNode.y,
        );

        this.ctx.beginPath();
        this.ctx.strokeStyle = PartneredRelation.STROKE_STYLE;
        this.ctx.lineWidth = PartneredRelation.LINE_WIDTH;

        this.ctx.moveTo(point1.x, point1.y);
        this.ctx.lineTo(point2.x, point2.y);
        this.ctx.lineTo(point3.x, point3.y);
        this.ctx.lineTo(point4.x, point4.y);
        this.ctx.stroke();
    }

    private renderMultipleAncestors(fromNodes: TreeNode[]) {

        const point1 = new Point(
            fromNodes[fromNodes.length - 1].leftMarginStart,
            fromNodes[fromNodes.length - 1].yBottom + PartneredRelation.HEIGHT,
        );

        const point2 = new Point(
            point1.x,
            point1.y + RaisedRelation.INFLECTION_HEIGHT,
        );

        const point3 = new Point(
            this.toNode.xMid,
            point2.y,
        );

        const point4 = new Point(
            point3.x,
            this.toNode.y,
        );


        this.ctx.beginPath();
        this.ctx.strokeStyle = PartneredRelation.STROKE_STYLE;
        this.ctx.lineWidth = PartneredRelation.LINE_WIDTH;

        this.ctx.moveTo(point1.x, point1.y);
        this.ctx.lineTo(point2.x, point2.y);
        this.ctx.lineTo(point3.x, point3.y);
        this.ctx.lineTo(point4.x, point4.y);
        this.ctx.stroke();
    }
}
