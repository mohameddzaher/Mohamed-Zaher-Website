import { Router } from "express";
import { z } from "zod";
import { Task } from "../models/Task";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { requireAdmin } from "../middleware/auth";

const router = Router();

const TaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(4000).optional(),
  status: z.enum(["todo", "in-progress", "done", "cancelled"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  type: z.enum(["task", "meeting", "call", "note", "deadline"]).optional(),
  dueAt: z.string().datetime().nullable().optional(),
  startsAt: z.string().datetime().nullable().optional(),
  durationMin: z.number().int().min(5).max(600).nullable().optional(),
  meetingWith: z.string().max(120).optional(),
  meetingLocation: z.string().max(200).optional(),
  tags: z.array(z.string().max(40)).max(15).optional(),
  relatedBooking: z.string().optional(),
});

/* List with filters */
router.get(
  "/",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const { status, type, priority, from, to, q } = req.query as Record<string, string | undefined>;
    const filter: Record<string, unknown> = { createdBy: req.user!.sub };
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (from || to) {
      const range: Record<string, Date> = {};
      if (from) range.$gte = new Date(from);
      if (to) range.$lt = new Date(to);
      filter.$or = [
        { dueAt: range },
        { startsAt: range },
      ];
    }
    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [...(Array.isArray(filter.$or) ? filter.$or : []), { title: re }, { description: re }, { meetingWith: re }];
    }
    const items = await Task.find(filter).sort({ status: 1, dueAt: 1, createdAt: -1 }).limit(500);
    res.json({ success: true, data: items });
  }),
);

/* Today + upcoming summary */
router.get(
  "/today",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfDay);
    endOfWeek.setUTCDate(startOfDay.getUTCDate() + 7);

    const [today, upcoming, overdue, openCount] = await Promise.all([
      Task.find({
        createdBy: req.user!.sub,
        status: { $ne: "done" },
        $or: [
          { dueAt: { $gte: startOfDay, $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000) } },
          { startsAt: { $gte: startOfDay, $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000) } },
        ],
      }).sort({ startsAt: 1, dueAt: 1 }),
      Task.find({
        createdBy: req.user!.sub,
        status: { $ne: "done" },
        $or: [
          { dueAt: { $gte: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000), $lt: endOfWeek } },
          { startsAt: { $gte: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000), $lt: endOfWeek } },
        ],
      }).sort({ startsAt: 1, dueAt: 1 }),
      Task.find({
        createdBy: req.user!.sub,
        status: { $in: ["todo", "in-progress"] },
        dueAt: { $lt: now },
      }).sort({ dueAt: 1 }),
      Task.countDocuments({ createdBy: req.user!.sub, status: { $in: ["todo", "in-progress"] } }),
    ]);

    res.json({ success: true, data: { today, upcoming, overdue, openCount } });
  }),
);

router.post(
  "/",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const body = TaskSchema.parse(req.body);
    const created = await Task.create({
      ...body,
      createdBy: req.user!.sub,
      dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
      startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
    });
    res.status(201).json({ success: true, data: created });
  }),
);

router.patch(
  "/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const body = TaskSchema.partial().parse(req.body);
    const update: Record<string, unknown> = { ...body };
    if (body.dueAt) update.dueAt = new Date(body.dueAt);
    if (body.dueAt === null) update.dueAt = null;
    if (body.startsAt) update.startsAt = new Date(body.startsAt);
    if (body.startsAt === null) update.startsAt = null;
    if (body.status === "done") update.completedAt = new Date();
    if (body.status && body.status !== "done") update.completedAt = null;

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user!.sub },
      update,
      { new: true, runValidators: true },
    );
    if (!updated) throw ApiError.notFound();
    res.json({ success: true, data: updated });
  }),
);

router.delete(
  "/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user!.sub });
    res.json({ success: true });
  }),
);

export default router;
