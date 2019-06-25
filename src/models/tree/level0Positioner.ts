import TreePositioner from './treePositioner';
import Tree from './tree';
import TreeNode from './treeNode';

export default class Level0Positioner implements TreePositioner {

    public tree: Tree;

    constructor(tree: Tree) {
        this.tree = tree;
    }

    public position(recalculateSpacing: boolean) {

        const partnerNode = this.tree.treeLevelsByLevel['0'].groups[0].partnerNodes[0];

        if (!partnerNode) {
            throw new Error('Nodes not set up properly on Level 0');
        }

        // If already have position values, re-use them
        if (!partnerNode.mainNode.hasYValue) {
            const x = (this.tree.canvas.width - TreeNode.WIDTH) / 2 / this.tree.dpr;
            const y = (this.tree.canvas.height - TreeNode.HEIGHT) / 2 / this.tree.dpr;
            partnerNode.mainNode.setXYPosition(x, y);
        }

        let xLeft = partnerNode.mainNode.rightMarginEnd;

        for (const partner of partnerNode.partners) {

            if (partnerNode.mainNode.hasXValue) {
                partner.setXYPosition(xLeft + partnerNode.spacing, partnerNode.mainNode.y);
                xLeft = partnerNode.rightMarginEnd;
            }
        }

        partnerNode.updateWidth();
        partnerNode.setXYPosition(partnerNode.mainNode.leftMarginStart, partnerNode.mainNode.y);
    }
}
