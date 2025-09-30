import { Schema } from "mongoose";
import Event from "../models/Event.model";
import { IEvent } from "../types/events.types";
import AppError from "../utils/appError.utils";

class EventService {
  static async getEvents() {
    const events = await Event.find({});
    if (!events) {
      throw new AppError(404, "Events not found");
    }
    return events;
  }

  static async getEvent(id: string) {
    const event = await Event.findById(id);
    if (!event) {
      throw new AppError(404, "Event not found");
    }
    return event;
  }

  static async createEvent(event: IEvent) {
    const newEvent = await Event.create(event);
    if (event.capacity <= 0) {
      throw new AppError(400, "Capacity must be greater than zero");
    }
    if (new Date(event.date).getTime() < Date.now()) {
      throw new AppError(400, "Event date cannot be in the past");
    }
    return newEvent;
  }

  static async updateEvent(
    userId: Schema.Types.ObjectId,
    eventId: string,
    event: IEvent
  ) {
    const eventToUpdate = await Event.findById(eventId);
    if (!eventToUpdate) {
      throw new AppError(404, "Event not found");
    }
    if (eventToUpdate.organizerId.toString() !== userId.toString()) {
      throw new AppError(403, "You are not the organizer of this event");
    }
    if (event.capacity && event.capacity < eventToUpdate.attendees.length) {
      throw new AppError(
        400,
        "New capacity cannot be less than current attendees"
      );
    }
    const today = new Date();
    if (event.date && new Date(event.date).getTime() < Date.now()) {
      throw new AppError(400, "Event date cannot be in the past");
    }
    const allowedFields = ["title", "description", "date", "capacity"];
    for (const field of allowedFields) {
      if (event[field as keyof IEvent]) {
        eventToUpdate.set(field, event[field as keyof IEvent]);
      }
    }
    await eventToUpdate.save();
    return eventToUpdate;
  }

  static async deleteEvent(userId: Schema.Types.ObjectId, eventId: string) {
    const eventToDelete = await Event.findById(eventId);
    if (!eventToDelete) {
      throw new AppError(400, "Event not found");
    }
    if (eventToDelete.organizerId.toString() !== userId.toString()) {
      throw new AppError(403, "You are not the organizer of this event");
    }
    await eventToDelete.deleteOne();
    return eventToDelete;
  }
}

export default EventService;
