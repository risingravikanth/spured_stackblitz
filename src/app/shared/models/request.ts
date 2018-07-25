export class PostRequest {
    context: Context;
    data: Data;
    pagination: Pagination;
}

export class Pagination {
    limit: number = 10;
    offset: number;
}

export class Data {
    category: string;
    model: string;
}

export class Context {
    type: string;
}