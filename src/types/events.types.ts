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
  name: string;
  email: string;
  registered_at?: Date;
}

export interface IEventQueryParams {
  page?: string;
  limit?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}
