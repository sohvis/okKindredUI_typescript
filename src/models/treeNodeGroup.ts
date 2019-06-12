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
    public nodesById: { [id: string]: TreePartnerNode; };
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
        this.updateWidth(spacing);
        this.setCentrePosition(xCentre, spacing);
    }

    public setLeftPostion(x: number, spacing: number) {
        window.console.log(`TreeNodeGroup.setLeftPostion(x: ${x}), spacing: ${spacing}`);
        this.spacing = spacing;
        let xLeft = x;
        this.setXPosition(xLeft);

        for (const node of this.nodes) {
            node.setPosition(xLeft, this.y || 0, TreePartnerNode.MIN_SPACING);
            xLeft = (node.xRight || xLeft) + spacing;
        }
    }

    public render() {
        for (const partnerNode of this.nodes) {
            partnerNode.render();
        }

        this.showBordersForDebugging(this.ctx);
    }

    public clearRenderValues() {
        for (const partnerNode of this.nodes) {
            partnerNode.clearRenderValues();
        }
    }

    public updateWidth(spacing: number) {
        this.spacing = spacing;

        let width = 0;
        for (const node of this.nodes) {
            width += node.width;
        }

        width += (this.nodes.length - 1) * this.spacing;

        this.width = width;
    }

    private getCentrePositionOfCommonRelatives() {

        window.console.log(`TreeNodeGroup.getCentrePositionOfCommonRelatives()`);
        window.console.log(this.commonRelatives);
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


    private setCentrePosition(x: number, spacing: number) {
        window.console.log(`TreeNodeGroup.setCentrePosition(x: ${x}), spacing: ${spacing}`);
        this.spacing = spacing;
        let xLeft = x - this.width / 2;
        this.setXPosition(xLeft);

        for (const node of this.nodes) {
            node.setPosition(xLeft, this.y || 0, TreePartnerNode.MIN_SPACING);
            xLeft = (node.xRight || xLeft) + spacing;
        }
    }

}
