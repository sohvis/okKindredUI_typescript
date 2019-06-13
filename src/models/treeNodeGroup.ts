import TreeNode from './treeNode';
import TreePartnerNode from './treePartnerNode';
import Tree from './tree';
import Positionable from './positionable';

export default class TreeNodeGroup extends Positionable {

    public static MIN_SPACING = 30;

    public static getGroupIdForCommonRelatives(relatives: TreeNode[]) {

        if (relatives) {
            const ids = relatives.map((item) => item.id);
            const groupId = ids.sort().join('|');
            return groupId;
        } else {
            return '0';
        }
    }

    public id: string;
    public commonRelatives: TreeNode[];
    public groupedByAncestors: boolean;
    public partnerNodes: TreePartnerNode[];
    public partnerNodesById: { [id: string]: TreePartnerNode; };
    public mainNodesWidth: number;
    public spacing: number;

    private ctx: CanvasRenderingContext2D;

    constructor(
        context: CanvasRenderingContext2D,
        commonRelatives: TreeNode[],
        groupedByAncestors: boolean, y: number) {

        super(0, TreeNode.HEIGHT);
        this.setYPosition(y);
        this.ctx = context;
        this.id = TreeNodeGroup.getGroupIdForCommonRelatives(commonRelatives);
        this.commonRelatives = commonRelatives;
        this.groupedByAncestors = groupedByAncestors;
        this.partnerNodes = new Array<TreePartnerNode>();
        this.partnerNodesById = {};
        this.mainNodesWidth = 0;
        this.spacing = TreeNodeGroup.MIN_SPACING;
    }

    public addNode(node: TreeNode) {

        if (!this.partnerNodesById[node.id]) {

            const treePartnerNode = new TreePartnerNode(this.ctx, node);
            this.partnerNodes.push(treePartnerNode);
            this.partnerNodesById[treePartnerNode.id] = treePartnerNode;
        }
    }

    public centreAmongRelatives(partnerAdditionalSpacing: number, nodeAdditionalSpacing: number) {
        const xCentre = this.getCentrePositionOfCommonRelatives();
        this.updateWidth(partnerAdditionalSpacing, nodeAdditionalSpacing);

        const x = xCentre - this.width / 2;
        let xStart = x;

        for (const partnerNode of this.partnerNodes) {
            partnerNode.setPosition(xStart, this.y || 0);
            xStart = (partnerNode.xRight || xStart) + partnerNode.spacing;
        }

        this.setXPosition(x);
    }

    public setLeftPostion(x: number, partnerAdditionalSpacing: number, nodeAdditionalSpacing: number) {
        let xLeft = x;
        this.updateWidth(partnerAdditionalSpacing, nodeAdditionalSpacing);

        for (const partnerNode of this.partnerNodes) {
            partnerNode.setPosition(xLeft, this.y || 0);
            xLeft = (partnerNode.xRight || xLeft) + partnerNode.spacing;
        }

        this.setXPosition(x);
    }

    public render() {
        for (const partnerNode of this.partnerNodes) {
            partnerNode.render();
        }

        this.showBordersForDebugging(this.ctx);
    }

    public clearRenderValues() {
        for (const partnerNode of this.partnerNodes) {
            partnerNode.clearRenderValues();
        }
    }

    public hasCommonRelatives(otherGroup: TreeNodeGroup): boolean {
        for (const node of this.commonRelatives) {
            for (const otherNode of otherGroup.commonRelatives) {
                if (node.id === otherNode.id) {
                    return true;
                }
            }
        }

        return false;
    }

    private updateWidth(partnerAdditionalSpacing: number, nodeAdditionalSpacing: number) {

        let width = 0;

        let lastPartner;
        for (const partnerNode of this.partnerNodes) {

            partnerNode.updateWidth(nodeAdditionalSpacing);
            partnerNode.spacing += partnerAdditionalSpacing;
            width += partnerNode.width + partnerNode.spacing;
            lastPartner = partnerNode;
        }

        if (lastPartner) {
            width -= lastPartner.spacing;
        }

        this.width = width;

    }

    private getCentrePositionOfCommonRelatives() {

        //window.console.log(`TreeNodeGroup.getCentrePositionOfCommonRelatives()`);
        //window.console.log(this.commonRelatives);
        let sumX = 0;
        let count = 0;
        for (const relative of this.commonRelatives) {
            if (relative.x) {
                sumX += relative.x;
                window.console.log(`relative.x: ${relative.x}`);
                count++;
            }
        }

        sumX += count * (TreeNode.WIDTH / 2);

        return sumX / count;
    }
}
