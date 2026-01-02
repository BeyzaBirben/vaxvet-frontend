export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  userName: string;
  token: string;
  expiresIn: number;
  role: string;
}

export interface User {
  id: string;
  userName: string;
}