import TreePositioner from './treePositioner';
import Tree from './tree';
import TreeLevel from './treeLevel';
import TreeNodeGroup from './treeNodeGroup';
import TreeAncestorPositioner from './treeAncestorPositioner';

export default class TreePositionerType1 implements TreePositioner {

    public tree: Tree;

    constructor(tree: Tree) {
        this.tree = tree;
    }

    public position() {
        const ancestorPositioner = new TreeAncestorPositioner(this.tree);
        ancestorPositioner.position();
        this.positionDescendantLevels();
    }


    private positionDescendantGroups(
                level: TreeLevel,
                additionalGroupSpacing: number,
                partnerAdditionalSpacing: number) {

        window.console.log(`TreeLevel.positionDescendantGroups() level: ${level.level}`);

        let previousGroup;
        for (const group of level.groups) {
            group.spacing += additionalGroupSpacing;
            if (!previousGroup || !previousGroup.hasCommonRelatives(group)) {
                this.centreGroupAmongRelatives(group, partnerAdditionalSpacing, 0);
            } else {
                window.console.log(`${previousGroup.id} & ${group.id} has common relatives`);
                const xRight = (previousGroup.xRight) + previousGroup.spacing;

                window.console.log(`xRight: ${xRight}`);
                group.setLeftPosition(xRight, partnerAdditionalSpacing, 0);
            }
            previousGroup = group;
        }

        // this.groups.sort((a, b) => { return (a.x) - (b.x) });
    }

    private positionDescendantLevels() {
        // decendant levels
        const descendantLevels = Object.values(this.tree.treeLevelsByLevel)
                            .filter((item) => item.level > 0)
                            .sort((a, b) => a.level - b. level);
        // Levels that have beened positioned
        const positionedLevels = new Array<TreeLevel>();
        positionedLevels.push(this.tree.treeLevelsByLevel['0']);

        for (const level of descendantLevels) {
            this.positionDescendantGroups(level, 0, 0);

            positionedLevels.unshift(level);

            const levelsToReposition = new Array<TreeLevel>();

            // if there is an overlap, we have to reposition previous level
            // then check for overlaps on further down
            for (const previousLevel of positionedLevels) {

                levelsToReposition.unshift(previousLevel);
                const maxOverlap = previousLevel.getLargestOverlap();
                if (maxOverlap > 0) {
                    const levelAbove = this.tree.treeLevelsByLevel[(previousLevel.level - 1).toString()];
                    this.positionDescendantGroups(level, 0, Math.min(maxOverlap, 800));

                    for (const levelToReposition of levelsToReposition) {
                        this.positionDescendantGroups(levelToReposition, 0, 0);
                    }
                }

            }
        }
    }

    private centreGroupAmongRelatives(
        group: TreeNodeGroup,
        partnerAdditionalSpacing: number,
        nodeAdditionalSpacing: number) {

        const xCentre = group.getCentrePositionOfCommonRelatives();
        group.updateWidth(partnerAdditionalSpacing, nodeAdditionalSpacing);

        const x = xCentre - group.width / 2;
        let xStart = x;

        for (const partnerNode of group.partnerNodes) {
            partnerNode.setPosition(xStart, group.y);
            xStart = (partnerNode.xRight || xStart) + partnerNode.spacing;
        }

        group.setXPosition(x);
    }

}
