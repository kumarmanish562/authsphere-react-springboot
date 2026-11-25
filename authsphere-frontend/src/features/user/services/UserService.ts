import apiClient from "@/features/common/config/ApiClient";
import type User from "@/features/user/models/User";
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserSettings,
} from "@/features/user/models/UserSettings";

export const fetchCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get<User>("/users/me");
  return data;
};

export const updateProfile = async (
  payload: UpdateProfileRequest
): Promise<User> => {
  const { data } = await apiClient.put<User>("/users/profile", payload);
  return data;
};

export const changePassword = async (
  payload: ChangePasswordRequest
): Promise<void> => {
  await apiClient.put("/users/change-password", payload);
};

export const getUserSettings = async (): Promise<UserSettings> => {
  const { data } = await apiClient.get<UserSettings>("/users/settings");
  return data;
};

export const updateUserSettings = async (
  payload: UserSettings
): Promise<UserSettings> => {
  const { data } = await apiClient.put<UserSettings>("/users/settings", payload);
  return data;
};

export const deleteOwnAccount = async (): Promise<void> => {
  await apiClient.delete("/users/me");
};
