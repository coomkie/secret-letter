import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../../../core/domain/entities/user.entity';
import { UserSettings } from '../../../core/domain/entities/user-setting.entity';
import { Mood } from '../../../core/domain/enums/mood.enum';

@Injectable()
export class UserSeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Users)
    private readonly _usersRepository: Repository<Users>,

    @InjectRepository(UserSettings)
    private readonly _settingsRepository: Repository<UserSettings>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedUsers();
  }

  private async seedUsers() {
    const usersData = [
      {
        email: 'lekhaiduong.netcore@gmail.com',
        username: 'Lê Khải Dương',
        gender: true,
        avatar:
          'https://res.cloudinary.com/dshe78dng/image/upload/v1763969046/admin_default_avatar_igmdrv.webp',
        password:
          '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
        isAdmin: true,
      },
      {
        email: 'tien@gmail.com',
        username: 'Ngô Quý Tiền',
        gender: true,
        avatar:
          'https://res.cloudinary.com/dshe78dng/image/upload/v1764082592/user_male_default_avatar-removebg-preview_dhix5q.png',
        password:
          '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
      },
      {
        email: 'nam@gmail.com',
        username: 'Phạm Bùi Châu Nam',
        gender: true,
        avatar:
          'https://res.cloudinary.com/dshe78dng/image/upload/v1764082592/user_male_default_avatar-removebg-preview_dhix5q.png',
        password:
          '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
      },
      {
        email: 'trong@gmail.com',
        username: 'Vũ Văn Trọng',
        gender: true,
        avatar:
          'https://res.cloudinary.com/dshe78dng/image/upload/v1764082592/user_male_default_avatar-removebg-preview_dhix5q.png',
        password:
          '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
      },
      {
        email: 'minh@gmail.com',
        username: 'Trần Tuấn Minh',
        gender: true,
        avatar:
          'https://res.cloudinary.com/dshe78dng/image/upload/v1764082592/user_male_default_avatar-removebg-preview_dhix5q.png',
        password:
          '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
      },
      {
        email: 'hung@gmail.com',
        username: 'Ngô Ngọc Hùng',
        gender: true,
        avatar:
          'https://res.cloudinary.com/dshe78dng/image/upload/v1764082592/user_male_default_avatar-removebg-preview_dhix5q.png',
        password:
          '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
      },
      {
        email: 'vananh@gmail.com',
        username: 'Nguyễn Thị Vân Anh',
        gender: false,
        avatar:
          'https://res.cloudinary.com/dshe78dng/image/upload/v1764082592/user_female_default_avatar-removebg-preview_avvhz2.png',
        password:
          '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
      },
    ];

    for (const u of usersData) {
      const userExists = await this._usersRepository.findOneBy({
        email: u.email,
      });
      if (!userExists) {
        // Create user
        const user = this._usersRepository.create({
          ...u,
          created_at: new Date(),
          updated_at: new Date(),
          isAdmin: u.isAdmin ?? false,
        });

        const savedUser = await this._usersRepository.save(user);

        const setting = this._settingsRepository.create({
          user: savedUser,
          allowRandomMessages: true,
          preferredMoods: [Mood.NEUTRAL],
          notificationsEnabled: true,
        });
        await this._settingsRepository.save(setting);
      }
    }
  }
}
