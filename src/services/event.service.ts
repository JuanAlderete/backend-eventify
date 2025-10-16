import { Schema } from "mongoose";
import Event from "../models/Event.model";
import { IEvent } from "../types/events.types";
import AppError from "../utils/appError.utils";
import {
  buildEventFilters,
  buildPagination,
} from "../utils/query-builder.utils";
import Users from "../models/User.model";

class EventService {
  static async getEvents(queryParams: Record<string, any>) {
    //FILTROS DE BUSQUEDA
    const filters = buildEventFilters(queryParams);
    const total = await Event.countDocuments(filters);
    const pagination = buildPagination(
      queryParams.page,
      queryParams.limit,
      total
    );
    const sortBy = queryParams.sortBy || "date";
    const order = queryParams.order === "asc" ? 1 : -1;
    // ------------------------------- //
    const events = await Event.find(filters)
      .sort([[sortBy, order]])
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage)
      //.populate -> Reemplaza el organizerId por el nombre y email de la persona que creo el evento
      .populate("organizerId", "name email");
    if (!events) {
      throw new AppError(404, "Events not found");
    }
    return {
      events,
      pagination: {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalEvents: pagination.total,
        eventsPerPage: pagination.itemsPerPage,
        hasNextPage: pagination.hasNextPage,
        hasPrevPage: pagination.hasPrevPage,
      },
    };
  }

  static async getEvent(id: string) {
    const event = await Event.findById(id);
    if (!event) {
      throw new AppError(404, "Event not found");
    }
    return event;
  }

  static async createEvent(event: IEvent, organizerId: string) {
    if (event.capacity <= 0) {
      throw new AppError(400, "Capacity must be greater than zero");
    }
    if (new Date(event.date).getTime() < Date.now()) {
      throw new AppError(400, "Event date cannot be in the past");
    }
    const newEvent = await Event.create({
      ...event,
      organizerId,
    });
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

  static async attendEvent(eventId: string, userId: Schema.Types.ObjectId) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError(404, "Event not found");
    }
    if (event.organizerId === userId) {
      throw new AppError(400, "The organizer cannot register for your event");
    }
    if (new Date(event.date) < new Date()) {
      throw new AppError(400, "Cannot attend past events ");
    }
    if (
      event.attendees.some(
        (attendee) => attendee.userId.toString() === userId.toString()
      )
    ) {
      throw new AppError(400, "Already registered for this event");
    }
    if (!event.hasAvailableSpots()) {
      throw new AppError(400, "Event is full");
    }
    const user = await Users.findById(userId);
    if (!user) throw new AppError(404, "User not found");
    const attendeeData = {
      userId: user._id as Schema.Types.ObjectId,
      name: user.name,
      email: user.email,
      registeredAt: new Date(),
    };
    event.attendees.push(attendeeData);
    await event.save();
    return event;
  }

  static async unattendEvent(eventId: string, userId: Schema.Types.ObjectId) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError(404, "Event not found");
    }
    const attendeeIndex = event.attendees.findIndex(
      (attendee) => attendee.userId.toString() === userId.toString()
    );
    if (attendeeIndex === -1) {
      throw new AppError(400, "Not registered for this event");
    }
    event.attendees.splice(attendeeIndex, 1);
    await event.save();
    return event;
  }

  static async getUserAttendances(userId: Schema.Types.ObjectId) {
    const events = await Event.find({
      "attendees.userId": userId,
    })
      .sort({ date: 1 })
      .populate("organizerId", "name");
    const eventsWithRegistration = events.map((event) => {
      const attendee = event.attendees.find(
        (a) => a.userId.toString() === userId.toString()
      );
      return {
        ...event.toObject(),
        myRegistrationDate: attendee?.registered_at,
      };
    });
    return eventsWithRegistration;
  }
}

export default EventService;
