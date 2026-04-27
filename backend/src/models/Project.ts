import { Schema, model, type Document } from "mongoose";
import { I18nStringSchema, type I18nString } from "./i18nString";

export type ProjectCategory = "web" | "ecommerce" | "business" | "realestate" | "edtech";

export interface IProject extends Document {
  slug: string;
  title: I18nString;
  description: I18nString;
  longDescription?: I18nString;
  thumbnail?: string;
  gallery: string[];
  tech: string[];
  category: ProjectCategory;
  featured: boolean;
  demoUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  order: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    title: { type: I18nStringSchema, required: true },
    description: { type: I18nStringSchema, required: true },
    longDescription: I18nStringSchema,
    thumbnail: String,
    gallery: [String],
    tech: [String],
    category: {
      type: String,
      enum: ["web", "ecommerce", "business", "realestate", "edtech"],
      required: true,
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    demoUrl: String,
    githubUrl: String,
    caseStudyUrl: String,
    order: { type: Number, default: 0, index: true },
    publishedAt: Date,
  },
  { timestamps: true },
);

export const Project = model<IProject>("Project", ProjectSchema);
