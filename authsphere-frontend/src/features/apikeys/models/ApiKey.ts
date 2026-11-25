export interface ApiKey {
  id: string;
  name: string;
  maskedKey: string;
  environment: string;
  scopes: string;
  active: boolean;
  createdAt: string;
  expiresAt?: string | null;
  lastUsedAt?: string | null;
  plainTextKey?: string | null;
}

export interface CreateApiKeyRequest {
  name: string;
  environment?: "LIVE" | "TEST";
  scopes?: string;
  expiresInDays?: number | null;
}
