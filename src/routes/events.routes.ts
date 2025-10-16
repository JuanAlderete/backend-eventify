import express from "express";
import EventController from "../controllers/event.controller";
import authMiddleware from "../middleware/auth.middleware";

const eventRoutes: express.Router = express.Router();

// GET
eventRoutes.get("/", EventController.getEvents);

eventRoutes.get(
  "/my-attendances",
  authMiddleware,
  EventController.getUserAttendances
);

// POST
eventRoutes.post("/", authMiddleware, EventController.createEvent);

// PUT
eventRoutes.put("/:id", authMiddleware, EventController.updateEvent);

// DELETE
eventRoutes.delete("/:id", authMiddleware, EventController.deleteEvent);

// WITH PARAMS
eventRoutes.get("/:id", EventController.getEvent);
eventRoutes.post("/:id/attend", authMiddleware, EventController.attendEvent);
eventRoutes.delete(
  "/:id/attend",
  authMiddleware,
  EventController.unattendEvent
);

export default eventRoutes;
