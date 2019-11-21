import TreePositioner from './treePositioner';
import Tree from './tree';
import TreeNode from './treeNode';
import TreeLevel from './treeLevel';

export default class Level0Positioner implements TreePositioner {

    public tree: Tree;
    public level0: TreeLevel;

    constructor(tree: Tree) {
        this.tree = tree;
        this.level0 = this.tree.treeLevelsByLevel['0'];
    }

    public position() {

        const partnerNode = this.level0.groups[0].partnerNodes[0];

        if (!partnerNode) {
            throw new Error('Nodes not set up properly on Level 0');
        }

        // If already have position values, re-use them
        if (!partnerNode.mainNode.hasYValue) {
            const x = (this.tree.canvas.width / this.tree.dpr  - TreeNode.WIDTH) / 2;
            const y = (this.tree.canvas.height / this.tree.dpr - TreeNode.HEIGHT) / 2;
            // partnerNode.updateWidth();
            partnerNode.mainNode.setXYPosition(x, y);
        }

        let xLeft = partnerNode.mainNode.rightMarginEnd;

        for (const partner of partnerNode.partners) {

            if (partnerNode.mainNode.hasXValue) {
                partner.setXYPosition(xLeft + partnerNode.spacing, partnerNode.mainNode.y);
                xLeft = partner.rightMarginEnd;
            }
        }

        partnerNode.updateWidth();
        partnerNode.setXYPosition(partnerNode.mainNode.leftMarginStart, partnerNode.mainNode.y);

        this.level0.xRight = xLeft;
        this.level0.updateMargins();
    }
}
