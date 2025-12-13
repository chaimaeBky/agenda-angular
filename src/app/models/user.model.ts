export interface User {
  id?: number;
  nom: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  nom: string;
  userId: number;
}
