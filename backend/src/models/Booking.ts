import { Schema, model, type Document } from "mongoose";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface IBooking extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message?: string;
  startsAt: Date;
  durationMin: number;
  timezone: string;
  status: BookingStatus;
  meetingType: "video" | "phone" | "in-person";
  meetingLink?: string;
  notes?: string;
  ip?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, trim: true, maxlength: 2000 },
    startsAt: { type: Date, required: true, index: true },
    durationMin: { type: Number, default: 60, min: 15, max: 240 },
    timezone: { type: String, default: "Asia/Riyadh" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
    meetingType: {
      type: String,
      enum: ["video", "phone", "in-person"],
      default: "video",
    },
    meetingLink: String,
    notes: String,
    ip: String,
  },
  { timestamps: true },
);

// Unique active slot — prevents double-booking via DB constraint.
// Cancelled bookings are excluded so the slot can be re-booked.
BookingSchema.index(
  { startsAt: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "confirmed"] } },
    name: "unique_active_slot",
  },
);

BookingSchema.index({ startsAt: 1, status: 1 });

export const Booking = model<IBooking>("Booking", BookingSchema);
