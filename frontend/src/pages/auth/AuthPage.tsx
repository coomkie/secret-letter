import React, { useState, useEffect } from 'react';
import { MailOutlined, LockOutlined, UserOutlined, EyeOutlined, EyeInvisibleOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../../CSS/Auth.css';
import api from '../../apis/AxiosInstance';
import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '../../types/auth';

type AuthMode = 'login' | 'register';

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
    const [mode, setMode] = useState<AuthMode>('login');
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
        setFormData({
            ...formData,
            [name]: value
        });
        // Xóa lỗi khi người dùng bắt đầu nhập
        if (errors[name as keyof FormErrors]) {
            setErrors({
                ...errors,
                [name]: undefined
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Validate email
        if (!formData.email) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        // Validate register fields
        if (mode === 'register') {
            if (!formData.username) {
                newErrors.username = 'Vui lòng nhập tên người dùng';
            }

            if (!formData.gender) {
                newErrors.gender = 'Vui lòng chọn giới tính';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            if (mode === 'login') {
                // Đăng nhập
                const response = await api.post('/auth/login', {
                    email: formData.email,
                    password: formData.password
                });

                if (response.data.accessToken) {
                    const token = response.data.accessToken;

                    localStorage.setItem('token', token);

                    const user = jwtDecode<MyJwtPayload>(token);

                    if (user.isAdmin) {
                        navigate('/admin/home');
                    } else {
                        navigate('/');
                    }
                }
            } else {
                // Đăng ký
                await api.post('/auth/register', {
                    email: formData.email,
                    username: formData.username,
                    gender: formData.gender === 'male', // true cho nam, false cho nữ
                    avatar: '',
                    password: formData.password
                });

                // Đăng ký thành công, chuyển sang mode đăng nhập
                setMode('login');
                setFormData({
                    username: '',
                    email: formData.email, // Giữ lại email
                    password: '',
                    confirmPassword: '',
                    gender: ''
                });
                setErrors({ general: 'Đăng ký thành công! Vui lòng đăng nhập.' });
            }
        } catch (error: any) {
            console.error('Auth error:', error);

            if (error.response?.data?.message) {
                // Xử lý lỗi từ backend
                const errorMessage = error.response.data.message;

                if (errorMessage.includes('wrong email')) {
                    setErrors({ email: errorMessage });
                } else if (errorMessage.includes('email or password')) {
                    setErrors({ password: errorMessage });
                } else {
                    setErrors({ general: errorMessage });
                }
            } else {
                setErrors({ general: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            gender: ''
        });
        setErrors({});
    };

    return (
        <div className="auth-page">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="auth-particle"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animationDelay: `${particle.delay}s`
                    }}
                >
                    ✉️
                </div>
            ))}

            <div className="auth-decoration">
                <div className="deco-circle circle-1"></div>
                <div className="deco-circle circle-2"></div>
                <div className="deco-circle circle-3"></div>
            </div>

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

                        <h2 className="illustration-title">
                            {mode === 'login' ? 'Chào mừng trở lại' : 'Bắt đầu cuộc hành trình'}
                        </h2>
                        <p className="illustration-description">
                            {mode === 'login'
                                ? 'Đăng nhập để tiếp tục gửi những lời chưa nói tới mọi người'
                                : 'Tạo tài khoản để khám phá thế giới và chia sẻ cảm xúc'
                            }
                        </p>
                    </div>
                </div>

                <div className="auth-form-section">
                    <div className="auth-form-container">
                        <div className="auth-logo">
                            <div className="auth-logo-icon">
                                <MailOutlined />
                            </div>
                            <span className="auth-logo-text">Hidden Letter</span>
                        </div>

                        <div className="auth-header">
                            <h1 className="auth-title">
                                {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                            </h1>
                            <p className="auth-subtitle">
                                {mode === 'login'
                                    ? 'Chào mừng bạn quay trở lại'
                                    : 'Tạo tài khoản mới của bạn'
                                }
                            </p>
                        </div>

                        {errors.general && (
                            <div style={{
                                color: errors.general.includes('thành công') ? '#52c41a' : '#ff4d4f',
                                marginBottom: '16px',
                                padding: '8px 12px',
                                backgroundColor: errors.general.includes('thành công') ? '#f6ffed' : '#fff2f0',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}>
                                {errors.general}
                            </div>
                        )}

                        <div className="social-login">
                            <button className="social-btn google-btn">
                                <GoogleOutlined />
                                <span>Google</span>
                            </button>
                            <button className="social-btn github-btn">
                                <GithubOutlined />
                                <span>GitHub</span>
                            </button>
                        </div>

                        <div className="divider">
                            <span>hoặc</span>
                        </div>

                        <div className="auth-form">
                            {mode === 'register' && (
                                <div className="form-group">
                                    <label className="form-label">Tên người dùng</label>
                                    <div className="input-wrapper">
                                        <UserOutlined className="input-icon" />
                                        <input
                                            type="text"
                                            name="username"
                                            className="form-input"
                                            placeholder="Nhập tên người dùng"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors.username && (
                                        <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
                                            {errors.username}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <div className="input-wrapper">
                                    <MailOutlined className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        placeholder="example@email.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {errors.email && (
                                    <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            {mode === 'register' && (
                                <div className="form-group">
                                    <label className="form-label">Giới tính</label>
                                    <div className="gender-options">
                                        <label className="gender-item">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={formData.gender === 'male'}
                                                onChange={handleInputChange}
                                            />
                                            <span>Nam</span>
                                        </label>

                                        <label className="gender-item">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                checked={formData.gender === 'female'}
                                                onChange={handleInputChange}
                                            />
                                            <span>Nữ</span>
                                        </label>
                                    </div>
                                    {errors.gender && (
                                        <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
                                            {errors.gender}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Mật khẩu</label>
                                <div className="input-wrapper">
                                    <LockOutlined className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        className="form-input"
                                        placeholder="Nhập mật khẩu"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {mode === 'register' && (
                                <div className="form-group">
                                    <label className="form-label">Xác nhận mật khẩu</label>
                                    <div className="input-wrapper">
                                        <LockOutlined className="input-icon" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            className="form-input"
                                            placeholder="Nhập lại mật khẩu"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
                                            {errors.confirmPassword}
                                        </div>
                                    )}
                                </div>
                            )}

                            {mode === 'login' && (
                                <div className="form-options">
                                    <label className="checkbox-label">
                                        <input type="checkbox" className="form-checkbox" />
                                        <span>Ghi nhớ đăng nhập</span>
                                    </label>
                                    <a href="#" className="forgot-link">Quên mật khẩu?</a>
                                </div>
                            )}

                            {mode === 'register' && (
                                <div className="terms-accept">
                                    <label className="checkbox-label">
                                        <input type="checkbox" className="form-checkbox" />
                                        <span>
                                            Tôi đồng ý với <a href="#">Điều khoản</a> và <a href="#">Chính sách bảo mật</a>
                                        </span>
                                    </label>
                                </div>
                            )}

                            <button
                                className="submit-btn"
                                onClick={handleSubmit}
                                disabled={loading}
                                style={{
                                    opacity: loading ? 0.6 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'Đang xử lý...' : (mode === 'login' ? 'Đăng nhập' : 'Đăng ký')}
                            </button>
                        </div>

                        <div className="auth-switch">
                            <span>
                                {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                            </span>
                            <button className="switch-btn" onClick={switchMode}>
                                {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;