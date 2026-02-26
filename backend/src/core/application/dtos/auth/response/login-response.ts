export class LoginResponse {
  accessToken: string;

  constructor(token: string) {
    this.accessToken = token;
  }
}
