import type { AuditLog } from "@/features/security/models/Security";

export interface AdminStats {
  totalUsers: number;
  activeSessions: number;
  lockedAccounts: number;
  recentAuditLogs: AuditLog[];
}
