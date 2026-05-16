import api from "@/lib/axios";
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ChangeContactRequest,
} from "@/types";

export const profileApi = {
  getProfile: () =>
    api.get<UserProfile>("/me/profile").then((r) => r.data),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put<UserProfile>("/me/profile", data).then((r) => r.data),

  changePassword: (data: ChangePasswordRequest) =>
    api.put<string>("/me/change-password", data).then((r) => r.data),

  changeContact: (data: ChangeContactRequest) =>
    api.put<string>("/me/change-contact", data).then((r) => r.data),
};
