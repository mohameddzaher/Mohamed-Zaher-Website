import { Router } from "express";
import { upload } from "../services/cloudinary";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { FileAsset } from "../models";

const router = Router();

router.post(
  "/",
  ...requireAdmin,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest("No file uploaded");
    const file = req.file as Express.Multer.File & { path?: string; filename?: string };
    res.json({
      success: true,
      data: {
        url: file.path,
        publicId: file.filename,
        size: file.size,
        mimeType: file.mimetype,
      },
    });
  }),
);

router.post(
  "/client-file",
  ...requireAdmin,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest("No file uploaded");
    const file = req.file as Express.Multer.File & { path?: string; filename?: string };
    const created = await FileAsset.create({
      owner: req.body.clientId,
      project: req.body.projectId || undefined,
      name: file.originalname,
      url: file.path,
      publicId: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      visibility: "client",
      uploadedBy: req.user!.sub,
    });
    res.json({ success: true, data: created });
  }),
);

export default router;
