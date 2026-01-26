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

// @WebSocketGateway({ cors: { origin: ['https://lekhaiduong.site', 'https://www.lekhaiduong.site'], credentials: true } })
@WebSocketGateway({ cors: { origin: [process.env.REACT_APP_API_URL], credentials: true } })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

    handleConnection(client: Socket) {}

    handleDisconnect(client: Socket) {
        for (const [userId, socketId] of this.connectedUsers.entries()) {
            if (socketId === client.id) this.connectedUsers.delete(userId);
        }
    }

    @SubscribeMessage('register')
    registerUser(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
        this.connectedUsers.set(userId, client.id);
    }

    sendNotification(userId: string, message: string) {
        const socketId = this.connectedUsers.get(userId);
        if (socketId) {
            this.server.to(socketId).emit('newLetter', { message, timestamp: new Date() });
        }
    }
}
