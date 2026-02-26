import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import * as usersRepository from '../../interfaces/repositories/user.repository';

@Injectable()
export class ForgotPasswordUseCase {
    constructor(
        @Inject('IUsersRepository')
        private readonly _usersRepository: usersRepository.IUsersRepository,
        private readonly mailerService: MailerService,
    ) { }

    async execute(email: string) {
        // 1. Kiểm tra user có tồn tại không
        const user = await this._usersRepository.getUserByEmail(email);
        if (!user) {
            throw new NotFoundException('Email không tồn tại trong hệ thống');
        }

        const newPassword = Math.floor(100000 + Math.random() * 900000).toString();

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(newPassword, salt);
        await this._usersRepository.saveUser(user);

        try {
            await this.mailerService.sendMail({
                to: email,
                subject: '[Secret Letter] Khôi phục mật khẩu',
                html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Xin chào ${user.username},</h2>
            <p>Bạn đã yêu cầu khôi phục mật khẩu.</p>
            <p>Mật khẩu mới của bạn là: <strong style="font-size: 20px; color: #f59e0b;">${newPassword}</strong></p>
            <p>Vui lòng đăng nhập và đổi lại mật khẩu ngay để đảm bảo an toàn.</p>
          </div>
        `,
            });
            return { message: 'Mật khẩu mới đã được gửi vào email của bạn' };
        } catch (error) {
            throw new Error('Không thể gửi email lúc này. Vui lòng thử lại sau.');
        }
    }
}