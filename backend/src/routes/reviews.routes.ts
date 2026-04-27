import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { Review } from "../models";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { requireAdmin } from "../middleware/auth";

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 6,
  message: { success: false, message: "Too many reviews submitted. Try later." },
});

const ReviewSchema = z.object({
  name: z.string().min(2).max(80),
  role: z.string().max(80).optional(),
  company: z.string().max(120).optional(),
  email: z.string().email().optional(),
  rating: z.number().int().min(1).max(5).default(5),
  quote: z.string().min(10).max(1500),
});

/* Public — list approved reviews */
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const items = await Review.find({ approved: true }).sort({ featured: -1, createdAt: -1 }).limit(50);
    res.json({ success: true, data: items });
  }),
);

/* Public — submit a review (held for moderation) */
router.post(
  "/",
  submitLimiter,
  asyncHandler(async (req, res) => {
    const body = ReviewSchema.parse(req.body);
    const created = await Review.create({
      ...body,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      approved: false,
    });
    res.status(201).json({ success: true, message: "Submitted for moderation", data: { id: created.id } });
  }),
);

/* Admin — list all (including pending) */
router.get(
  "/all",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;
    const filter: Record<string, unknown> = {};
    if (status === "pending") filter.approved = false;
    if (status === "approved") filter.approved = true;
    const items = await Review.find(filter).sort({ createdAt: -1 }).limit(500);
    res.json({ success: true, data: items });
  }),
);

router.patch(
  "/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) throw ApiError.notFound();
    res.json({ success: true, data: updated });
  }),
);

router.delete(
  "/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  }),
);

export default router;
