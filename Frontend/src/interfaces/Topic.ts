import type { Category } from "./Category";

export interface Topic {
  id?: number;
  title: string;
  description: string;
  endDate: string;
  category?: Category;
  image?: string;
}
