import TreeNode from './treeNode';
import TreePartnerNode from './treePartnerNode';
import Tree from './tree';
import Positionable from './positionable';

export default class TreeNodeGroup extends Positionable {

    public static minSpacing = 30;

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
    public nodes: TreePartnerNode[];
    public nodesById: { [id: number]: TreePartnerNode; };
    public spacing: number;

    private ctx: CanvasRenderingContext2D;

    constructor(
        context: CanvasRenderingContext2D,
        commonRelatives: TreeNode[],
        groupedByAncestors: boolean, y: number) {

        super(0, TreeNode.height);
        this.SetYPosition(y);
        this.ctx = context;
        this.id = TreeNodeGroup.getGroupIdForCommonRelatives(commonRelatives);
        this.commonRelatives = commonRelatives;
        this.groupedByAncestors = groupedByAncestors;
        this.nodes = new Array<TreePartnerNode>();
        this.nodesById = {};
        this.spacing = TreeNodeGroup.minSpacing;
    }

    public addNode(node: TreeNode) {

        if (!this.nodesById[node.id]) {

            const treePartnerNode = new TreePartnerNode(node);
            this.nodes.push(treePartnerNode);
            this.nodesById[treePartnerNode.id] = treePartnerNode;
        }
    }

    public centreAmongRelatives(spacing: number) {
        const xCentre = this.getCentrePositionOfCommonRelatives();
        this.updateWidth();
        this.setCentrePosition(xCentre, spacing);
    }

    private getCentrePositionOfCommonRelatives() {

        window.console.log(`TreeNodeGroup.getCentrePositionOfCommonRelatives()`);

        let sumX = 0;
        let count = 0;
        for (const relative of this.commonRelatives) {
            sumX += relative.x || 0;
            count++;
        }

        sumX += count * (TreeNode.width / 2);

        return sumX / count;
    }

    private updateWidth() {
        let width = 0;
        for (const node of this.nodes) {
            width += node.width;
        }

        width += (this.nodes.length - 1) * this.spacing;

        this.width = width;
    }



    private setCentrePosition(x: number, spacing: number) {
        this.spacing = spacing;
        let xLeft = x - this.width / 2;
        this.SetXPosition(xLeft);

        for (const node of this.nodes) {
            node.SetXPosition(xLeft);
            xLeft = node.xRight || xLeft + spacing;
        }
    }


}
