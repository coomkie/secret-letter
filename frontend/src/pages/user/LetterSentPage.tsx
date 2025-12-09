import React, { useState, useEffect, useCallback } from 'react';
import { SendOutlined, CalendarOutlined, FilterOutlined, LoadingOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Pagination, Empty, Select, DatePicker } from 'antd';
import '../../CSS/LetterSent.css'
import api from '../../apis/AxiosInstance';
import type { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface LetterSent {
    id: string;
    content: string;
    mood: string;
    isRead: boolean;
    otherUser: {
        id: string;
        username: string;
        avatar: string;
    };
    matchId: string;
    createdAt: string;
    updatedAt: string;
}

interface ReceiverOption {
    id: string;
    username: string;
}

const LetterSentPage: React.FC = () => {
    const { t } = useTranslation();
    const [letters, setLetters] = useState<LetterSent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize] = useState(10);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [selectedMood, setSelectedMood] = useState<string>('all');
    const [selectedReceiver, setSelectedReceiver] = useState<string>('all');
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [allReceivers, setAllReceivers] = useState<ReceiverOption[]>([]);

    // Modal state
    const [selectedLetter, setSelectedLetter] = useState<LetterSent | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    const openModal = (letter: LetterSent) => {
        setSelectedLetter(letter);
        setIsClosing(false);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedLetter(null);
            setIsClosing(false);
            document.body.style.overflow = 'unset';
        }, 300);
    };

    useEffect(() => {
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
    }, []);

    useEffect(() => {
        fetchAllReceivers();
    }, []);

    useEffect(() => {
        fetchLetters(currentPage);
    }, [currentPage, selectedMood, selectedReceiver, dateRange]);

    const fetchAllReceivers = async () => {
        try {
            const response = await api.get('/letters/sent?page=1&pageSize=1000');
            const uniqueReceivers = response.data.items.reduce((acc: ReceiverOption[], letter: LetterSent) => {
                if (!acc.find(r => r.id === letter.otherUser.id)) {
                    acc.push({
                        id: letter.otherUser.id,
                        username: letter.otherUser.username
                    });
                }
                return acc;
            }, []);
            setAllReceivers(uniqueReceivers);
        } catch (error) {
            console.error('Error fetching receivers:', error);
        }
    };

    const fetchLetters = async (page: number) => {
        setLoading(true);
        try {
            let url = `/letters/sent?page=${page}&pageSize=${pageSize}&sortBy=created_at&sortOrder=DESC`;

            if (selectedMood !== 'all') {
                url += `&mood=${selectedMood}`;
            }

            if (selectedReceiver !== 'all') {
                url += `&search=${encodeURIComponent(selectedReceiver)}`;
            }

            if (dateRange && dateRange.length === 2) {
                const startDate = dateRange[0].format('YYYY-MM-DD');
                const endDate = dateRange[1].format('YYYY-MM-DD');
                url += `&startDate=${startDate}&endDate=${endDate}`;
            }

            const response = await api.get(url);
            setLetters(response.data.items);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching letters:', error);
            setLetters([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const getMoodEmoji = (mood: string): string => {
        const moodMap: Record<string, string> = {
            happy: '😊',
            sad: '😢',
            angry: '😠',
            neutral: '😐'
        };
        return moodMap[mood.toLowerCase()] || '😐';
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));

        if (days > 0) return `${days} ${t('day_after')}`;
        if (hours > 0) return `${hours} ${t('hour_after')}`;
        if (minutes > 0) return `${minutes} ${t('minute_after')}`;
        return t('just_in_time');
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setSelectedMood('all');
        setSelectedReceiver('all');
        setDateRange(null);
        setCurrentPage(1);
    };

    const hasActiveFilters = selectedMood !== 'all' || selectedReceiver !== 'all' || dateRange !== null;

    const activeFilterCount =
        (selectedMood !== 'all' ? 1 : 0) +
        (selectedReceiver !== 'all' ? 1 : 0) +
        (dateRange ? 1 : 0);

    return (
        <div className="letter-sent-page">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="sent-particle"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animationDelay: `${particle.delay}s`
                    }}
                >
                    ✉️
                </div>
            ))}

            <div className="sent-container">
                <div className="sent-header">
                    <div className="header-sent-content">
                        <div className="header-icon">
                            <SendOutlined />
                        </div>
                        <div className="header-text">
                            <h1 className="page-title">{t('letter_send_title_1')}</h1>
                            <p className="page-subtitle">
                                {t('letter_send_title_2')}
                            </p>
                        </div>
                    </div>
                    <div className="total-count">
                        <span className="count-number">{total}</span>
                        <span className="count-label">{t('letter_count')}</span>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="filter-section">
                    <button
                        className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FilterOutlined />
                        <span>{t('filter')}</span>
                        {hasActiveFilters && (
                            <span className="filter-badge">{activeFilterCount}</span>
                        )}
                    </button>

                    {showFilters && (
                        <div className="filter-panel">
                            <div className="filter-row">
                                <div className="filter-item">
                                    <label className="filter-label">{t('mood')}</label>
                                    <Select
                                        value={selectedMood}
                                        onChange={(value) => {
                                            setSelectedMood(value);
                                            setCurrentPage(1);
                                        }}
                                        className="filter-select"
                                        style={{ width: '100%' }}
                                    >
                                        <Option value="all">{t('all')}</Option>
                                        <Option value="happy">{t('happy')}</Option>
                                        <Option value="sad">{t('sad')}</Option>
                                        <Option value="angry">{t('angry')}</Option>
                                        <Option value="neutral">{t('curious')}</Option>
                                    </Select>
                                </div>

                                <div className="filter-item">
                                    <label className="filter-label">{t('receiver')}</label>
                                    <Select
                                        value={selectedReceiver}
                                        onChange={(value) => {
                                            setSelectedReceiver(value);
                                            setCurrentPage(1);
                                        }}
                                        className="filter-select"
                                        style={{ width: '100%' }}
                                        showSearch
                                        placeholder={t('choose_receiver')}
                                        optionFilterProp="children"
                                        filterOption={(input, option) => {
                                            const label = option?.label as string;
                                            return label.toLowerCase().includes(input.toLowerCase());
                                        }}
                                    >
                                        <Option value="all">{t('all')}</Option>
                                        {allReceivers.map(receiver => (
                                            <Option key={receiver.id} value={receiver.id}>
                                                {receiver.username}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="filter-item">
                                    <label className="filter-label">{t('time')}</label>
                                    <RangePicker
                                        value={dateRange}
                                        onChange={(dates) => {
                                            setDateRange(dates as [Dayjs, Dayjs] | null);
                                            setCurrentPage(1);
                                        }}
                                        className="filter-date"
                                        style={{ width: '100%' }}
                                        placeholder={[t('time_from'), t('time_to')]}
                                        format="DD/MM/YYYY"
                                    />
                                </div>

                                {hasActiveFilters && (
                                    <button
                                        className="clear-filter-btn"
                                        onClick={clearFilters}
                                    >
                                        <CloseOutlined />
                                        <span>{t('filter_reset')}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="loading-container">
                        <LoadingOutlined className="loading-icon" />
                        <p>{t('letter_loading')}</p>
                    </div>
                ) : letters.length === 0 ? (
                    <div className="empty-container">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div className="empty-description">
                                    <h3>{t('null_letter_count')}</h3>
                                    <p>
                                        {hasActiveFilters
                                            ? t('no_letter_filter')
                                            : t('no_upcoming_letter')}
                                    </p>
                                    {hasActiveFilters && (
                                        <button className="clear-filter-btn-empty" onClick={clearFilters}>
                                            {t('filter_reset')}
                                        </button>
                                    )}
                                </div>
                            }
                        />
                    </div>
                ) : (
                    <>
                        <div className="letters-grid">
                            {letters.map((letter, index) => (
                                <div
                                    key={letter.id}
                                    className="letter-card"
                                    style={{ animationDelay: `${index * 0.1}s`, cursor: 'pointer' }}
                                    onClick={() => openModal(letter)}
                                >
                                    <div className="letter-card-header">
                                        <span className="letter-date">
                                            <CalendarOutlined /> {formatDate(letter.createdAt)}
                                        </span>
                                    </div>

                                    <div className="letter-content-wrapper">
                                        <p className="letter-content">
                                            {letter.content.length > 100
                                                ? letter.content.slice(0, 100) + "..."
                                                : letter.content}
                                        </p>
                                    </div>

                                    <div className="letter-card-footer">
                                        <div className="receiver-info">
                                            <img
                                                src={letter.otherUser.avatar}
                                                alt={letter.otherUser.username}
                                                className="receiver-avatar"
                                            />
                                            <div className="receiver-details">
                                                <span className="receiver-label">{t('receiver')}</span>
                                                <span className="receiver-name">{letter.otherUser.username}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {total > pageSize && (
                            <div className="pagination-container">
                                <Pagination
                                    current={currentPage}
                                    total={total}
                                    pageSize={pageSize}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    showQuickJumper
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            {selectedLetter && (
                <div className={`letter-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={closeModal}>
                    <div className="modal-particles">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className={`modal-particle modal-particle-${i + 1}`}>
                                ✨
                            </div>
                        ))}
                    </div>
                    <div className="letter-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="letter-modal-header">
                            <div className="modal-header-left">
                                <div className="modal-header-info">
                                    <h2>{t('letter_detail') || 'Chi tiết thư'}</h2>
                                    <span className="modal-date">
                                        <CalendarOutlined /> {formatDate(selectedLetter.createdAt)}
                                    </span>
                                </div>
                            </div>
                            <button className="modal-close-btn" onClick={closeModal}>
                                <CloseOutlined />
                            </button>
                        </div>

                        <div className="letter-modal-body">
                            <div className="modal-receiver-section">
                                <img
                                    src={selectedLetter.otherUser.avatar}
                                    alt={selectedLetter.otherUser.username}
                                    className="modal-receiver-avatar"
                                />
                                <div className="modal-receiver-info">
                                    <span className="modal-receiver-label">{t('receiver')}</span>
                                    <span className="modal-receiver-name">{selectedLetter.otherUser.username}</span>
                                </div>
                            </div>

                            <div className="modal-content-section">
                                <div className="modal-content-text">
                                    {selectedLetter.content}
                                </div>
                            </div>

                            <div className="modal-status-section">
                                <div className="letter-status">
                                    <span className="status-dot"></span>
                                    <span className="status-text">{t('sent_status')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="letter-modal-footer">
                            <button className="modal-close-footer-btn" onClick={closeModal}>
                                {t('close') || 'Đóng'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LetterSentPage;