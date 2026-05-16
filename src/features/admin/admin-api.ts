import api from "@/lib/axios";
import type { UserProfile } from "@/types";

export const adminApi = {
  getUsers: () =>
    api.get<UserProfile[]>("/admin/users").then((r) => r.data),

  assignRoles: (userId: number, roles: string[]) =>
    api.put<string>(`/admin/users/${userId}/roles`, roles).then((r) => r.data),

  deactivateUser: (userId: number) =>
    api.delete<string>(`/admin/users/${userId}`).then((r) => r.data),
};
