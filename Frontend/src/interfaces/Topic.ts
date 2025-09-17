import type { Category } from "./Category";

export interface Topic {
  id?: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category?: Category;
  image?: string;
}

export interface CreateTopicPayload {
  title: string;
  description: string;
  startDate: string;
  categoryId: number;
  image: File;
}
