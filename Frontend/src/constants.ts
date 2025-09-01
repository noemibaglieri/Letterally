export class Constants {
  static API_URL: string = "http://localhost:3001";
  static API_AUTH_REGISTER: string = "/auth/register";
  static API_AUTH_LOGIN: string = "/auth/login";
  static API_USER_ME: string = "/users/me";
  static API_TOPIC_ALL: string = "/topics";
  static API_TOPIC_CURRENT: string = "/topics/active";
  static API_ESSAY_BY_ID = (id: number | string): string => `/essays/${id}`;
}
