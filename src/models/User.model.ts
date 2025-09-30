import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserModel } from "../types/user.types";
import { validateEmail } from "../utils/utils";
import AppError from "../utils/appError.utils";

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updated_at: {
    type: Date,
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
});

usersSchema.index({ name: "text", email: "text" });

usersSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});

usersSchema.post("save", async function (user) {
  if (user.isNew) {
    console.log("New user created:", user);
  } else {
    console.log("User updated:", user);
  }
});

usersSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

usersSchema.statics.login = async function (
  email: string,
  password: string
): Promise<IUser> {
  const user = await this.findOne({ email, active: true }).select("+password");
  if (!user) throw new AppError(401, "Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError(401, "Invalid credentials");

  return user;
};

const Users = mongoose.model<IUser, IUserModel>("Users", usersSchema);

export default Users;
