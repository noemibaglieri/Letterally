export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  dateOfBirth: string;
  avatar?: string;
  registeredOn?: string;
}

export interface NewUserResponse {
  id: number;
}

export interface SignInResponse {
  accessToken: string;
}
