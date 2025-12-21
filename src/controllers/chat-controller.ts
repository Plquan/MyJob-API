import IChatService from "@/interfaces/chat/chat-interface";
import { before, DELETE, GET, inject, POST, route } from "awilix-express";
import { Response, Request } from "express";
import { Auth } from "@/common/middlewares";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";

@route('/chat')
export class ChatController {
    private readonly _chatService: IChatService;

    constructor(ChatService: IChatService) {
        this._chatService = ChatService;
    }

    @POST()
    @route("/create-conversation")
    @before(inject(Auth.required))
    async createOrGetConversation(req: Request, res: Response) {
        try {
            const data = req.body;
            const conversation = await this._chatService.createOrGetConversation(data);
            return res.status(StatusCodes.OK).json(conversation);
        } catch (error) {
            throw error;
        }
    }

    @POST()
    @route("/send-message")
    @before(inject(Auth.required))
    async sendMessage(req: Request, res: Response) {
        try {
            const data = req.body;
            const message = await this._chatService.sendMessage(data);
            return res.status(StatusCodes.CREATED).json(message);
        } catch (error) {
            throw error;
        }
    }

    @POST()
    @route("/get-messages")
    @before(inject(Auth.required))
    async getMessages(req: Request, res: Response) {
        try {
            const data = req.body;
            const messages = await this._chatService.getMessages(data);
            return res.status(StatusCodes.OK).json(messages);
        } catch (error) {
            throw error;
        }
    }

    @POST()
    @route("/get-conversations")
    @before(inject(Auth.required))
    async getConversations(req: Request, res: Response) {
        try {
            const data = req.body;
            const conversations = await this._chatService.getConversations(data);
            return res.status(StatusCodes.OK).json(conversations);
        } catch (error) {
            throw error;
        }
    }

    @POST()
    @route("/mark-as-read")
    @before(inject(Auth.required))
    async markAsRead(req: Request, res: Response) {
        try {
            const data = req.body;
            await this._chatService.markAsRead(data);
            return res.status(StatusCodes.OK).json({ message: "Đánh dấu đã đọc thành công" });
        } catch (error) {
            throw error;
        }
    }

    @DELETE()
    @route("/delete-conversation/:conversationId/:userId")
    @before(inject(Auth.required))
    async deleteConversation(req: Request, res: Response) {
        try {
            const conversationId = parseInt(req.params.conversationId);
            const userId = parseInt(req.params.userId);
            await this._chatService.deleteConversation(conversationId, userId);
            return res.status(StatusCodes.OK).json({ message: "Xóa conversation thành công" });
        } catch (error) {
            throw error;
        }
    }

    @POST()
    @route("/search-employers")
    @before(inject(Auth.required))
    async searchEmployers(req: Request, res: Response) {
        try {
            const data = req.body;
            const employers = await this._chatService.searchEmployers(data);
            return res.status(StatusCodes.OK).json(employers);
        } catch (error) {
            throw error;
        }
    }

    @POST()
    @route("/get-unread-count")
    @before(inject(Auth.required))
    async getUnreadCount(req: Request, res: Response) {
        try {
            const data = req.body;
            const count = await this._chatService.getUnreadCount(data);
            return res.status(StatusCodes.OK).json({ count });
        } catch (error) {
            throw error;
        }
    }
}

