export default class PagedResults<T> {
    public count: number;
    public next: string;
    public previous: string;
    public results: T[];

    constructor() {
        this.count = 0;
        this.previous = '';
        this.next = '';
        this.results = [];
    }
}
