import TreePositioner from './treePositioner';
import Tree from './tree';
import TreeLevel from './treeLevel';

export default class TreePositionerType1 implements TreePositioner {
    
    public tree: Tree;

    constructor(tree: Tree) {
        this.tree = tree;
    }

    public position() {
        this.positionAncestorLevels();
        this.positionDescendantLevels();
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

    
    public positionDescendantGroups(level: TreeLevel, additionalGroupSpacing: number, partnerAdditionalSpacing: number) {
        window.console.log(`TreeLevel.positionDescendantGroups() level: ${level.level}`);

        let previousGroup;
        for (const group of level.groups) {
            group.spacing += additionalGroupSpacing;
            if (!previousGroup || !previousGroup.hasCommonRelatives(group)) {
                group.centreAmongRelatives(partnerAdditionalSpacing, 0);
            } else {
                window.console.log(`${previousGroup.id} & ${group.id} has common relatives`);
                const xRight = (previousGroup.xRight) + previousGroup.spacing;

                window.console.log(`xRight: ${xRight}`);
                group.setLeftPostion(xRight, partnerAdditionalSpacing, 0);
            }
            previousGroup = group;
        }

        // this.groups.sort((a, b) => { return (a.x) - (b.x) });
    }

    private positionAncestorLevels() {

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

    public positionAncestorGroups(level: TreeLevel, partnerAdditionalSpacing: number, nodeAdditionalSpacing: number) {
        window.console.log(`TreeLevel.positionAncestorGroups() level: ${level.level}`);

        for (const group of level.groups) {
            group.centreAmongRelatives(partnerAdditionalSpacing, nodeAdditionalSpacing);
        }

        // this.groups.sort((a, b) => { return (a.x) - (b.x) });
    }
}
