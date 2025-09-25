require("dotenv").config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import AppError from "./utils/appError";
const app = express();

// Access environment variables
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 8080;

if (!dbHost || !port || !apiKey) {
  console.error(
    "Error: Las variables de entorno DB_HOST, DB_PORT y API_KEY son obligatorias."
  );
  process.exit(1); // Sale de la aplicación si faltan variables
}

const portNumber = parseInt(port as string, 10);
if (isNaN(portNumber)) {
  console.error(
    `Error: La variable de entorno PORT "${port}" no es un número válido.`
  );
  process.exit(1);
}

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

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

console.log(`Connecting to database at ${dbHost} with user ${dbUser}`);
console.log(`Using API Key: ${apiKey}`);

app.get("/api/health", (req, res) => {
  res.json({
    status: 200,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
