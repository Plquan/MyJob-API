import { IPaginationResponse } from "@/interfaces/base/IPaginationBase";
import { ICreateConversation, ISendMessage, IGetMessages, IGetConversations, IMarkAsRead } from "@/dtos/chat/chat-dto";
import { Conversation } from "@/entities/conversation";
import { Message } from "@/entities/message";

export default interface IChatService {
    createOrGetConversation(data: ICreateConversation): Promise<Conversation>;
    sendMessage(data: ISendMessage): Promise<Message>;
    getMessages(data: IGetMessages): Promise<IPaginationResponse<Message>>;
    getConversations(data: IGetConversations): Promise<IPaginationResponse<Conversation>>;
    markAsRead(data: IMarkAsRead): Promise<void>;
    deleteConversation(conversationId: number, userId: number): Promise<void>;
}

