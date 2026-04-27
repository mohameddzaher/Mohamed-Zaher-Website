import { Router } from "express";
import { z } from "zod";
import { ContactSubmission } from "../models";
import { asyncHandler } from "../utils/asyncHandler";
import { contactLimiter } from "../middleware/rateLimit";
import { requireAdmin } from "../middleware/auth";
import { sendMail, mailTemplates } from "../services/mailer";
import { env } from "../config/env";
import { getIO } from "../socket";

const router = Router();

const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  company: z.string().max(120).optional(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
  inquiry: z.string().max(60).optional(),
  budget: z.string().max(40).optional(),
  type: z.string().max(40).optional(),
});

router.post(
  "/",
  contactLimiter,
  asyncHandler(async (req, res) => {
    const body = ContactSchema.parse(req.body);
    const submission = await ContactSubmission.create({
      ...body,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    const tpl = mailTemplates.contactNotification(body);
    await sendMail({
      to: env.EMAIL_TO_ADMIN,
      subject: tpl.subject,
      html: tpl.html,
      replyTo: body.email,
    });
    try {
      getIO()
        .to("admins")
        .emit("contact:new", {
          id: submission.id,
          name: body.name,
          email: body.email,
          subject: body.subject,
          inquiry: body.inquiry,
        });
    } catch {
      /* socket might not be ready in tests */
    }
    res.status(201).json({ success: true, message: "Submitted" });
  }),
);

// Admin endpoints
router.get(
  "/",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;
    const q: Record<string, unknown> = {};
    if (status) q.status = status;
    const items = await ContactSubmission.find(q).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, data: items });
  }),
);

router.patch(
  "/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const updated = await ContactSubmission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: updated });
  }),
);

router.delete(
  "/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    await ContactSubmission.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  }),
);

export default router;
