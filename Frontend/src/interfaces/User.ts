export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  dateOfBirth: string;
  avatar?: string;
  createdAt?: string;
}

export interface NewUserResponse {
  id: number;
}

export interface SignInResponse {
  accessToken: string;
}
