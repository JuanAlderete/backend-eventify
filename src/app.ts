require("dotenv").config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { time } from "console";
const app = express();

// Access environment variables
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 8080;

// Your application logic here
console.log(`Connecting to database at ${dbHost} with user ${dbUser}`);
console.log(`Using API Key: ${apiKey}`);

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/api/health", (req, res) => {
  res.json({
    status: 200,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

