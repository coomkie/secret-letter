import React, { useState, useEffect, useContext } from 'react';
import { Badge, Dropdown, MenuProps } from 'antd';
import { MailOutlined, SendOutlined, InboxOutlined, ExclamationCircleFilled, FileSearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import '../../CSS/Header.css';
import viFlag from '../../assets/vi_flag.jpg';
import enFlag from '../../assets/eng_flag.jpg';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '../../types/auth';
import { UserContext } from '../../utils/userContext';
import { useNotifications } from '../../hooks/useNotifications';

type Mood = 'HAPPY' | 'SAD' | 'ANGRY' | 'NEUTRAL';

const Header: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { hasNewLetter, clearNotification } = useNotifications();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentMood] = useState<Mood>('HAPPY');
    const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number }>>([]);

    // Get current language from i18next (single source of truth)
    const getCurrentLanguage = (): 'vi' | 'en' => {
        const i18nextLang = i18n.language || localStorage.getItem('i18nextLng') || 'vi';
        return i18nextLang.startsWith('en') ? 'en' : 'vi';
    };

    const [currentLanguage, setCurrentLanguage] = useState<'vi' | 'en'>(getCurrentLanguage());

    // Initialize component
    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem("token");
        if (token) {
            try {
                jwtDecode<MyJwtPayload>(token);
                setIsAuthenticated(true);
            } catch (err) {
                localStorage.removeItem("token");
                setUser(null);
                setIsAuthenticated(false);
            }
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }

        // Generate particles for animation
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);

        // Sync language state with i18next
        const syncedLang = getCurrentLanguage();
        setCurrentLanguage(syncedLang);

        // Clean up old localStorage key
        localStorage.removeItem('lang');
    }, []);

    // Sync language when i18next changes
    useEffect(() => {
        const syncedLang = getCurrentLanguage();
        setCurrentLanguage(syncedLang);
    }, [i18n.language]);

    // Navigation handlers
    const handleLogin = () => navigate('/auth');
    const handleHomePage = () => navigate('/home');
    const handleSendLetter = () => navigate('/send');
    const handleViewLetterSent = () => navigate('/letter-sent');

    const handleViewInbox = () => {
        clearNotification();
        navigate('/inbox');
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
        navigate("/auth");
    };

    const handleLanguageChange = ({ key }: { key: string }) => {
        const newLang = key as 'vi' | 'en';
        i18n.changeLanguage(newLang);
        setCurrentLanguage(newLang);
        // i18next automatically saves to localStorage as 'i18nextLng'
    };
    const handleHowItWork = () => navigate('/how-it-works');
    // Mood colors configuration
    const moodColors = {
        HAPPY: {
            primary: '#fbbf24',
            gradient: 'linear-gradient(135deg, #ffe671 0%, #ffc864 100%)'
        },
        SAD: {
            primary: '#60a5fa',
            gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
        },
        ANGRY: {
            primary: '#f87171',
            gradient: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'
        },
        NEUTRAL: {
            primary: '#9ca3af',
            gradient: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
        }
    };

    // Menu items
    const userMenuItems: MenuProps['items'] = [
        {
            key: '1',
            label: t('profile'),
            onClick: () => navigate('/profile')
        },
        {
            key: '2',
            label: t('settings'),
            onClick: () => navigate('/setting')
        },
        {
            key: '3',
            label: t('logout'),
            onClick: handleLogout
        }
    ];

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

    return (
        <>
            <style>{`
                .header-container .particle {
                    background: ${moodColors[currentMood].primary};
                }

                .header-container .logo-envelope {
                    background: ${moodColors[currentMood].gradient};
                    box-shadow: 0 0 5px ${moodColors[currentMood].primary}40;
                    animation: glow-${currentMood} 2s ease-in-out infinite;
                }

                @keyframes glow-${currentMood} {
                    0%, 100% { box-shadow: 0 0 5px ${moodColors[currentMood].primary}40; }
                    50% { box-shadow: 0 0 20px ${moodColors[currentMood].primary}80; }
                }

                .header-container .logo-text {
                    background: ${moodColors[currentMood].gradient};
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .header-container .nav-item::before {
                    background: ${moodColors[currentMood].gradient};
                }

                .header-container .nav-item:hover {
                    color: ${moodColors[currentMood].primary};
                }

                .header-container .mood-indicator {
                    background: ${moodColors[currentMood].gradient};
                }

                .header-container .custom-badge .ant-badge-count {
                    background: ${moodColors[currentMood].gradient};
                    box-shadow: 0 2px 8px ${moodColors[currentMood].primary}40;
                }
            `}</style>

            <header className="header-container">
                {/* Animated particles */}
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="particle"
                        style={{
                            left: `${p.left}%`,
                            animationDelay: `${p.delay}s`,
                            top: '50%'
                        }}
                    />
                ))}

                <div className="header-content">
                    {/* Logo Section */}
                    <div className="logo-section">
                        <div
                            className="logo-envelope"
                            onClick={handleHomePage}
                            style={{ cursor: 'pointer' }}
                        >
                            <MailOutlined />
                        </div>
                        <span className="logo-text">Hidden Letter</span>
                    </div>

                    {/* Navigation Section */}
                    <nav className="nav-section">
                        {isAuthenticated && (
                            <>
                                <div className="nav-item" onClick={handleSendLetter}>
                                    <SendOutlined />
                                    <span>{t('send_letter')}</span>
                                </div>

                                <div
                                    className="nav-item"
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                                    onClick={handleViewInbox}
                                >
                                    <Badge
                                        count={hasNewLetter ? <ExclamationCircleFilled className='warning-icon' /> : 0}
                                        className="custom-badge"
                                    >
                                        <MailOutlined style={{ fontSize: '18px' }} />
                                    </Badge>
                                    <span>{t('inbox')}</span>
                                </div>

                                <div
                                    className="nav-item"
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                                    onClick={handleViewLetterSent}
                                >
                                    <Badge className="custom-badge">
                                        <InboxOutlined style={{ fontSize: '18px' }} />
                                    </Badge>
                                    <span>{t('sent')}</span>
                                </div>
                                <div
                                    className="nav-item"
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                                    onClick={handleHowItWork}
                                >
                                    <Badge className="custom-badge">
                                        <FileSearchOutlined style={{ fontSize: '18px' }} />
                                    </Badge>
                                    <span>{t('works')}</span>
                                </div>
                            </>
                        )}
                    </nav>

                    {/* User Section */}
                    <div className="user-section">
                        {isAuthenticated && user ? (
                            <>
                                <Dropdown
                                    menu={{
                                        items: userMenuItems,
                                        rootClassName: "language-dropdown-menu"
                                    }}
                                    placement="bottom"
                                >
                                    <div className="avatar-wrapper" style={{ cursor: 'pointer' }}>
                                        <img
                                            className="user-avatar"
                                            src={user.avatar}
                                            alt={user.username}
                                        />
                                        <span
                                            className="avatar-status"
                                            style={{ background: 'rgb(42 232 47)' }}
                                        />
                                    </div>
                                </Dropdown>
                                <div style={{ fontSize: '14px' }}>{user.username}</div>
                            </>
                        ) : (
                            <div className="auth-buttons">
                                <button className="login-btn" onClick={handleLogin}>
                                    {t('login')}
                                </button>
                                <button className="register-btn" onClick={handleLogin}>
                                    {t('register')}
                                </button>
                            </div>
                        )}

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
                </div>

                <div className="mood-indicator" />
            </header>
        </>
    );
};

export default Header;