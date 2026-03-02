import React, { useState, useEffect, useContext } from 'react';
import { MailOutlined, LockOutlined, UserOutlined, EyeOutlined, EyeInvisibleOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../../CSS/Auth.css';
import api from '../../apis/AxiosInstance';
import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '../../types/auth';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../utils/userContext';

type AuthMode = 'login' | 'register' | 'forgot';

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    gender?: string;
    general?: string;
}

const AuthPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { setUser } = useContext(UserContext);

    const [mode, setMode] = useState<AuthMode>('login');
    const [forgotEmail, setForgotEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, delay: number }>>([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name as keyof FormErrors]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (mode === 'forgot') {
            if (!forgotEmail) newErrors.email = t('blank_email');
            else if (!emailRegex.test(forgotEmail)) newErrors.email = t('invalid_email');
        } else {
            if (!formData.email) newErrors.email = t('blank_email');
            else if (!emailRegex.test(formData.email)) newErrors.email = t('invalid_email');

            if (!formData.password) newErrors.password = t('blank_password');
            else if (formData.password.length < 6) newErrors.password = t('invalid_password');

            if (mode === 'register') {
                if (!formData.username) newErrors.username = t('blank_username');
                if (!formData.gender) newErrors.gender = t('blank_gender');
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = t('not_match_verify_password');
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        setErrors({});

        try {
            if (mode === 'login') {
                const response = await api.post('/auth/login', {
                    email: formData.email,
                    password: formData.password
                });

                if (response.data.accessToken) {
                    const token = response.data.accessToken;
                    localStorage.setItem('token', token);
                    const decodedUser = jwtDecode<MyJwtPayload>(token);

                    try {
                        const userRes = await api.get("/auth/me");
                        setUser({ ...userRes.data, isAdmin: decodedUser.isAdmin });
                        navigate(decodedUser.isAdmin ? '/admin/home' : '/home');
                    } catch (err) {
                        navigate('/auth');
                    }
                }
            } else if (mode === 'register') {
                await api.post('/auth/register', {
                    email: formData.email,
                    username: formData.username,
                    gender: formData.gender === 'male',
                    avatar: '',
                    password: formData.password
                });
                setMode('login');
                setErrors({ general: t('register_success') });
            } else if (mode === 'forgot') {
                const response = await api.post('/auth/forgot-password', { email: forgotEmail, lang: t('lang') });
                setErrors({ general: response.data.message });
                setTimeout(() => setMode('login'), 3000);
            }
        } catch (error: any) {
            const msg = error.response?.data?.message;
            if (msg?.includes('email')) setErrors({ email: msg });
            else if (msg?.includes('password')) setErrors({ password: msg });
            else setErrors({ general: msg || t('register_fail') });
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode);
        setFormData({ username: '', email: '', password: '', confirmPassword: '', gender: '' });
        setForgotEmail('');
        setErrors({});
    };

    return (
        <div className="auth-page">
            {particles.map(p => (
                <div key={p.id} className="auth-particle" style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.delay}s` }}>✉️</div>
            ))}

            <div className="auth-container">
                <div className="auth-illustration">
                    <div className="illustration-content">
                        <div className="floating-envelope-auth">
                            <div className="envelope-auth">
                                <div className="envelope-flap-auth"></div>
                                <div className="envelope-body-auth"></div>
                                <div className="heart-icon-float">💌</div>
                            </div>
                        </div>
                        <h2 className="illustration-title">{mode === 'login' ? t('login_title_1') : t('login_title_2')}</h2>
                        <p className="illustration-description">{mode === 'login' ? t('login_title_3') : t('login_title_4')}</p>
                    </div>
                </div>

                <div className="auth-form-section">
                    <div className="auth-form-container">
                        <div className="auth-logo">
                            <div className="auth-logo-icon"><MailOutlined /></div>
                            <span className="auth-logo-text">Hidden Letter</span>
                        </div>

                        <h1 className="auth-title">
                            {mode === 'login' ? t('login') : mode === 'register' ? t('register') : t('forgot_password')}
                        </h1>

                        {errors.general && (
                            <div style={{
                                color: errors.general.includes('thành công') || mode === 'forgot' ? '#52c41a' : '#ff4d4f',
                                marginBottom: '16px', padding: '8px 12px',
                                backgroundColor: errors.general.includes('thành công') || mode === 'forgot' ? '#f6ffed' : '#fff2f0',
                                borderRadius: '4px', fontSize: '14px'
                            }}>{errors.general}</div>
                        )}

                        {mode !== 'forgot' && (
                            <>
                                <div className="social-login">
                                    <button className="social-btn google-btn"><GoogleOutlined /> <span>Google</span></button>
                                    <button className="social-btn github-btn"><GithubOutlined /> <span>GitHub</span></button>
                                </div>
                                <div className="divider"><span>{t('login_title_7')}</span></div>
                            </>
                        )}

                        <div className="auth-form">
                            {mode === 'register' && (
                                <div className="form-group">
                                    <label className="form-label">{t('username')}</label>
                                    <div className="input-wrapper">
                                        <UserOutlined className="input-icon" />
                                        <input type="text" name="username" className="form-input" placeholder={t('username_title')} value={formData.username} onChange={handleInputChange} />
                                    </div>
                                    {errors.username && <div className="error-text" style={{ color: '#ff4d4f', fontSize: '12px' }}>{errors.username}</div>}
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <div className="input-wrapper">
                                    <MailOutlined className="input-icon" />
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="abc@gmail.com"
                                        value={mode === 'forgot' ? forgotEmail : formData.email}
                                        onChange={(e) => mode === 'forgot' ? setForgotEmail(e.target.value) : handleInputChange(e)}
                                        name="email"
                                    />
                                </div>
                                {errors.email && <div className="error-text" style={{ color: '#ff4d4f', fontSize: '12px' }}>{errors.email}</div>}
                            </div>

                            {mode === 'register' && (
                                <div className="form-group">
                                    <label className="form-label">{t('gender')}</label>
                                    <div className="gender-options">
                                        <label className="gender-item"><input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleInputChange} /> <span>{t('male')}</span></label>
                                        <label className="gender-item"><input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleInputChange} /> <span>{t('female')}</span></label>
                                    </div>
                                    {errors.gender && <div className="error-text" style={{ color: '#ff4d4f', fontSize: '12px' }}>{errors.gender}</div>}
                                </div>
                            )}

                            {mode !== 'forgot' && (
                                <div className="form-group">
                                    <label className="form-label">{t('password')}</label>
                                    <div className="input-wrapper">
                                        <LockOutlined className="input-icon" />
                                        <input type={showPassword ? 'text' : 'password'} name="password" className="form-input" placeholder={t('password_title')} value={formData.password} onChange={handleInputChange} />
                                        <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                        </button>
                                    </div>
                                    {errors.password && <div className="error-text" style={{ color: '#ff4d4f', fontSize: '12px' }}>{errors.password}</div>}
                                </div>
                            )}

                            {mode === 'register' && (
                                <div className="form-group">
                                    <label className="form-label">{t('verify_password')}</label>
                                    <div className="input-wrapper">
                                        <LockOutlined className="input-icon" />
                                        <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" className="form-input" placeholder={t('verify_password_title')} value={formData.confirmPassword} onChange={handleInputChange} />
                                        <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <div className="error-text" style={{ color: '#ff4d4f', fontSize: '12px' }}>{errors.confirmPassword}</div>}
                                </div>
                            )}

                            {mode === 'login' && (
                                <div className="form-options">
                                    <label className="checkbox-label"><input type="checkbox" className="form-checkbox" /> <span>{t('remember_password')}</span></label>
                                    <button type="button" className="forgot-link" onClick={() => switchMode('forgot')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }}>{t('forgot_password')}</button>
                                </div>
                            )}

                            {mode === 'forgot' && <p style={{ fontSize: '14px', marginBottom: '16px', color: '#666' }}>{t('forgot_password_instruction')}</p>}

                            <button className="submit-btn" onClick={handleSubmit} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
                                {loading ? t('loading') : mode === 'login' ? t('login') : mode === 'register' ? t('register') : t('send_new_password')}
                            </button>
                        </div>

                        <div className="auth-switch">
                            {mode === 'forgot' ? (
                                <button className="switch-btn" onClick={() => switchMode('login')}>{t('back_to_login')}</button>
                            ) : (
                                <>
                                    <span>{mode === 'login' ? t('login_content_1') : t('login_content_2')}</span>
                                    <button className="switch-btn" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>
                                        {mode === 'login' ? t('login_content_3') : t('login')}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;