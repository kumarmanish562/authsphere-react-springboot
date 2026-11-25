import apiClient from "@/features/common/config/ApiClient";
import type { UserSession } from "@/features/sessions/models/Session";

export const getActiveSessions = async (): Promise<UserSession[]> => {
  const { data } = await apiClient.get<UserSession[]>("/sessions");
  return data;
};

export const revokeSession = async (sessionId: string): Promise<void> => {
  await apiClient.delete(`/sessions/${sessionId}`);
};

export const revokeOtherSessions = async (): Promise<void> => {
  await apiClient.delete("/sessions/other");
};
