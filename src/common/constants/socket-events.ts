// Socket events constants for chat functionality

export const SOCKET_EVENTS = {
    // Connection events
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
    
    // Chat events
    CHAT_JOIN_CONVERSATION: 'chat:join-conversation',
    CHAT_LEAVE_CONVERSATION: 'chat:leave-conversation',
    CHAT_NEW_MESSAGE: 'chat:new-message',
    CHAT_NEW_CONVERSATION_MESSAGE: 'chat:new-conversation-message',
} as const;

export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];

