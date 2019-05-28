import TreeNode from './treeNode';

// Represents a group of people who are partners in the family tree

export default class TreePartnerNode {
    
    mainNode: TreeNode;
    partners: TreeNode[];

    constructor(mainNode:TreeNode) {
        this.mainNode = mainNode;
        this.partners = mainNode.partners;
    }
}