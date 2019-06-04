import Person from './person';
import Relation from './relation';

export default class Tree {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, people: Person[], relations: Relation[]) {
        this.canvas = canvas;

        const ctx  = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No 2d canvas element!');
        }

        this.ctx = ctx;
    }
}
