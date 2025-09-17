import { toast } from "react-toastify";
import { Constants } from "../constants";
import type { CreateTopicPayload, Topic } from "../interfaces/Topic";
import { StorageService } from "./storage.service";
import type { PageResponse } from "../interfaces/Types";

export class TopicService {
  async getAll(page = 0, size = 20, sortBy = "startDate", direction: "asc" | "desc" = "asc", date?: string): Promise<PageResponse<Topic> | null> {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sortBy,
      direction,
    });
    if (date) params.set("date", date);

    const response = await fetch(`${Constants.API_URL}${Constants.API_TOPIC_ALL}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      toast.error(errorData.message || "Failed to retrieve topics");
      return null;
    }

    return (await response.json()) as PageResponse<Topic>;
  }

  async getActiveTopic(): Promise<Topic | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_TOPIC_CURRENT}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to retrieve current topic");
      return null;
    } else {
      const result = await response.json();
      return result;
    }
  }

  async getTopicById(id: number): Promise<Topic | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_TOPIC_BY_ID(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to retrieve topic");
      return null;
    } else {
      const result = await response.json();
      return result;
    }
  }

  async create(payload: CreateTopicPayload): Promise<Topic | null> {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("startDate", payload.startDate);
    formData.append("categoryId", String(payload.categoryId));
    formData.append("image", payload.image);

    const response = await fetch(`${Constants.API_URL}${Constants.API_TOPIC_ALL}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + StorageService.getToken(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to create topic");
      return null;
    } else {
      const result = await response.json();
      return result;
    }
  }

  async delete(id: number): Promise<boolean> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_TOPIC_ALL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete topic");
      } catch {
        toast.error("Failed to delete topic");
      }
      return false;
    }

    toast.success("Essay deleted successfully");
    return true;
  }
}
