import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { Booking } from "../models/Booking";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { requireAdmin } from "../middleware/auth";
import { sendMail } from "../services/mailer";
import { env } from "../config/env";
import { getIO } from "../socket";

const router = Router();

const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  message: { success: false, message: "Too many booking attempts. Try later." },
});

/* ------------ Working hours config ------------
 * Default 09:00 → 21:00 local (Asia/Riyadh), 60-min slots.
 * Days off: Friday (5). Could move to SiteSettings later.
 */
const WORK_HOURS = { start: 9, end: 21 };
const SLOT_MIN = 60;
const DAYS_OFF = [5]; // 0=Sun … 5=Fri … 6=Sat

function generateSlots(date: Date): Date[] {
  const slots: Date[] = [];
  for (let h = WORK_HOURS.start; h < WORK_HOURS.end; h++) {
    const slot = new Date(date);
    slot.setUTCHours(h, 0, 0, 0);
    slots.push(slot);
  }
  return slots;
}

/* ------------ Public: get availability for a date ------------ */
router.get(
  "/availability",
  asyncHandler(async (req, res) => {
    const dateStr = (req.query as { date?: string }).date;
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw ApiError.badRequest("date=YYYY-MM-DD required");
    }
    const day = new Date(`${dateStr}T00:00:00.000Z`);
    const next = new Date(day);
    next.setUTCDate(day.getUTCDate() + 1);

    const isPast = day.getTime() < new Date().setUTCHours(0, 0, 0, 0);
    const dayOff = DAYS_OFF.includes(day.getUTCDay());

    const slots = generateSlots(day);

    const taken = await Booking.find({
      startsAt: { $gte: day, $lt: next },
      status: { $in: ["pending", "confirmed"] },
    }).select("startsAt durationMin");

    const takenSet = new Set(taken.map((b) => b.startsAt.toISOString()));

    const items = slots.map((slot) => {
      const isPastSlot = slot.getTime() < Date.now();
      return {
        startsAt: slot.toISOString(),
        durationMin: SLOT_MIN,
        available: !takenSet.has(slot.toISOString()) && !isPastSlot && !dayOff && !isPast,
        isBooked: takenSet.has(slot.toISOString()),
        isPast: isPastSlot || isPast,
        isDayOff: dayOff,
      };
    });

    res.json({
      success: true,
      data: { date: dateStr, dayOff, slots: items, workHours: WORK_HOURS, slotMin: SLOT_MIN },
    });
  }),
);

/* ------------ Public: create booking ------------ */
const CreateSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  company: z.string().max(120).optional(),
  subject: z.string().min(2).max(200),
  message: z.string().max(2000).optional(),
  startsAt: z.string().datetime(),
  meetingType: z.enum(["video", "phone", "in-person"]).default("video"),
  timezone: z.string().max(60).optional(),
});

router.post(
  "/",
  bookingLimiter,
  asyncHandler(async (req, res) => {
    const body = CreateSchema.parse(req.body);
    const startsAt = new Date(body.startsAt);
    if (startsAt.getTime() < Date.now()) {
      throw ApiError.badRequest("Cannot book a past slot");
    }
    if (DAYS_OFF.includes(startsAt.getUTCDay())) {
      throw ApiError.badRequest("Selected day is off");
    }

    try {
      const booking = await Booking.create({
        ...body,
        startsAt,
        durationMin: SLOT_MIN,
        timezone: body.timezone ?? "Asia/Riyadh",
        status: "pending",
        ip: req.ip,
      });

      // Notify admin via email + socket
      const adminTpl = `
        <div style="font-family:Inter,sans-serif;max-width:600px;background:#0a0a0b;color:#e5e5ea;padding:32px;border-radius:16px">
          <h2 style="color:#e11d48;margin:0 0 16px">New Meeting Booking</h2>
          <p><b>${body.name}</b> &lt;${body.email}&gt;</p>
          ${body.company ? `<p>Company: ${body.company}</p>` : ""}
          ${body.phone ? `<p>Phone: ${body.phone}</p>` : ""}
          <p><b>When:</b> ${startsAt.toUTCString()} (UTC) — ${SLOT_MIN} min</p>
          <p><b>Type:</b> ${body.meetingType}</p>
          <p><b>Subject:</b> ${body.subject}</p>
          ${body.message ? `<p style="white-space:pre-line">${body.message}</p>` : ""}
        </div>
      `;
      await sendMail({
        to: env.EMAIL_TO_ADMIN,
        subject: `[Booking] ${body.subject} — ${body.name}`,
        html: adminTpl,
        replyTo: body.email,
      });

      try {
        getIO().to("admins").emit("booking:new", {
          id: booking.id,
          name: body.name,
          startsAt: startsAt.toISOString(),
          subject: body.subject,
        });
      } catch {
        /* socket not ready */
      }

      res.status(201).json({
        success: true,
        message: "Booked",
        data: { id: booking.id, startsAt: booking.startsAt, status: booking.status },
      });
    } catch (e) {
      if (
        e instanceof mongoose.mongo.MongoServerError &&
        e.code === 11000
      ) {
        throw ApiError.conflict("Slot already taken — please choose another time");
      }
      throw e;
    }
  }),
);

/* ------------ Admin: list / range / update / delete ------------ */
router.get(
  "/",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    const items = await Booking.find(filter).sort({ startsAt: 1 }).limit(500);
    res.json({ success: true, data: items });
  }),
);

router.get(
  "/range",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const fromStr = (req.query.from as string) ?? "";
    const toStr = (req.query.to as string) ?? "";
    if (!fromStr || !toStr) throw ApiError.badRequest("from & to required");
    const from = new Date(fromStr);
    const to = new Date(toStr);
    const items = await Booking.find({
      startsAt: { $gte: from, $lt: to },
    })
      .sort({ startsAt: 1 })
      .limit(500);
    res.json({ success: true, data: items });
  }),
);

router.get(
  "/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Booking.findById(req.params.id);
    if (!item) throw ApiError.notFound();
    res.json({ success: true, data: item });
  }),
);

router.patch(
  "/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw ApiError.notFound();
    res.json({ success: true, data: updated });
  }),
);

router.delete(
  "/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  }),
);

export default router;
