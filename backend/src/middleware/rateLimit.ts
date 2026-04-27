import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many auth attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  message: { success: false, message: "Too many submissions. Try again later." },
});

export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
});
