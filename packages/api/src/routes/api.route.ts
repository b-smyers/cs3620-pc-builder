import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { InternalServerError, OK } from "../lib/api-response";
import db from "../services/sqlite.service";

const router = Router();

router.get("/cpus", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM cpu LIMIT 15").all();
    return res.status(200).json(OK("Successfully retrieved data", rows));
  } catch (err: any) {
    console.error("DB error:", err);
    return res.status(500).json(InternalServerError());
  }
});

export default router;
