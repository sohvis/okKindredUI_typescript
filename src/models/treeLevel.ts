import Positionable from './positionable';
import TreeNode from './treeNode';
import TreePartnerNode from './treePartnerNode';
import TreeNodeGroup from './treeNodeGroup';

// Represents a level in the family tree
export default class TreeLevel extends  Positionable {

    public static TREE_LEVEL_SPACING = 100;

    public id: string;
    public level: number;
    public groups: TreeNodeGroup[];
    public groupsById: { [id: string]: TreeNodeGroup; };
    public ctx: CanvasRenderingContext2D;
    public canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, level: number, y: number) {
        super(0, TreeNode.HEIGHT);

        this.id = level.toString();
        this.level = level;
        this.canvas = canvas;
        this.ctx = context;
        this.setYPosition(y);
        this.groupsById = {};
        this.groups = [];
        this.setYPosition(y);
    }

    public addSelectedNode(node: TreeNode) {

        // If already have position values, re-use them
        if (!node.y) {
            const x = (this.canvas.width - TreeNode.WIDTH) / 2;
            const y = (this.canvas.height - TreeNode.HEIGHT) / 2;
            node.setXYPosition(x, y);
        }

        const group = new TreeNodeGroup(this.ctx, [], true, node.y || 0);

        this.groupsById[group.id] = group;
        this.groups.push(group);

        group.addNode(node);

        group.updateWidth(TreeNode.WIDTH);
        group.setLeftPostion(node.x || 0, TreeNode.WIDTH);
        
    }

    public addNode(node: TreeNode, commonRelatives: TreeNode[], ancestor: boolean) {
        const id = TreeNodeGroup.getGroupIdForCommonRelatives(commonRelatives);

        if (!this.groupsById[id]) {
            const group = new TreeNodeGroup(this.ctx, commonRelatives, ancestor, this.y || 0);
            this.groupsById[group.id] = group;
            this.groups.push(group);
        }

        this.groupsById[id].addNode(node);
    }

    public positionGroups() {
        window.console.log(`TreeLevel.positionGroups() level: ${this.level}`);

        const spacing = TreeNodeGroup.minSpacing;
        for (const group of this.groups) {
            group.centreAmongRelatives(spacing);
        }
    }

    public render() {
        for (const group of this.groups) {
            group.render();
        }
    }

    public clearRenderValues() {
        for (const group of this.groups) {
            group.clearRenderValues();
        }
    }
}
