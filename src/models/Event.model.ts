import mongoose, { UpdateQuery } from "mongoose";
import { IAttendee, IEvent } from "../types/events.types";

const validateDate = (date: Date) => {
  const today = new Date();
  return date.getTime() > today.getTime();
};

function validateAttendeesMax(this: IEvent, attendees: IAttendee[]) {
  return attendees.length <= this.capacity;
}

const eventsSchema = new mongoose.Schema({
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    validate: [
      validateDate,
      "Please fill a valid date. It must be in the future.",
    ],
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  capacity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  attendees: {
    type: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
          required: true,
        },
        registered_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
    validate: [validateAttendeesMax, "Capacity exceeded"],
  },
});

eventsSchema.index({ date: 1 });
eventsSchema.index({ organizerId: 1 });
eventsSchema.index({ location: 1 });
eventsSchema.index({ title: "text", description: "text" });

eventsSchema.methods.hasAvailableSpots = function () {
  return this.capacity - this.attendees.length > 0;
};

eventsSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as UpdateQuery<IEvent> & {
    $push?: { attendees?: IAttendee };
  };

  if (update?.$push?.attendees) {
    try {
      const doc = await this.model.findOne(this.getQuery()).exec();
      if (!doc) return next(new Error("Event not found"));

      const newLength = doc.attendees.length + 1;
      if (newLength > doc.capacity) {
        return next(new Error("Capacity exceeded: cannot add more attendees"));
      }
    } catch (err) {
      return next(err as Error);
    }
  }

  next();
});

const Events = mongoose.model<IEvent>("Events", eventsSchema);

export default Events;
