import User from "../models/User.model";
import AppError from "../utils/appError.utils";
import { generateToken } from "../utils/jwt.utils";

class AuthService {
  static async login(email: string, password: string) {
    try {
      const user = await User.login(email, password);
      if (!user) {
        throw new AppError(401, "Invalid credentials");
      }
      const token = generateToken(user.id);
      if (!token) {
        throw new Error("Token generation failed");
      }
      return { user, token };
    } catch (err) {
      throw err;
    }
  }

  static async register(email: string, password: string) {
    const user = await User.create({
      name: email,
      email,
      password,
    });
    return user;
  }
}

export default AuthService;
