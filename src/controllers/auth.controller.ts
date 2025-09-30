import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import AppError from "../utils/appError.utils";
import { validateEmail } from "../utils/utils";

class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return next(new AppError(400, "Request body is required"));
      }
      const { email, password } = req.body;
      if (!email || !validateEmail(email)) {
        return next(new AppError(400, "Invalid email"));
      }
      if (!password || password.length < 6) {
        return next(
          new AppError(400, "Password must be at least 6 characters long")
        );
      }
      const result = await AuthService.login(email, password);
      if (!result) {
        return next(new AppError(401, "Invalid credentials"));
      }
      res.json({
        status: "success",
        message: "Successfully logged in",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return next(new AppError(400, "Request body is required"));
      }
      const { email, password } = req.body;
      if (!email || !validateEmail(email)) {
        return next(new AppError(400, "Invalid email"));
      }
      if (!password || password.length < 6) {
        return next(
          new AppError(400, "Password must be at least 6 characters long")
        );
      }
      const user = await AuthService.register(email, password);
      if (!user) {
        return next(new AppError(500, "Error registering user"));
      }
      res.json({
        status: 200,
        message: "Successfully registered",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
