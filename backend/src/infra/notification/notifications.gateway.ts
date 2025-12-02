import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        // Xóa user khỏi map khi disconnect
        for (const [userId, socketId] of this.connectedUsers.entries()) {
            if (socketId === client.id) {
                this.connectedUsers.delete(userId);
            }
        }
    }

    @SubscribeMessage('register')
    registerUser(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
        this.connectedUsers.set(userId, client.id);
    }

    // Gửi thông báo tới 1 user cụ thể
    sendNotification(userId: string, message: string) {
        const socketId = this.connectedUsers.get(userId);

        if (socketId) {
            this.server.to(socketId).emit('newLetter', { message, timestamp: new Date() });
        }
    }
}