export class Constants {
  static API_URL: string = "http://localhost:3001";
  static API_AUTH_REGISTER: string = "/auth/register";
  static API_AUTH_LOGIN: string = "/auth/login";
  static API_USER_ME: string = "/users/me";
  static API_CATEGORY: string = "/categories";
  static API_TOPIC_ALL: string = "/topics";
  static API_TOPIC_CURRENT: string = "/topics/active";
  static API_TOPIC_BY_ID = (id: number | string): string => `/topics/${id}`;
  static API_ESSAY: string = "/essays";
  static API_ESSAY_BY_ID = (id: number | string): string => `/essays/${id}`;
  static API_ESSAY_ALL_BY_TOPIC_ID = (id: number | string): string => `/essays/by-topic/${id}`;
  static API_ESSAY_ALL_BY_USER_ID = (id: number | string): string => `/essays/by-user/${id}`;
  static API_ESSAY_LAST_BY_CATEGORY = (id: number | string): string => `/essays/by-category/${id}`;
  static API_COUNT_ALL_USER_ESSAY = (id: number | string): string => `/essays/count-by-author/${id}`;
  static API_FEEDBACK_ALL_BY_USER_ID = (id: number | string): string => `/essays/by-user/${id}`;
  static API_FEEDBACK_AVG_BY_USER_ID = (id: number | string): string => `/feedback/avg-by-author/${id}`;
  static API_FEEDBACK_AVG_BY_ESSAY_ID = (id: number | string): string => `/feedback/avg-by-essay/${id}`;
  static API_FEEDBACK_SEND: string = "/feedback";
}
