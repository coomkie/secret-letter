import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as usersRepository from '../../interfaces/repositories/user.repository';
import { UpdateUserRequest } from '../../dtos/users/request/update-user-request';
import { CloudinaryService } from '../../interfaces/services/cloudinary.service';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUsersRepository')
    private readonly _usersRepository: usersRepository.IUsersRepository,
    private readonly _cloudinaryService: CloudinaryService,
  ) { }

  async execute(
    id: string,
    model: Partial<UpdateUserRequest>,
    file?: Express.Multer.File,
  ) {
    const user = await this._usersRepository.getUserById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    if (model.username) user.username = model.username;
    if (file) {
      const result = await this._cloudinaryService.uploadImage(file, id);
      user.avatar = result.secure_url;
    }
    if (Object.prototype.hasOwnProperty.call(model, 'gender') && model.gender !== undefined) {
      user.gender = model.gender;
    }
    user.updated_at = new Date();

    const savedUser = await this._usersRepository.saveUser(user);

    return {
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
      gender: savedUser.gender,
      avatar: savedUser.avatar,
      isAdmin: savedUser.isAdmin,
      created_at: savedUser.created_at,
      updated_at: savedUser.updated_at,
    };
  }
}
