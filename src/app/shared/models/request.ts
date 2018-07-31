export class GetRequest {
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


export class PostRequest {
    data: Data;
}

export class PostData {
    text: string;
    images: Array<string>;
    category: string;
    model: string;
    website: string;
    contact: string;
}