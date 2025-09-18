import { toast } from "react-toastify";
import { Constants } from "../constants";
import type { Feedback } from "../interfaces/Feedback";
import { StorageService } from "./storage.service";
import type { PageResponse } from "../interfaces/Types";

export class FeedbackService {
  async getAll(page = 0, size = 50): Promise<PageResponse<Feedback> | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_FEEDBACK_PAGE(page, size)}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to retrieve comments");
      return null;
    } else {
      const result = await response.json();
      return result;
    }
  }

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

  async getAvgByEssay(id: number): Promise<number | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_FEEDBACK_AVG_BY_ESSAY_ID(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to retrieve average rating by essay");
      return null;
    } else {
      const result = await response.json();
      return result;
    }
  }

  async postFeedback(essayId: number, value: number, content: string): Promise<Feedback | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_FEEDBACK_SEND}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
      body: JSON.stringify({ essayId, value, content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Comment failed to send");
      return null;
    } else {
      const result = await response.json();
      return result;
    }
  }

  async delete(id: number): Promise<boolean> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_FEEDBACK_BY_ID(id)}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + StorageService.getToken() },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to delete comment");
      return false;
    }
    toast.success("Comment deleted");
    return true;
  }
}
