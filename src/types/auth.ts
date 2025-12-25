export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  userName: string;
  token: string;
  expiresIn: number;
}

export interface User {
  id: string;
  userName: string;
}