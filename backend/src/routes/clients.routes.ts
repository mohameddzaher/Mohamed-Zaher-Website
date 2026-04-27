/**
 * Clients module — admin manages client accounts and their projects/files/invoices.
 * Client-side endpoints (`/me/...`) let logged-in clients view their own data.
 */

import { Router } from "express";
import { z } from "zod";
import { User, hashPassword } from "../models/User";
import { ClientProject, FileAsset, Invoice, Payment } from "../models";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { requireAdmin, requireAuth, requireRole } from "../middleware/auth";
import { getIO } from "../socket";

const router = Router();

/* ---------- Admin: clients CRUD ---------- */

const CreateClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  company: z.string().optional(),
});

router.get(
  "/",
  ...requireAdmin,
  asyncHandler(async (_req, res) => {
    const clients = await User.find({ role: "client" }).sort({ createdAt: -1 });
    res.json({ success: true, data: clients });
  }),
);

router.post(
  "/",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const body = CreateClientSchema.parse(req.body);
    const exists = await User.findOne({ email: body.email.toLowerCase() });
    if (exists) throw ApiError.conflict("Email already used");
    const created = await User.create({
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash: await hashPassword(body.password),
      phone: body.phone,
      company: body.company,
      role: "client",
    });
    res.status(201).json({ success: true, data: created });
  }),
);

router.get(
  "/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const client = await User.findById(req.params.id);
    if (!client) throw ApiError.notFound();
    const [projects, invoices, files] = await Promise.all([
      ClientProject.find({ client: client.id }).sort({ createdAt: -1 }),
      Invoice.find({ client: client.id }).sort({ issueDate: -1 }),
      FileAsset.find({ owner: client.id }).sort({ createdAt: -1 }),
    ]);
    const totalBilled = invoices.reduce((s, i) => s + i.total, 0);
    const totalPaid = invoices.reduce((s, i) => s + i.paid, 0);
    res.json({
      success: true,
      data: {
        client,
        projects,
        invoices,
        files,
        totals: {
          billed: totalBilled,
          paid: totalPaid,
          remaining: totalBilled - totalPaid,
        },
      },
    });
  }),
);

router.put(
  "/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const body = req.body as Partial<{
      name: string;
      phone: string;
      company: string;
      active: boolean;
      password: string;
    }>;
    const update: Record<string, unknown> = { ...body };
    if (body.password) update.passwordHash = await hashPassword(body.password);
    delete (update as { password?: string }).password;
    const updated = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) throw ApiError.notFound();
    res.json({ success: true, data: updated });
  }),
);

router.delete(
  "/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  }),
);

/* ---------- Client projects ---------- */

router.post(
  "/:clientId/projects",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const created = await ClientProject.create({ ...req.body, client: req.params.clientId });
    try { getIO().to(`client:${req.params.clientId}`).emit("project:new", created); } catch { /* ignore */ }
    res.status(201).json({ success: true, data: created });
  }),
);

router.put(
  "/projects/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const updated = await ClientProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) throw ApiError.notFound();
    try { getIO().to(`client:${updated.client}`).emit("project:updated", updated); } catch { /* ignore */ }
    res.json({ success: true, data: updated });
  }),
);

router.delete(
  "/projects/:id",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    await ClientProject.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  }),
);

/* ---------- Invoices ---------- */

router.post(
  "/:clientId/invoices",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const number = `INV-${Date.now().toString(36).toUpperCase()}`;
    const created = await Invoice.create({ ...req.body, client: req.params.clientId, number });
    res.status(201).json({ success: true, data: created });
  }),
);

router.post(
  "/invoices/:id/payments",
  ...requireAdmin,
  asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) throw ApiError.notFound();
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) throw ApiError.badRequest("Invalid amount");
    const payment = await Payment.create({
      invoice: invoice.id,
      client: invoice.client,
      amount,
      method: req.body.method ?? "bank-transfer",
      reference: req.body.reference,
      notes: req.body.notes,
    });
    invoice.paid += amount;
    if (invoice.paid >= invoice.total) invoice.status = "paid";
    else if (invoice.paid > 0) invoice.status = "partial";
    await invoice.save();
    try { getIO().to(`client:${invoice.client}`).emit("invoice:payment", { invoice, payment }); } catch { /* ignore */ }
    res.json({ success: true, data: { invoice, payment } });
  }),
);

/* ---------- Client self-service (logged-in client) ---------- */

router.get(
  "/me/dashboard",
  requireAuth,
  requireRole("client"),
  asyncHandler(async (req, res) => {
    const clientId = req.user!.sub;
    const [projects, invoices, files] = await Promise.all([
      ClientProject.find({ client: clientId }).sort({ createdAt: -1 }),
      Invoice.find({ client: clientId }).sort({ issueDate: -1 }),
      FileAsset.find({ owner: clientId, visibility: { $in: ["client", "public"] } }).sort({ createdAt: -1 }),
    ]);
    const billed = invoices.reduce((s, i) => s + i.total, 0);
    const paid = invoices.reduce((s, i) => s + i.paid, 0);
    res.json({
      success: true,
      data: {
        projects,
        invoices,
        files,
        totals: { billed, paid, remaining: billed - paid, pending: invoices.filter((i) => i.status !== "paid").length },
      },
    });
  }),
);

router.get(
  "/me/files/:id/download",
  requireAuth,
  requireRole("client"),
  asyncHandler(async (req, res) => {
    const file = await FileAsset.findById(req.params.id);
    if (!file) throw ApiError.notFound();
    if (String(file.owner) !== req.user!.sub && file.visibility !== "public") {
      throw ApiError.forbidden();
    }
    res.json({ success: true, data: { url: file.url } });
  }),
);

export default router;
