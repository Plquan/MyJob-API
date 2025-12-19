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

