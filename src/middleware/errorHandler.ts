import express from "express";
import AppError from "../utils/appError";

const errorHandler = (
  err: express.ErrorRequestHandler,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }
  console.error(err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};

export default errorHandler;
