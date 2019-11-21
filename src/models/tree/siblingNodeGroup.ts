import Tree from './tree';
import TreeNode from './treeNode';
import Relation from '../data/relation';
import RaisedRelation from './raisedRelation';
import TreeNodeGroup from './treeNodeGroup';

export default class SiblingNodeGroup {

    public parent: Tree;
    public nodes: TreeNode[];

    constructor(tree: Tree) {
        this.parent = tree;
        this.nodes = [];
    }

    public ClearRenderValues() {
        for (const sibling of this.nodes) {
            sibling.clearRenderValues();
        }

        this.nodes = [];
    }

    public setDisabled(disabled: boolean) {
        for (const sibling of this.nodes) {
            sibling.setDisabled(disabled);
        }
    }

    public addSiblings(selectedNode: TreeNode) {

        // Group nodes by common ancestor
        const nodesGroupedByAncestor = this.groupNodesByAncestor(selectedNode);

        const level0 = this.parent.treeLevelsByLevel['0'];
        let xLeft = level0.rightMarginEnd;

        const sortedGroupIds = Object.keys(nodesGroupedByAncestor).sort();

        for (const groupId of sortedGroupIds) {
            for (const sibling of nodesGroupedByAncestor[groupId]) {
                if (sibling.addToTree === false) {
                    sibling.addToTree = true;
                    sibling.setXYPosition(xLeft, level0.y);
                    this.nodes.push(sibling);
                    xLeft = sibling.rightMarginEnd;

                    const relation = new RaisedRelation(this.parent.ctx, sibling.ancestors, sibling);
                    if (!this.parent.raisedRelationsById[relation.id]) {
                        this.parent.raisedRelationsById[relation.id] = relation;
                    }
                }
            }
        }
    }



    public render() {
        for (const sibling of this.nodes) {
            sibling.render();
        }
    }

    public positionSiblings() {
        // Position siblings
        const level0 = this.parent.treeLevelsByLevel['0'];

        const selectedNodeGroup = level0.groups[0];
        let xLeft = level0.rightMarginEnd + selectedNodeGroup.spacing;

        for (const sibling of this.nodes) {
            sibling.setXYPosition(xLeft + selectedNodeGroup.spacing,  selectedNodeGroup.y);
            xLeft = sibling.rightMarginEnd;
        }
    }

    private groupNodesByAncestor(selectedNode: TreeNode): { [id: string]: TreeNode[]; } {

        const selectedNodeGroupId = TreeNodeGroup.getGroupIdForCommonRelatives(selectedNode.ancestors);

        const nodesGroupedByAncestor: { [id: string]: TreeNode[]; } = {};

        for (const parent of selectedNode.ancestors) {
            for (const sibling of parent.descendants) {
                if (sibling.id !== selectedNode.id) {
                    let groupId = TreeNodeGroup.getGroupIdForCommonRelatives(sibling.ancestors);

                    // Nodes that have common ancestor with selected node should be sorted to top
                    if (groupId === selectedNodeGroupId) {
                        groupId = ' ' + groupId;
                    }

                    if (!nodesGroupedByAncestor[groupId]) {
                        nodesGroupedByAncestor[groupId] = new Array<TreeNode>();
                    }

                    nodesGroupedByAncestor[groupId].push(sibling);
                }
            }
        }

        return nodesGroupedByAncestor;
    }
}
