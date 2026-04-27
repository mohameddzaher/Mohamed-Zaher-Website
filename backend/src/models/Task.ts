import { Schema, model, type Document, type Types } from "mongoose";

export type TaskStatus = "todo" | "in-progress" | "done" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskType = "task" | "meeting" | "call" | "note" | "deadline";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  dueAt?: Date;
  startsAt?: Date;
  durationMin?: number;
  meetingWith?: string;
  meetingLocation?: string;
  tags: string[];
  completedAt?: Date;
  relatedBooking?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 4000 },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done", "cancelled"],
      default: "todo",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,
    },
    type: {
      type: String,
      enum: ["task", "meeting", "call", "note", "deadline"],
      default: "task",
      index: true,
    },
    dueAt: { type: Date, index: true },
    startsAt: { type: Date, index: true },
    durationMin: { type: Number, min: 5, max: 600 },
    meetingWith: String,
    meetingLocation: String,
    tags: [{ type: String, trim: true }],
    completedAt: Date,
    relatedBooking: { type: Schema.Types.ObjectId, ref: "Booking" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
);

TaskSchema.index({ status: 1, dueAt: 1 });
TaskSchema.index({ createdBy: 1, status: 1 });

export const Task = model<ITask>("Task", TaskSchema);
