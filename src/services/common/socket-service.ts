import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '@/common/helpers/logger';
import jwt from 'jsonwebtoken';
import { ENV } from '@/common/constants/env';

interface AuthSocket extends Socket {
    userId?: number;
}

export default class SocketService {
    private io: SocketServer;

    constructor(httpServer: HttpServer) {
        this.io = new SocketServer(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        this.initialize();
    }

    private initialize() {
        this.io.use((socket: AuthSocket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
                
                if (!token) {
                    return next(new Error('Authentication error: No token provided'));
                }

                const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET) as { userId: number };
                socket.userId = decoded.userId;
                next();
            } catch (error) {
                logger.error('Socket authentication error:', error);
                next(new Error('Authentication error'));
            }
        });

        this.io.on('connection', (socket: AuthSocket) => {
            const userId = socket.userId;
            if (userId) {
                logger.info(`User ${userId} connected with socket ${socket.id}`);
            }

            // Handle joining conversation rooms
            socket.on('chat:join-conversation', (conversationId: number) => {
                socket.join(`conversation:${conversationId}`);
                logger.info(`User ${userId} joined conversation ${conversationId}`);
            });

            // Handle leaving conversation rooms
            socket.on('chat:leave-conversation', (conversationId: number) => {
                socket.leave(`conversation:${conversationId}`);
                logger.info(`User ${userId} left conversation ${conversationId}`);
            });

            socket.on('disconnect', () => {
                if (userId) {
                    logger.info(`User ${userId} disconnected`);
                }
            });

            socket.on('error', (error) => {
                logger.error('Socket error:', error);
            });
        });
    }

    // Emit new message to conversation room
    public emitNewMessage(conversationId: number, message: any) {
        this.io.to(`conversation:${conversationId}`).emit('chat:new-message', message);
        logger.info(`New message emitted to conversation ${conversationId}`);
    }

    // Emit message to specific user (for notifications when user is not in conversation room)
    public emitMessageToUser(userId: number, message: any) {
        // Find all sockets of this user (user might have multiple tabs/devices) and emit directly
        let emittedCount = 0;
        this.io.sockets.sockets.forEach((socket: AuthSocket) => {
            if (socket.userId === userId) {
                socket.emit('chat:new-message', message);
                emittedCount++;
            }
        });
        logger.info(`New message emitted to user ${userId} (${emittedCount} socket(s))`);
    }

    // Get socket instance
    public getIO(): SocketServer {
        return this.io;
    }
}

