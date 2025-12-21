# Socket.io Integration Guide - MyJob Chat API

## Tổng quan

API MyJob đã được tích hợp Socket.io để hỗ trợ chat real-time. Tài liệu này hướng dẫn cách tích hợp Socket.io ở phía client (React).

## Các Socket Events

### Server Events (Server emit đến Client)

| Event | Description | Payload |
|-------|-------------|---------|
| `chat:new-message` | Tin nhắn mới trong conversation | `Message` object với thông tin sender |
| `chat:new-conversation-message` | Notification cho người nhận về tin nhắn mới | `{ conversationId, message }` |
| `chat:typing` | Người dùng đang typing | `{ userId, isTyping }` |
| `chat:messages-read` | Tin nhắn đã được đọc | `{ userId, conversationId }` |
| `user:online` | User đã online | `{ userId }` |
| `user:offline` | User đã offline | `{ userId }` |

### Client Events (Client emit đến Server)

| Event | Description | Payload |
|-------|-------------|---------|
| `chat:join-conversation` | Join vào một conversation room | `conversationId: number` |
| `chat:leave-conversation` | Rời khỏi conversation room | `conversationId: number` |
| `chat:typing` | Thông báo đang typing | `{ conversationId, isTyping }` |
| `chat:mark-read` | Đánh dấu đã đọc | `{ conversationId }` |

## Cài đặt Client (React)

### 1. Cài đặt package

```bash
npm install socket.io-client
# hoặc
yarn add socket.io-client
```

### 2. Tạo Socket Context (src/contexts/SocketContext.tsx)

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { accessToken } = useSelector((state: RootState) => state.authStore);

  useEffect(() => {
    if (!accessToken) {
      // Nếu không có token, disconnect socket
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Khởi tạo socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001', {
      auth: {
        token: accessToken,
      },
      transports: ['websocket'],
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
```

### 3. Wrap App với SocketProvider (src/main.tsx)

```typescript
import { SocketProvider } from '@/contexts/SocketContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </Provider>
  </React.StrictMode>
);
```

### 4. Sử dụng Socket trong Chat Component

```typescript
import { useEffect, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useDispatch } from 'react-redux';

const ChatPage = () => {
  const { socket, isConnected } = useSocket();
  const dispatch = useDispatch();
  const currentConversation = useSelector(/* ... */);

  // Join conversation khi chọn conversation
  useEffect(() => {
    if (socket && currentConversation?.id) {
      socket.emit('chat:join-conversation', currentConversation.id);
      
      return () => {
        socket.emit('chat:leave-conversation', currentConversation.id);
      };
    }
  }, [socket, currentConversation?.id]);

  // Listen cho tin nhắn mới
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      // Cập nhật state với tin nhắn mới
      dispatch(addMessageToStore(message));
    };

    const handleTyping = (data: { userId: number; isTyping: boolean }) => {
      // Hiển thị typing indicator
      console.log('User typing:', data);
    };

    const handleMessagesRead = (data: { userId: number; conversationId: number }) => {
      // Cập nhật trạng thái đã đọc
      console.log('Messages read:', data);
    };

    socket.on('chat:new-message', handleNewMessage);
    socket.on('chat:typing', handleTyping);
    socket.on('chat:messages-read', handleMessagesRead);

    return () => {
      socket.off('chat:new-message', handleNewMessage);
      socket.off('chat:typing', handleTyping);
      socket.off('chat:messages-read', handleMessagesRead);
    };
  }, [socket, dispatch]);

  // Emit typing event
  const handleTyping = useCallback((isTyping: boolean) => {
    if (socket && currentConversation?.id) {
      socket.emit('chat:typing', {
        conversationId: currentConversation.id,
        isTyping,
      });
    }
  }, [socket, currentConversation?.id]);

  // Emit mark as read
  const handleMarkAsRead = useCallback(() => {
    if (socket && currentConversation?.id) {
      socket.emit('chat:mark-read', {
        conversationId: currentConversation.id,
      });
    }
  }, [socket, currentConversation?.id]);

  return (
    <div>
      {/* Chat UI */}
    </div>
  );
};
```

## Authentication

Socket connection sử dụng JWT token từ Redux store để xác thực. Token được gửi qua `auth.token` trong handshake.

### Lưu ý:
- Token phải được set trong Redux store trước khi khởi tạo socket
- Khi logout, socket sẽ tự động disconnect
- Khi login lại, socket sẽ tự động reconnect với token mới

## CORS Configuration

Đảm bảo CORS đã được cấu hình đúng ở phía server. Socket.io sử dụng cùng CORS config với Express app.

File: `src/common/configs/cors-config.ts` (nếu cần update)

```typescript
export const corsConfig = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
};
```

## Environment Variables

Thêm vào `.env` của client:

```env
VITE_API_URL=http://localhost:5001
```

Thêm vào `.env` của server:

```env
APP_PORT=5001
CLIENT_URL=http://localhost:5173
JWT_SECRET_KEY=your_secret_key
```

## Testing Socket Connection

Để test socket connection, mở Browser Console và kiểm tra:

```javascript
// Trong component có useSocket()
const { socket, isConnected } = useSocket();
console.log('Socket ID:', socket?.id);
console.log('Connected:', isConnected);
```

## Troubleshooting

### Socket không connect được

1. Kiểm tra JWT token có hợp lệ không
2. Kiểm tra CORS configuration
3. Kiểm tra port và URL của API server
4. Xem logs trong browser console và server console

### Tin nhắn không real-time

1. Đảm bảo đã join conversation: `socket.emit('chat:join-conversation', conversationId)`
2. Kiểm tra listeners đã được setup đúng chưa
3. Verify socket connection status

### Performance Issues

1. Luôn cleanup listeners trong useEffect return
2. Sử dụng useCallback cho event handlers
3. Debounce typing events để tránh emit quá nhiều

## Best Practices

1. **Cleanup listeners**: Luôn remove listeners khi component unmount
2. **Debounce typing events**: Tránh spam typing events
3. **Error handling**: Handle socket errors gracefully
4. **Reconnection**: Socket.io tự động reconnect, nhưng cần handle UI state
5. **Room management**: Join/leave rooms đúng cách để tránh memory leaks

## Support

Nếu có vấn đề, kiểm tra:
- Server logs: `logs/server.log`
- Browser console
- Network tab để xem WebSocket connection

