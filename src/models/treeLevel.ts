import Positionable from './positionable';
import TreeNode from './treeNode';
import TreePartnerNode from './treePartnerNode';
import TreeNodeGroup from './treeNodeGroup';

// Represents a level in the family tree
export default class TreeLevel extends  Positionable {

    public level: number;
    public groups: TreeNodeGroup[];
    public groupsById: { [id: string]: TreeNodeGroup; };
    public ctx: CanvasRenderingContext2D;
    public canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, level: number, y: number) {
        super(0, TreeNode.height);

        this.level = level;
        this.canvas = canvas;
        this.ctx = context;
        this.SetYPosition(y);
        this.groupsById = {};
        this.groups = [];
    }

    public addSelectedNode(node: TreeNode) {

        // If already have position values, re-use them
        if (!node.y) {
            node.x = (this.canvas.width - TreeNode.width) / 2;
            node.y = (this.canvas.height - TreeNode.height) / 2;
        }

        const group = new TreeNodeGroup(this.ctx, [], true, node.y);

        this.groupsById[group.id] = group;
        this.groups.push(group);

        group.addNode(node);
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
        const spacing = TreeNodeGroup.minSpacing;
        for (const group of this.groups) {
            group.centreAmongRelatives(spacing);
        }
    }
}
