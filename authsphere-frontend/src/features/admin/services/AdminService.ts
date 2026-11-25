import apiClient from "@/features/common/config/ApiClient";
import type { AdminStats } from "@/features/admin/models/Admin";
import type User from "@/features/user/models/User";

export const getAdminStats = async (): Promise<AdminStats> => {
  const { data } = await apiClient.get<AdminStats>("/admin/stats");
  return data;
};

export const getAdminUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>("/admin/users");
  return data;
};

export const unlockAdminUser = async (userId: string): Promise<User> => {
  const { data } = await apiClient.put<User>(`/admin/users/${userId}/unlock`);
  return data;
};

export const toggleAdminUserStatus = async (
  userId: string,
  enabled: boolean
): Promise<User> => {
  const { data } = await apiClient.put<User>(`/admin/users/${userId}/status`, {
    enabled,
  });
  return data;
};

export const updateAdminUserRole = async (
  userId: string,
  role: "ROLE_USER" | "ROLE_ADMIN"
): Promise<User> => {
  const { data } = await apiClient.put<User>(`/admin/users/${userId}/role`, {
    role,
  });
  return data;
};
