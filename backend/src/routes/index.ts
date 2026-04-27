import { Router } from "express";
import {
  Experience,
  Venture,
  Skill,
  Certification,
  NewsPost,
  Testimonial,
} from "../models";
import { Project } from "../models/Project";
import { crudRouter } from "./_crudRouter";
import auth from "./auth.routes";
import contact from "./contact.routes";
import newsletter from "./newsletter.routes";
import upload from "./upload.routes";
import clients from "./clients.routes";
import settings from "./settings.routes";
import analytics from "./analytics.routes";
import reviews from "./reviews.routes";
import bookings from "./bookings.routes";
import tasks from "./tasks.routes";

const router = Router();

router.get("/health", (_req, res) =>
  res.json({ success: true, data: { status: "ok", uptime: process.uptime() } }),
);

router.use("/auth", auth);
router.use("/contact", contact);
router.use("/newsletter", newsletter);
router.use("/upload", upload);
router.use("/clients", clients);
router.use("/settings", settings);
router.use("/analytics", analytics);
router.use("/reviews", reviews);
router.use("/bookings", bookings);
router.use("/tasks", tasks);

router.use(
  "/projects",
  crudRouter({
    model: Project,
    lookupField: "slug",
    publishedFilter: { publishedAt: { $exists: true, $ne: null } },
  }),
);
router.use("/experience", crudRouter({ model: Experience }));
router.use("/ventures", crudRouter({ model: Venture, lookupField: "slug" }));
router.use("/skills", crudRouter({ model: Skill }));
router.use("/certifications", crudRouter({ model: Certification }));
router.use(
  "/news",
  crudRouter({
    model: NewsPost,
    lookupField: "slug",
    publishedFilter: { published: true },
    defaultSort: { publishedAt: -1, createdAt: -1 },
  }),
);
router.use("/testimonials", crudRouter({ model: Testimonial }));

export default router;
