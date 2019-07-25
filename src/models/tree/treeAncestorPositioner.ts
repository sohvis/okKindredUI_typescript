import TreePositioner from './treePositioner';
import Tree from './tree';
import TreeLevel from './treeLevel';
import TreeNodeGroup from './treeNodeGroup';

export default class TreeAncestorPositioner implements TreePositioner {

    public tree: Tree;

    constructor(tree: Tree) {
        this.tree = tree;
    }

    public position(recalculateSpacing: boolean) {

        // ancestor Levels
        const ancestorLevelsGoingUp = Object.values(this.tree.treeLevelsByLevel)
                            .filter((item) => item.level < 0)
                            .sort((a, b) => b.level - a. level);


        for (const level of ancestorLevelsGoingUp) {
            this.positionAncestorGroups(level, 0, 0);

            if (recalculateSpacing) {
                this.expandIfOverlap(level);
            }
        }
    }

    private expandIfOverlap(level: TreeLevel) {
        window.console.log(`TreeLevel.expandIfOverlap() level: ${level.level}`);

        const overlap = level.getLargestOverlap();
        window.console.log(`overlap: ${overlap}`);

        if (overlap > 0) {

            // if overlap, increase node spacing of previous level
            const descLevelId = (level.level + 1).toString();
            const descLevel = this.tree.treeLevelsByLevel[descLevelId];

            this.positionAncestorGroups(descLevel, 0, overlap / 2);
            this.expandIfOverlap(descLevel);

            this.positionAncestorGroups(level, 0, 0);
        }
    }

    private positionAncestorGroups(
                level: TreeLevel,
                partnerAdditionalSpacing: number,
                nodeAdditionalSpacing: number) {

        window.console.log(`TreeLevel.positionAncestorGroups() level: ${level.level}`);
        
        let previousGroup;
        for (const group of level.groups) {
            this.centreGroupAmongRelatives(group, partnerAdditionalSpacing, nodeAdditionalSpacing);

            // This can happen if raised by distinct groups
            if (previousGroup && Math.abs(previousGroup.xMid - group.xMid) < 2 ) {
                group.setLeftPosition(previousGroup.rightMarginEnd);
            }

            previousGroup = group;
        }
    }

    private centreGroupAmongRelatives(
                group: TreeNodeGroup,
                partnerAdditionalSpacing: number,
                nodeAdditionalSpacing: number) {
        
        window.console.log(`TreeLevel.centreGroupAmongRelatives()`);
        const xCentre = group.getCentrePositionOfCommonRelatives();

        group.updateWidth(partnerAdditionalSpacing, nodeAdditionalSpacing);

        const x = xCentre - (group.widthAndSpacing / 2);

        group.setLeftPosition(x);
        window.console.log(group);
    }
}
