export interface IAuthService {
    hashPassword(password: string): string;

    generateToken(payload: any): string;
}