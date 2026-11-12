export interface AuthUser {
  id: number;
  email: string;
  username: string | null;
  name: string | null;
}

export interface AuthUserResponse {
  user: AuthUser;
}

export interface CurrentUserResponse {
  user: AuthUser | null;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  username?: string;
  name?: string;
}

export interface UpdateProfileInput {
  email?: string;
  username?: string;
  name?: string;
}