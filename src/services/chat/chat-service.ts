import { IPaginationResponse } from "@/interfaces/base/IPaginationBase";
import IChatService from "@/interfaces/chat/chat-interface";
import DatabaseService from "../common/database-service";
import logger from "@/common/helpers/logger";
import { ICreateConversation, ISendMessage, IGetMessages, IGetConversations, IMarkAsRead } from "@/dtos/chat/chat-dto";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { Conversation } from "@/entities/conversation";
import { Message } from "@/entities/message";
import { HttpException } from "@/errors/http-exception";
import { EGlobalError } from "@/common/enums/error/EGlobalError";

export default class ChatService implements IChatService {
    private readonly _context: DatabaseService;

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService;
    }

    async createOrGetConversation(data: ICreateConversation): Promise<Conversation> {
        try {
            const { user1Id, user2Id } = data;

            // Đảm bảo user1Id luôn nhỏ hơn user2Id để tránh duplicate
            const [smallerId, biggerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];

            // Kiểm tra conversation đã tồn tại chưa
            let conversation = await this._context.ConversationRepo
                .createQueryBuilder("conversation")
                .where(
                    "(conversation.user1Id = :smallerId AND conversation.user2Id = :biggerId) OR (conversation.user1Id = :biggerId AND conversation.user2Id = :smallerId)",
                    { smallerId, biggerId }
                )
                .getOne();

            // Nếu chưa có thì tạo mới
            if (!conversation) {
                conversation = this._context.ConversationRepo.create({
                    user1Id: smallerId,
                    user2Id: biggerId,
                });
                await this._context.ConversationRepo.save(conversation);
            }

            return conversation;
        } catch (error: any) {
            logger.error(error?.message);
            console.log(`Error in ChatService - method createOrGetConversation() at ${new Date().getTime()} with message ${error?.message}`);
            throw error;
        }
    }

    async sendMessage(data: ISendMessage): Promise<Message> {
        try {
            const { conversationId, senderId, content } = data;

            // Kiểm tra conversation có tồn tại không
            const conversation = await this._context.ConversationRepo.findOne({
                where: { id: conversationId },
            });

            if (!conversation) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Conversation không tồn tại");
            }

            // Tạo message mới
            const message = this._context.MessageRepo.create({
                conversationId,
                senderId,
                content,
            });
            await this._context.MessageRepo.save(message);

            // Cập nhật lastMessage và lastMessageAt của conversation
            conversation.lastMessage = content;
            conversation.lastMessageAt = new Date();
            await this._context.ConversationRepo.save(conversation);

            // Load lại message với thông tin sender
            const messageWithSender = await this._context.MessageRepo
                .createQueryBuilder("message")
                .leftJoinAndSelect("message.sender", "sender")
                .where("message.id = :id", { id: message.id })
                .getOne();

            return messageWithSender!;
        } catch (error: any) {
            logger.error(error?.message);
            console.log(`Error in ChatService - method sendMessage() at ${new Date().getTime()} with message ${error?.message}`);
            throw error;
        }
    }

    async getMessages(data: IGetMessages): Promise<IPaginationResponse<Message>> {
        try {
            const { conversationId, page = 1, limit = 50 } = data;

            // Kiểm tra conversation có tồn tại không
            const conversation = await this._context.ConversationRepo.findOne({
                where: { id: conversationId },
            });

            if (!conversation) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Conversation không tồn tại");
            }

            // Lấy messages với pagination
            const [messages, totalItems] = await this._context.MessageRepo
                .createQueryBuilder("message")
                .leftJoinAndSelect("message.sender", "sender")
                .where("message.conversationId = :conversationId", { conversationId })
                .orderBy("message.createdAt", "DESC")
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();

            return {
                items: messages,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            };
        } catch (error: any) {
            logger.error(error?.message);
            console.log(`Error in ChatService - method getMessages() at ${new Date().getTime()} with message ${error?.message}`);
            throw error;
        }
    }

    async getConversations(data: IGetConversations): Promise<IPaginationResponse<Conversation>> {
        try {
            const { userId, page = 1, limit = 20 } = data;

            // Lấy conversations của user
            const [conversations, totalItems] = await this._context.ConversationRepo
                .createQueryBuilder("conversation")
                .leftJoinAndSelect("conversation.user1", "user1")
                .leftJoinAndSelect("user1.avatar", "avatar1")
                .leftJoinAndSelect("conversation.user2", "user2")
                .leftJoinAndSelect("user2.avatar", "avatar2")
                .where("conversation.user1Id = :userId OR conversation.user2Id = :userId", { userId })
                .orderBy("conversation.lastMessageAt", "DESC")
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();

            return {
                items: conversations,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            };
        } catch (error: any) {
            logger.error(error?.message);
            console.log(`Error in ChatService - method getConversations() at ${new Date().getTime()} with message ${error?.message}`);
            throw error;
        }
    }

    async markAsRead(data: IMarkAsRead): Promise<void> {
        try {
            const { conversationId, userId } = data;

            // Kiểm tra conversation có tồn tại không
            const conversation = await this._context.ConversationRepo.findOne({
                where: { id: conversationId },
            });

            if (!conversation) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Conversation không tồn tại");
            }

            // Đánh dấu tất cả tin nhắn chưa đọc là đã đọc
            await this._context.MessageRepo
                .createQueryBuilder()
                .update(Message)
                .set({ isRead: true })
                .where("conversationId = :conversationId", { conversationId })
                .andWhere("senderId != :userId", { userId })
                .andWhere("isRead = :isRead", { isRead: false })
                .execute();
        } catch (error: any) {
            logger.error(error?.message);
            console.log(`Error in ChatService - method markAsRead() at ${new Date().getTime()} with message ${error?.message}`);
            throw error;
        }
    }

    async deleteConversation(conversationId: number, userId: number): Promise<void> {
        try {
            const conversation = await this._context.ConversationRepo.findOne({
                where: { id: conversationId },
            });

            if (!conversation) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Conversation không tồn tại");
            }

            if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
                throw new HttpException(StatusCodes.FORBIDDEN, EGlobalError.UnauthorizedAccess, "Bạn không có quyền xóa conversation này");
            }

            await this._context.ConversationRepo.remove(conversation);
        } catch (error: any) {
            throw error;
        }
    }
}

