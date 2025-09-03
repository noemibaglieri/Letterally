import { toast } from "react-toastify";
import { Constants } from "../constants";
import type { Essay } from "../interfaces/Essay";
import { StorageService } from "./storage.service";

export class EssayService {
  async getById(id: number): Promise<Essay | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_ESSAY_BY_ID(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to retrieve essay");
      return null;
    } else {
      const result = response.json();
      return result;
    }
  }

  async countAllEssaysByUser(id: number): Promise<number | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_COUNT_ALL_USER_ESSAY(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to count essays");
      return null;
    } else {
      const result = await response.json();
      return result;
    }
  }

  async getAllByTopicId(id: number): Promise<(Essay | null)[]> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_ESSAY_ALL_BY_TOPIC_ID(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to retrieve essays");
      return [];
    } else {
      const result = await response.json();
      return result.content;
    }
  }

  async getAllByUserId(id: number): Promise<(Essay | null)[]> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_ESSAY_ALL_BY_USER_ID(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to retrieve essays");
      return [];
    } else {
      const result = await response.json();
      return result.content;
    }
  }
}
