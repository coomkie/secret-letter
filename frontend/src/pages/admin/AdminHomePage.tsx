import React, { useState, useEffect } from 'react';
import {
    UserOutlined,
    MailOutlined,
    WarningOutlined,
    DashboardOutlined,
    BarChartOutlined,
    SettingOutlined,
    LogoutOutlined,
    SearchOutlined,
    BellOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    EyeOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ToolFilled,
    LoadingOutlined
} from '@ant-design/icons';
import '../../CSS/AdminHome.css';
import api from '../../apis/AxiosInstance';
import { Dropdown, MenuProps, message } from 'antd';
import { useTranslation } from 'react-i18next';
import viFlag from '../../assets/vi_flag.jpg';
import enFlag from '../../assets/eng_flag.jpg';
import { useNavigate } from 'react-router-dom';
interface Stats {
    totalUsers: number;
    growRateUsers: number;
    totalLetters: number;
    growRateLetters: number;
    totalReportsNotSolved: number;
    growRateReportsNotSolved: number;
    totalReportsSolved: number;
    growRateReportsSolved: number;
}

interface User {
    name: string;
    email: string;
    status: string;
    joinDate?: string;
}

interface Letter {
    from: string;
    to: string;
    status: string;
    date: string;
}
interface Report {
    id: string;
    reported: string;
    originalContent: string;
    reason: string;
    reportDate: string;
    status: string;
    _loading?: boolean;
}


const AdminHomePage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // USERS STATE
    const [users, setUsers] = useState<any[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);

    const [userPage, setUserPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalUserPages, setTotalUserPages] = useState(1);

    const [userSearch, setUserSearch] = useState('');
    const [userStatus, setUserStatus] = useState('');
    const [userSort, setUserSort] = useState('created_at-DESC');
    const navigate = useNavigate();
    // State for statistics data
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        growRateUsers: 0,
        totalLetters: 0,
        growRateLetters: 0,
        totalReportsNotSolved: 0,
        growRateReportsNotSolved: 0,
        totalReportsSolved: 0,
        growRateReportsSolved: 0
    });

    const [newUsers, setNewUsers] = useState<User[]>([]);
    const [newLetters, setNewLetters] = useState<Letter[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const { t, i18n } = useTranslation();
    const getCurrentLanguage = (): 'vi' | 'en' => {
        const i18nextLang = i18n.language || localStorage.getItem('i18nextLng') || 'vi';
        return i18nextLang.startsWith('en') ? 'en' : 'vi';
    };

    const [currentLanguage, setCurrentLanguage] = useState<'vi' | 'en'>(getCurrentLanguage());
    const languageMenuItems: MenuProps['items'] = [
        {
            key: 'vi',
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={viFlag} alt="Vietnam" style={{ width: 20, height: 14 }} />
                    <span>Tiếng Việt</span>
                </div>
            )
        },
        {
            key: 'en',
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={enFlag} alt="English" style={{ width: 20, height: 14 }} />
                    <span>English</span>
                </div>
            )
        }
    ];

    const handleLanguageChange = ({ key }: { key: string }) => {
        const newLang = key as 'vi' | 'en';
        i18n.changeLanguage(newLang);
        setCurrentLanguage(newLang);
        // i18next automatically saves to localStorage as 'i18nextLng'
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };
    // Fetch statistics from backend
    useEffect(() => {
        fetchStatistics();
    }, []);
    useEffect(() => {
        fetchUsers();
    }, [userPage, userSearch, userStatus, userSort]);

    useEffect(() => {
        const syncedLang = getCurrentLanguage();
        setCurrentLanguage(syncedLang);
    }, [i18n.language]);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/statistics');
            const data = response.data;

            setStats({
                totalUsers: data.totalUsers,
                growRateUsers: data.growRateUsers,
                totalLetters: data.totalLetters,
                growRateLetters: data.growRateLetters,
                totalReportsNotSolved: data.totalReportsNotSolved,
                growRateReportsNotSolved: data.growRateReportsNotSolved,
                totalReportsSolved: data.totalReportsSolved,
                growRateReportsSolved: data.growRateReportsSolved
            });

            setNewUsers(data.newUsers || []);
            setNewLetters(data.newLetters || []);
            setReports(data.reports || []);
        } catch (err: any) {
            setError(err.message || 'Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };
    const fetchUsers = async () => {
        try {
            setUsersLoading(true);

            const [sortBy, sortOrder] = userSort.split("-");

            const res = await api.get("/users", {
                params: {
                    page: userPage,
                    pageSize,
                    search: userSearch,
                    sortBy,
                    sortOrder
                }
            });

            setUsers(res.data.items || []);
            setTotalUserPages(res.data.meta.totalPages);
        } catch (e) {
            console.error(e);
        } finally {
            setUsersLoading(false);
        }
    };
    const deleteUser = async (id: string) => {
        if (!window.confirm(t('sure_to_delete_user'))) return;

        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (e) {
            console.error(e);
            message.error(t('delete_failed'));
        }
    };

    const updateReportStatus = async (reportId: string) => {
        try {
            // Tạm set loading
            setReports(prev =>
                prev.map(r => r.id === reportId ? { ...r, _loading: true } : r)
            );

            const res = await api.patch(`/reports/${reportId}`);
            setReports(prev =>
                prev.map(r =>
                    r.id === reportId
                        ? {
                            ...r,
                            status:
                                r.status === "pending"
                                    ? "reviewing"
                                    : "pending",
                            _loading: false
                        }
                        : r
                )
            );
        } catch (error) {
            message.error(t('update_failed'));
            setReports(prev =>
                prev.map(r => (r.id === reportId ? { ...r, _loading: false } : r))
            );
        }
    };
    const formatGrowthRate = (rate: number) => {
        const sign = rate >= 0 ? '+' : '';
        return `${sign}${rate}%`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const menuItems = [
        { key: 'dashboard', icon: <DashboardOutlined />, label: t('dashboard') },
        { key: 'users', icon: <UserOutlined />, label: t('user_manage') },
        { key: 'letters', icon: <MailOutlined />, label: t('letter_manage') },
        { key: 'reports', icon: <WarningOutlined />, label: t('report_manage') },
        { key: 'analytics', icon: <BarChartOutlined />, label: t('stat_manage') },
        { key: 'settings', icon: <SettingOutlined />, label: t('setting') },
    ];

    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-container-2">
                    <LoadingOutlined className="loading-icon" />
                    <p>{t('loading_data')}</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-container">
                    <WarningOutlined className="error-icon" />
                    <h3>{t('error_500')}</h3>
                    <button className="retry-btn" onClick={fetchStatistics}>
                        {t('try_again')}
                    </button>
                </div>
            );
        }

        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="dashboard-content">
                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card stat-users">
                                <div className="stat-icon">
                                    <UserOutlined />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.totalUsers.toLocaleString()}</h3>
                                    <p>{t('total_user')}</p>
                                    <span className={`stat-change ${stats.growRateUsers >= 0 ? 'positive' : 'negative'}`}>
                                        {formatGrowthRate(stats.growRateUsers)}
                                    </span>
                                </div>
                            </div>

                            <div className="stat-card stat-letters">
                                <div className="stat-icon">
                                    <MailOutlined />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.totalLetters.toLocaleString()}</h3>
                                    <p>{t('total_letter')}</p>
                                    <span className={`stat-change ${stats.growRateLetters >= 0 ? 'positive' : 'negative'}`}>
                                        {formatGrowthRate(stats.growRateLetters)}
                                    </span>
                                </div>
                            </div>

                            <div className="stat-card stat-reports">
                                <div className="stat-icon">
                                    <WarningOutlined />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.totalReportsNotSolved}</h3>
                                    <p>{t('total_report')}</p>
                                    <span className={`stat-change ${stats.growRateReportsNotSolved >= 0 ? 'negative' : 'positive'}`}>
                                        {formatGrowthRate(stats.growRateReportsNotSolved)}
                                    </span>
                                </div>
                            </div>

                            <div className="stat-card stat-resolved">
                                <div className="stat-icon">
                                    <CheckCircleOutlined />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.totalReportsSolved}</h3>
                                    <p>{t('report_solved')}</p>
                                    <span className={`stat-change ${stats.growRateReportsSolved >= 0 ? 'positive' : 'negative'}`}>
                                        {formatGrowthRate(stats.growRateReportsSolved)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="activity-grid">
                            <div className="activity-card">
                                <div className="card-header">
                                    <h3>{t('user_new')}</h3>
                                    <button className="view-all-btn">{t('view_all')}</button>
                                </div>
                                <div className="user-list">
                                    {newUsers.length === 0 ? (
                                        <div className="empty-state">{t('no_new_user')}</div>
                                    ) : (
                                        newUsers.map((user, index) => (
                                            <div key={index} className="user-item">
                                                <div className="user-avatar">
                                                    <UserOutlined />
                                                </div>
                                                <div className="user-details">
                                                    <h4>{user.name}</h4>
                                                    <p>{user.email}</p>
                                                </div>
                                                <span className={`status-badge ${user.status}`}>
                                                    {user.status === 'active' ? t('user_active') : t('user_suspened')}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="activity-card">
                                <div className="card-header">
                                    <h3>{t('new_letter')}</h3>
                                    <button className="view-all-btn">{t('view_all')}</button>
                                </div>
                                <div className="letter-list">
                                    {newLetters.length === 0 ? (
                                        <div className="empty-state">{t('no_new_letter')}</div>
                                    ) : (
                                        newLetters.map((letter, index) => (
                                            <div key={index} className="letter-item">
                                                <div className="letter-icon">
                                                    <MailOutlined />
                                                </div>
                                                <div className="letter-details">
                                                    <h4>{letter.from} → {letter.to}</h4>
                                                    <p>{formatDate(letter.date)}</p>
                                                </div>
                                                <span className={`status-badge ${letter.status}`}>
                                                    {letter.status === 'delivered' ? t('letter_sent') :
                                                        letter.status === 'pending' ? t('letter_wait') : t('letter_reported')}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reports Section */}
                        <div className="reports-section">
                            <div className="card-header">
                                <h3>{t('report_need_to_solve')}</h3>
                                <button className="view-all-btn">{t('view_all')}</button>
                            </div>
                            {reports.length === 0 ? (
                                <div className="empty-state">{t('no_report')}</div>
                            ) : (
                                <div className="reports-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '260px' }}>{t('original_content')}</th>
                                                <th>{t('reason')}</th>
                                                <th>{t('date')}</th>
                                                <th>{t('status')}</th>
                                                <th>{t('action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reports.map((report, index) => (
                                                <tr key={report.id}>
                                                    <td>{report.originalContent}</td>

                                                    <td>
                                                        <div className="content-cell">
                                                            {report.reason}
                                                        </div>
                                                    </td>

                                                    <td>{formatDate(report.reportDate)}</td>

                                                    <td>
                                                        <span className={`status-badge ${report.status}`}>
                                                            {report.status === 'pending'
                                                                ? 'Chờ xử lý'
                                                                : report.status === 'reviewing'
                                                                    ? t('review')
                                                                    : t('solved')}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="action-buttons">
                                                            <button className="action-btn view"><EyeOutlined /></button>

                                                            <button
                                                                className="action-btn approve"
                                                                disabled={report._loading}
                                                                onClick={() => updateReportStatus(report.id)}
                                                            >
                                                                {report._loading
                                                                    ? <LoadingOutlined />
                                                                    : <CheckCircleOutlined />}
                                                            </button>

                                                            <button
                                                                className="action-btn reject"
                                                                disabled={report._loading}
                                                                onClick={() => updateReportStatus(report.id)}
                                                            >
                                                                {report._loading
                                                                    ? <LoadingOutlined />
                                                                    : <CloseCircleOutlined />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                );

            /** ======================= USERS MANAGEMENT ======================= */
            case 'users':
                return (
                    <div className="management-content">
                        <div className="page-header">
                            <h2>{t('user_manage_1')}</h2>

                            {/* FILTER BLOCK */}
                            <div className="header-actions">
                                {/* SEARCH */}
                                <div className="search-box">
                                    <SearchOutlined />
                                    <input
                                        type="text"
                                        placeholder={t('user_manage_2')}
                                        value={userSearch}
                                        onChange={(e) => {
                                            setUserSearch(e.target.value);
                                            setUserPage(1);
                                        }}
                                    />
                                </div>

                                {/* FILTER STATUS */}
                                <select
                                    value={userStatus}
                                    onChange={(e) => {
                                        setUserStatus(e.target.value);
                                        setUserPage(1);
                                    }}
                                    className="filter-select"
                                >
                                    <option value="">{t('user_manage_3')}</option>
                                    <option value="active">{t('user_manage_4')}</option>
                                    <option value="banned">{t('user_manage_5')}</option>
                                </select>

                                {/* SORT */}
                                <select
                                    value={userSort}
                                    onChange={(e) => {
                                        setUserSort(e.target.value as any);
                                        setUserPage(1);
                                    }}
                                    className="filter-select"
                                >
                                    <option value="created_at-DESC">{t('user_manage_6')}</option>
                                    <option value="created_at-ASC">{t('user_manage_7')}</option>
                                    <option value="username-ASC">{t('user_manage_8')}</option>
                                    <option value="username-DESC">{t('user_manage_9')}</option>
                                </select>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="content-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t('user_manage_10')}</th>
                                        <th>{t('user_manage_11')}</th>
                                        <th>{t('user_manage_12')}</th>
                                        <th>{t('user_manage_13')}r</th>
                                        <th>{t('user_manage_14')}</th>
                                        <th>{t('user_manage_15')}</th>
                                        <th>{t('user_manage_16')}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {usersLoading ? (
                                        <tr>
                                            <td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>
                                                <LoadingOutlined style={{ fontSize: 24 }} />
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="empty-state">
                                                {t('user_manage_17')}
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((u, i) => (
                                            <tr key={u.id}>
                                                <td>{u.id.slice(0, 8)}...</td>

                                                <td>{u.username}</td>

                                                <td>{u.email}</td>

                                                <td>
                                                    <img
                                                        src={u.avatar}
                                                        alt=""
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: '50%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </td>

                                                <td>{formatDate(u.created_at)}</td>

                                                <td>
                                                    <span className={`status-badge ${u.isAdmin ? "admin" : "active"}`}>
                                                        {u.isAdmin ? "Admin" : t('user_manage_4')}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="action-btn view">
                                                            <EyeOutlined />
                                                        </button>

                                                        <button
                                                            className="action-btn delete"
                                                            onClick={() => deleteUser(u.id)}
                                                        >
                                                            <DeleteOutlined />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="pagination">
                            <button
                                disabled={userPage === 1}
                                onClick={() => setUserPage(userPage - 1)}
                            >
                                ←
                            </button>

                            <span>{t('user_manage_18')} {userPage} / {totalUserPages}</span>

                            <button
                                disabled={userPage === totalUserPages}
                                onClick={() => setUserPage(userPage + 1)}
                            >
                                →
                            </button>
                        </div>
                    </div>
                );


            case 'letters':
                return (
                    <div className="management-content">
                        <div className="page-header">
                            <h2>Quản lý Letters</h2>
                            <div className="header-actions">
                                <div className="search-box">
                                    <SearchOutlined />
                                    <input type="text" placeholder="Tìm kiếm letters..." />
                                </div>
                            </div>
                        </div>
                        <div className="content-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Từ</th>
                                        <th>Đến</th>
                                        <th>Thời gian</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newLetters.map((letter, index) => (
                                        <tr key={index}>
                                            <td>#{index + 1}</td>
                                            <td>{letter.from}</td>
                                            <td>{letter.to}</td>
                                            <td>{formatDate(letter.date)}</td>
                                            <td>
                                                <span className={`status-badge ${letter.status}`}>
                                                    {letter.status === 'delivered' ? 'Đã gửi' :
                                                        letter.status === 'pending' ? 'Chờ xử lý' : 'Bị báo cáo'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="action-btn view"><EyeOutlined /></button>
                                                    <button className="action-btn delete"><DeleteOutlined /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'reports':
                return (
                    <div className="management-content">
                        <div className="page-header">
                            <h2>Quản lý Báo cáo</h2>
                            <div className="header-actions">
                                <div className="search-box">
                                    <SearchOutlined />
                                    <input type="text" placeholder="Tìm kiếm báo cáo..." />
                                </div>
                            </div>
                        </div>

                        <div className="content-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Người bị báo cáo</th>
                                        <th>Nội dung gốc</th>
                                        <th>Lý do</th>
                                        <th>Thời gian</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report, index) => (
                                        <tr key={report.id}>
                                            <td>#{index + 1}</td>
                                            <td>{report.reported}</td>

                                            <td>
                                                <div className="content-cell">
                                                    {report.originalContent}
                                                </div>
                                            </td>

                                            <td>{report.reason}</td>
                                            <td>{formatDate(report.reportDate)}</td>

                                            <td>
                                                <span className={`status-badge ${report.status}`}>
                                                    {report.status === 'pending'
                                                        ? 'Chờ xử lý'
                                                        : report.status === 'reviewing'
                                                            ? 'Đang xem xét'
                                                            : 'Đã xử lý'}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="action-buttons">
                                                    <button className="action-btn view"><EyeOutlined /></button>

                                                    <button
                                                        className="action-btn approve"
                                                        disabled={report._loading}
                                                        onClick={() => updateReportStatus(report.id)}
                                                    >
                                                        {report._loading
                                                            ? <LoadingOutlined />
                                                            : <CheckCircleOutlined />}
                                                    </button>

                                                    <button
                                                        className="action-btn reject"
                                                        disabled={report._loading}
                                                        onClick={() => updateReportStatus(report.id)}
                                                    >
                                                        {report._loading
                                                            ? <LoadingOutlined />
                                                            : <CloseCircleOutlined />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

        };
    };
    return (
        <div className="admin-page">
            {/* Sidebar */}
            <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <ToolFilled />
                        {!sidebarCollapsed && <span>Admin</span>}
                    </div>
                </div>

                <nav className="sidebar-menu">
                    {menuItems.map(item => (
                        <div
                            key={item.key}
                            className={`menu-item ${activeTab === item.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.key)}
                        >
                            <span className="menu-icon">{item.icon}</span>
                            {!sidebarCollapsed && <span className="menu-label">{item.label}</span>}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="menu-item logout">
                        <span className="menu-icon"><LogoutOutlined /></span>
                        {!sidebarCollapsed && <span className="menu-label" onClick={handleLogout}>{t('logout')}</span>}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="admin-main">
                {/* Top Header */}
                <header className="admin-header">
                    <button
                        className="toggle-sidebar-btn"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                        {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </button>

                    <div className="header-right">
                        <button className="notification-btn">
                            <BellOutlined />
                            {stats.totalReportsNotSolved > 0 && (
                                <span className="notification-badge">
                                    {stats.totalReportsNotSolved}
                                </span>
                            )}
                        </button>
                        {/* Language Selector */}
                        <Dropdown
                            menu={{
                                items: languageMenuItems,
                                onClick: handleLanguageChange,
                                selectedKeys: [currentLanguage],
                                rootClassName: "language-dropdown-menu"
                            }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <div
                                className="language-selector"
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    marginLeft: '12px'
                                }}
                            >
                                <img
                                    src={currentLanguage === 'vi' ? viFlag : enFlag}
                                    style={{ width: 24, height: 16 }}
                                    alt={currentLanguage === 'vi' ? 'Vietnam' : 'English'}
                                />
                                <span>{currentLanguage.toUpperCase()}</span>
                            </div>
                        </Dropdown>
                    </div>
                </header>

                {/* Content Area */}
                <div className="admin-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};
export default AdminHomePage;