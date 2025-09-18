import type { Feedback } from "./Feedback";
import type { Topic } from "./Topic";
import type { User } from "./User";

export interface Essay {
  id?: number;
  title: string;
  content: string;
  imageFile?: string;
  topic?: Topic;
  user?: User;
  createdOn?: Date;
  votes?: Feedback[];
}

export interface CreateEssayPayload {
  title: string;
  content: string;
  imageFile: File;
  topicId: number;
}

export type UpdateEssayPayload = {
  title: string;
  content: string;
  topicId: number;
  imageFile?: File;
};

export type EssayResponse = {
  id?: number;
  title: string;
  content: string;
  image: string;
  topic?: Topic;
  user?: User;
  createdOn?: Date;
  votes?: Feedback[];
};
