import React, { useState, useEffect } from 'react';
import { SendOutlined, ArrowLeftOutlined, WarningOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../CSS/SendLetter.css';
import api from '../../apis/AxiosInstance';
import { useTranslation } from 'react-i18next';

type Mood = 'happy' | 'sad' | 'angry' | 'neutral';

interface ReplyState {
    isReply: boolean;
    matchId: string;
    letterId?: string;
    recipient: {
        id: string;
        username: string;
        avatar: string;
    };
    originalLetter?: {
        content: string;
        createdAt: string;
    };
}

const SendLetterPage = () => {
    const [content, setContent] = useState('');
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, delay: number }>>([]);
    const [envelopeState, setEnvelopeState] = useState<'open' | 'closing' | 'closed'>('open');
    const [moodHint, setMoodHint] = useState<string>('');
    const [isValidating, setIsValidating] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const maxChars = 1000;

    // Get reply data from navigation state
    const replyData = location.state as ReplyState | null;
    const isReplyMode = replyData?.isReply || false;

    // Validate reply status when component mounts in reply mode
    useEffect(() => {
        if (isReplyMode && replyData?.letterId) {
            validateReplyStatus();
        }
    }, [isReplyMode, replyData?.letterId]);

    const validateReplyStatus = async () => {
        if (!replyData?.letterId) return;

        setIsValidating(true);
        try {
            const { data } = await api.get(`/letters/check-replied/${replyData.letterId}`);
            const isAlreadyReplied = data === true || data.isReplied === true;

            if (isAlreadyReplied) {
                Modal.warning({
                    title: t('warning') || 'Cảnh báo',
                    content: t('letter_already_replied') || 'Thư này đã được phản hồi trước đó. Bạn sẽ được chuyển về hộp thư.',
                    okText: t('ok') || 'Đồng ý',
                    onOk: () => {
                        navigate('/inbox', { replace: true });
                    }
                });
            }
        } catch (error) {
            message.error(t('validation_error') || 'Không thể xác thực trạng thái thư');
        } finally {
            setIsValidating(false);
        }
    };

    useEffect(() => {
        const newParticles = Array.from({ length: 25 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 8
        }));
        setParticles(newParticles);
        if (!isReplyMode) {
            getMood();
        }
    }, [isReplyMode]);

    const getMood = async () => {
        try {
            const response = await api.get('/user-settings');
            const mood = response.data.preferredMoods?.[0] ?? 'NEUTRAL';
            setSelectedMood(mood.toLowerCase() as Mood);
            setMoodHint(getRandomHint(mood.toLowerCase()));
        } catch (error) {
            console.error('Error fetching mood:', error);
        }
    };

    const moods = [
        {
            type: 'happy' as Mood,
            icon: '😊',
            label: t('happy'),
            color: '#fbbf24',
            gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            description: t('happy_desc')
        },
        {
            type: 'sad' as Mood,
            icon: '😢',
            label: t('sad'),
            color: '#60a5fa',
            gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            description: t('sad_desc')
        },
        {
            type: 'angry' as Mood,
            icon: '😠',
            label: t('angry'),
            color: '#f87171',
            gradient: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
            description: t('angry_desc')
        },
        {
            type: 'neutral' as Mood,
            icon: '😐',
            label: t('curious'),
            color: '#9ca3af',
            gradient: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
            description: t('curious_desc')
        }
    ];

    const moodHints: Record<string, string[]> = {
        happy: [
            'happy_mood_example_1',
            'happy_mood_example_2',
            'happy_mood_example_3',
            'happy_mood_example_4',
            'happy_mood_example_5',
            'happy_mood_example_6',
            'happy_mood_example_7',
            'happy_mood_example_8',
            'happy_mood_example_9',
            'happy_mood_example_10',
            'happy_mood_example_11',
        ],
        neutral: [
            'curious_mood_example_1',
            'curious_mood_example_2',
            'curious_mood_example_3',
            'curious_mood_example_4',
            'curious_mood_example_5',
            'curious_mood_example_6',
            'curious_mood_example_7',
            'curious_mood_example_8',
            'curious_mood_example_9',
            'curious_mood_example_10',
            'curious_mood_example_11',
        ],
        sad: [
            'sad_mood_example_1',
            'sad_mood_example_2',
            'sad_mood_example_3',
            'sad_mood_example_4',
            'sad_mood_example_5',
            'sad_mood_example_6',
            'sad_mood_example_7',
            'sad_mood_example_8',
            'sad_mood_example_9',
            'sad_mood_example_10',
            'sad_mood_example_11',
        ],
        angry: [
            'angry_mood_example_1',
            'angry_mood_example_2',
            'angry_mood_example_3',
            'angry_mood_example_4',
            'angry_mood_example_5',
            'angry_mood_example_6',
            'angry_mood_example_7',
            'angry_mood_example_8',
            'angry_mood_example_9',
            'angry_mood_example_10',
            'angry_mood_example_11',
        ],
    };

    function getRandomHint(mood: string) {
        const hints = moodHints[mood];
        if (!hints || hints.length === 0) return '';
        const randomIndex = Math.floor(Math.random() * hints.length);
        return t(hints[randomIndex]);
    }

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        if (text.length <= maxChars) {
            setContent(text);
            setCharCount(text.length);
        }
    };

    const handleSendLetter = async () => {
        if (!content.trim()) return message.warning(t('blank_letter'));
        if (isValidating) return;

        if (isReplyMode) {
            // Validate again before sending
            if (!replyData?.matchId) return message.error('Invalid match data');
            if (!replyData?.letterId) return message.error('Invalid letter data');

            setIsSending(true);
            setEnvelopeState('closing');

            try {
                // Double-check reply status
                const { data: checkData } = await api.get(`/letters/check-replied/${replyData.letterId}`);
                const isAlreadyReplied = checkData === true || checkData.isReplied === true;

                if (isAlreadyReplied) {
                    message.warning(t('letter_already_replied') || 'Thư này đã được phản hồi');
                    setTimeout(() => {
                        navigate('/inbox', { replace: true });
                    }, 1500);
                    return;
                }

                // Send reply
                await api.post('/letters/reply', {
                    matchId: replyData.matchId,
                    letterId: replyData.letterId, // Add letterId
                    content: content.trim()
                });

                await new Promise(res => setTimeout(res, 1400));

                message.success({
                    content: t('sent_letter_success'),
                    duration: 3
                });

                setTimeout(() => {
                    navigate('/inbox', { replace: true });
                }, 800);

            } catch (err: any) {
                const errorMsg = err?.response?.data?.message || t('sent_letter_fail');
                message.error(errorMsg);
                setEnvelopeState('open');
            } finally {
                setIsSending(false);
            }
        } else {
            // Send random letter (original logic)
            if (!selectedMood) return message.warning(t('blank_mood'));

            setIsSending(true);
            setEnvelopeState('closing');

            try {
                await api.post('/letters/random', {
                    content: content.trim(),
                    mood: selectedMood
                });

                await new Promise(res => setTimeout(res, 1400));
                setEnvelopeState('open');

                message.success({
                    content: t('sent_letter_success'),
                    duration: 3
                });

                setTimeout(() => {
                    setContent('');
                    setSelectedMood(null);
                    setCharCount(0);
                    setEnvelopeState('open');
                    setIsSending(false);
                }, 800);

            } catch (err) {
                console.error('Error sending letter:', err);
                message.error(t('sent_letter_fail'));
                setEnvelopeState('closed');
                setIsSending(false);
            }
        }
    };

    const handleBackToInbox = () => {
        navigate('/inbox');
    };

    const selectedMoodData = moods.find(m => m.type === selectedMood);

    // Show loading overlay while validating
    if (isValidating) {
        return (
            <div className="send-letter-page" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="sending-spinner" style={{ 
                        width: '48px', 
                        height: '48px',
                        margin: '0 auto 16px'
                    }}></div>
                    <p style={{ fontSize: '16px', color: '#6b7280' }}>
                        {t('validating') || 'Đang xác thực...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="send-letter-page">
            {/* Floating Particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="send-particle"
                    style={{
                        left: `${particle.x }%`,
                        top: `${particle.y}%`,
                        animationDelay: `${particle.delay}s`
                    }}
                >
                    ✉️
                </div>
            ))}

            {/* Decorative Circles */}
            <div className="send-decoration">
                <div className="send-circle circle-1"></div>
                <div className="send-circle circle-2"></div>
                <div className="send-circle circle-3"></div>
            </div>

            <div className="send-container">
                {/* Left Side - Editor */}
                <div className="send-editor-section">
                    <div className="editor-header">
                        {isReplyMode && (
                            <button className="back-to-inbox-btn" onClick={handleBackToInbox}>
                                <ArrowLeftOutlined />
                                <span>{t('back')}</span>
                            </button>
                        )}

                        <h1 className="editor-title">
                            {isReplyMode ? t('reply') : t("send_letter_title")}
                        </h1>

                        <p className="editor-subtitle">
                            {isReplyMode
                                ? `${t('reply_to')} ${replyData?.recipient.username}`
                                : t("send_letter_content")}
                        </p>
                    </div>

                    {/* Mood Selector - Only show for non-reply mode */}
                    {!isReplyMode && (
                        <div className="mood-selector-section">
                            <h3 className="section-label">
                                {t('send_letter_mood_title')}
                            </h3>
                            <div className="mood-options">
                                {moods.map((mood, index) => (
                                    <button
                                        key={index}
                                        className={`mood-option ${selectedMood === mood.type ? 'active' : ''}`}
                                        style={{
                                            borderColor: selectedMood === mood.type ? mood.color : '#e5e7eb'
                                        }}
                                        disabled
                                    >
                                        <span className="mood-option-emoji">{mood.icon}</span>
                                        <div className="mood-option-content">
                                            <span className="mood-option-label">{mood.label}</span>
                                            <span className="mood-option-desc">{mood.description}</span>
                                        </div>
                                        {selectedMood === mood.type && (
                                            <div className="mood-selected-indicator" style={{ background: mood.gradient }}>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Content Editor */}
                    <div className="content-editor-section">
                        <div className="editor-header-row">
                            <h3 className="section-label">
                                {t('send_letter_text')}
                            </h3>
                            <span className={`char-counter ${charCount >= maxChars ? 'limit-reached' : ''}`}>
                                {charCount}/{maxChars}
                            </span>
                        </div>
                        <div className='letter-write'>
                            <textarea
                                className="letter-textarea"
                                placeholder={isReplyMode ? t('write_your_reply') : t('send_letter_description')}
                                value={content}
                                onChange={handleContentChange}
                                disabled={isSending}
                                style={{
                                    borderColor: selectedMoodData?.color || '#e5e7eb'
                                }}
                            />
                        </div>
                    </div>

                    {/* Send Button */}
                    <button
                        className="send-button"
                        onClick={handleSendLetter}
                        disabled={isSending || !content.trim() || (!isReplyMode && !selectedMood)}
                        style={{
                            background: selectedMoodData?.gradient || 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                        }}
                    >
                        {isSending ? (
                            <>
                                <span className="sending-spinner"></span>
                                {t('sending_status')}
                            </>
                        ) : (
                            <>
                                <SendOutlined />
                                {isReplyMode ? t('send_reply') : t('sending_status_2')}
                            </>
                        )}
                    </button>

                    <p className="privacy-note">
                        {t('send_letter_privacy_note')}
                    </p>
                </div>

                {/* Right Side - Preview */}
                <div className="send-preview-section">
                    <div className="sender-container">
                        {isReplyMode && replyData && (
                            <div className="recipient-card">
                                <div className="recipient-header">
                                    <span className="recipient-label">{t('receiver')}</span>
                                </div>
                                <div className="recipient-info">
                                    <img
                                        src={replyData.recipient.avatar}
                                        alt={replyData.recipient.username}
                                        className="recipient-avatar"
                                    />
                                    <div className="recipient-details">
                                        <h4 className="recipient-name">{replyData.recipient.username}</h4>
                                        <p className="recipient-status">{t('waiting_reply')}</p>
                                    </div>
                                </div>
                                {replyData.originalLetter && (
                                    <div className="original-letter-preview">
                                        <span className="preview-label">{t('root_mail')}</span>
                                        <textarea
                                            className="preview-textarea"
                                            value={replyData.originalLetter.content}
                                            readOnly
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="preview-container">
                        <div className={`envelope-preview ${envelopeState}`}>
                            <div className="envelope-preview-flap"></div>
                            <div className="envelope-preview-body">
                                <div className="letter-preview-content">
                                    {!isReplyMode && selectedMood && (
                                        <>
                                            <div className="preview-text-2">
                                                <span>{t('preview_text')}</span>
                                            </div>
                                            <p className="preview-text">{moodHint}</p>
                                        </>
                                    )}
                                    {isReplyMode && (
                                        <p className="preview-text">{t('reply_mail_title')}</p>
                                    )}
                                </div>
                            </div>
                            <div className="envelope-glow-effect" style={{
                                background: selectedMoodData ? `radial-gradient(circle, ${selectedMoodData.color}40 0%, transparent 70%)` : 'none'
                            }}></div>
                        </div>

                        {!isReplyMode && selectedMoodData && (
                            <div className="mood-indicator-display" style={{ background: selectedMoodData.gradient }}>
                                <span>{selectedMoodData.icon}</span>
                                <span>{selectedMoodData.label}</span>
                            </div>
                        )}

                        <div className="preview-stats">
                            <div className="preview-stat">
                                <span className="stat-icon">📝</span>
                                <span className="stat-text">{charCount} {t('chars')}</span>
                            </div>
                            <div className="preview-stat">
                                <span className="stat-icon">🎯</span>
                                <span className="stat-text">
                                    {isReplyMode ? t('reply_online') : t('chars_2')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendLetterPage;