import TreeNode from './TreeNode';
import TreeRelation from './treeRelation';
import Point from './point';

export default class RaisedRelation implements TreeRelation {

    public id: string;
    public ctx: CanvasRenderingContext2D;
    public fromNodes: TreeNode[];
    public toNode: TreeNode;

    constructor(ctx: CanvasRenderingContext2D, fromNodes: TreeNode[], toNode: TreeNode) {
        this.ctx = ctx;
        const fromIds = fromNodes.map((item) => item.id);
        const fromIdsFormatted = fromIds.sort().join('|');
        this.id = `${fromIdsFormatted}-${toNode.id}`;
        this.fromNodes = fromNodes;
        this.toNode = toNode;
    }

    public render() {
        window.console.log(`RaisedRelation.render()`);
    }
}
