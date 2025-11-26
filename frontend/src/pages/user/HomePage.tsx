import React, { useState, useEffect } from 'react';
import { SendOutlined, HeartOutlined, SafetyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import '../../CSS/Home.css';
import { useTranslation } from 'react-i18next';
const HomePage = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [floatingLetters, setFloatingLetters] = useState<Array<{ id: number, x: number, y: number, delay: number }>>([]);
    const { t } = useTranslation();
    useEffect(() => {
        const letters = Array.from({ length: 30 }, (_, i) => ({
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
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        {
            icon: <HeartOutlined />,
            title: t('homepage_card_1_title'),
            description: t('homepage_card_1_description'),
            color: '#f87171'
        },
        {
            icon: <SafetyOutlined />,
            title: t('homepage_card_2_title'),
            description: t('homepage_card_2_description'),
            color: '#60a5fa'
        },
        {
            icon: <ThunderboltOutlined />,
            title: t('homepage_card_3_title'),
            description: t('homepage_card_3_description'),
            color: '#fbbf24'
        }
    ];

    const moods = [
        { emoji: '😊', label: t('happy'), color: '#fbbf24' },
        { emoji: '😢', label: t('sad'), color: '#60a5fa' },
        { emoji: '😠', label: t('angry'), color: '#f87171' },
        { emoji: '😐', label: t('curious'), color: '#9ca3af' }
    ];

    return (
        <div className="home-page">
            {/* Floating Letters Background */}
            {floatingLetters.map(letter => (
                <div
                    key={letter.id}
                    className="floating-letter"
                    style={{
                        left: `${letter.x}%`,
                        top: `${letter.y}%`,
                        animationDelay: `${letter.delay}s`
                    }}
                >
                    ✉️
                </div>
            ))}

            {/* Hero Section */}
            <section className="hero-section">
                <div
                    className="hero-content"
                    style={{
                        transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
                    }}
                >
                    <div className="hero-badge">
                        <div>{t('hero_badge')}</div>
                    </div>

                    <h1 className="hero-title">
                        {t('hero_title_1')}
                        <span className="gradient-text"> {t('hero_title_2')}</span>
                        <br />
                        {t('hero_title_3')}
                    </h1>

                    <p className="hero-description">
                        <span className="gradient-text-strong">{t('hero_description_1')} </span>
                         {t('hero_description_2')}
                    </p>

                    <div className="hero-buttons">
                        <button className="btn-primary">
                            <SendOutlined />
                            {t('hero_button_1')}
                        </button>
                        <button className="btn-secondary">
                            {t('hero_button_2')}
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">2,847</span>
                            <span className="stat-label">{t('hero_start_1')}</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-number">1,234</span>
                            <span className="stat-label">{t('hero_start_2')}</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-number">98%</span>
                            <span className="stat-label">{t('hero_start_3')}</span>
                        </div>
                    </div>
                </div>

                {/* Animated Envelope */}
                <div
                    className="hero-visual"
                    style={{
                        transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`
                    }}
                >
                    <div className="envelope-container">
                        <div className="envelope">
                            <div className="envelope-flap"></div>
                            <div className="envelope-body"></div>
                            <div className="letter-peek"></div>
                        </div>
                        <div className="envelope-glow"></div>
                    </div>
                </div>
            </section>

            {/* Mood Section */}
            <section className="mood-section">
                <div className="section-header">
                    <h2 className="section-title">{t('section_title')}</h2>
                    <p className="section-description">
                        {t('section_description')}
                    </p>
                </div>

                <div className="mood-grid">
                    {moods.map((mood, index) => (
                        <div
                            key={index}
                            className="mood-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="mood-emoji" style={{ background: `${mood.color}20` }}>
                                {mood.emoji}
                            </div>
                            <h3 className="mood-label">{mood.label}</h3>
                            <div className="mood-glow" style={{ background: mood.color }}></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">{t('feature_section_title')}</h2>
                    <p className="section-description">
                        {t('feature_section_description')}
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card"
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <div className="feature-icon" style={{ color: feature.color }}>
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                            <div className="feature-hover-effect" style={{ background: feature.color }}></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2 className="cta-title">
                        {t('cta_title')}
                    </h2>
                    <p className="cta-description">
                        {t('cta_description')}
                    </p>
                    <button className="btn-cta">
                        <SendOutlined />
                        {t('btn_cta')}
                    </button>
                </div>
                <div className="cta-decoration">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;