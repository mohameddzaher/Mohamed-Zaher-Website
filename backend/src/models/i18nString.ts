import { Schema } from "mongoose";

/**
 * Reusable shape for bilingual strings stored in DB.
 * Falls back to `en` when `ar` is missing.
 */
export const I18nStringSchema = new Schema(
  {
    en: { type: String, required: true, trim: true },
    ar: { type: String, default: "", trim: true },
  },
  { _id: false },
);

export interface I18nString {
  en: string;
  ar: string;
}
