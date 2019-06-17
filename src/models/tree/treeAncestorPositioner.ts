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

        // Levels that have beened positioned
        const positionedLevels = new Array<TreeLevel>();
        positionedLevels.push(this.tree.treeLevelsByLevel['0']);

        for (const level of ancestorLevelsGoingUp) {
            this.positionAncestorGroups(level, 0, 0);
            positionedLevels.unshift(level);

            const levelsToReposition = new Array<TreeLevel>();

            // if there is an overlap, we have to reposition previous level
            // then check for overlaps on further down
            for (const previousLevel of positionedLevels) {

                levelsToReposition.unshift(previousLevel);
                const maxOverlap = previousLevel.getLargestOverlap();
                if (maxOverlap > 0) {
                    const levelBelow = this.tree.treeLevelsByLevel[(previousLevel.level + 1).toString()];
                    this.positionAncestorGroups(levelBelow, 0, maxOverlap);

                    for (const levelToReposition of levelsToReposition) {
                        this.positionAncestorGroups(levelToReposition, 0, 0);
                    }
                }

            }

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

        // this.groups.sort((a, b) => { return (a.x) - (b.x) });
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
