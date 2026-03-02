import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as authService from '../../interfaces/services/auth.service';
import * as usersRepository from '../../interfaces/repositories/user.repository';
@Injectable()
export class ForgotPasswordUseCase {
    constructor(
        private readonly mailerService: MailerService,
        @Inject('IUsersRepository') private readonly _usersRepository: usersRepository.IUsersRepository,
        @Inject('IAuthService') private readonly _authService: authService.IAuthService,
    ) { }

    private readonly translations = {
        'vi-VN': {
            subject: '[Secret Letter] Khôi phục mật khẩu',
            greeting: 'Xin chào',
            description: 'Bạn đã yêu cầu khôi phục mật khẩu.',
            newPasswordLabel: 'Mật khẩu mới của bạn là:',
            warning: 'Vui lòng đăng nhập và đổi lại mật khẩu ngay để đảm bảo an toàn.',
            success: 'Mật khẩu mới đã được gửi vào email của bạn'
        },
        'en-US': {
            subject: '[Secret Letter] Password Recovery',
            greeting: 'Hello',
            description: 'You requested a password recovery.',
            newPasswordLabel: 'Your new password is:',
            warning: 'Please login and change your password immediately for security.',
            success: 'New password has been sent to your email'
        }
    };

    async execute(email: string, lang: string = 'vi-VN') {
        console.log('ForgotPasswordUseCase executed with email:', email, 'and lang:', lang);
        const user = await this._usersRepository.getUserByEmail(email);
        if (!user) throw new NotFoundException(lang === 'vi-VN' ? 'Email không tồn tại' : 'Email not found');

        const t = this.translations[lang] || this.translations['vi-VN'];
        console.log('Using translations:', t.subject);
        const newPassword = Math.floor(100000 + Math.random() * 900000).toString();

        user.password = await this._authService.hashPassword(newPassword);
        await this._usersRepository.saveUser(user);

        await this.mailerService.sendMail({
            to: email,
            subject: t.subject,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                    <h2 style="color: #333;">${t.greeting} ${user.username},</h2>
                    <p>${t.description}</p>
                    <p style="background: #f9f9f9; padding: 15px; text-align: center;">
                        ${t.newPasswordLabel} <br/>
                        <strong style="font-size: 24px; color: #f59e0b;">${newPassword}</strong>
                    </p>
                    <p style="color: #666; font-size: 12px;">${t.warning}</p>
                </div>
            `,
        });
        return { message: t.success };
    }
}