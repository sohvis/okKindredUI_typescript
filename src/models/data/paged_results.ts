export default class PagedResults<T> {
    count: number;
    next: string;
    previous: string;
    results: T[];

    constructor() {
        this.count = 0;
        this.previous = "";
        this.next = "";
        this.results = [];
    }
}
