import React, { useState, useEffect } from 'react';
import { HeartOutlined, GithubOutlined, TwitterOutlined, MailOutlined } from '@ant-design/icons';
import '../../CSS/Footer.css';

type Mood = 'HAPPY' | 'SAD' | 'ANGRY' | 'NEUTRAL';

interface SecretLetterFooterProps {
    currentMood?: Mood;
}

const Footer: React.FC<SecretLetterFooterProps> = ({ currentMood = 'HAPPY' }) => {
    const [particles, setParticles] = useState<Array<{ id: number, left: number, delay: number }>>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 8
        }));
        setParticles(newParticles);
    }, []);

    const moodColors = {
        HAPPY: { primary: '#fbbf24', gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
        SAD: { primary: '#60a5fa', gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' },
        ANGRY: { primary: '#f87171', gradient: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)' },
        NEUTRAL: { primary: '#9ca3af', gradient: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' }
    };

    const footerLinks = {
        product: [
            { label: 'Tính năng', href: '#' },
            { label: 'Cách hoạt động', href: '#' },
            { label: 'Bảng giá', href: '#' },
            { label: 'FAQs', href: '#' }
        ],
        company: [
            { label: 'Về chúng tôi', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Careers', href: '#' },
            { label: 'Liên hệ', href: '#' }
        ],
        legal: [
            { label: 'Điều khoản sử dụng', href: '#' },
            { label: 'Chính sách bảo mật', href: '#' },
            { label: 'Cookie Policy', href: '#' },
            { label: 'Giấy phép', href: '#' }
        ]
    };

    const socialLinks = [
        { icon: <GithubOutlined />, href: '#', label: 'GitHub' },
        { icon: <TwitterOutlined />, href: '#', label: 'Twitter' },
        { icon: <MailOutlined />, href: '#', label: 'Email' }
    ];

    return (
        <>
            <style>{`
        .footer-container .particle-footer {
          background: ${moodColors[currentMood].primary};
        }
        
        .footer-container .footer-logo-envelope {
          background: ${moodColors[currentMood].gradient};
          box-shadow: 0 0 5px ${moodColors[currentMood].primary}40;
          animation: glow-footer-${currentMood} 2s ease-in-out infinite;
        }

        @keyframes glow-footer-${currentMood} {
          0%, 100% { box-shadow: 0 0 5px ${moodColors[currentMood].primary}40; }
          50% { box-shadow: 0 0 20px ${moodColors[currentMood].primary}80; }
        }
        
        .footer-container .footer-logo-text {
          background: ${moodColors[currentMood].gradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .footer-container .footer-link:hover {
          color: ${moodColors[currentMood].primary};
          transform: translateX(4px);
        }
        
        .footer-container .social-icon:hover {
          background: ${moodColors[currentMood].gradient};
          transform: translateY(-4px) rotate(5deg);
        }
        
        .footer-container .mood-indicator-top {
          background: ${moodColors[currentMood].gradient};
        }
        
        .footer-container .heart-icon {
          color: ${moodColors[currentMood].primary};
        }
      `}</style>

            <footer className="footer-container">
                {/* Mood Indicator Bar */}
                <div className="mood-indicator-top" />

                {/* Floating Particles */}
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="particle-footer"
                        style={{
                            left: `${particle.left}%`,
                            animationDelay: `${particle.delay}s`,
                            bottom: `${Math.random() * 100}%`
                        }}
                    />
                ))}

                <div className="footer-content">
                    {/* Top Section */}
                    <div className="footer-top">
                        {/* Logo & Description */}
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <div className="footer-logo-envelope">
                                    <MailOutlined />
                                </div>
                                <span className="footer-logo-text">Secret Letter</span>
                            </div>
                            <p className="footer-description">
                                Nơi những lời chưa nói được gửi đi, nơi tâm trạng được chia sẻ ẩn danh.
                                Hãy để trái tim bạn tự do bày tỏ.
                            </p>
                            <div className="social-links">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="social-icon"
                                        aria-label={social.label}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div className="footer-links">
                            <div className="footer-column">
                                <h4 className="footer-column-title">Sản phẩm</h4>
                                <ul className="footer-list">
                                    {footerLinks.product.map((link, index) => (
                                        <li key={index}>
                                            <a href={link.href} className="footer-link">
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="footer-column">
                                <h4 className="footer-column-title">Công ty</h4>
                                <ul className="footer-list">
                                    {footerLinks.company.map((link, index) => (
                                        <li key={index}>
                                            <a href={link.href} className="footer-link">
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="footer-column">
                                <h4 className="footer-column-title">Pháp lý</h4>
                                <ul className="footer-list">
                                    {footerLinks.legal.map((link, index) => (
                                        <li key={index}>
                                            <a href={link.href} className="footer-link">
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="footer-bottom">
                        <div className="footer-copyright">
                            © 2024 Secret Letter. Made with <HeartOutlined className="heart-icon" /> in Vietnam
                        </div>
                        <div className="footer-stats">
                            <span className="stat-item">1,234 thư đã gửi</span>
                            <span className="stat-divider">•</span>
                            <span className="stat-item">567 kết nối</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;