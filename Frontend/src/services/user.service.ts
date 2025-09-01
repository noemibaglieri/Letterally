import { toast } from "react-toastify";
import { Constants } from "../constants";
import type { NewUserResponse, SignInResponse, User } from "../interfaces/User";
import { StorageService } from "./storage.service";

export class UserService {
  async createUser(user: User): Promise<NewUserResponse | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_AUTH_REGISTER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Registration failed");
      return null;
    } else {
      return response.json();
    }
  }

  async signIn(email: string, password: string): Promise<SignInResponse | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_AUTH_LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Login failed");
      return null;
    } else {
      const result = response.json();
      StorageService.saveToken((await result).accessToken);
      return result;
    }
  }

  async getProfile(): Promise<User | null> {
    const response = await fetch(`${Constants.API_URL}${Constants.API_USER_ME}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + StorageService.getToken(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to retrieve profile");
      return null;
    } else {
      const result = response.json();
      StorageService.saveUser(await result);
      return result;
    }
  }
}
