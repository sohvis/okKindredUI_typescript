import TreePositioner from './treePositioner';
import Tree from './tree';
import TreeNode from './treeNode';

export default class Level0Positioner implements TreePositioner {

    public tree: Tree;

    constructor(tree: Tree) {
        this.tree = tree;
    }

    public position() {

        const partnerNode = this.tree.treeLevelsByLevel['0'].groups[0].partnerNodes[0];

        if (!partnerNode) {
            throw new Error('Nodes not set up properly on Level 0');
        }

        // If already have position values, re-use them
        if (!partnerNode.mainNode.hasYValue) {
            const x = (this.tree.canvas.width / this.tree.dpr  - TreeNode.WIDTH) / 2;
            const y = (this.tree.canvas.height / this.tree.dpr - TreeNode.HEIGHT) / 2;
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

    public positionSiblings() {
        // window.console.log('position siblings');
        // window.console.log(this.tree.treeLevelsByLevel['0'].groups);
        // Position siblings

        const selectNodeGroup = this.tree.treeLevelsByLevel['0'].groups[0];
        let xLeft = selectNodeGroup.rightMarginEnd;

        for (const sibling of this.tree.siblings) {
            sibling.setXYPosition(xLeft + selectNodeGroup.spacing,  selectNodeGroup.y);
            xLeft += sibling.rightMarginEnd;
        }
    }
}
