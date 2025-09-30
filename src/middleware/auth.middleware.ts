import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided or invalid format." });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        status: 401,
        message: "Invalid token",
      });
    }
    next();
  } catch (error) {
    return res.status(403).json({
      status: 403,
      message: "Invalid token",
    });
  }
}

export default authMiddleware;
