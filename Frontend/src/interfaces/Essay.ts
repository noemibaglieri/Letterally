import type { Feedback } from "./Feedback";
import type { Topic } from "./Topic";
import type { User } from "./User";

export interface Essay {
  id?: number;
  title: string;
  content: string;
  topic?: Topic;
  user?: User;
  createdOn?: Date;
  votes?: Feedback[];
}
