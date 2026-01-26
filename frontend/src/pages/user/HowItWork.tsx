import React, { useState, useEffect } from 'react';
import { SendOutlined, ClockCircleOutlined, MailOutlined, HeartOutlined, BellOutlined, SafetyOutlined, InboxOutlined, ThunderboltOutlined, CheckCircleOutlined } from '@ant-design/icons';
import '../../CSS/HowItWork.css';
import { useTranslation } from 'react-i18next';

const HowItWorksPage = () => {
    const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, delay: number }>>([]);
    const [activeSection, setActiveSection] = useState<number | null>(null);
    const { t } = useTranslation();
    useEffect(() => {
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
    }, []);

    const features = [
        {
            icon: <SendOutlined />,
            title: t('feature_1'),
            color: '#fbbf24',
            gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            points: [
                t('feature_1_desc_1'),
                t('feature_1_desc_2'),
                t('feature_1_desc_3'),
                t('feature_1_desc_4'),
            ]
        },
        {
            icon: <HeartOutlined />,
            title: t('feature_2'),
            color: '#f87171',
            gradient: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
            points: [
                t('feature_2_desc_1'),
                t('feature_2_desc_2'),
                t('feature_2_desc_3'),
                t('feature_2_desc_4'),
            ]
        },
        {
            icon: <ClockCircleOutlined />,
            title: t('feature_3'),
            color: '#60a5fa',
            gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            points: [
                t('feature_3_desc_1'),
                t('feature_3_desc_2'),
                t('feature_3_desc_3'),
            ]
        },
        {
            icon: <MailOutlined />,
            title: t('feature_4'),
            color: '#a78bfa',
            gradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
            points: [
                t('feature_4_desc_1'),
                t('feature_4_desc_2'),
                t('feature_4_desc_3'),
            ]
        }
    ];

    const timeline = [
        {
            time: t('timeline_1'),
            day: t('timeline_2'),
            title: t('timeline_3'),
            description: t('timeline_4'),
            icon: '✍️',
            color: '#fbbf24'
        },
        {
            time: t('timeline_5'),
            day: t('timeline_6'),
            title: t('timeline_7'),
            description: t('timeline_8'),
            icon: '🔗',
            color: '#f87171'
        },
        {
            time: t('timeline_9'),
            day: t('timeline_10'),
            title: t('timeline_11'),
            description: t('timeline_12'),
            icon: '📬',
            color: '#60a5fa'
        },
        {
            time: t('timeline_13'),
            day: t('timeline_14'),
            title: t('timeline_15'),
            description: t('timeline_16'),
            icon: '💌',
            color: '#a78bfa'
        },
        {
            time: t('timeline_17'),
            day: t('timeline_18'),
            title: t('timeline_19'),
            description: t('timeline_20'),
            icon: '🎉',
            color: '#22c55e'
        }
    ];

    const rules = [
        {
            icon: <ThunderboltOutlined />,
            title: t('rule_1'),
            description: t('rule_2'),
            color: '#fbbf24'
        },
        {
            icon: <ClockCircleOutlined />,
            title: t('rule_3'),
            description: t('rule_4'),
            color: '#60a5fa'
        },
        {
            icon: <SafetyOutlined />,
            title: t('rule_5'),
            description: t('rule_6'),
            color: '#f87171'
        },
        {
            icon: <CheckCircleOutlined />,
            title: t('rule_7'),
            description: t('rule_8'),
            color: '#a78bfa'
        }
    ];

    return (
        <div className="how-it-works-page">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="works-particle"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animationDelay: `${particle.delay}s`
                    }}
                >
                    ✉️
                </div>
            ))}

            {/* Hero Section */}
            <section className="works-hero">
                <div className="works-hero-content">
                    <div className="hero-badge">
                        <span className="badge-icon">💡</span>
                        <span>{t('how_it_work')}</span>
                    </div>

                    <h1 className="works-hero-title">
                        {t('title_hiw_1')}
                        <br />
                        <span className="gradient-text">{t('hero_description_1')}</span>
                        <br />
                        {t('title_hiw_2')}
                    </h1>

                    <p className="works-hero-description">
                        {t('title_hiw_3')}
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="works-features">
                <div className="works-container">
                    <div className="section-header">
                        <h2 className="section-title">{t('main_feature')}</h2>
                        <p className="section-description">
                            {t('main_feature_title')}
                        </p>
                    </div>

                    <div className="features-grid-works">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="feature-card-works"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onMouseEnter={() => setActiveSection(index)}
                                onMouseLeave={() => setActiveSection(null)}
                            >
                                <div className="feature-icon-works" style={{ background: feature.gradient }}>
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title-works">{feature.title}</h3>
                                <ul className="feature-points">
                                    {feature.points.map((point, i) => (
                                        <li key={i} className="feature-point">
                                            <span className="point-dot" style={{ background: feature.color }}></span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="feature-glow-works" style={{ background: feature.gradient }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="works-timeline">
                <div className="works-container">
                    <div className="section-header">
                        <h2 className="section-title">{t('timeline')}</h2>
                        <p className="section-description">
                            {t('timeline_title')}
                        </p>
                    </div>

                    <div className="timeline-wrapper">
                        {timeline.map((item, index) => (
                            <div key={index} className="timeline-item-works">
                                <div className="timeline-dot-works" style={{ background: item.color }}>
                                    <span className="timeline-icon">{item.icon}</span>
                                </div>
                                <div className="timeline-content-works">
                                    <div className="timeline-time">
                                        <ClockCircleOutlined />
                                        <span>{item.time}</span>
                                        <span className="timeline-day">{item.day}</span>
                                    </div>
                                    <h4 className="timeline-title">{item.title}</h4>
                                    <p className="timeline-desc">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rules Section */}
            <section className="works-rules">
                <div className="works-container">
                    <div className="section-header">
                        <h2 className="section-title">{t('important')}</h2>
                        <p className="section-description">
                            {t('important_title')}
                        </p>
                    </div>

                    <div className="rules-grid">
                        {rules.map((rule, index) => (
                            <div
                                key={index}
                                className="rule-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="rule-icon" style={{ color: rule.color }}>
                                    {rule.icon}
                                </div>
                                <h3 className="rule-title">{rule.title}</h3>
                                <p className="rule-description">{rule.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Use */}
            <section className="works-usage">
                <div className="works-container">
                    <div className="usage-card">
                        <div className="usage-header">
                            <div className="usage-icon">
                                <InboxOutlined />
                            </div>
                            <div className="usage-info">
                                <h2 className="usage-title">{t('usage_1')}</h2>
                                <p className="usage-subtitle">{t('usage_2')}</p>
                            </div>
                        </div>

                        <div className="usage-content">
                            <div className="usage-item">
                                <div className="usage-number">1</div>
                                <div className="usage-text">
                                    <h4>{t('usage_3')}</h4>
                                    <p>{t('usage_4')}</p>
                                </div>
                            </div>

                            <div className="usage-item">
                                <div className="usage-number">2</div>
                                <div className="usage-text">
                                    <h4>{t('usage_5')}</h4>
                                    <p>{t('usage_6')}</p>
                                </div>
                            </div>

                            <div className="usage-item">
                                <div className="usage-number">3</div>
                                <div className="usage-text">
                                    <h4>{t('usage_7')}</h4>
                                    <p>{t('usage_8')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="works-cta">
                <div className="works-container">
                    <div className="cta-content-works">
                        <h2 className="cta-title-works">
                            {t('cta_1')}
                        </h2>
                        <p className="cta-description-works">
                            {t('cta_2')}
                        </p>
                        <button className="cta-button-works">
                            <SendOutlined />
                            {t('cta_3')}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HowItWorksPage;