import { User } from '../models/user';
export interface LoginResponse {
    success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    loginTime: string;
    expiresIn: string;
  };
}
