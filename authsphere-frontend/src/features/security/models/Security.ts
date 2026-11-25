export interface AuditLog {
  id: string;
  action: string;
  description: string;
  status: string;
  ipAddress: string;
  createdAt: string;
}

export interface SecurityRequirement {
  key: string;
  title: string;
  description: string;
  completed: boolean;
  points: number;
}

export interface AuthMethod {
  key: string;
  title: string;
  description: string;
  status: string;
  active: boolean;
}

export interface SecurityOverview {
  securityScore: number;
  activeSessionsCount: number;
  apiStatus: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  requirements: SecurityRequirement[];
  authMethods: AuthMethod[];
  recentActivity: AuditLog[];
}
