import TreeNode from './treeNode';
import Point from './point';
import Positionable from './positionable';

// Represents a group of people who are partners in the family tree

export default class TreePartnerNode extends Positionable {

    public static minSpacing = 30;

    public id: number;
    public mainNode: TreeNode;
    public partners: TreeNode[];
    public relationXStartPoints: { [id: string]: number; };
    private spacing: number;

    constructor(mainNode: TreeNode) {
        const width = (mainNode.partners.length + 1) * TreeNode.width
                        + (mainNode.partners.length) * TreePartnerNode.minSpacing;
        super(width, TreeNode.height);

        this.id = mainNode.id;
        this.mainNode = mainNode;
        this.partners = mainNode.partners;
        this.spacing = TreeNode.minSpacing;
        this.relationXStartPoints = {};
    }

    public SetPosition(x: number, y: number, spacing: number) {
        this.spacing = spacing;
        const width = (this.mainNode.partners.length + 1) * TreeNode.width
                            + (this.mainNode.partners.length) * spacing;
        this.width = width;

        this.mainNode.SetXYPosition(x, y);

        let left = this.mainNode.xRight || 0 + spacing;

        this.relationXStartPoints[`${this.mainNode.id}`] = this.mainNode.xMid || 0;

        for (const partner of this.partners) {
            partner.SetXYPosition(left, y);
            left = partner.xRight || 0 + spacing;

            this.relationXStartPoints[`${this.mainNode.id}-${partner.id}`] = left -  spacing / 2;
        }

        this.SetXYPosition(x, y);
    }

    public Render() {
        this.mainNode.Render();

        for (const partner of this.partners) {
            partner.Render();
        }
    }
}
