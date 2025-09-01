import type { Category } from "./Category";

export interface Topic {
  id?: number;
  title: string;
  description: string;
  startDate: string;
  category?: Category;
  image?: string;
}
