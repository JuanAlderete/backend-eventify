import mongoose from "mongoose";

const validateDate = (date: Date) => {
  const today = new Date();
  return date.getTime() > today.getTime();
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
  attendees:{
    type: Array<mongoose.Schema.Types.ObjectId>,
    ref: "Users",
    required: true,
  }
});

const Events = mongoose.model("Events", eventsSchema);
export default Events;
