import config from '../../config';

export default class PagedResults<T> {

    public static PAGE_SIZE(): number {
        return config.PaginationPageSize;
    }

    public static PAGE_COUNT(totalCount: number): number {
        return Math.max(1, Math.ceil(totalCount / config.PaginationPageSize));
    }


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
