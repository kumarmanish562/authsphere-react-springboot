import apiClient from "@/features/common/config/ApiClient";
import type { ApiKey, CreateApiKeyRequest } from "@/features/apikeys/models/ApiKey";

export const listApiKeys = async (): Promise<ApiKey[]> => {
  const { data } = await apiClient.get<ApiKey[]>("/api-keys");
  return data;
};

export const createApiKey = async (
  payload: CreateApiKeyRequest
): Promise<ApiKey> => {
  const { data } = await apiClient.post<ApiKey>("/api-keys", payload);
  return data;
};

export const revokeApiKey = async (keyId: string): Promise<void> => {
  await apiClient.delete(`/api-keys/${keyId}`);
};
