// Auth.ts
export interface IAuthState {
  username: string | null;
  loginTime: Date | null;
}

export class Auth {
  private state: IAuthState = {
    username: null,
    loginTime: null
  };

  isAuthenticated(): boolean {
    return this.state.username !== null;
  }

  // Đăng nhập
  login(username: string): void {
    this.state = {
      username,
      loginTime: new Date()
    };
  }

  // Đăng xuất
  logout(): void {
    this.state = {
      username: null,
      loginTime: null
    };
  }

  // Lấy username
  getUsername(): string | null {
    return this.state.username;
  }

  // Lấy thời gian đăng nhập
  getLoginTime(): Date | null {
    return this.state.loginTime;
  }

  // Lấy toàn bộ state (để debug)
  getState(): IAuthState {
    return { ...this.state };
  }
}