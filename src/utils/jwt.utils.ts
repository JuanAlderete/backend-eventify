import jwt from "jsonwebtoken";
import { Schema } from "mongoose";

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export function generateToken(userId: Schema.Types.ObjectId) {
  try {
    const expiresIn = process.env.JWT_EXPIRES_IN
      ? parseInt(process.env.JWT_EXPIRES_IN)
      : 86400;
    const payload = { id: userId.toString() };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn,
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    return decoded.id;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
