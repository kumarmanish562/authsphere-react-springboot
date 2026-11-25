export interface UserSettings {
  securityNotifications: boolean;
  locationTracking: boolean;
  loginMonitoring: boolean;
  automaticTokenRotation: boolean;
  theme: string;
}

export interface UpdateProfileRequest {
  name: string;
  image?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
