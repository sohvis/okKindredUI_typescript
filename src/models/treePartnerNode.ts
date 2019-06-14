import TreeNode from './treeNode';
import Positionable from './positionable';
import TreeRelation from './treeRelation';
import PartneredRelation from './partneredRelation';

// Represents a group of people who are partners in the family tree

export default class TreePartnerNode extends Positionable {

    public static MIN_SPACING = 30;

    public id: string;
    public ctx: CanvasRenderingContext2D;
    public mainNode: TreeNode;
    public partners: TreeNode[];
    public relationXStartPoints: { [id: string]: number; };
    public nodes: TreeNode[];
    public spacing: number;
    public relations: TreeRelation[];

    constructor(ctx: CanvasRenderingContext2D, mainNode: TreeNode) {

        // window.console.log(`TreePartnerNode.constructor()`);

        const width = (mainNode.partners.length + 1) * TreeNode.WIDTH
                        + (mainNode.partners.length) * TreeNode.MIN_SPACING;

        super(width, TreeNode.HEIGHT);

        this.id = mainNode.id;
        this.ctx = ctx;
        this.mainNode = mainNode;
        this.partners = mainNode.partners;
        this.spacing = TreePartnerNode.MIN_SPACING;
        this.relationXStartPoints = {};
        this.relations = [];

        mainNode.addToTree = true;
        this.nodes = [];
        this.nodes.push(mainNode);

        for (const partner of this.partners) {
            partner.addToTree = true;
            this.nodes.push(partner);

            const relation = new PartneredRelation(ctx, mainNode, partner);
            this.relations.push(relation);
        }
    }

    public setPosition(x: number, y: number) {

        this.mainNode.setXYPosition(x, y);

        let nextNodeX = (this.mainNode.xRight || 0) + this.mainNode.spacing;

        this.relationXStartPoints[`${this.mainNode.id}`] = this.mainNode.xMid || 0;

        for (const partner of this.partners) {
            partner.setXYPosition(nextNodeX, y);
            nextNodeX = (partner.xRight || 0) + partner.spacing;

            this.relationXStartPoints[`${this.mainNode.id}-${partner.id}`] = nextNodeX -  partner.spacing / 2;
        }

        this.setXYPosition(x, y);
    }

    public updateWidth(nodeSpacingChange: number) {

        let lastPartner = this.mainNode;
        this.mainNode.spacing += nodeSpacingChange;

        let width = this.mainNode.width + this.mainNode.spacing;

        for (const partner of this.partners) {
            partner.spacing += nodeSpacingChange;
            width += partner.width + partner.spacing;
            lastPartner = partner;
        }

        width -= lastPartner.spacing;

        this.width = width;
    }

    public render() {
        this.mainNode.render();

        for (const partner of this.partners) {
            partner.render();
        }

        for (const relation of this.relations) {
            relation.render();
        }
        // this.showBordersForDebugging(this.ctx);
    }

    public clearRenderValues() {
        this.mainNode.clearRenderValues();
        for (const partner of this.partners) {
            partner.clearRenderValues();
        }

        this.spacing = TreePartnerNode.MIN_SPACING;
    }
}
