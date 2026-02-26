import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../core/domain/entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users)
    private _userRepository: Repository<Users>,
  ) {}

  hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async login(email: string, password: string) {
    const user = await this._userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    const hashedPassword = this.hashPassword(password);
    if (hashedPassword !== user.password)
      throw new UnauthorizedException('Invalid password');

    const payload = { sub: user.id, email: user.email, isAdmin: user.isAdmin };
    const token = this.jwtService.sign(payload);

    return { accessToken: token };
  }
}
