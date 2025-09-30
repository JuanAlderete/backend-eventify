require("dotenv").config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.middleware";
import { connectDB } from "./config/database";
import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/events.routes";
const app = express();

// Access environment variables
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 8080;

if (!apiKey) {
  console.error(
    "Error: Las variables de entorno DB_HOST, DB_PORT y API_KEY son obligatorias."
  );
  process.exit(1);
}

const portNumber = parseInt(port as string, 10);
if (isNaN(portNumber)) {
  console.error(
    `Error: La variable de entorno PORT "${port}" no es un número válido.`
  );
  process.exit(1);
}

const startServer = async () => {
  try {
    await connectDB();
    console.log(`📦 Conectado a MongoDB`);
    console.log(`   Base de datos: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Puerto: ${mongoose.connection.port}`);
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      console.log(
        "Colecciones en la base de datos:",
        collections.map((c) => c.name)
      );
    }
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

startServer();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    status: 200,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
