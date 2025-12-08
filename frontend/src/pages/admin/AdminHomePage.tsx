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
import { Dropdown, MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import viFlag from '../../assets/vi_flag.jpg';
import enFlag from '../../assets/eng_flag.jpg';

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
    reported: string;
    originalContent: string;
    reason: string;
    reportDate: string;
    status: string;
}

const AdminHomePage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Fetch statistics from backend
    useEffect(() => {
        fetchStatistics();
    }, []);
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
            console.error('Error fetching statistics:', err);
        } finally {
            setLoading(false);
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
        { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: 'users', icon: <UserOutlined />, label: 'Quản lý User' },
        { key: 'letters', icon: <MailOutlined />, label: 'Quản lý Letter' },
        { key: 'reports', icon: <WarningOutlined />, label: 'Báo cáo' },
        { key: 'analytics', icon: <BarChartOutlined />, label: 'Thống kê' },
        { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt' },
    ];

    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-container-2">
                    <LoadingOutlined className="loading-icon" />
                    <p>Đang tải dữ liệu...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-container">
                    <WarningOutlined className="error-icon" />
                    <h3>{t('error_500')}</h3>
                    <button className="retry-btn" onClick={fetchStatistics}>
                        Thử lại
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
                                    <p>Tổng số Users</p>
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
                                    <p>Tổng số Letters</p>
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
                                    <p>Báo cáo đang xử lý</p>
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
                                    <p>Đã xử lý tháng này</p>
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
                                    <h3>Users mới đăng ký</h3>
                                    <button className="view-all-btn">Xem tất cả</button>
                                </div>
                                <div className="user-list">
                                    {newUsers.length === 0 ? (
                                        <div className="empty-state">Không có user mới</div>
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
                                                    {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="activity-card">
                                <div className="card-header">
                                    <h3>Letters gần đây</h3>
                                    <button className="view-all-btn">Xem tất cả</button>
                                </div>
                                <div className="letter-list">
                                    {newLetters.length === 0 ? (
                                        <div className="empty-state">Không có letter mới</div>
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
                                                    {letter.status === 'delivered' ? 'Đã gửi' :
                                                        letter.status === 'pending' ? 'Chờ xử lý' : 'Bị báo cáo'}
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
                                <h3>Báo cáo cần xử lý</h3>
                                <button className="view-all-btn">Xem tất cả</button>
                            </div>
                            {reports.length === 0 ? (
                                <div className="empty-state">Không có báo cáo nào</div>
                            ) : (
                                <div className="reports-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Người bị báo cáo</th>
                                                <th style={{ width: '260px' }}>Nội dung gốc</th>
                                                <th>Lý do</th>
                                                <th>Thời gian</th>
                                                <th>Trạng thái</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reports.map((report, index) => (
                                                <tr key={index}>
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
                                                            {report.status === 'pending' ? 'Chờ xử lý' :
                                                                report.status === 'reviewing' ? 'Đang xem xét' :
                                                                    'Đã xử lý'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button className="action-btn view" title="Xem chi tiết">
                                                                <EyeOutlined />
                                                            </button>
                                                            <button className="action-btn approve" title="Chấp nhận">
                                                                <CheckCircleOutlined />
                                                            </button>
                                                            <button className="action-btn reject" title="Từ chối">
                                                                <CloseCircleOutlined />
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

            case 'users':
                return (
                    <div className="management-content">
                        <div className="page-header">
                            <h2>Quản lý Users</h2>
                            <div className="header-actions">
                                <div className="search-box">
                                    <SearchOutlined />
                                    <input type="text" placeholder="Tìm kiếm users..." />
                                </div>
                                <button className="primary-btn">Thêm User</button>
                            </div>
                        </div>
                        <div className="content-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên</th>
                                        <th>Email</th>
                                        <th>Ngày tham gia</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newUsers.map((user, index) => (
                                        <tr key={index}>
                                            <td>#{index + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.joinDate || 'N/A'}</td>
                                            <td>
                                                <span className={`status-badge ${user.status}`}>
                                                    {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
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
                                        <tr key={index}>
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
                                                    {report.status === 'pending' ? 'Chờ xử lý' :
                                                        report.status === 'reviewing' ? 'Đang xem xét' :
                                                            'Đã xử lý'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="action-btn view"><EyeOutlined /></button>
                                                    <button className="action-btn approve"><CheckCircleOutlined /></button>
                                                    <button className="action-btn reject"><CloseCircleOutlined /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            default:
                return <div className="coming-soon">Tính năng đang phát triển...</div>;
        }
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
                        {!sidebarCollapsed && <span className="menu-label">Đăng xuất</span>}
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