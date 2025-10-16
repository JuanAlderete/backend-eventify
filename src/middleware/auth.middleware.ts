import { Request, Response, NextFunction } from "express";
import { JwtPayload, verifyToken } from "../utils/jwt.utils";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided or invalid format." });
  }

  try {
    const cleanToken = token.startsWith("Bearer ")
      ? token.slice(7).trim()
      : token;
    const decoded = (await verifyToken(cleanToken)) as JwtPayload["id"];
    if (!decoded) {
      return res.status(401).json({ status: 401, message: "Invalid token" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      status: 403,
      message: "Invalid token",
    });
  }
}

export default authMiddleware;
