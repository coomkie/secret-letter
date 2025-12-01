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
            console.error('Error fetching profile:', error);
            message.error('Không thể tải thông tin người dùng');
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('vi-VN', {
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
            message.success("Cập nhật thông tin thành công!");
            setIsEditing(false);

        } catch (error) {
            console.error("Error updating profile:", error);
            message.error("Cập nhật thất bại");
        }
    };

    if (loading) return <div className="profile-page"><div className="loading-spinner"><div className="spinner"></div><p>Đang tải thông tin...</p></div></div>;
    if (!profile) return <div className="profile-page"><div className="error-message">Không thể tải thông tin người dùng</div></div>;

    const stats = [
        { icon: <MailOutlined />, label: 'Thư đã viết', value: profile.letters, color: '#fbbf24', gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
        { icon: <MailOutlined />, label: 'Thư đã nhận', value: profile.receivedMatches, color: '#60a5fa', gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' },
        { icon: <UsergroupAddOutlined />, label: 'Đã kết nối', value: profile.sentMatches, suffix: ' người', color: '#f87171', gradient: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)' }
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
                                    {profile.isAdmin ? 'Quản trị viên' : 'Thành viên'}
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
                        <h2 className="card-title"><UserOutlined /> Thông tin cá nhân</h2>
                        {!isEditing ? (
                            <button className="edit-btn" onClick={handleEdit}><EditOutlined /> Chỉnh sửa</button>
                        ) : (
                            <div className="edit-actions">
                                <button className="save-btn" onClick={handleSave}><SaveOutlined /> Lưu</button>
                                <button className="cancel-btn" onClick={handleCancel}><CloseOutlined /> Hủy</button>
                            </div>
                        )}
                    </div>

                    <div className="card-body">
                        <div className="info-row">
                            <label className="info-label">Tên người dùng</label>
                            {isEditing ? (
                                <input type="text" className="info-input" value={editedUsername} onChange={e => setEditedUsername(e.target.value)} />
                            ) : <span className="info-value">{profile.username}</span>}
                        </div>

                        <div className="info-row">
                            <label className="info-label">Email</label>
                            <span className="info-value readonly">{profile.email}<span className="readonly-badge">Chỉ đọc</span></span>
                        </div>

                        <div className="info-row">
                            <label className="info-label">Giới tính</label>
                            {isEditing ? (
                                <div className="gender-selector">
                                    <button className={`gender-btn ${editedGender ? 'active' : ''}`} onClick={() => setEditedGender(true)}><ManOutlined /> Nam</button>
                                    <button className={`gender-btn ${!editedGender ? 'active' : ''}`} onClick={() => setEditedGender(false)}><WomanOutlined /> Nữ</button>
                                </div>
                            ) : (
                                <span className="info-value">
                                    {profile.gender
                                        ? <span className="gender-badge male"><ManOutlined /> Nam</span>
                                        : <span className="gender-badge female"><WomanOutlined /> Nữ</span>}
                                </span>
                            )}
                        </div>

                        <div className="info-row">
                            <label className="info-label">Ngày tham gia</label>
                            <span className="info-value"><CalendarOutlined /> {formatDate(profile.created_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="profile-activity-card">
                    <h2 className="card-title"><MailOutlined /> Hoạt động gần đây</h2>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h4>Tham gia Secret Letter</h4>
                                <p>{formatDate(profile.created_at)}</p>
                            </div>
                        </div>
                        <div className="timeline-item">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
