import {Injectable} from "@nestjs/common";
import {IAuthService} from "../../core/application/interfaces/services/auth.service";
import {JwtService} from "@nestjs/jwt";
import * as crypto from 'crypto';

@Injectable()
export class AuthServiceImpl implements IAuthService {
    constructor(private readonly jwtService: JwtService) {
    }

    hashPassword(password: string): string {
        return crypto.createHash("sha256").update(password).digest("hex");
    }

    generateToken(payload: any): string {
        return this.jwtService.sign(payload);
    }

}