import { toast } from "react-toastify";
import { Constants } from "../constants";
import type { Topic } from "../interfaces/Topic";
import { StorageService } from "./storage.service";

export class TopicService {
  async getActiveTopic(): Promise<Topic[] | null> {
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
      const result = response.json();
      return result;
    }
  }
}
