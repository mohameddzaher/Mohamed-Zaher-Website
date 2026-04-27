import cron from "node-cron";
import { logger } from "../utils/logger";
import { Invoice } from "../models";

/**
 * Hourly: mark unpaid invoices past dueDate as overdue.
 */
cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const updated = await Invoice.updateMany(
      {
        dueDate: { $lt: now },
        status: { $in: ["sent", "partial"] },
      },
      { $set: { status: "overdue" } },
    );
    if (updated.modifiedCount > 0) {
      logger.info(`Cron: marked ${updated.modifiedCount} invoices overdue`);
    }
  } catch (err) {
    logger.error("Cron overdue-invoices failed:", err);
  }
});
