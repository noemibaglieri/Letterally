import type { User } from "../interfaces/User";

export class StorageService {
  static saveToken(token: string): void {
    localStorage.setItem("authToken", token);
  }

  static getToken(): string {
    return localStorage.getItem("authToken")!;
  }

  static removeToken(): void {
    localStorage.removeItem("authToken");
  }

  static saveUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  }

  static getUser(): User | null {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(localStorage.getItem("user")!);
    } else {
      return null;
    }
  }

  static removeUser(): void {
    localStorage.removeItem("user");
  }
}
