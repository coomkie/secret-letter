import { Users } from '../../../../domain/entities/user.entity';

export class UserShortResponse {
  id: string;
  username: string;
  gender: boolean;
  email: string;
  avatar: string;
  password: string;
  isAdmin: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(entity: Users) {
    this.id = entity.id;
    this.username = entity.username;
    this.gender = entity.gender;
    this.email = entity.email;
    this.avatar = entity.avatar;
    this.password = entity.password;
    this.isAdmin = entity.isAdmin;
    this.created_at = entity.created_at;
    this.updated_at = entity.updated_at;
  }
}
