/**
 * Compact model file — defines Experience, Venture, Skill, Certification,
 * NewsPost, Testimonial, ContactSubmission, NewsletterSubscriber, ClientProject,
 * Invoice, Payment, FileAsset, Message, SiteSettings, AnalyticsEvent.
 *
 * Major models (User, Project) live in their own files for clarity.
 */

import { Schema, model } from "mongoose";
import { I18nStringSchema } from "./i18nString";

/* -------------------- Experience -------------------- */
const ExperienceSchema = new Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    logo: String,
    start: { type: String, required: true },
    end: { type: String, default: "Present" },
    location: String,
    achievements: [{ type: String, required: true }],
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);
export const Experience = model("Experience", ExperienceSchema);

/* -------------------- Venture -------------------- */
const VentureSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    description: { type: I18nStringSchema, required: true },
    url: String,
    logo: String,
    category: {
      type: String,
      enum: ["Tech", "E-Commerce", "Logistics", "Consulting", "Founded"],
      required: true,
    },
    accent: { type: String, enum: ["brand", "violet"], default: "brand" },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);
export const Venture = model("Venture", VentureSchema);

/* -------------------- Skill -------------------- */
const SkillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["engineering", "business", "leadership"],
      required: true,
      index: true,
    },
    level: { type: Number, min: 0, max: 100, default: 80 },
    icon: String,
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);
export const Skill = model("Skill", SkillSchema);

/* -------------------- Certification -------------------- */
const CertificationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true },
    image: String,
    issuedAt: Date,
    credentialUrl: String,
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);
export const Certification = model("Certification", CertificationSchema);

/* -------------------- News / Blog Post -------------------- */
const NewsPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    title: { type: I18nStringSchema, required: true },
    excerpt: { type: I18nStringSchema, required: true },
    content: { type: I18nStringSchema, required: true },
    coverImage: String,
    tags: [String],
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, index: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export const NewsPost = model("NewsPost", NewsPostSchema);

/* -------------------- Review (public submissions) -------------------- */
const ReviewSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    role: { type: String, trim: true, maxlength: 80 },
    company: { type: String, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true },
    rating: { type: Number, min: 1, max: 5, required: true, default: 5 },
    quote: { type: String, required: true, trim: true, maxlength: 1500 },
    approved: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false },
    ip: String,
    userAgent: String,
  },
  { timestamps: true },
);
ReviewSchema.index({ approved: 1, createdAt: -1 });
export const Review = model("Review", ReviewSchema);

/* -------------------- Testimonial -------------------- */
const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    role: String,
    company: String,
    avatar: String,
    quote: { type: I18nStringSchema, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);
export const Testimonial = model("Testimonial", TestimonialSchema);

/* -------------------- Contact Submission -------------------- */
const ContactSubmissionSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, index: true },
    company: String,
    subject: { type: String, required: true },
    message: { type: String, required: true },
    inquiry: { type: String, index: true }, // Investment / Partnership / Consulting / Project / Speaking / General
    budget: String,
    type: String,
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
      index: true,
    },
    notes: String,
    ip: String,
    userAgent: String,
  },
  { timestamps: true },
);
export const ContactSubmission = model("ContactSubmission", ContactSubmissionSchema);

/* -------------------- Newsletter Subscriber -------------------- */
const NewsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    subscribed: { type: Boolean, default: true },
    unsubscribedAt: Date,
    source: { type: String, default: "website" },
  },
  { timestamps: true },
);
export const NewsletterSubscriber = model("NewsletterSubscriber", NewsletterSubscriberSchema);

/* -------------------- Client Project (junction + lifecycle) -------------------- */
const MilestoneSchema = new Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: Date,
    completedAt: Date,
  },
  { _id: true, timestamps: true },
);

const ClientProjectSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["planning", "in-progress", "review", "delivered", "on-hold"],
      default: "planning",
      index: true,
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    startDate: Date,
    endDate: Date,
    milestones: [MilestoneSchema],
    notes: String,
  },
  { timestamps: true },
);
export const ClientProject = model("ClientProject", ClientProjectSchema);

/* -------------------- Invoice & Payment -------------------- */
const InvoiceSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    project: { type: Schema.Types.ObjectId, ref: "ClientProject" },
    number: { type: String, required: true, unique: true, index: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: Date,
    items: [
      {
        description: String,
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, default: 0 },
      },
    ],
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paid: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["draft", "sent", "partial", "paid", "overdue", "void"],
      default: "draft",
      index: true,
    },
    pdfUrl: String,
    notes: String,
  },
  { timestamps: true },
);
export const Invoice = model("Invoice", InvoiceSchema);

const PaymentSchema = new Schema(
  {
    invoice: { type: Schema.Types.ObjectId, ref: "Invoice", required: true, index: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: ["bank-transfer", "card", "cash", "wallet", "other"],
      default: "bank-transfer",
    },
    reference: String,
    receivedAt: { type: Date, default: Date.now },
    notes: String,
  },
  { timestamps: true },
);
export const Payment = model("Payment", PaymentSchema);

/* -------------------- File Asset (client-shared & media library) -------------------- */
const FileAssetSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
    project: { type: Schema.Types.ObjectId, ref: "ClientProject" },
    name: { type: String, required: true },
    url: { type: String, required: true },
    publicId: String,
    mimeType: String,
    size: Number,
    visibility: {
      type: String,
      enum: ["client", "internal", "public"],
      default: "client",
      index: true,
    },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);
export const FileAsset = model("FileAsset", FileAssetSchema);

/* -------------------- Message (simple thread between admin and client) -------------------- */
const MessageSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: String,
    body: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);
export const Message = model("Message", MessageSchema);

/* -------------------- Site Settings (singleton) -------------------- */
const SiteSettingsSchema = new Schema(
  {
    key: { type: String, default: "default", unique: true },
    hero: {
      tagline: I18nStringSchema,
      ctaPrimaryText: I18nStringSchema,
      ctaSecondaryText: I18nStringSchema,
    },
    about: {
      bio: I18nStringSchema,
      quote: I18nStringSchema,
      photoUrl: String,
    },
    contact: {
      email: String,
      phone: String,
      location: String,
    },
    socials: {
      linkedin: String,
      github: String,
      instagram: String,
      x: String,
      facebook: String,
      snapchat: String,
      whatsapp: String,
    },
    seo: {
      defaultTitle: String,
      defaultDescription: String,
      keywords: [String],
      ogImage: String,
      gaId: String,
    },
    nowBuilding: String,
    visitorCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export const SiteSettings = model("SiteSettings", SiteSettingsSchema);

/* -------------------- Analytics Event -------------------- */
const AnalyticsEventSchema = new Schema(
  {
    type: { type: String, required: true, index: true },
    path: String,
    referrer: String,
    sessionId: { type: String, index: true },
    ua: String,
    country: String,
    device: String,
    meta: Schema.Types.Mixed,
  },
  { timestamps: true },
);
AnalyticsEventSchema.index({ createdAt: -1 });
export const AnalyticsEvent = model("AnalyticsEvent", AnalyticsEventSchema);
