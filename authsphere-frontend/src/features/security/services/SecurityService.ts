import apiClient from "@/features/common/config/ApiClient";
import type { SecurityOverview } from "@/features/security/models/Security";
import type User from "@/features/user/models/User";

export const getSecurityOverview = async (): Promise<SecurityOverview> => {
  const { data } = await apiClient.get<SecurityOverview>("/security/overview");
  return data;
};

export const toggleTwoFactor = async (enabled: boolean): Promise<User> => {
  const { data } = await apiClient.put<User>("/security/two-factor", {
    enabled,
  });
  return data;
};

export const verifyEmail = async (): Promise<User> => {
  const { data } = await apiClient.post<User>("/security/verify-email");
  return data;
};
