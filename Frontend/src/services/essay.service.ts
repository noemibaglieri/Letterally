import { toast } from "react-toastify";
import { Constants } from "../constants";
import type { CreateEssayPayload, Essay, EssayResponse, UpdateEssayPayload } from "../interfaces/Essay";
import { StorageService } from "./storage.service";
import type { PageResponse } from "../interfaces/Types";

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
      const result = await response.json();
      return result;
    }
  }

  async getLatestByCategoryId(id: number): Promise<Essay | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_ESSAY_LAST_BY_CATEGORY(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failted to retrieve essay");
      return null;
    } else {
      const result = await response.json();
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

  async getAllOwnEssays(page: number, size: number): Promise<PageResponse<EssayResponse> | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_ESSAY_MINE(page, size)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to retrieve essays");
      return null;
    } else {
      const result = await response.json();
      return result;
    }
  }

  async getMyEssayIdForTopic(topicId: number): Promise<number | null> {
    const page = await this.getAllOwnEssays(0, 100);
    if (!page) return null;
    const match = page.content.find((e: EssayResponse) => e.topic?.id === topicId);
    return match ? match.id! : null;
  }

  async getAllYetToFeedback(page: number, size: number): Promise<PageResponse<EssayResponse> | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_ESSAY_YET_TO_FEEDBACK(page, size)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to retrieve essays");
      return null;
    } else {
      const result = await response.json();
      return result;
    }
  }

  async getTop3Weekly(): Promise<(EssayResponse | null)[]> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_ESSAY_WEEKLY_TOP3}`, {
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
      return result;
    }
  }

  async create(payload: CreateEssayPayload): Promise<Essay | null> {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    formData.append("image", payload.imageFile);
    formData.append("topicId", String(payload.topicId));

    const response = await fetch(`${Constants.API_URL}${Constants.API_ESSAY}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + StorageService.getToken(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to create essay");
      return null;
    } else {
      const result = await response.json();
      return result;
    }
  }

  async update(payload: UpdateEssayPayload, id: number): Promise<Essay | null> {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    formData.append("topicId", String(payload.topicId));

    if (payload.imageFile) {
      formData.append("image", payload.imageFile);
    }

    const response = await fetch(`${Constants.API_URL}${Constants.API_ESSAY}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + StorageService.getToken(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to update essay");
      return null;
    } else {
      const result = await response.json();
      return result;
    }
  }

  async delete(id: number): Promise<boolean> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_ESSAY}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete essay");
      } catch {
        toast.error("Failed to delete essay");
      }
      return false;
    }

    toast.success("Essay deleted successfully");
    return true;
  }

  async hasWrittenForTopic(topicId: number): Promise<boolean> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_ESSAY_EXISTS_BY_TOPIC(topicId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      try {
        const err = await response.json();
        toast.error(err.message || "Failed to check essay existence");
      } catch {
        toast.error("Failed to check essay existence");
      }
      return false;
    }

    const result: boolean = await response.json();
    return result;
  }

  async getAll(page = 0, size = 50): Promise<PageResponse<EssayResponse> | null> {
    const res = await fetch(`${Constants.API_URL}${Constants.API_ESSAY_PAGE(page, size)}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.message || "Failed to retrieve essays");
      return null;
    }
    return res.json();
  }
}
