import { JwtPayload } from "jwt-decode";

export interface MyJwtPayload extends JwtPayload {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
}
