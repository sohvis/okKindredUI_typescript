import Person from '../data/person';
import Relation from '../data/relation';
import TreeNode from './treeNode';
import TreeLevel from './treeLevel';
import store from '../../store/store';
import TreeRelation from './treeRelation';
import RaisedRelation from './raisedRelation';
import TreeAncestorPositioner from './treeAncestorPositioner';
import TreeDescendantPositioner from './treeDescendantPositioner';
import Level0Positioner from './level0Positioner';
import RelationTypes from '../data/relation_types';
import SiblingNodeGroup from './siblingNodeGroup';
import Point from './point';
import router from '../../router';

export default class Tree {

    public raisedRelationsById: { [id: string]: TreeRelation; };

    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public dpr: number;
    public nodesById: { [id: string]: TreeNode; };
    public treeLevels: TreeLevel[];
    public treeLevelsByLevel: { [id: string]: TreeLevel; };
    public selectedNode: TreeNode;
    public hoverNode: TreeNode | null;
    public disabled: boolean;
    public selectedPersonId: string = '';
    public siblingNodeGroup: SiblingNodeGroup;

    constructor(canvas: HTMLCanvasElement, people: Person[], relations: Relation[]) {

        const canvasTop = canvas.getBoundingClientRect().top;

        // Get the device pixel ratio, falling back to 1.
        const dpr = window.devicePixelRatio || 1;

        canvas.width = window.innerWidth * dpr;
        canvas.height = (window.innerHeight - canvasTop) * dpr;
        const ctx  = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No 2d canvas element!');
        }
        ctx.scale(dpr, dpr);

        this.dpr = dpr;
        this.canvas = canvas;
        this.ctx = ctx;
        this.nodesById = {};
        this.treeLevels = [];
        this.treeLevelsByLevel = {};
        this.raisedRelationsById = {};
        this.disabled = false;
        this.siblingNodeGroup = new SiblingNodeGroup(this);

        // Create tree node lookup
        for (const person of people) {
            const node = new TreeNode(ctx, person);
            this.nodesById[node.id] = node;
        }

        // Create relation objects
        for (const relation of relations) {
            const fromPerson = this.nodesById[relation.from_person_id];
            const toPerson = this.nodesById[relation.to_person_id];

            if (relation.relation_type === RelationTypes.RAISED) {
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

    public setDisabled(disabled: boolean) {
        this.disabled = disabled;

        for (const treeLevel of this.treeLevels) {
            treeLevel.setDisabled(disabled);
        }

        this.siblingNodeGroup.setDisabled(disabled);

        Object.values(this.raisedRelationsById).forEach((relation) => {
            relation.disabled = disabled;
        });
    }

    public render(clearAll = true) {

        // window.console.log(`Tree.Render()`);
        // window.console.log(`Clearing Canvas`);
        this.clearCanvas(clearAll);

        if (clearAll) {
            // window.console.log(`Adding selected node`);
            this.addLevel0();

            // window.console.log(`Adding ancestors`);
            this.addAncestors();

            // window.console.log(`Adding descendants`);
            this.addDescendants();

            this.setDisabled(this.disabled);
        }

        // window.console.log(`Positioning`);

        const level0Positioner = new Level0Positioner(this);
        level0Positioner.position();

        const ancestorPositioner = new TreeAncestorPositioner(this);
        ancestorPositioner.position(clearAll);

        const descendantPositioner = new TreeDescendantPositioner(this);
        descendantPositioner.position(clearAll);

        this.siblingNodeGroup.addSiblings(this.selectedNode);
        this.siblingNodeGroup.positionSiblings();

        // window.console.log(`Rendering levels`);
        for (const treeLevel of this.treeLevels) {
            treeLevel.render();
        }

        this.siblingNodeGroup.render();

        Object.values(this.raisedRelationsById).forEach((relation) => {
            relation.render();
        });
    }

    public clickRequiresMove(x: number, y: number): Point | null {
        // window.console.log(`Tree.click(x:${x} , y:${y})`);

        const node = this.getNodeAtXY(x, y);
        if (node) {
            if (node.selected) {
                return new Point(node.xMid, node.yMid);
            } else {
                store.dispatch('changePerson', node.id.toString());
                return null;
            }
        }

        return null;
    }

    public doubleClick(x: number, y: number) {
        const node = this.getNodeAtXY(x, y);
        if (node) {
            if (node.selected) {
                router.push(`/family/profile/${node.id}/`);
            }
        }
    }

    public changeSelectedPerson(newPersonId: string, oldPersonId: string) {
        // window.console.log(`state.changeSelectedPerson(newPersonId: ${newPersonId})`);

        this.nodesById[oldPersonId].selected = false;
        this.selectedPersonId = newPersonId;
        this.nodesById[newPersonId].selected = true;

        this.render(true);
    }

    public hover(x: number, y: number) {
        // // window.console.log(`Tree.hover(x:${x} , y:${y})`);

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

            this.render(false);
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

        result.push(...this.siblingNodeGroup.nodes);

        return result;
    }

    private clearCanvas(clearAll = true) {

        for (const treeLevel of this.treeLevels) {
            treeLevel.clearRenderValues(clearAll);
        }

        this.siblingNodeGroup.ClearRenderValues();

        if (clearAll) {
            this.treeLevelsByLevel = {};
            this.treeLevels = [];
            this.raisedRelationsById = {};
        }

        // Store the current transformation matrix
        this.ctx.save();

        // Use the identity matrix while clearing the canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Restore the transform
        this.ctx.restore();
    }

    private addLevel0() {

        // window.console.log(`Tree.addLevel0()`);
        const level0 = new TreeLevel(this.canvas, this.ctx, 0, 0);

        // window.console.log(`store.state.person_id: ${store.state.person_id}`);
        this.selectedNode =  this.nodesById[store.state.person_id];
        // window.console.log(this.selectedNode);

        level0.addSelectedNode(this.selectedNode, this.dpr);
        this.createRelations(this.selectedNode);
        this.treeLevelsByLevel[level0.id] = level0;
        this.treeLevels.push(level0);
    }

    private addAncestors() {
        const addedNodesById: { [id: string]: TreeNode; } = {};

        let frontier = new Array<TreeNode>();
        frontier.push(this.selectedNode);
        addedNodesById[this.selectedNode.id] = this.selectedNode;

        let level = -1;

        while (frontier.length > 0) {
            const y = (this.selectedNode.y) + level * (TreeNode.HEIGHT + TreeLevel.TREE_LEVEL_SPACING);
            const treeLevel = new TreeLevel(this.canvas, this.ctx, level, y);

            const newFrontier = new Array<TreeNode>();

            for (const node of frontier) {
                for (const ancestor of node.ancestors) {

                    if (!addedNodesById[ancestor.id]) {
                        newFrontier.push(ancestor);
                        addedNodesById[ancestor.id] = ancestor;
                        if (ancestor.addToTree === false) {
                            treeLevel.addNode(ancestor, ancestor.descendants, true);
                        }

                        this.createRelations(ancestor);
                    }
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
        const addedNodesById: { [id: string]: TreeNode; } = {};
        let frontier = new Array<TreeNode>();
        frontier.push(this.selectedNode);
        addedNodesById[this.selectedNode.id] = this.selectedNode;

        let level = 1;

        while (frontier.length > 0) {
            const y = (this.selectedNode.y) + level * (TreeNode.HEIGHT + TreeLevel.TREE_LEVEL_SPACING);
            const treeLevel = new TreeLevel(this.canvas, this.ctx, level, y);

            const newFrontier = new Array<TreeNode>();

            for (const node of frontier) {
                for (const descendant of node.descendants) {

                    if (!addedNodesById[descendant.id]) {
                        newFrontier.push(descendant);
                        addedNodesById[descendant.id] = descendant;
                        if (descendant.addToTree === false) {
                            treeLevel.addNode(descendant, descendant.ancestors, true);
                        }

                        this.createRelations(descendant);
                    }
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
