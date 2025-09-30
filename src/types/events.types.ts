import { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  id: Schema.Types.ObjectId;
  organizerId: Schema.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  imageUrl?: string;
  capacity: number;
  attendees: IAttendee[];
  hasAvailableSpots: () => boolean;
}

export interface EventResponse {
  status: number;
  message: string;
  data: IEvent;
}

export interface IAttendee {
  userId: Schema.Types.ObjectId;
  registered_at?: Date;
}
