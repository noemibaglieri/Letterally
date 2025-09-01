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
}
