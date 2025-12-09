import React, { useState, useEffect, CSSProperties } from 'react';
import { HomeOutlined, SearchOutlined, MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import viFlag from '../../assets/vi_flag.jpg';
import enFlag from '../../assets/eng_flag.jpg';
import { Dropdown, MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
interface FloatingLetter {
    id: number;
    x: number;
    y: number;
    delay: number;
}

interface MousePosition {
    x: number;
    y: number;
}

const NotfoundPage: React.FC = () => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
    const [floatingLetters, setFloatingLetters] = useState<FloatingLetter[]>([]);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const getCurrentLanguage = (): 'vi' | 'en' => {
        const i18nextLang = i18n.language || localStorage.getItem('i18nextLng') || 'vi';
        return i18nextLang.startsWith('en') ? 'en' : 'vi';
    };

    const handleHomePage = () => {
        navigate('/home');
    }
    const [currentLanguage, setCurrentLanguage] = useState<'vi' | 'en'>(getCurrentLanguage());
    useEffect(() => {
        const letters = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5
        }));
        setFloatingLetters(letters);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 20 - 10,
                y: (e.clientY / window.innerHeight) * 20 - 10
            });
        };
        const syncedLang = getCurrentLanguage();
        setCurrentLanguage(syncedLang);
        // Clean up old localStorage key
        localStorage.removeItem('lang');
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [i18n.language]);

    const handleLanguageChange = ({ key }: { key: string }) => {
        const newLang = key as 'vi' | 'en';
        i18n.changeLanguage(newLang);
        setCurrentLanguage(newLang);
        // i18next automatically saves to localStorage as 'i18nextLng'
    };

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

            <div style={styles.container}>
                <div style={{ position: 'absolute', top: ' 0', right: '0', padding: '10px 20px' }}>
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
                {/* Floating Letters Background */}
                {floatingLetters.map(letter => (
                    <div
                        key={letter.id}
                        style={{
                            ...styles.floatingLetter,
                            left: `${letter.x}%`,
                            top: `${letter.y}%`,
                            animationDelay: `${letter.delay}s`
                        }}
                    >
                        ✉️
                    </div>
                ))}

                {/* Main Content */}
                <div style={styles.content}>
                    {/* 404 Envelope Animation */}
                    <div
                        style={{
                            ...styles.envelopeContainer,
                            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
                        }}
                    >
                        <div style={styles.envelope}>
                            <div style={styles.envelopeFlap}></div>
                            <div style={styles.envelopeBody}>
                                <div style={styles.number404}>404</div>
                            </div>
                            <div style={styles.envelopeGlow}></div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div style={styles.textContent}>
                        <h1 style={styles.title}>
                            <span style={styles.gradientText}>{t('oops')}</span>
                        </h1>
                        <p style={styles.description}>
                            {t('404_1')}
                        </p>

                        {/* Action Buttons */}
                        <div style={styles.buttonGroup}>
                            <button style={styles.btnPrimary} onClick={handleHomePage}>
                                <HomeOutlined style={{ fontSize: '18px' }} />
                                {t('404_2')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Decorative Circles */}
                <div style={styles.decorationCircle1}></div>
                <div style={styles.decorationCircle2}></div>
                <div style={styles.decorationCircle3}></div>

                <style>
                    {`
                    @keyframes float-gentle {
                        0%, 100% {
                            transform: translateY(0px) rotate(0deg);
                        }
                        25% {
                            transform: translateY(-30px) rotate(5deg);
                        }
                        50% {
                            transform: translateY(-20px) rotate(-5deg);
                        }
                        75% {
                            transform: translateY(-40px) rotate(3deg);
                        }
                    }

                    @keyframes float-envelope {
                        0%, 100% {
                            transform: translateY(0px) rotate(-5deg);
                        }
                        50% {
                            transform: translateY(-20px) rotate(5deg);
                        }
                    }

                    @keyframes flap-wave {
                        0%, 100% {
                            transform: rotateX(0deg);
                        }
                        50% {
                            transform: rotateX(-20deg);
                        }
                    }

                    @keyframes glow-pulse {
                        0%, 100% {
                            opacity: 0.4;
                            transform: scale(1);
                        }
                        50% {
                            opacity: 0.8;
                            transform: scale(1.1);
                        }
                    }

                    @keyframes gradient-shift {
                        0%, 100% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                    }

                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes float-circle {
                        0%, 100% {
                            transform: translate(0, 0);
                        }
                        50% {
                            transform: translate(30px, -30px);
                        }
                    }

                    @keyframes pulse-404 {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.05);
                        }
                    }
                `}
                </style>
            </div>
        </>

    );
};

const styles: { [key: string]: CSSProperties } = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fef3c7 0%, #ffffff 50%, #dbeafe 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
    },
    floatingLetter: {
        position: 'absolute',
        fontSize: '20px',
        opacity: 0.15,
        animation: 'float-gentle 15s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 1,
    },
    content: {
        maxWidth: '1200px',
        display: 'flex',
        alignItems: 'center',
        gap: '80px',
        position: 'relative',
        zIndex: 10,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    envelopeContainer: {
        position: 'relative',
        width: '400px',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'transform 0.3s ease',
    },
    envelope: {
        position: 'relative',
        width: '300px',
        height: '200px',
        animation: 'float-envelope 6s ease-in-out infinite',
    },
    envelopeBody: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '160px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    envelopeFlap: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100px',
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        clipPath: 'polygon(0 0, 50% 70%, 100% 0)',
        borderRadius: '16px 16px 0 0',
        transformOrigin: 'top center',
        animation: 'flap-wave 3s ease-in-out infinite',
        boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)',
    },
    number404: {
        fontSize: '80px',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f87171 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'pulse-404 2s ease-in-out infinite',
        letterSpacing: '4px',
    },
    envelopeGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
        animation: 'glow-pulse 3s ease-in-out infinite',
        borderRadius: '50%',
    },
    textContent: {
        flex: 1,
        minWidth: '300px',
        maxWidth: '500px',
        textAlign: 'center',
        animation: 'fadeInUp 0.8s ease-out',
    },
    title: {
        fontSize: '48px',
        fontWeight: '800',
        lineHeight: 1.2,
        color: '#1f2937',
        margin: '0 0 24px 0',
    },
    gradientText: {
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f87171 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'gradient-shift 3s ease infinite',
        backgroundSize: '200% 200%',
    },
    description: {
        fontSize: '18px',
        lineHeight: 1.8,
        color: '#6b7280',
        margin: '0 0 40px 0',
    },
    buttonGroup: {
        display: 'flex',
        gap: '16px',
        marginBottom: '40px',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    btnPrimary: {
        padding: '14px 32px',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: 'none',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        color: 'white',
        boxShadow: '0 4px 16px rgba(251, 191, 36, 0.3)',
    },
    btnSecondary: {
        padding: '14px 32px',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '2px solid #e5e7eb',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'white',
        color: '#4b5563',
    },
    quickLinks: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center',
    },
    quickLinksTitle: {
        fontSize: '14px',
        color: '#9ca3af',
        fontWeight: '500',
    },
    linksList: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    link: {
        fontSize: '15px',
        color: '#4b5563',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    linkDivider: {
        color: '#d1d5db',
        fontSize: '12px',
    },
    decorationCircle1: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        opacity: 0.1,
        top: '-100px',
        right: '-100px',
        animation: 'float-circle 10s ease-in-out infinite',
        pointerEvents: 'none',
    },
    decorationCircle2: {
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
        opacity: 0.1,
        bottom: '-50px',
        left: '-50px',
        animation: 'float-circle 12s ease-in-out infinite reverse',
        pointerEvents: 'none',
    },
    decorationCircle3: {
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #f87171, #ef4444)',
        opacity: 0.1,
        top: '50%',
        left: '10%',
        animation: 'float-circle 8s ease-in-out infinite',
        pointerEvents: 'none',
    },
};

export default NotfoundPage;