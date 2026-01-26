// src/hooks/useNotifications.ts
import { useEffect, useState, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { UserContext } from '../utils/userContext';
import api from '../apis/AxiosInstance';

const API_URL = process.env.REACT_APP_API_URL || 'http://api.lekhaiduong.site';

export const useNotifications = () => {
    const { user } = useContext(UserContext);
    const [hasNewLetter, setHasNewLetter] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch unread count khi component mount
    useEffect(() => {
        if (!user?.id) return;

        const fetchUnreadCount = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get(`/letters/unread-count`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const count = response.data.count;
                setUnreadCount(count);
                setHasNewLetter(count > 0);
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        fetchUnreadCount();
    }, [user?.id]);

    // WebSocket connection
    useEffect(() => {
        if (!user?.id) return;

        const s = io(process.env.REACT_APP_WS_URL || 'wss://api.lekhaiduong.site', {
            auth: { userId: user.id },
            transports: ['websocket', 'polling']
        });

        setSocket(s);

        s.on('connect', () => {
            s.emit('register', user.id);
        });

        s.on('newLetter', (data: any) => {
            setHasNewLetter(true);
            setUnreadCount(prev => prev + 1);
        });

        s.on('disconnect', () => {
        });

        return () => {
            s.disconnect();
        };
    }, [user?.id]);

    const clearNotification = async () => {
        setHasNewLetter(false);
        // Không reset unreadCount ở đây, sẽ reset khi user đọc từng thư
    };

    const markLetterAsRead = async (letterId: string) => {
        try {
            const token = localStorage.getItem('token');
            await api.patch(`/letters/${letterId}/mark-as-read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            if (unreadCount <= 1) {
                setHasNewLetter(false);
            }
        } catch (error) {
            console.error('Error marking letter as read:', error);
        }
    };

    return { hasNewLetter, unreadCount, clearNotification, markLetterAsRead, socket };
};