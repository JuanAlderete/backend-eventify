// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError.utils";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Si no es AppError, error desconocido -> mensaje genérico
  console.error("❌ Error inesperado:", err);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong! Please try again later.",
  });
};

export default errorHandler;
