import { Document } from "mongoose";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  active: boolean;
}

export interface UserResponse {
  status: number;
  message: string;
  data: User;
}

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  active: boolean;
}
