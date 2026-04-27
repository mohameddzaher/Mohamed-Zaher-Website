import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "admin" | "client";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  company?: string;
  active: boolean;
  lastLogin?: Date;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(plain: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "client"], default: "client", index: true },
    avatar: String,
    phone: String,
    company: String,
    active: { type: Boolean, default: true },
    lastLogin: Date,
    refreshTokenHash: { type: String, select: false },
  },
  { timestamps: true },
);

UserSchema.methods.comparePassword = async function (plain: string) {
  return bcrypt.compare(plain, this.passwordHash);
};

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export const User = model<IUser>("User", UserSchema);
