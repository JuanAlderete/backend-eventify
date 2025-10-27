import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.utils";
import EventService from "../services/event.service";
import mongoose from "mongoose";

class EventController {
  static async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await EventService.getEvents(req.query);
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
      const { id: eventId } = req.params;
      if (!eventId) {
        return next(new AppError(400, "Event id is required 4"));
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
      const { title, description, date, capacity, location } = req.body;
      if (!title || !date || !capacity || !description || !location) {
        return next(
          new AppError(
            400,
            "Title, date, description, capacity and location are required"
          )
        );
      }
      if (typeof capacity !== "number") {
        return next(new AppError(400, "Capacity must be a number"));
      }
      if (!req.user) {
        return next(new AppError(400, "User id is required"));
      }
      const event = await EventService.createEvent(req.body, req.user);
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
      if (!req.user) {
        return next(new AppError(400, "User id is required"));
      }
      const updatedEvent = await EventService.updateEvent(
        req.user,
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
      const { id: eventId } = req.params;
      if (!eventId) {
        return next(new AppError(400, "Event id is required 3"));
      }
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return next(new AppError(400, "Invalid event ID format"));
      }
      if (!req.user) {
        return next(new AppError(400, "User id is required"));
      }
      const deletedEvent = await EventService.deleteEvent(req.user, eventId);
      res.json({
        status: 200,
        message: "Successfully deleted event",
        data: deletedEvent.id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async attendEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: eventId } = req.params;
      if (!eventId) return next(new AppError(400, "Event id is required 1"));
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return next(new AppError(400, "Invalid event ID format"));
      }
      if (!req.user) {
        return next(new AppError(400, "User id is required"));
      }
      const event = await EventService.attendEvent(eventId, req.user);
      res.json({
        status: 200,
        message: "Successfully attend event",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  static async unattendEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: eventId } = req.params;
      if (!eventId) return next(new AppError(400, "Event id is required 2"));
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return next(new AppError(400, "Invalid event ID format"));
      }
      if (!req.user) {
        return next(new AppError(400, "User id is required"));
      }
      const event = await EventService.unattendEvent(eventId, req.user);
      res.json({
        status: 200,
        message: "Successfully unattend event",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserAttendances(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return next(new AppError(400, "User id is required"));
      }
      const event = await EventService.getUserAttendances(req.user);
      res.json({
        status: 200,
        message: "Successfully get user events",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default EventController;
