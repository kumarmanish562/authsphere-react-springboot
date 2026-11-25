export interface UserSession {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActiveAt: string;
  createdAt: string;
  current: boolean;
  secure: boolean;
}
