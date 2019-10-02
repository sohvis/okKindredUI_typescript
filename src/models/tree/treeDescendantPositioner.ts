import TreePositioner from './treePositioner';
import Tree from './tree';
import TreeNodeGroup from './treeNodeGroup';
import TreeNode from './treeNode';
import TreePartnerNode from './treePartnerNode';

export default class TreePositionerType2 implements TreePositioner {

    public tree: Tree;

    constructor(tree: Tree) {
        this.tree = tree;
    }

    public position(recalculateSpacing: boolean) {

        if (recalculateSpacing) {
            this.setInitialLevelSpacing();
        }

        // decendant levels
        const descendantLevels = this.tree.treeLevels
            .filter((item) => item.level > 0)
            .sort((a, b) => a.level - b.level);

        // Center the first descendant level
        if (descendantLevels.length > 0) {
            let previousGroup;
            for (const group of descendantLevels[0].groups) {
                this.centreGroupAmongRelatives(group);

                if (previousGroup && group.isOverlapped(previousGroup)) {
                    group.setLeftPosition(previousGroup.rightMarginEnd + group.spacing / 2);
                }

                previousGroup = group;
            }
        }

        for (let i = 1; i < descendantLevels.length; i++) {
            const level = descendantLevels[i];


            this.lineUpWithRelatives(level.groups[0], null);
            let previousGroup = level.groups[0];

            for (let j = 1; j < level.groups.length; j++) {
                const group = level.groups[j];
                this.lineUpWithRelatives(group, previousGroup);
                previousGroup = group;
            }
        }
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


    private lineUpWithRelatives(group: TreeNodeGroup, previousGroup: TreeNodeGroup | null) {
        // // window.console.log(`TreePositionerType2.lineUpWithRelatives`);
        const parentNode = this.getParentPartnerNode(group);

        if (parentNode) {
            group.setLeftPosition(parentNode.leftMarginStart + group.spacing / 2);
        } else {
            this.centreGroupAmongRelatives(group);
        }

        if (previousGroup && group.isOverlapped(previousGroup)) {
            group.setLeftPosition(previousGroup.rightMarginEnd + group.spacing / 2);
        }
    }

    private getParentPartnerNode(group: TreeNodeGroup): TreePartnerNode | null {

        for (const relative of group.commonRelatives) {

            const partnerNode = relative.parent;
            if (partnerNode) {
                return partnerNode;
            }
        }

        return null;
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

                    // Set spacing on number of nodes in level below
                    let lowerNodeCount = partnerNode.mainNode.descendants.length;

                    for (const desc of partnerNode.mainNode.descendants) {
                        lowerNodeCount += desc.partners.length;
                    }

                    const lowerNodeCorrection = Math.max(0, lowerNodeCount - partnerNode.partners.length - 0.5);
                    const minspacing = TreeNode.WIDTH / 2 + TreeNode.MIN_SPACING;
                    const extraSpacingFromNodes = lowerNodeCorrection * minspacing;

                    // Get spacing from level below and add it on
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

                    partnerNode.spacing = TreePartnerNode.MIN_SPACING + extraSpacingFromNodes + spacingFromBelow;

                    if (partnerNode.spacing > spacing) {
                        spacing = partnerNode.spacing;
                    }
                }
            }
            level.updateWidth();

            levelBelow = level;
        }
    }
}
