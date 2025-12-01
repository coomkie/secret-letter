import React, { useState, useEffect, useContext } from 'react';
import { Badge, Dropdown, Avatar, MenuProps } from 'antd';
import { MailOutlined, SendOutlined, InboxOutlined, UserOutlined, GlobalOutlined, SolutionOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import '../../CSS/Header.css';
import viFlag from '../../assets/vi_flag.jpg';
import enFlag from '../../assets/eng_flag.jpg';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '../../types/auth';
import { UserContext } from '../../utils/userContext';
type Mood = 'HAPPY' | 'SAD' | 'ANGRY' | 'NEUTRAL';

const Header: React.FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentMood, setCurrentMood] = useState<Mood>('HAPPY');
    const [unreadCount, setUnreadCount] = useState(2);
    const savedLang = localStorage.getItem('lang') as 'vi' | 'en' | null;
    const [currentLanguage, setCurrentLanguage] = useState<'vi' | 'en'>(savedLang || 'vi');
    const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number }>>([]);
    const { user, reloadUser } = useContext(UserContext);

    const handleLogin = () => {
        navigate('/auth');
    }
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };
    const handleHomePage = () => {
        navigate('/home');
    }
    const handleSendLetter = () => {
        navigate('/send');
    }
    const handleViewLetterSent = () => {
        navigate('/letter-sent');
    }
    const handleViewInbox = () => {
        navigate('/inbox');
    }
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode<MyJwtPayload>(token);
            } catch (err) {
                console.log("Invalid token", err);
            }
        }
        setIsAuthenticated(!!token);
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
    }, []);

    const moodColors = {
        HAPPY: { primary: '#fbbf24', gradient: 'linear-gradient(135deg, #ffe671 0%, #ffc864  100%)', height: '2px' },
        SAD: { primary: '#60a5fa', gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', height: '2px' },
        ANGRY: { primary: '#f87171', gradient: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)', height: '2px' },
        NEUTRAL: { primary: '#9ca3af', gradient: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)', height: '2px' }
    };

    const userMenuItems: MenuProps['items'] = [
        { key: '1', label: t('profile'), onClick: () => navigate('/profile') },
        { key: '2', label: t('settings'), onClick: () => navigate('/setting') },
        { key: '3', label: t('logout'), onClick: () => handleLogout() }
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


    const changeMood = (mood: Mood) => setCurrentMood(mood);

    const handleLanguageChange = ({ key }: { key: string }) => {
        i18n.changeLanguage(key);
        setCurrentLanguage(key as 'vi' | 'en');
        localStorage.setItem('lang', key);
    };

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
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="particle"
                        style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, top: '50%' }}
                    />
                ))}

                <div className="header-content">
                    {/* Logo */}
                    <div className="logo-section">
                        <div className="logo-envelope" onClick={handleHomePage}><MailOutlined /></div>
                        <span className="logo-text">Hidden Letter</span>
                    </div>

                    {/* Navigation */}
                    <nav className="nav-section">
                        {/* <div className="nav-item">
                            <SolutionOutlined style={{ fontSize: '18px' }} />
                            <span>{t('about')}</span>
                        </div> */}

                        {isAuthenticated && (
                            <>
                                <div className="nav-item" onClick={handleSendLetter}>
                                    <SendOutlined />
                                    <span>{t('send_letter')}</span>
                                </div>

                                <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={handleViewInbox}>
                                    <Badge count={unreadCount} className="custom-badge">
                                        <MailOutlined style={{ fontSize: '18px' }} />
                                    </Badge>
                                    <span>{t('inbox')}</span>
                                </div>

                                <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={handleViewLetterSent}>
                                    <Badge count={unreadCount} className="custom-badge">
                                        <InboxOutlined style={{ fontSize: '18px' }} />
                                    </Badge>
                                    <span>{t('sent')}</span>
                                </div>
                            </>
                        )}
                    </nav>


                    <div className="user-section">

                        {/* Mood selector (only when logged in) */}
                        {/* {isAuthenticated && (
                            <div className="mood-selector">
                                {(['HAPPY', 'SAD', 'ANGRY', 'NEUTRAL'] as Mood[]).map(mood => (
                                    <button
                                        key={mood}
                                        className={`mood-btn ${currentMood === mood ? 'active' : ''}`}
                                        onClick={() => changeMood(mood)}
                                        style={{ background: moodColors[mood].gradient }}
                                    >
                                        {mood === 'HAPPY' ? '😊' :
                                            mood === 'SAD' ? '😢' :
                                                mood === 'ANGRY' ? '😠' : '😐'}
                                    </button>
                                ))}
                            </div>
                        )} */}

                        {/* Avatar OR Login/Register */}
                        {isAuthenticated ? (
                            <Dropdown menu={{ items: userMenuItems, rootClassName: "language-dropdown-menu" }} placement="bottom">
                                <div className="avatar-wrapper">
                                    <img
                                        className="user-avatar"
                                        src={user?.avatar}
                                        alt=""
                                    />
                                    <span className="avatar-status" style={{ background: 'rgb(42 232 47)' }} />
                                </div>
                            </Dropdown>
                        ) : (
                            <div className="auth-buttons">
                                <button className="login-btn" onClick={handleLogin}>{t('login')}</button>
                                <button className="register-btn">{t('register')}</button>
                            </div>
                        )}
                        <div style={{ fontSize: '14px' }}>{user?.username}</div>
                        {/* Language selector (always shown) */}
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
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '12px' }}
                            >
                                <img src={currentLanguage === 'vi' ? viFlag : enFlag} style={{ width: 24, height: 16 }} alt="404" />
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
