import { Router } from "express";
import { z } from "zod";
import { NewsletterSubscriber } from "../models";
import { asyncHandler } from "../utils/asyncHandler";
import { newsletterLimiter } from "../middleware/rateLimit";
import { requireAdmin } from "../middleware/auth";
import { sendMail, mailTemplates } from "../services/mailer";

const router = Router();

const SubSchema = z.object({ email: z.string().email() });

router.post(
  "/",
  newsletterLimiter,
  asyncHandler(async (req, res) => {
    const { email } = SubSchema.parse(req.body);
    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.subscribed) {
        existing.subscribed = true;
        existing.unsubscribedAt = undefined;
        await existing.save();
      }
      return res.json({ success: true, message: "Subscribed" });
    }
    await NewsletterSubscriber.create({ email: email.toLowerCase() });
    const tpl = mailTemplates.newsletterWelcome(email);
    await sendMail({ to: email, subject: tpl.subject, html: tpl.html });
    res.status(201).json({ success: true });
  }),
);

router.get(
  "/",
  ...requireAdmin,
  asyncHandler(async (_req, res) => {
    const items = await NewsletterSubscriber.find().sort({ createdAt: -1 }).limit(2000);
    res.json({ success: true, data: items });
  }),
);

router.get(
  "/export.csv",
  ...requireAdmin,
  asyncHandler(async (_req, res) => {
    const items = await NewsletterSubscriber.find({ subscribed: true });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=subscribers.csv");
    res.write("email,createdAt\n");
    for (const s of items) res.write(`${s.email},${s.createdAt.toISOString()}\n`);
    res.end();
  }),
);

export default router;
