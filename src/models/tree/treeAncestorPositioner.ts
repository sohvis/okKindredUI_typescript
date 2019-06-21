import TreePositioner from './treePositioner';
import Tree from './tree';
import TreeLevel from './treeLevel';
import TreeNodeGroup from './treeNodeGroup';

export default class TreeAncestorPositioner implements TreePositioner {

    public tree: Tree;

    constructor(tree: Tree) {
        this.tree = tree;
    }

    public position() {

        // ancestor Levels
        const ancestorLevelsGoingUp = Object.values(this.tree.treeLevelsByLevel)
                            .filter((item) => item.level < 0)
                            .sort((a, b) => b.level - a. level);


        for (const level of ancestorLevelsGoingUp) {
            this.positionAncestorGroups(level, 0, 0);
            this.expandIfOverlap(level);
        }
    }

    private expandIfOverlap(level: TreeLevel) {
        const overlap = level.getLargestOverlap();
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

        for (const group of level.groups) {
            this.centreGroupAmongRelatives(group, partnerAdditionalSpacing, nodeAdditionalSpacing);
        }
    }

    private centreGroupAmongRelatives(
                group: TreeNodeGroup,
                partnerAdditionalSpacing: number,
                nodeAdditionalSpacing: number) {

        const xCentre = group.getCentrePositionOfCommonRelatives();
        group.updateWidth(partnerAdditionalSpacing, nodeAdditionalSpacing);

        const x = xCentre - (group.widthAndSpacing / 2);

        group.setLeftPosition(x);
    }
}
