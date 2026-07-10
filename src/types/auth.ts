// src/types/auth.ts

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// NOTA: ajusta esto si tu backend devuelve el token o el user con otro nombre de campo
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}