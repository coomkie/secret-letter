import React, { useState, useEffect } from 'react';
import { SettingOutlined, BellOutlined, MailOutlined, HeartOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Switch, message } from 'antd';
import '../../CSS/Setting.css';
import api from '../../apis/AxiosInstance';
import { useTranslation } from 'react-i18next';

type Mood = 'HAPPY' | 'SAD' | 'ANGRY' | 'NEUTRAL';

interface UserSettings {
    id: string;
    userId: string;
    allowRandomMessages: boolean;
    preferredMoods: string[];
    notificationsEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}

const SettingPage = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, delay: number }>>([]);

    // Local state for form
    const [allowRandomMessages, setAllowRandomMessages] = useState(true);
    const [selectedMood, setSelectedMood] = useState<Mood>('NEUTRAL');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/user-settings`);
            const data: UserSettings = response.data;
            setSettings(data);
            setAllowRandomMessages(data.allowRandomMessages);
            setSelectedMood(data.preferredMoods[0]?.toUpperCase() as Mood || 'NEUTRAL');
            setNotificationsEnabled(data.notificationsEnabled);

        } catch (error) {
            message.error(t('setting_load_fail'));
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            await api.patch(`/user-settings`, {
                allowRandomMessages: allowRandomMessages,
                preferredMood: [selectedMood.toLowerCase()],
                notificationEnabled: notificationsEnabled
            });

            message.success({
                content: t('setting_save_success'),
                duration: 3
            });
            setSaving(false);
            await fetchSettings();
        } catch (error) {
            message.error(t('setting_save_fail'));
            setSaving(false);
        } finally {
            setLoading(false);
        }
    };

    const moods = [
        {
            type: 'HAPPY' as Mood,
            icon: '😊',
            label: t('happy'),
            color: '#fbbf24',
            gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            description: t('setting_mood_title_1')
        },
        {
            type: 'SAD' as Mood,
            icon: '😢',
            label: t('sad'),
            color: '#60a5fa',
            gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            description: t('setting_mood_title_2')
        },
        {
            type: 'ANGRY' as Mood,
            icon: '😠',
            label: t('angry'),
            color: '#f87171',
            gradient: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
            description: t('setting_mood_title_3')
        },
        {
            type: 'NEUTRAL' as Mood,
            icon: '😐',
            label: t('curious'),
            color: '#9ca3af',
            gradient: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
            description: t('setting_mood_title_4')
        }
    ];

    if (loading) {
        return (
            <div className="settings-page">
                <div className="loading-container-settings">
                    <LoadingOutlined className="loading-icon-settings" />
                    <p>{t('setting_loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="settings-page">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="settings-particle"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animationDelay: `${particle.delay}s`
                    }}
                >
                    ⚙️
                </div>
            ))}

            <div className="settings-container">
                {/* Header */}
                <div className="settings-header">
                    <div className="header-content-settings">
                        <div className="header-icon-settings">
                            <SettingOutlined />
                        </div>
                        <div className="header-text-settings">
                            <h1 className="settings-title">{t('setting')}</h1>
                            <p className="settings-subtitle">
                                {t('setting_title')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="settings-content">
                    {/* Random Messages Setting */}
                    <div className="setting-card">
                        <div className="setting-card-header">
                            <div className="setting-icon" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}>
                                <MailOutlined />
                            </div>
                            <div className="setting-info">
                                <h3 className="setting-title">{t('setting_1')}</h3>
                                <p className="setting-description">
                                    {t('setting_1_title')}
                                </p>
                            </div>
                            <Switch
                                checked={allowRandomMessages}
                                onChange={setAllowRandomMessages}
                                className="setting-switch"
                            />
                        </div>

                        {allowRandomMessages && (
                            <div className="setting-detail">
                                <div className="detail-badge success">
                                    <CheckCircleOutlined />
                                    <span>{t('setting_1_active')}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preferred Mood Setting */}
                    <div className="setting-card">
                        <div className="setting-card-header">
                            <div className="setting-icon" style={{ background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)' }}>
                                <HeartOutlined />
                            </div>
                            <div className="setting-info">
                                <h3 className="setting-title">{t('setting_2')}</h3>
                                <p className="setting-description">
                                    {t('setting_2_title')}
                                </p>
                            </div>
                        </div>

                        <div className="mood-selector-settings">
                            {moods.map((mood, index) => (
                                <button
                                    key={index}
                                    className={`mood-card-settings ${selectedMood === mood.type ? 'active' : ''}`}
                                    onClick={() => setSelectedMood(mood.type)}
                                    style={{
                                        borderColor: selectedMood === mood.type ? mood.color : '#e5e7eb'
                                    }}
                                >
                                    <span className="mood-emoji-settings">{mood.icon}</span>
                                    <div className="mood-content-settings">
                                        <span className="mood-label-settings">{mood.label}</span>
                                        <span className="mood-desc-settings">{mood.description}</span>
                                    </div>
                                    {selectedMood === mood.type && (
                                        <div className="mood-check">
                                            <CheckCircleOutlined />
                                        </div>
                                    )}
                                    {selectedMood === mood.type && (
                                        <div className="mood-glow-settings" style={{ background: mood.gradient }}></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notifications Setting */}
                    <div className="setting-card">
                        <div className="setting-card-header">
                            <div className="setting-icon" style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' }}>
                                <BellOutlined />
                            </div>
                            <div className="setting-info" >
                                <h3 className="setting-title">{t('setting_3')}</h3>
                                <p className="setting-description">
                                    {t('setting_3_title')}
                                </p>
                            </div>
                            <Switch disabled
                                checked={notificationsEnabled}
                                onChange={setNotificationsEnabled}
                                className="setting-switch"
                            />
                        </div>

                        {notificationsEnabled && (
                            <div className="setting-detail">
                                <div className="detail-badge success">
                                    <CheckCircleOutlined />
                                    <span>{t('setting_3_active')}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="save-button-container">
                        <button
                            className="save-settings-btn"
                            onClick={handleSaveSettings}
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <span className="saving-spinner">{t('saving')}</span>

                                </>
                            ) : (
                                <>
                                    <CheckCircleOutlined />
                                    {t('save_setting')}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Info Box */}
                    <div className="info-box">
                        <div className="info-icon">💡</div>
                        <div className="info-content">
                            <h4>{t('setting_desc_1')}</h4>
                            <ul>
                                <li>{t('setting_desc_2')}</li>
                                <li>{t('setting_desc_3')}</li>
                                <li>{t('setting_desc_4')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingPage;