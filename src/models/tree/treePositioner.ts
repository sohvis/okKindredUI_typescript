import Tree from './tree';

export default interface TreePositioner {
    tree: Tree;

    position(): void;
}
