import { TodoSearchBody } from "./todoSearchBody.interface";

export interface TodoSearchResult {
    hits: {
        total: number,
        hits: Array<{
            _source: TodoSearchBody
        }>;
    }
}