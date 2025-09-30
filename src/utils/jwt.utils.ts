import jwt from "jsonwebtoken";
import { Schema } from "mongoose";

export function generateToken(userId: Schema.Types.ObjectId) {
  try {
    const expiresIn = process.env.JWT_EXPIRES_IN
      ? parseInt(process.env.JWT_EXPIRES_IN)
      : undefined;

    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET as string,
      expiresIn ? { expiresIn } : undefined
    );

    return token;
  } catch (error) {
    return null;
  }
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error) {
    return null;
  }
}
