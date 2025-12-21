export interface ICreateConversation {
    user1Id: number;
    user2Id: number;
}

export interface ISendMessage {
    conversationId: number;
    senderId: number;
    content: string;
}

export interface IGetMessages {
    conversationId: number;
    page?: number;
    limit?: number;
}

export interface IGetConversations {
    userId: number;
    page?: number;
    limit?: number;
}

export interface IMarkAsRead {
    conversationId: number;
    userId: number;
}

export interface ISearchEmployers {
    keyword?: string;
    limit?: number;
}

export interface IEmployerSearchResult {
    id: number;
    email: string;
    companyName: string;
    companyId: number;
    avatar?: string;
}

export interface IGetUnreadCount {
    userId: number;
}

