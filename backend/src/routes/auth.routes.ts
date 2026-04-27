import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { User, hashPassword } from "../models/User";
import { signAccess, signRefresh, verifyRefresh } from "../services/jwt";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { authLimiter } from "../middleware/rateLimit";
import { requireAuth } from "../middleware/auth";
import { env } from "../config/env";

const router = Router();

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.COOKIE_SECURE,
  domain: env.COOKIE_DOMAIN === "localhost" ? undefined : env.COOKIE_DOMAIN,
  path: "/",
};

function setCookies(
  res: import("express").Response,
  access: string,
  refresh: string,
) {
  res.cookie("mz_access", access, { ...cookieBase, maxAge: 15 * 60 * 1000 });
  res.cookie("mz_refresh", refresh, {
    ...cookieBase,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post(
  "/login",
  authLimiter,
  asyncHandler(async (req, res) => {
    const body = LoginSchema.parse(req.body);
    const user = await User.findOne({ email: body.email.toLowerCase() }).select(
      "+passwordHash +refreshTokenHash",
    );
    if (!user || !user.active) throw ApiError.unauthorized("Invalid credentials");
    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) throw ApiError.unauthorized("Invalid credentials");

    const payload = { sub: user.id, role: user.role, email: user.email };
    const access = signAccess(payload);
    const refresh = signRefresh(payload);
    user.refreshTokenHash = await bcrypt.hash(refresh, 10);
    user.lastLogin = new Date();
    await user.save();

    setCookies(res, access, refresh);
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  }),
);

router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.["mz_refresh"];
    if (!token) throw ApiError.unauthorized("Missing refresh token");
    let payload;
    try {
      payload = verifyRefresh(token);
    } catch {
      throw ApiError.unauthorized("Invalid refresh token");
    }
    const user = await User.findById(payload.sub).select("+refreshTokenHash");
    if (!user || !user.refreshTokenHash) throw ApiError.unauthorized();
    const matches = await bcrypt.compare(token, user.refreshTokenHash);
    if (!matches) throw ApiError.unauthorized("Refresh token revoked");

    const newPayload = { sub: user.id, role: user.role, email: user.email };
    const access = signAccess(newPayload);
    const refresh = signRefresh(newPayload);
    user.refreshTokenHash = await bcrypt.hash(refresh, 10);
    await user.save();
    setCookies(res, access, refresh);
    res.json({ success: true });
  }),
);

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.["mz_refresh"];
    if (token) {
      try {
        const payload = verifyRefresh(token);
        await User.findByIdAndUpdate(payload.sub, { $unset: { refreshTokenHash: "" } });
      } catch {
        /* ignore */
      }
    }
    res.clearCookie("mz_access", cookieBase);
    res.clearCookie("mz_refresh", cookieBase);
    res.json({ success: true });
  }),
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.sub);
    if (!user) throw ApiError.notFound();
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        company: user.company,
      },
    });
  }),
);

const ChangePasswordSchema = z.object({
  current: z.string().min(6),
  next: z.string().min(8),
});

router.post(
  "/change-password",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { current, next } = ChangePasswordSchema.parse(req.body);
    const user = await User.findById(req.user!.sub).select("+passwordHash");
    if (!user) throw ApiError.notFound();
    const ok = await bcrypt.compare(current, user.passwordHash);
    if (!ok) throw ApiError.badRequest("Current password is incorrect");
    user.passwordHash = await hashPassword(next);
    await user.save();
    res.json({ success: true });
  }),
);

export default router;
