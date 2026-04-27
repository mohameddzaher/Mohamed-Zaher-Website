import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) {
    throw new Error(`Missing env var: ${name}`);
  }
  return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 5000),
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:3000",

  MONGODB_URI: required("MONGODB_URI"),

  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET", "dev-access-secret-change-me"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET", "dev-refresh-secret-change-me"),
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES ?? "15m",
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES ?? "30d",

  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN ?? "localhost",
  COOKIE_SECURE: process.env.COOKIE_SECURE === "true",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? "",

  SMTP_HOST: process.env.SMTP_HOST ?? "smtp.gmail.com",
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
  SMTP_USER: process.env.SMTP_USER ?? "",
  SMTP_PASS: process.env.SMTP_PASS ?? "",
  EMAIL_FROM: process.env.EMAIL_FROM ?? "Mohamed Zaher <noreply@example.com>",
  EMAIL_TO_ADMIN: process.env.EMAIL_TO_ADMIN ?? "mohamedzaher.dev@gmail.com",

  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL ?? "admin@example.com",
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD ?? "change-me-strong-password",
  SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME ?? "Admin",
};

export const isProd = env.NODE_ENV === "production";
