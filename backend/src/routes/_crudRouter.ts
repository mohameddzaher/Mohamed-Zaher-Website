import { Router, type Request } from "express";
import type { Model } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { requireAdmin } from "../middleware/auth";

interface CrudOptions<T> {
  model: Model<T>;
  /** Default sort */
  defaultSort?: Record<string, 1 | -1>;
  /** Field to look up by /:idOrSlug — if defined, accepts either ObjectId or this field */
  lookupField?: string;
  /** Filter applied to list endpoint when ?published=true */
  publishedFilter?: Record<string, unknown>;
  /** Hard cap on list items */
  defaultLimit?: number;
  /** Max items the client can request */
  maxLimit?: number;
}

/**
 * Generic CRUD: GET / (public list), GET /:idOrSlug (public), POST/PUT/DELETE (admin).
 */
export function crudRouter<T>({
  model,
  defaultSort = { order: 1, createdAt: -1 },
  lookupField,
  publishedFilter,
  defaultLimit = 50,
  maxLimit = 200,
}: CrudOptions<T>) {
  const router = Router();

  router.get(
    "/",
    asyncHandler(async (req: Request, res) => {
      const limit = Math.min(Number(req.query.limit ?? defaultLimit), maxLimit);
      const filter: Record<string, unknown> = {};
      if (req.query.published === "true" && publishedFilter) {
        Object.assign(filter, publishedFilter);
      }
      if (req.query.featured === "true") filter.featured = true;
      if (req.query.category) filter.category = req.query.category;
      const items = await model.find(filter).sort(defaultSort).limit(limit);
      res.json({ success: true, data: items });
    }),
  );

  router.get(
    "/:idOrKey",
    asyncHandler(async (req, res) => {
      const idOrKey = (req.params as { idOrKey: string }).idOrKey;
      const isObjectId = /^[a-fA-F0-9]{24}$/.test(idOrKey);
      const query: Record<string, unknown> = isObjectId
        ? { _id: idOrKey }
        : lookupField
          ? { [lookupField]: idOrKey }
          : { _id: idOrKey };
      const item = await model.findOne(query);
      if (!item) throw ApiError.notFound();
      res.json({ success: true, data: item });
    }),
  );

  router.post(
    "/",
    ...requireAdmin,
    asyncHandler(async (req, res) => {
      const created = await model.create(req.body);
      res.status(201).json({ success: true, data: created });
    }),
  );

  router.put(
    "/:id",
    ...requireAdmin,
    asyncHandler(async (req, res) => {
      const updated = await model.findByIdAndUpdate(req.params.id, req.body, {
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
      const deleted = await model.findByIdAndDelete(req.params.id);
      if (!deleted) throw ApiError.notFound();
      res.json({ success: true });
    }),
  );

  router.post(
    "/reorder",
    ...requireAdmin,
    asyncHandler(async (req, res) => {
      const ids: string[] = Array.isArray(req.body?.ids) ? req.body.ids : [];
      await Promise.all(ids.map((id, i) => model.findByIdAndUpdate(id, { order: i })));
      res.json({ success: true });
    }),
  );

  return router;
}
