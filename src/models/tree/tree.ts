import Person from '../data/person';
import Relation from '../data/relation';
import TreeNode from './treeNode';
import TreeLevel from './treeLevel';
import store from '../../store/store';
import TreeRelation from './treeRelation';
import RaisedRelation from './raisedRelation';
import TreePositionerType1 from './treePositionerType1';
import TreePositionerType2 from './treePositionerType2';

export default class Tree {

    public static PARTNERED = 1;
    public static RAISED = 2;

    public raisedRelationsById: { [id: string]: TreeRelation; };

    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public nodesById: { [id: string]: TreeNode; };
    public treeLevels: Array<TreeLevel>;
    public treeLevelsByLevel: { [id: string]: TreeLevel; };
    public selectedNode: TreeNode;
    public hoverNode: TreeNode | null;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, people: Person[], relations: Relation[]) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.nodesById = {};
        this.treeLevels = [];
        this.treeLevelsByLevel = {};
        this.raisedRelationsById = {};

        // Create tree node lookup
        for (const person of people) {
            const node = new TreeNode(ctx, person);
            this.nodesById[node.id] = node;
        }

        // Create relation objects
        for (const relation of relations) {
            const fromPerson = this.nodesById[relation.from_person_id];
            const toPerson = this.nodesById[relation.to_person_id];

            if (relation.relation_type === Tree.RAISED) {
                fromPerson.descendants.push(toPerson);
                toPerson.ancestors.push(fromPerson);

            } else { // Partnered
                fromPerson.partners.push(toPerson);
                toPerson.partners.push(fromPerson);
            }
        }

        this.selectedNode =  this.nodesById[store.state.person_id];
        this.selectedNode.selected = true;
        this.hoverNode = null;
    }

    public render() {

        window.console.log(`Tree.Render()`);
        window.console.log(`Clearing Canvas`);
        this.clearCanvas();

        window.console.log(`Adding selected node`);
        this.addLevel0();

        window.console.log(`Adding ancestors`);
        this.addAncestors();

        window.console.log(`Adding descendants`);
        this.addDescendants();

        window.console.log(`Positioning`);
        const positioner = new TreePositionerType2(this);
        positioner.position();

        window.console.log(`Rendering levels`);
        window.console.log(this.treeLevelsByLevel);

        for (const treeLevel of this.treeLevels) {
            treeLevel.render();
        }

        Object.values(this.raisedRelationsById).forEach((relation) => {
            relation.render();
        });
    }

    public click(x: number, y: number) {
        window.console.log(`Tree.click(x:${x} , y:${y})`);

        const node = this.getNodeAtXY(x, y);
        if (node) {
            this.changeSelectedPerson(node.id.toString()).then(() => {
                        this.render();
            });
        }
    }

    public hover(x: number, y: number) {
        window.console.log(`Tree.hover(x:${x} , y:${y})`);

        const node = this.getNodeAtXY(x, y);

        if (node !== this.hoverNode) {

            // Unhighlight all nodes
            Object.values(this.nodesById).forEach((otherNodes) => {
                otherNodes.highlighted = false;
            });

            if (node) {

                node.highlighted = true;

                const relatives = node.ancestors.concat(node.descendants).concat(node.partners);
                for (const relative of relatives) {
                    relative.highlighted = true;
                }
            }

            this.hoverNode = node;

            this.render();
        }
    }

    private getNodeAtXY(x: number, y: number): TreeNode | null {
        for (const node of this.getDrawnNodes()) {
            if (node.hasXValue && node.hasYValue) {
                if (node.x < x && node.xRight > x
                    && node.y < y && node.yBottom > y) {
                    return node;
                }
            }
        }

        return null;
    }

    private changeSelectedPerson(newPersonId: string) {
        return new Promise((resolve) => {
            // Get old selected id
            const oldSelectedId = store.state.person_id;

            if (oldSelectedId !== newPersonId) {
                this.nodesById[oldSelectedId].selected = false;
                store.dispatch('changePerson', newPersonId).then(() => {
                    this.nodesById[newPersonId].selected = true;
                    resolve();
                });

            }
        });

    }

    private getDrawnNodes(): TreeNode[] {

        const result = new Array<TreeNode>();

        for (const level of this.treeLevels) {
            for (const group of level.groups) {
                for (const partner of group.partnerNodes) {
                    for (const node of partner.nodes) {
                        result.push(node);
                    }
                }
            }
        }

        return result;
    }

    private clearCanvas() {

        for (const treeLevel of this.treeLevels) {
            treeLevel.clearRenderValues();
        }

        this.treeLevelsByLevel = {};
        this.treeLevels = [];
        this.raisedRelationsById = {};

        // Store the current transformation matrix
        this.ctx.save();

        // Use the identity matrix while clearing the canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Restore the transform
        this.ctx.restore();

    }

    private addLevel0() {

        const level0 = new TreeLevel(this.canvas, this.ctx, 0, 0);
        this.selectedNode =  this.nodesById[store.state.person_id];

        level0.addSelectedNode(this.selectedNode);
        this.createRelations(this.selectedNode);
        this.treeLevelsByLevel[level0.id] = level0;
        this.treeLevels.push(level0);
    }

    private addAncestors() {
        let frontier = new Array<TreeNode>();
        frontier.push(this.selectedNode);

        let level = -1;

        while (frontier.length > 0) {
            const y = (this.selectedNode.y) + level * (TreeNode.HEIGHT + TreeLevel.TREE_LEVEL_SPACING);
            const treeLevel = new TreeLevel(this.canvas, this.ctx, level, y);

            const newFrontier = new Array<TreeNode>();

            for (const node of frontier) {
                for (const ancestor of node.ancestors) {

                    newFrontier.push(ancestor);
                    if (ancestor.addToTree === false) {
                        treeLevel.addNode(ancestor, ancestor.descendants, true);
                    }

                    this.createRelations(ancestor);
                }
            }

            if (treeLevel.groups.length > 0) {
                this.treeLevelsByLevel[treeLevel.id] = treeLevel;
                this.treeLevels.push(treeLevel);
            }

            frontier = newFrontier;
            level--;
        }
    }

    private addDescendants() {
        let frontier = new Array<TreeNode>();
        frontier.push(this.selectedNode);

        let level = 1;

        while (frontier.length > 0) {
            const y = (this.selectedNode.y) + level * (TreeNode.HEIGHT + TreeLevel.TREE_LEVEL_SPACING);
            const treeLevel = new TreeLevel(this.canvas, this.ctx, level, y);

            const newFrontier = new Array<TreeNode>();

            for (const node of frontier) {
                for (const descendant of node.descendants) {

                    newFrontier.push(descendant);
                    if (descendant.addToTree === false) {
                        treeLevel.addNode(descendant, descendant.ancestors, true);
                    }

                    this.createRelations(descendant);
                }
            }

            if (treeLevel.groups.length > 0) {
                this.treeLevelsByLevel[treeLevel.id] = treeLevel;
                this.treeLevels.push(treeLevel);
            }

            frontier = newFrontier;
            level++;
        }
    }

    private createRelations(treeNode: TreeNode) {
        if (treeNode.ancestors.length > 0) {
            const relation = new RaisedRelation(this.ctx, treeNode.ancestors, treeNode);

            if (!this.raisedRelationsById[relation.id]) {
                this.raisedRelationsById[relation.id] = relation;
            }
        }
    }
}
