import React, { useState, useEffect, useContext } from 'react';
import {
    MailOutlined, UserOutlined, CalendarOutlined,
    EditOutlined, SaveOutlined, CloseOutlined,
    ManOutlined, WomanOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import { message } from 'antd';
import '../../CSS/Profile.css';
import api from '../../apis/AxiosInstance';
import { UserContext } from '../../utils/userContext';
import { useTranslation } from 'react-i18next';

interface UserProfile {
    id: string;
    username: string;
    email: string;
    gender: boolean;
    avatar: string;
    letters: number;
    sentMatches: number;
    receivedMatches: number;
    created_at: string;
    setting: any;
    isAdmin: boolean;
}

const ProfilePage = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUsername, setEditedUsername] = useState('');
    const [editedGender, setEditedGender] = useState(true);
    const [particles, setParticles] = useState<{ id: number, x: number, y: number, delay: number }[]>([]);
    const { reloadUser } = useContext(UserContext);
    const { t } = useTranslation();
    useEffect(() => {
        // Tạo particle animation
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);

        // Load profile
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('auth/me');
            setProfile(response.data);

            // Khởi tạo giá trị edit
            setEditedUsername(response.data.username);
            setEditedGender(response.data.gender);

            setLoading(false);
        } catch (error) {
            message.error(t('profile_1'));
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString(t('lang'), {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        if (profile) {
            setEditedUsername(profile.username);
            setEditedGender(profile.gender);
        }
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            if (!profile) return;

            const body = {
                username: editedUsername,
                gender: editedGender,
            };

            const res = await api.patch(`/users/${profile.id}`, body);
            setProfile(res.data);
            await reloadUser();
            message.success(t('profile_2'));
            setIsEditing(false);

        } catch (error) {
            message.error(t('profile_3'));
        }
    };

    if (loading) return <div className="profile-page"><div className="loading-spinner"><div className="spinner"></div><p>{t('profile_4')}</p></div></div>;
    if (!profile) return <div className="profile-page"><div className="error-message">{t('profile_5')}</div></div>;

    const stats = [
        { icon: <MailOutlined />, label: t('profile_6'), value: profile.letters, color: '#fbbf24', gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
        { icon: <MailOutlined />, label: t('profile_7'), value: profile.receivedMatches, color: '#60a5fa', gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' },
        { icon: <UsergroupAddOutlined />, label: t('profile_8'), value: profile.sentMatches, suffix: t('profile_9'), color: '#f87171', gradient: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)' }
    ];

    return (
        <div className="profile-page">
            {particles.map(p => (
                <div key={p.id} className="profile-particle" style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.delay}s` }}>✉️</div>
            ))}

            <div className="profile-container">
                {/* Header Card */}
                <div className="profile-header-card">
                    <div className="profile-cover"><div className="cover-gradient"></div></div>
                    <div className="profile-avatar-section">
                        <div className="avatar-wrapper-profile">
                            <img
                                src={profile.avatar}
                                alt="Avatar"
                                className="profile-avatar"
                            />
                            <div className="avatar-status-profile"></div>
                        </div>

                        <div className="profile-info-header">
                            <h1 className="profile-name">{profile.username}</h1>
                            <p className="profile-email">{profile.email}</p>
                            <div className="profile-badge">
                                <span className={`badge ${profile.isAdmin ? 'admin-badge' : 'member-badge'}`}>
                                    {profile.isAdmin ? t('profile_10') : t('profile_11')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="profile-stats-grid">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="stat-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                            <div className="stat-content">
                                <div className="stat-value" >
                                    {stat.value}{stat.suffix || ''}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                            <div className="stat-glow" style={{ background: stat.gradient }}></div>
                        </div>
                    ))}
                </div>

                {/* Information Card */}
                <div className="profile-info-card">
                    <div className="card-header">
                        <h2 className="card-title"><UserOutlined />{t('profile_12')}</h2>
                        {!isEditing ? (
                            <button className="edit-btn" onClick={handleEdit}><EditOutlined />{t('profile_13')}</button>
                        ) : (
                            <div className="edit-actions">
                                <button className="save-btn" onClick={handleSave}><SaveOutlined />{t('profile_14')}</button>
                                <button className="cancel-btn" onClick={handleCancel}><CloseOutlined />{t('profile_15')}</button>
                            </div>
                        )}
                    </div>

                    <div className="card-body">
                        <div className="info-row">
                            <label className="info-label">{t('profile_16')}</label>
                            {isEditing ? (
                                <input type="text" className="info-input" value={editedUsername} onChange={e => setEditedUsername(e.target.value)} />
                            ) : <span className="info-value">{profile.username}</span>}
                        </div>

                        <div className="info-row">
                            <label className="info-label">Email</label>
                            <span className="info-value readonly">{profile.email}<span className="readonly-badge">{t('profile_17')}</span></span>
                        </div>

                        <div className="info-row">
                            <label className="info-label">{t('profile_18')}</label>
                            {isEditing ? (
                                <div className="gender-selector">
                                    <button className={`gender-btn ${editedGender ? 'active' : ''}`} onClick={() => setEditedGender(true)}><ManOutlined /> {t('male')}</button>
                                    <button className={`gender-btn ${!editedGender ? 'active' : ''}`} onClick={() => setEditedGender(false)}><WomanOutlined /> {t('female')}</button>
                                </div>
                            ) : (
                                <span className="info-value">
                                    {profile.gender
                                        ? <span className="gender-badge male"><ManOutlined /> {t('male')}</span>
                                        : <span className="gender-badge female"><WomanOutlined /> {t('female')}</span>}
                                </span>
                            )}
                        </div>

                        <div className="info-row">
                            <label className="info-label">{t('profile_19')}</label>
                            <span className="info-value"><CalendarOutlined /> {formatDate(profile.created_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="profile-activity-card">
                    <h2 className="card-title"><MailOutlined />{t('profile_20')}</h2>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h4>{t('profile_21')}</h4>
                                <p>{formatDate(profile.created_at)}</p>
                            </div>
                        </div>
                        {/* <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h4>Đã gửi {profile.sentMatches} thư</h4>
                                <p>Kết nối với {profile.sentMatches} người</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h4>Đã nhận {profile.receivedMatches} thư</h4>
                                <p>Từ những tâm hồn đồng điệu</p>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
