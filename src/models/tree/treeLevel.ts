import Positionable from './positionable';
import TreeNode from './treeNode';
import TreeNodeGroup from './treeNodeGroup';

// Represents a level in the family tree
export default class TreeLevel extends Positionable {

    public static TREE_LEVEL_SPACING = 100;

    public id: string;
    public level: number;
    public groups: TreeNodeGroup[];
    public groupsById: { [id: string]: TreeNodeGroup; };
    public ctx: CanvasRenderingContext2D;
    public canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, level: number, y: number) {
        super(0, TreeNode.HEIGHT, 0);

        this.id = level.toString();
        this.level = level;
        this.canvas = canvas;
        this.ctx = context;
        this.setYPosition(y);
        this.groupsById = {};
        this.groups = [];
        this.setYPosition(y);
    }

    public addSelectedNode(node: TreeNode, dpr: number) {
        // window.console.log(`TreeLevel.addSelectedNode()`);

        // If already have position values, re-use them
        if (!node.hasYValue) {
            const x = (this.canvas.width - TreeNode.WIDTH) / 2 / dpr;
            const y = (this.canvas.height - TreeNode.HEIGHT) / 2 / dpr;
            node.setXYPosition(x, y);
        }

        const group = new TreeNodeGroup(this.ctx, [], true, node.y, this);

        this.groupsById[group.id] = group;
        this.groups.push(group);

        group.addNode(node);

        group.updateWidth(0, 0);

        // Assume one partner group in level
        group.setXYPosition(group.partnerNodes[0].leftMarginStart, node.y);
    }

    public addNode(node: TreeNode, commonRelatives: TreeNode[], ancestor: boolean) {
        const id = TreeNodeGroup.getGroupIdForCommonRelatives(commonRelatives);

        if (!this.groupsById[id]) {
            const group = new TreeNodeGroup(this.ctx, commonRelatives, ancestor, this.y, this);
            this.groupsById[group.id] = group;
            this.groups.push(group);
        }

        this.groupsById[id].addNode(node);
    }

    public getLargestOverlap() {

        // window.console.log(`TreeLevel.getLargestOverlap() level: ${this.level}`);

        let largestOverlap = 0;
        let previousGroup;

        for (const group of this.groups) {

            if (previousGroup) {
                const overlap = previousGroup.rightMarginEnd - group.leftMarginStart;
                largestOverlap = Math.max(largestOverlap, overlap);
            }

            previousGroup = group;
        }

        return largestOverlap;
    }

    public updateWidth() {
        this.width = 0;
        for (const group of this.groups) {
            group.updateWidth(0, 0);
            this.width += group.width;
        }
    }

    public render() {
        for (const group of this.groups) {
            group.render();
        }
    }

    public clearRenderValues(clearAll = true) {

        for (const group of this.groups) {
            group.clearRenderValues(clearAll);
        }

        if (clearAll) {
            this.groupsById = {};
            this.groups = [];
        }
    }
}
