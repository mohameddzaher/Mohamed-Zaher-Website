import { Router } from "express";
import { SiteSettings } from "../models";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const s = (await SiteSettings.findOne({ key: "default" })) ?? (await SiteSettings.create({ key: "default" }));
    res.json({ success: true, data: s });
  }),
);

router.put(
  "/",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const s = await SiteSettings.findOneAndUpdate({ key: "default" }, req.body, {
      new: true,
      upsert: true,
    });
    res.json({ success: true, data: s });
  }),
);

router.post(
  "/visit",
  asyncHandler(async (_req, res) => {
    const s = await SiteSettings.findOneAndUpdate(
      { key: "default" },
      { $inc: { visitorCount: 1 } },
      { upsert: true, new: true },
    );
    res.json({ success: true, data: { count: s.visitorCount } });
  }),
);

export default router;
