import TreeNode from './treeNode';
import TreePartnerNode from './treePartnerNode';
import Positionable from './positionable';
import TreeLevel from './treeLevel';

export default class TreeNodeGroup extends Positionable {

    public static MIN_SPACING = 10;

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
    public commonRelativesById: { [id: string]: TreeNode; };
    public groupedByAncestors: boolean;
    public partnerNodes: TreePartnerNode[];
    public partnerNodesById: { [id: string]: TreePartnerNode; };
    public mainNodesWidth: number;
    public parent: TreeLevel | null;

    private ctx: CanvasRenderingContext2D;

    constructor(
        context: CanvasRenderingContext2D,
        commonRelatives: TreeNode[],
        groupedByAncestors: boolean,
        y: number,
        parent: TreeLevel) {

        super(0, TreeNode.HEIGHT, TreeNodeGroup.MIN_SPACING);
        this.setYPosition(y);
        this.ctx = context;
        this.id = TreeNodeGroup.getGroupIdForCommonRelatives(commonRelatives);
        this.commonRelatives = commonRelatives;
        this.groupedByAncestors = groupedByAncestors;
        this.partnerNodes = new Array<TreePartnerNode>();
        this.partnerNodesById = {};
        this.mainNodesWidth = 0;
        this.parent = parent;
        this.commonRelativesById = {};

        for (const rel of this.commonRelatives) {
            this.commonRelativesById[rel.id.toString()] = rel;
        }
    }

    public addNode(node: TreeNode) {

        if (!this.partnerNodesById[node.id]) {

            const treePartnerNode = new TreePartnerNode(this.ctx, node, this);
            this.partnerNodes.push(treePartnerNode);
            this.partnerNodesById[treePartnerNode.id] = treePartnerNode;
        }
    }

    public setContentPosition(x: number) {

        let xLeft = x;
        const firstPartnerNode = this.partnerNodes[0];
        firstPartnerNode.setContentPosition(xLeft, this.y);
        xLeft = firstPartnerNode.rightMarginEnd;

        for (let i = 1; i < this.partnerNodes.length; i++) {
            const partnerNode = this.partnerNodes[i];
            partnerNode.setPosition(xLeft, this.y);
            xLeft = partnerNode.rightMarginEnd;
        }

        this.setXPosition(this.partnerNodes[0].leftMarginStart);
    }

    public setLeftPosition(xLeftMargin: number) {
        const firstPartnerNode = this.partnerNodes[0];
        const x = xLeftMargin + this.spacing / 2 + firstPartnerNode.spacing + firstPartnerNode.nodes[0].spacing;
        this.setContentPosition(x);
    }

    public setDisabled(disabled: boolean) {

        for (const partnerNode of this.partnerNodes) {
            partnerNode.setDisabled(disabled);
        }
    }

    public render() {
        for (const partnerNode of this.partnerNodes) {
            partnerNode.render();
        }
    }

    public clearRenderValues(clearAll = true) {
        for (const partnerNode of this.partnerNodes) {
            partnerNode.clearRenderValues(clearAll);
        }

        if (clearAll) {
            this.partnerNodes = new Array<TreePartnerNode>();
            this.partnerNodesById = {};
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

    public updateWidth(partnerAdditionalSpacing = 0, nodeAdditionalSpacing = 0) {

        let width = 0;

        for (const partnerNode of this.partnerNodes) {

            partnerNode.updateWidth(nodeAdditionalSpacing);
            partnerNode.updateSpacing(partnerNode.spacing + partnerAdditionalSpacing);
            width += partnerNode.widthAndSpacing;
        }

        this.width = width;
        this.widthAndSpacing = this.width + this.spacing;
    }

    public getCentrePositionOfCommonRelatives(): number {

        // window.console.log(`TreeNodeGroup.getCentrePositionOfCommonRelatives()`);
        // window.console.log(this.commonRelatives);
        if (this.commonRelatives.length > 0) {
            let sumX = 0;
            let count = 0;
            for (const relative of this.commonRelatives) {
                if (relative.hasXValue) {
                    sumX += relative.xMid;
                    count++;
                }
            }

            const result = sumX / count;

            return result;

        } else {
            // no change
            return this.xMid;
        }
    }
}
