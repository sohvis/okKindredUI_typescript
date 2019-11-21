import TreeNode from './treeNode';
import Point from './point';

/*
 Builds arrows to show more family members
*/
export default class MoreArrowBuilder {

    public static STROKE_STYLE = '#2e6f9a';
    public static DISABLED_STROKE_STYLE = '#444';
    public static MORE_ARROW_SPACING = 5;
    public static MORE_ARROW_HEIGHT = 12;
    public static MORE_ARROW_WIDTH = 8;

    public static createMoreArrows(node: TreeNode, ctx: CanvasRenderingContext2D) {
        // Any relations not showing draw arrow
        if (node.descendants.some((x) => !x.addToTree)) {
            MoreArrowBuilder.drawDownArrow(node, ctx);
        }

        if (node.partners.some((x) => !x.addToTree)) {
            MoreArrowBuilder.drawRightArrow(node, ctx);
        }

        if (node.ancestors.some((x) => !x.addToTree)) {
            MoreArrowBuilder.drawUpArrow(node, ctx);
        }
    }

    private static drawRightArrow(node: TreeNode, ctx: CanvasRenderingContext2D) {

        const point1 = new Point(
            node.xRight + MoreArrowBuilder.MORE_ARROW_SPACING,
            node.yMid - MoreArrowBuilder.MORE_ARROW_WIDTH,
        );

        const point2 = new Point(
            point1.x + MoreArrowBuilder.MORE_ARROW_HEIGHT,
            point1.y + MoreArrowBuilder.MORE_ARROW_WIDTH,
        );

        const point3 = new Point(
            point1.x,
            point2.y + MoreArrowBuilder.MORE_ARROW_WIDTH,
        );

        MoreArrowBuilder.drawArrow(node, point1, point2, point3, ctx);
    }

    private static drawUpArrow(node: TreeNode, ctx: CanvasRenderingContext2D) {

        const point1 = new Point(
            node.xMid + MoreArrowBuilder.MORE_ARROW_SPACING,
            node.y - MoreArrowBuilder.MORE_ARROW_SPACING,
        );

        const point2 = new Point(
            point1.x + MoreArrowBuilder.MORE_ARROW_WIDTH,
            point1.y - MoreArrowBuilder.MORE_ARROW_HEIGHT,
        );

        const point3 = new Point(
            point2.x + MoreArrowBuilder.MORE_ARROW_WIDTH,
            point1.y,
        );

        MoreArrowBuilder.drawArrow(node, point1, point2, point3, ctx);
    }

    private static drawDownArrow(node: TreeNode, ctx: CanvasRenderingContext2D) {

        const point1 = new Point(
            node.xMid + MoreArrowBuilder.MORE_ARROW_SPACING,
            node.yBottom + MoreArrowBuilder.MORE_ARROW_SPACING,
        );

        const point2 = new Point(
            point1.x + MoreArrowBuilder.MORE_ARROW_WIDTH,
            point1.y + MoreArrowBuilder.MORE_ARROW_HEIGHT,
        );

        const point3 = new Point(
            point2.x + MoreArrowBuilder.MORE_ARROW_WIDTH,
            point1.y,
        );

        MoreArrowBuilder.drawArrow(node, point1, point2, point3, ctx);
    }

    private static drawArrow(node: TreeNode,
                             point1: Point, point2: Point, point3: Point,
                             ctx: CanvasRenderingContext2D) {
        let fillstyle = MoreArrowBuilder.STROKE_STYLE;
        let strokeStyle = MoreArrowBuilder.STROKE_STYLE;

        if (node.isDisabled) {
            fillstyle = MoreArrowBuilder.DISABLED_STROKE_STYLE;
            strokeStyle = MoreArrowBuilder.DISABLED_STROKE_STYLE;
        }

        ctx.beginPath();
        ctx.strokeStyle = fillstyle;
        ctx.lineWidth = 1;
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.lineTo(point3.x, point3.y);
        ctx.lineTo(point1.x, point1.y);
        ctx.stroke();
        ctx.fillStyle = strokeStyle;
        ctx.fill();
    }
}
