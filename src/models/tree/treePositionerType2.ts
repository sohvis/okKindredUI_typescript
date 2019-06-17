import TreePositioner from './treePositioner';
import Tree from './tree';
import TreeLevel from './treeLevel';
import TreeNodeGroup from './treeNodeGroup';
import TreeAncestorPositioner from './treeAncestorPositioner';

export default class TreePositionerType2 implements TreePositioner {

    public tree: Tree;

    constructor(tree: Tree) {
        this.tree = tree;
    }

    public position() {
        const ancestorPositioner = new TreeAncestorPositioner(this.tree);
        ancestorPositioner.position();
        this.positionDescendantLevels();
    }

    private centreGroupAmongRelatives(
        group: TreeNodeGroup) {

        const xCentre = group.getCentrePositionOfCommonRelatives();
        group.updateWidth(0, 0);

        const x = xCentre - group.width / 2;
        let xStart = x;

        for (const partnerNode of group.partnerNodes) {
            partnerNode.setPosition(xStart, group.y);
            xStart = (partnerNode.xRight || xStart) + partnerNode.spacing;
        }

        group.setXPosition(x);
    }

    private positionDescendantLevels() {

        const middle = this.tree.selectedNode.xMid;

        // decendant levels
        const descendantLevels = Object.values(this.tree.treeLevelsByLevel)
            .filter((item) => item.level > 0)
            .sort((a, b) => a.level - b.level);

        for (const level of descendantLevels) {

            level.updateWidth();
            let left = middle - level.width / 2;

            for (const group of level.groups) {
                group.setLeftPosition(left, 0, 0);
                left += group.width + group.spacing;
            }
        }

        this.expandDescendantLevels(descendantLevels, middle);
    }

    private expandDescendantLevels(descendantLevels: TreeLevel[], middle: number) {

        if (descendantLevels && descendantLevels.length > 0) {

            // get largest level by size
            descendantLevels.sort((a, b) => b.width - a.width);
            const largestLevel = descendantLevels[0];

            // ancestor Levels of largest level
            const ancestorLevelsGoingUp = Object.values(this.tree.treeLevelsByLevel)
                 .filter((item) => item.level > largestLevel.level && item.level != 0)
                 .sort((a, b) => a.level - b.level);

            window.console.log(`expandDescendantLevels`);
            window.console.log(ancestorLevelsGoingUp);

            for (const levelToExpand of ancestorLevelsGoingUp) {
                 for (const group of levelToExpand.groups) {
                    this.centreGroupAmongRelatives(group);
                 }
            }
        }
    }
}
