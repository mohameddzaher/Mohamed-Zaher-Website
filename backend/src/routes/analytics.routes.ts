import { Router } from "express";
import { AnalyticsEvent, ContactSubmission, NewsletterSubscriber, NewsPost, ClientProject, Invoice } from "../models";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.post(
  "/track",
  asyncHandler(async (req, res) => {
    const body = (req.body ?? {}) as {
      type?: string;
      path?: string;
      sessionId?: string;
      meta?: unknown;
    };
    await AnalyticsEvent.create({
      type: body.type ?? "pageview",
      path: body.path,
      referrer: req.headers.referer as string | undefined,
      sessionId: body.sessionId,
      ua: req.headers["user-agent"] as string | undefined,
      meta: body.meta,
    });
    res.json({ success: true });
  }),
);

router.get(
  "/dashboard",
  ...requireAdmin,
  asyncHandler(async (_req, res) => {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [
      pageviews30d,
      contactsCount,
      subscribersCount,
      postsCount,
      activeProjectsCount,
      clientsCount,
      revenueAgg,
    ] = await Promise.all([
      AnalyticsEvent.countDocuments({ type: "pageview", createdAt: { $gte: since } }),
      ContactSubmission.countDocuments(),
      NewsletterSubscriber.countDocuments({ subscribed: true }),
      NewsPost.countDocuments({ published: true }),
      ClientProject.countDocuments({ status: { $in: ["planning", "in-progress", "review"] } }),
      User.countDocuments({ role: "client" }),
      Invoice.aggregate([
        { $group: { _id: null, billed: { $sum: "$total" }, paid: { $sum: "$paid" } } },
      ]),
    ]);

    const topPathsAgg = await AnalyticsEvent.aggregate([
      { $match: { type: "pageview", createdAt: { $gte: since } } },
      { $group: { _id: "$path", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]);

    const dailyPageviewsAgg = await AnalyticsEvent.aggregate([
      { $match: { type: "pageview", createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          views: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        pageviews30d,
        contactsCount,
        subscribersCount,
        postsCount,
        activeProjectsCount,
        clientsCount,
        revenue: revenueAgg[0] ?? { billed: 0, paid: 0 },
        topPaths: topPathsAgg.map((r) => ({ path: r._id, views: r.views })),
        dailyPageviews: dailyPageviewsAgg.map((r) => ({ date: r._id, views: r.views })),
      },
    });
  }),
);

export default router;
