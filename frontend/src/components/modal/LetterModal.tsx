import React, { useEffect, useState } from 'react';
import { CloseOutlined, CalendarOutlined, CheckCircleOutlined, WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import '../../CSS/LetterModal.css';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../hooks/useNotifications';
import api from '../../apis/AxiosInstance';

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
    isRead?: boolean;
}

interface LetterModalProps {
    letter: Letter | null;
    isOpen: boolean;
    onClose: () => void;
    onLetterRead?: (letterId: string) => void;
}

const LetterModal: React.FC<LetterModalProps> = ({ letter, isOpen, onClose, onLetterRead }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [readCache, setReadCache] = useState<Set<string>>(new Set());
    const [isReplied, setIsReplied] = useState(false);
    const [isReported, setIsReported] = useState(false);
    const [checkingReply, setCheckingReply] = useState(false);

    // Report states
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [isReporting, setIsReporting] = useState(false);
    const [reportClosing, setReportClosing] = useState(false);

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { markLetterAsRead } = useNotifications();

    const reportReasons = [
        { value: 'spam', label: t('report_spam') || 'Spam' },
        { value: 'inappropriate', label: t('report_inappropriate') || 'Nội dung không phù hợp' },
        { value: 'harassment', label: t('report_harassment') || 'Quấy rối' },
        { value: 'fake', label: t('report_fake') || 'Thông tin giả mạo' },
        { value: 'other', label: t('report_other') || 'Lý do khác' }
    ];

    // Check if letter has been replied
    useEffect(() => {
        if (!isOpen || !letter) {
            setIsReplied(false);
            return;
        }

        const checkReplyStatus = async () => {
            setCheckingReply(true);
            try {
                const { data } = await api.get(`/letters/check-replied/${letter.id}`);
                setIsReplied(data === true || data.isReplied === true);
                setIsReported(data === true || data.isReported === true);
            } catch (error) {
                setIsReplied(false);
                setIsReported(false);
            } finally {
                setCheckingReply(false);
            }
        };

        checkReplyStatus();
    }, [isOpen, letter]);

    // Mark letter as read when modal opens
    useEffect(() => {
        if (!isOpen || !letter) return;

        if (letter.isRead || readCache.has(letter.id)) return;

        const mark = async () => {
            try {
                await markLetterAsRead(letter.id);
                setReadCache(prev => new Set(prev).add(letter.id));
                if (onLetterRead) onLetterRead(letter.id);
            } catch (err) {
            }
        };

        mark();
    }, [isOpen, letter]);

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
        if (!letter || isReplied) return;

        navigate('/send', {
            state: {
                isReply: true,
                matchId: letter.matchId,
                letterId: letter.id,
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

    const handleOpenReport = () => {
        setShowReportModal(true);
        setReportReason('');
    };

    const handleCloseReport = () => {
        setReportClosing(true);
        setTimeout(() => {
            setShowReportModal(false);
            setReportClosing(false);
            setReportReason('');
        }, 300);
    };

    const handleSubmitReport = async () => {
        if (!reportReason || !letter) {
            message.warning(t('please_select_reason') || 'Vui lòng chọn lý do báo cáo');
            return;
        }

        setIsReporting(true);
        try {
            await api.post('/reports', {
                letterId: letter.id,
                reason: reportReasons.find(r => r.value === reportReason)?.label || reportReason
            });

            message.success(t('report_success') || 'Báo cáo thành công. Cảm ơn bạn đã góp ý!');
            handleCloseReport();
        } catch (error: any) {
            message.error(error.response?.data?.message || t('report_failed') || 'Báo cáo thất bại. Vui lòng thử lại!');
        } finally {
            setIsReporting(false);
        }
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
        <>
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
                            <button
                                className="action-btn report-btn"
                                onClick={handleOpenReport}
                                disabled={isReported}
                            >
                                {isReported ? (
                                    <>
                                        <WarningOutlined />
                                        <span>{t('reported')}</span>
                                    </>
                                ) : (
                                    <span>{t('report') || 'Báo cáo'}</span>
                                )}
                            </button>
                            {checkingReply ? (
                                <button className="action-btn reply-btn" disabled>
                                    <Spin size="small" />
                                    <span style={{ marginLeft: '8px' }}>{t('checking') || 'Đang kiểm tra...'}</span>
                                </button>
                            ) : (

                                <button
                                    className={`action-btn reply-btn ${isReplied ? 'replied' : ''}`}
                                    onClick={handleReply}
                                    disabled={isReplied}
                                >
                                    {isReplied ? (
                                        <>
                                            <CheckCircleOutlined />
                                            <span>{t('already_replied')}</span>
                                        </>
                                    ) : (
                                        <span>{t('reply')}</span>
                                    )}
                                </button>
                            )}


                        </div>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div
                    className={`report-modal-overlay ${reportClosing ? 'closing' : ''}`}
                    onClick={handleCloseReport}
                >
                    <div
                        className={`report-modal-content ${reportClosing ? 'closing' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="report-modal-header">
                            <h3>{t('report') || 'Báo cáo thư'}</h3>
                            <button className="report-close-btn" onClick={handleCloseReport}>
                                <CloseOutlined />
                            </button>
                        </div>

                        <div className="report-modal-body">

                            <div className="report-reasons">
                                {reportReasons.map((reason) => (
                                    <label key={reason.value} className="report-reason-item">
                                        <input
                                            type="radio"
                                            name="reportReason"
                                            value={reason.value}
                                            checked={reportReason === reason.value}
                                            onChange={(e) => setReportReason(e.target.value)}
                                        />
                                        <span className="report-reason-label">{reason.label}</span>
                                        <span className="report-reason-radio"></span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="report-modal-footer">
                            <button
                                className="report-cancel-btn"
                                onClick={handleCloseReport}
                                disabled={isReporting}
                            >
                                {t('cancel') || 'Hủy'}
                            </button>
                            <button
                                className="report-submit-btn"
                                onClick={handleSubmitReport}
                                disabled={isReporting || !reportReason}
                            >
                                {isReporting ? (
                                    <>
                                        <Spin size="small" />
                                        <span style={{ marginLeft: '8px' }}>{t('reporting') || 'Đang báo cáo...'}</span>
                                    </>
                                ) : (
                                    <span>{t('submit_report') || 'Gửi báo cáo'}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LetterModal;