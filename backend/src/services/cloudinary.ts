import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { env } from "../config/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: "mohamedzaher-platform",
    resource_type: "auto",
    public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
  }),
});

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /image|pdf|video|application\/(zip|x-zip-compressed|octet-stream)/;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error("Unsupported file type"));
  },
});

export { cloudinary };
