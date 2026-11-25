import type User from "@/features/user/models/User";

export default interface LoginResponseData {
  accessToken: string;
  user: User;
  refreshToken: string;
  expiresIn: number;
}