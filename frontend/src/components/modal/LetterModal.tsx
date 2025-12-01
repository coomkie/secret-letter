import React, { useEffect, useState } from 'react';
import { CloseOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../../CSS/LetterModal.css';
import { useTranslation } from 'react-i18next';

interface UserInfo {
    id: string;
    username: string;
    avatar: string;
}

interface Letter {
    id: string;
    content: string;
    mood: string;
    sender: UserInfo;
    receiver: UserInfo;
    matchId: string;
    createdAt: string;
}

interface LetterModalProps {
    letter: Letter | null;
    isOpen: boolean;
    onClose: () => void;
}

const LetterModal: React.FC<LetterModalProps> = ({ letter, isOpen, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    const handleReply = () => {
        if (!letter) return;

        // Navigate to SendLetterPage with reply data
        navigate('/send', {
            state: {
                isReply: true,
                matchId: letter.matchId,
                recipient: {
                    id: letter.sender.id,
                    username: letter.sender.username,
                    avatar: letter.sender.avatar
                },
                originalLetter: {
                    content: letter.content,
                    createdAt: letter.createdAt
                }
            }
        });

        handleClose();
    };

    if (!isOpen && !isClosing) return null;
    if (!letter) return null;

    const formatDate = (input: string) => {
        const date = new Date(input);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days} ${t('day_after')}`;
        if (hours > 0) return `${hours} ${t('hour_after')}`;
        if (minutes > 0) return `${minutes} ${t('minute_after')}`;
        return t('just_in_time');
    };

    return (
        <div className={`letter-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
            {/* Floating particles */}
            <div className="modal-particles">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className={`modal-particle modal-particle-${i + 1}`}>
                        ✨
                    </div>
                ))}
            </div>

            <div className={`letter-modal-content ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={handleClose}>
                    <CloseOutlined />
                </button>

                <div className="modal-body">
                    <div className="modal-sender-info">
                        <div className="sender-avatar-container">
                            <img
                                src={letter.sender.avatar}
                                alt={letter.sender.username}
                                className="modal-sender-avatar"
                            />
                            <div className="avatar-ring"></div>
                        </div>
                        <div className="modal-sender-details">
                            <h3 className="modal-sender-name">{letter.sender.username}</h3>
                            <p className="modal-letter-date">
                                <CalendarOutlined /> {formatDate(letter.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="modal-letter-content">
                        <div className="letter-paper-bg">
                            <p className="letter-text">{letter.content}</p>
                            <div className="letter-signature">
                                <div className="signature-line"></div>
                                <span className="signature-text">{letter.sender.username}</span>
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button className="action-btn reply-btn" onClick={handleReply}>
                            Trả lời
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LetterModal;