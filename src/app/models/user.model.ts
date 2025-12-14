export interface User {
  id: number;
  nom: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string; // AJOUTÉ POUR JWT
  user: User;
}
