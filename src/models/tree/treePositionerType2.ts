import TreePositioner from './treePositioner';
import Tree from './tree';
import TreeLevel from './treeLevel';
import TreeNodeGroup from './treeNodeGroup';
import TreeAncestorPositioner from './treeAncestorPositioner';
import TreeNode from './treeNode';
import TreePartnerNode from './treePartnerNode';

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

        // decendant levels
        const descendantLevels = Object.values(this.tree.treeLevelsByLevel)
            .filter((item) => item.level > 0)
            .sort((a, b) => a.level - b.level);

        for (const level of descendantLevels) {

            this.setInitialLevelSpacing(level);

            let previousGroup;
            for (const group of level.groups) {
                this.centreGroupAmongRelatives(group);

                if (previousGroup && group.isOverlapped(previousGroup, TreeNodeGroup.MIN_SPACING)) {
                    group.setLeftPosition(previousGroup.xRight + TreeNodeGroup.MIN_SPACING, 0, 0);
                }

                previousGroup = group;
            }
        }

        // this.expandDescendantLevels(descendantLevels, middle);
    }

    private setInitialLevelSpacing(level: TreeLevel) {

        for (const group of level.groups) {
            let spacing = group.spacing;
            for (const partnerNode of group.partnerNodes) {

                let lowerNodeCount = partnerNode.mainNode.descendants.length;

                for (const desc of partnerNode.mainNode.descendants) {
                    lowerNodeCount += desc.partners.length;
                }

                partnerNode.spacing = TreePartnerNode.MIN_SPACING +
                                        lowerNodeCount * (TreeNode.WIDTH + TreeNode.MIN_SPACING) / 2;

                if (partnerNode.spacing > spacing) {
                    spacing = partnerNode.spacing;
                }
            }

            group.spacing = spacing;
        }

        level.updateWidth();
    }

    private expandDescendantLevels(descendantLevels: TreeLevel[], middle: number) {

        if (descendantLevels && descendantLevels.length > 0) {

            // get largest level by size
            descendantLevels.sort((a, b) => b.width - a.width);
            const largestLevel = descendantLevels[0];

            // ancestor Levels of largest level
            const ancestorLevelsGoingUp = Object.values(this.tree.treeLevelsByLevel)
                 .filter((item) => item.level > largestLevel.level && item.level !== 0)
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
