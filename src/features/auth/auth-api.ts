import api from "@/lib/axios";
import type { LoginRequest, RegisterRequest, AuthResponse } from "@/types";

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", data).then((r) => r.data),
};
