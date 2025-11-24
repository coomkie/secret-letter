import {Users} from "../../../domain/entities/user.entity";
import {CreateUserRequest} from "../../dtos/users/request/create-user-request";
import {UpdateUserRequest} from "../../dtos/users/request/update-user-request";

export interface FindAllUsersOptions {
    page?: number,
    pageSize?: number,
    search?: string,
    sortBy?: keyof Users,
    sortOrder?: 'ASC' | 'DESC',
}

export interface IUsersRepository {
    getAllUsers(options: FindAllUsersOptions): Promise<[Users[], number]>;

    getUserById(id: string): Promise<Users | null>;

    getUserByEmail(email: string): Promise<Users | null>;

    getUserByReportId(reportId: string): Promise<Users | null>;

    getUserByLetterId(letterId: string): Promise<Users | null>;

    createUser(data: Partial<CreateUserRequest>): Promise<Users>;

    updateUser(id: string, data: Partial<UpdateUserRequest>):
        Promise<Users>;

    saveUser(data: Users): Promise<Users>;

    deleteUser(id: string): Promise<void>;
}