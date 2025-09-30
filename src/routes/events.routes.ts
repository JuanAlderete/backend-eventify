import express from "express";
import EventController from "../controllers/event.controller";
import authMiddleware from "../middleware/auth.middleware";

const eventRoutes: express.Router = express.Router();

//Rutas publicas
eventRoutes.get("/", EventController.getEvents);

eventRoutes.get("/:id", EventController.getEvent);

//Rutas privadas por middleware
eventRoutes.post("/", authMiddleware, EventController.createEvent);

eventRoutes.put("/:id", authMiddleware, EventController.updateEvent);

eventRoutes.delete("/:id", authMiddleware, EventController.deleteEvent);

export default eventRoutes;
