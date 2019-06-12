import TreeNode from './treeNode';
import Point from './point';
import Positionable from './positionable';

// Represents a group of people who are partners in the family tree

export default class TreePartnerNode extends Positionable {

    public static MIN_SPACING = 30;

    public id: string;
    public mainNode: TreeNode;
    public partners: TreeNode[];
    public relationXStartPoints: { [id: string]: number; };
    private spacing: number;

    constructor(mainNode: TreeNode) {

        window.console.log(`TreePartnerNode.constructor()`);

        const width = (mainNode.partners.length + 1) * TreeNode.WIDTH
                        + (mainNode.partners.length) * TreePartnerNode.MIN_SPACING;
        super(width, TreeNode.HEIGHT);

        this.id = mainNode.id;
        this.mainNode = mainNode;
        this.partners = mainNode.partners;
        window.console.log(`mainNode.partners`);
        window.console.log(mainNode.partners);

        this.spacing = TreeNode.MIN_SPACING;
        this.relationXStartPoints = {};

        mainNode.addToTree = true;
        for (const partner of this.partners) {
            partner.addToTree = true;
        }
    }

    public setPosition(x: number, y: number, spacing: number) {
        this.spacing = spacing;
        const width = (this.mainNode.partners.length + 1) * TreeNode.WIDTH
                            + (this.mainNode.partners.length) * spacing;
        this.width = width;

        this.mainNode.setXYPosition(x, y);

        let left = (this.mainNode.xRight || 0) + spacing;

        this.relationXStartPoints[`${this.mainNode.id}`] = this.mainNode.xMid || 0;

        for (const partner of this.partners) {
            partner.setXYPosition(left, y);
            left = (partner.xRight || 0) + spacing;

            this.relationXStartPoints[`${this.mainNode.id}-${partner.id}`] = left -  spacing / 2;
        }

        this.setXYPosition(x, y);
    }

    public render() {
        this.mainNode.render();

        for (const partner of this.partners) {
            partner.render();
        }
    }

    public clearRenderValues() {
        this.mainNode.clearRenderValues();
        for (const partner of this.partners) {
            partner.clearRenderValues();
        }
    }
}
