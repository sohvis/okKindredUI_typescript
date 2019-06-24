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

    private centreGroupAmongRelatives(group: TreeNodeGroup) {

        const xCentre = group.getCentrePositionOfCommonRelatives();
        group.updateWidth(0, 0);

        let x;

        if (group.partnerNodes.length === 1) {
            const partnerNode = group.partnerNodes[0];
            x = xCentre - TreeNode.WIDTH / 2
                    - partnerNode.mainNode.spacing
                    - partnerNode.spacing;
        } else {

            x = xCentre - group.width / 2;
        }
        let xStart = x;

        for (const partnerNode of group.partnerNodes) {
            partnerNode.setPosition(xStart, group.y);
            xStart = (partnerNode.xRight || xStart) + partnerNode.spacing;
        }

        group.setXPosition(x);
    }

    private positionDescendantLevels() {

        this.setInitialLevelSpacing();

        // decendant levels
        const descendantLevels = Object.values(this.tree.treeLevelsByLevel)
            .filter((item) => item.level > 0)
            .sort((a, b) => a.level - b.level);

        for (const level of descendantLevels) {



            let previousGroup;
            for (const group of level.groups) {
                this.centreGroupAmongRelatives(group);

                if (previousGroup && group.isOverlapped(previousGroup)) {
                    group.setLeftPosition(previousGroup.rightMarginEnd + group.spacing / 2);
                }

                previousGroup = group;
            }
        }

        // this.expandDescendantLevels(descendantLevels, middle);
    }

    private setInitialLevelSpacing() {

        // decendant levels
        const descendantLevelsSortedBottomUp = Object.values(this.tree.treeLevelsByLevel)
                .filter((item) => item.level > 0)
                .sort((a, b) => b.level - a.level);

        let levelBelow;
        for (const level of descendantLevelsSortedBottomUp) {
            for (const group of level.groups) {
                let spacing = group.spacing;
                for (const partnerNode of group.partnerNodes) {

                    let lowerNodeCount = partnerNode.mainNode.descendants.length;
                    let extraSpacing = 0;

                    for (const desc of partnerNode.mainNode.descendants) {
                        lowerNodeCount += desc.partners.length;
                        extraSpacing += desc.spacing - TreeNode.MIN_SPACING;
                    }

                    const lowerNodeCorrection = Math.max(0, lowerNodeCount - partnerNode.partners.length - 0.5);
                    const minspacing = TreeNode.WIDTH / 2 + TreeNode.MIN_SPACING;
                    const extraSpacingFromNodes = lowerNodeCorrection * minspacing;

                    // Get spacing from level below
                    let spacingFromBelow = 0;
                    if (levelBelow) {
                        for (const levelBelowGroup of levelBelow.groups) {
                            if (levelBelowGroup.commonRelativesById[partnerNode.id]) {

                                for (const partnerNodeBelow of levelBelowGroup.partnerNodes) {
                                    spacingFromBelow += partnerNodeBelow.spacing - TreePartnerNode.MIN_SPACING;
                                }
                            }
                        }
                    }

                    partnerNode.spacing = TreePartnerNode.MIN_SPACING + extraSpacingFromNodes;

                    if (partnerNode.spacing > spacing) {
                        spacing = partnerNode.spacing;
                    }
                }
            }
            level.updateWidth();

            levelBelow = level;
        }
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
