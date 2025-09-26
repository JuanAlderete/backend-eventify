import { Document } from "mongoose";

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  imageUrl: string;
  capacity: number;
  attendees: string[];
}

export interface EventResponse {
  status: number;
  message: string;
  data: Event;
}

interface IEvent extends Document {
  organizerId: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  imageUrl: string;
  capacity: number;
  attendees: string[];
}