import { toast } from "react-toastify";
import { Constants } from "../constants";
import type { Feedback } from "../interfaces/Feedback";
import { StorageService } from "./storage.service";

export class FeedbackService {
  async getAllByUserId(id: number): Promise<(Feedback | null)[]> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_FEEDBACK_ALL_BY_USER_ID(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to retrieve comments");
      return [];
    } else {
      const result = await response.json();
      return result.content;
    }
  }

  async getAvgByAuthor(id: number): Promise<number | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_FEEDBACK_AVG_BY_USER_ID(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to retrieve average rating by author");
      return null;
    } else {
      const result = await response.json();
      return result;
    }
  }
}
