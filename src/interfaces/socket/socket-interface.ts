import { Server as SocketServer } from 'socket.io';

export default interface ISocketService {
    emitNewMessage(conversationId: number, message: any): void;
    emitToUser(userId: number, event: string, data: any): void;
    isUserOnline(userId: number): boolean;
    getIO(): SocketServer;
}

