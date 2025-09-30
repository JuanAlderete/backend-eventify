import express from "express";
import AuthController from "../controllers/auth.controller";

const authRoutes: express.Router = express.Router();

authRoutes.post("/login", AuthController.login);

authRoutes.post("/register", AuthController.register);

export default authRoutes;
