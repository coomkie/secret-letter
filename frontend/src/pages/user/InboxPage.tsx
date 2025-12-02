import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { InboxOutlined, CalendarOutlined, LoadingOutlined, FilterOutlined, CloseOutlined } from '@ant-design/icons';
import { Pagination, Empty, Select, DatePicker } from 'antd';
import '../../CSS/Inbox.css';
import api from '../../apis/AxiosInstance';
import LetterModal from '../../components/modal/LetterModal';
import type { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../hooks/useNotifications';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface UserInfo {
    id: string;
    username: string;
    avatar: string;
}

interface LetterReceived {
    id: string;
    content: string;
    mood: string;
    isRead: boolean;
    sender: UserInfo;
    receiver: UserInfo;
    matchId: string;
    createdAt: string;
    updatedAt: string;
}

interface SenderOption {
    id: string;
    username: string;
}

const PAGE_SIZE = 10;

const moodEmoji: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    neutral: '😐',
};

const moodColors: Record<string, string> = {
    happy: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    sad: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    angry: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
    neutral: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
};

const InboxPage: React.FC = () => {
    const [letters, setLetters] = useState<LetterReceived[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedLetter, setSelectedLetter] = useState<LetterReceived | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [selectedMood, setSelectedMood] = useState<string>('all');
    const [selectedSender, setSelectedSender] = useState<string>('all');
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [allSenders, setAllSenders] = useState<SenderOption[]>([]);

    const { t } = useTranslation();
    const particles = useMemo(
        () =>
            Array.from({ length: 15 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                delay: Math.random() * 5,
            })),
        []
    );

    // Fetch all senders for the dropdown (without filters)
    useEffect(() => {
        fetchAllSenders();
    }, []);

    // Fetch letters when page or filters change
    useEffect(() => {
        fetchLetters(currentPage);
    }, [currentPage, selectedMood, selectedSender, dateRange]);

    const fetchAllSenders = async () => {
        try {
            const { data } = await api.get('/letters/received?page=1&pageSize=1000');
            const uniqueSenders = (data.items || []).reduce((acc: SenderOption[], letter: LetterReceived) => {
                if (!acc.find(s => s.id === letter.sender.id)) {
                    acc.push({
                        id: letter.sender.id,
                        username: letter.sender.username
                    });
                }
                return acc;
            }, []);
            setAllSenders(uniqueSenders);
        } catch (error) {
            console.error('Error fetching senders:', error);
        }
    };

    const fetchLetters = useCallback(async (page: number) => {
        setLoading(true);
        try {
            let url = `/letters/received?page=${page}&pageSize=${PAGE_SIZE}&sortBy=created_at&sortOrder=DESC`;

            // Add filters to URL
            if (selectedMood !== 'all') {
                url += `&mood=${selectedMood}`;
            }

            if (selectedSender !== 'all') {
                url += `&search=${encodeURIComponent(selectedSender)}`;
            }

            if (dateRange && dateRange.length === 2) {
                const startDate = dateRange[0].format('YYYY-MM-DD');
                const endDate = dateRange[1].format('YYYY-MM-DD');
                url += `&startDate=${startDate}&endDate=${endDate}`;
            }

            const { data } = await api.get(url);
            setLetters(data.items || []);
            setTotal(data.total ?? 0);
        } catch (error) {
            console.error('Error fetching letters:', error);
            setLetters([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [selectedMood, selectedSender, dateRange]);

    const getMoodEmoji = (mood: string) => moodEmoji[mood?.toLowerCase()] || '😐';
    const getMoodColor = (mood: string) => moodColors[mood?.toLowerCase()] || moodColors.neutral;

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

    const handleOpenLetter = (letter: LetterReceived) => {
        setSelectedLetter(letter);
        setIsModalOpen(true);
    };
    const handleLetterRead = (letterId: string) => {
        setLetters(prev =>
            prev.map(l =>
                l.id === letterId
                    ? { ...l, isRead: true }
                    : l
            )
        );
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedLetter(null);
        }, 300);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setSelectedMood('all');
        setSelectedSender('all');
        setDateRange(null);
        setCurrentPage(1);
    };

    const hasActiveFilters = selectedMood !== 'all' || selectedSender !== 'all' || dateRange !== null;

    const activeFilterCount =
        (selectedMood !== 'all' ? 1 : 0) +
        (selectedSender !== 'all' ? 1 : 0) +
        (dateRange ? 1 : 0);

    return (
        <>
            <div className="inbox-page">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="inbox-particle"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            animationDelay: `${p.delay}s`,
                        }}
                    >
                        📬
                    </div>
                ))}

                <div className="inbox-container">
                    <div className="inbox-header">
                        <div className="header-content">
                            <div className="header-icon">
                                <InboxOutlined />
                            </div>
                            <div className="header-text">
                                <h1 className="page-title">{t('inbox')}</h1>
                                <p className="page-subtitle">{t('inbox_desc')}</p>
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
                                        <label className="filter-label">{t('sender')}</label>
                                        <Select
                                            value={selectedSender}
                                            onChange={(value) => {
                                                setSelectedSender(value);
                                                setCurrentPage(1);
                                            }}
                                            className="filter-select"
                                            style={{ width: '100%' }}
                                            showSearch
                                            placeholder="Chọn người gửi"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => {
                                                const label = option?.label as string;
                                                return label.toLowerCase().includes(input.toLowerCase());
                                            }}

                                        >
                                            <Option value="all">{t('all')}</Option>
                                            {allSenders.map(sender => (
                                                <Option key={sender.id} value={sender.id}>
                                                    {sender.username}
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

                    {loading && (
                        <div className="loading-container">
                            <LoadingOutlined className="loading-icon" />
                            <p>{t('letter_loading')}</p>
                        </div>
                    )}

                    {!loading && letters.length === 0 && (
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
                    )}

                    {!loading && letters.length > 0 && (
                        <>
                            <div className="letters-grid">
                                {letters.map((letter, index) => (
                                    <div
                                        key={letter.id}
                                        className="envelope-container"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                        onClick={() => handleOpenLetter(letter)}
                                    >
                                        {!letter.isRead && (
                                            <div className="unread-badge">
                                                {t('new') || 'MỚI'}
                                            </div>
                                        )}
                                        <div className="envelope">
                                            <div className="envelope-back" style={{ background: getMoodColor(letter.mood) }} />

                                            <div className="envelope-front">
                                                <div className="envelope-stamp">
                                                    <span className="mood-emoji">{getMoodEmoji(letter.mood)}</span>
                                                </div>

                                                <div className="envelope-info">
                                                    <div className="sender-info-compact">
                                                        <img
                                                            src={letter.sender.avatar}
                                                            alt={letter.sender.username}
                                                            className="sender-avatar-small"
                                                        />
                                                        <div className="sender-text">
                                                            <span className="sender-name-small">{letter.sender.username}</span>
                                                            <span className="letter-date-small">
                                                                <CalendarOutlined /> {formatDate(letter.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="envelope-flap" style={{ background: getMoodColor(letter.mood) }} />

                                            <div className="letter-paper">
                                                <div className="letter-paper-content">
                                                    <p className="letter-preview">
                                                        {letter.content.slice(0, 120)}
                                                        {letter.content.length > 120 && '...'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {total > PAGE_SIZE && (
                                <div className="pagination-container">
                                    <Pagination
                                        current={currentPage}
                                        total={total}
                                        pageSize={PAGE_SIZE}
                                        onChange={handlePageChange}
                                        showSizeChanger={false}
                                        showQuickJumper
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <LetterModal
                letter={selectedLetter}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onLetterRead={handleLetterRead}
            />
        </>
    );
};

export default InboxPage;