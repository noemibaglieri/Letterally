import type { User } from "./User";

export interface Feedback {
  id: number;
  value: number;
  content: string;
  user: User;
  createdOn: Date;
}
