import Tree from './tree';

export default interface TreePositioner {
    tree: Tree;

    position(recalculateSpacing: boolean): void;
}
