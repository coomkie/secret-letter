import { LetterShortResponse } from "./letter-short-response";

export class PaginationLetterResponse {
    items: LetterShortResponse[];
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;

    constructor(
        items: LetterShortResponse[],
        totalItems: number,
        currentPage: number,
        pageSize: number,
    ) {
        this.items = items;
        this.totalItems = totalItems;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPages = Math.ceil(totalItems / pageSize);
    }
}
