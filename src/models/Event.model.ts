import mongoose from "mongoose";

const validateDate = (date: Date) => {
  const today = new Date();
  return date.getTime() > today.getTime();
};

// Validar que la capacidad del evento no supere el maximo permitido(capacity)
const validateAttendeesMax = (attendees: string[], capacity: number) => {
  return attendees.length <= capacity;
};

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
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    ref: "Users",
    required: true,
    default: [],
    validate: [validateAttendeesMax, "Capacity exceded"],
  },
});

eventsSchema.methods.hasAvailableSpots = function () {
  return this.capacity - this.attendees.length > 0;
};

const Events = mongoose.model("Events", eventsSchema);
export default Events;
