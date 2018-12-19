export class GetPostsRequest {
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
    boardId: number;
    maxId: number;
    minId: number;
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

export class GetCommentRequest {
    context: CommentContext;
    data: CreateCommentData;
    pagination: Pagination;
}

export class CreateCommentRequest {
    context: CommentContext;
    data: CreateCommentData;
}

export class CommentContext {
    postId: string;
    type: string;
}

export class CreateCommentData {
    _type: any;
    text: null;
    postId:number;
    commentId:number;
    maxId:number;
    minId:number;
}