import { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  active: boolean;
  comparePassword(userPassword: string): Promise<boolean>;
}

export interface UserResponse {
  status: number;
  message: string;
  data: IUser;
}

export interface IUserModel extends Model<IUser> {
  login(email: string, password: string): Promise<IUser>;
}
