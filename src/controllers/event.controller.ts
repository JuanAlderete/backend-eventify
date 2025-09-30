import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.utils";
import EventService from "../services/event.service";
import mongoose from "mongoose";

class EventController {
  static async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await EventService.getEvents();
      res.json({
        status: 200,
        message: "Successfully retrieved events",
        data: events,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      if (!eventId) {
        return next(new AppError(400, "Event id is required"));
      }
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return next(new AppError(400, "Invalid event ID format"));
      }
      const event = await EventService.getEvent(eventId);
      res.json({
        status: 200,
        message: "Successfully retrieved event",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return next(new AppError(400, "Request body is required"));
      }
      const { title, description, date, capacity } = req.body;
      if (!title || !date || !capacity || !description) {
        return next(
          new AppError(
            400,
            "Title, date, description and capacity are required"
          )
        );
      }
      if (typeof capacity !== "number") {
        return next(new AppError(400, "Capacity must be a number"));
      }
      const event = await EventService.createEvent(req.body);
      res.status(201).json({
        status: "success",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return next(new AppError(400, "Request body is required"));
      }
      const { title, description, date, capacity } = req.body;
      if (!title || !date || !capacity || !description) {
        return next(
          new AppError(
            400,
            "Title, date, description and capacity are required"
          )
        );
      }
      if (typeof capacity !== "number") {
        return next(new AppError(400, "Capacity must be a number"));
      }
      const updatedEvent = await EventService.updateEvent(
        req.user.id,
        req.params.id,
        req.body
      );
      res.json({
        status: 200,
        message: "Successfully updated event",
        data: updatedEvent,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      if (!eventId) {
        return next(new AppError(400, "Event id is required"));
      }
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return next(new AppError(400, "Invalid event ID format"));
      }
      const deletedEvent = await EventService.deleteEvent(req.user.id, eventId);
      res.json({
        status: 200,
        message: "Successfully deleted event",
        data: deletedEvent.id,
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export default EventController;
