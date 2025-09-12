import { toast } from "react-toastify";
import { Constants } from "../constants";
import type { Category } from "../interfaces/Category";

export class CategoryService {
  async getAll(): Promise<(Category | null)[]> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_CATEGORY}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to retrieve categories");
      return [];
    } else {
      const result = await response.json();
      return result;
    }
  }
}
