import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import db from "../services/sqlite.service";
import { OK, InternalServerError } from "../lib/api-response";

const router = Router();

// List of tables / endpoints
const tables = [
  "keyboard",
  "speakers",
  "memory",
  "thermal-paste",
  "pc-case",
  "monitor",
  "cpu-cooler",
  "motherboard",
  "video-card",
  "cpu",
  "mouse",
  "webcam",
  "external-hard-drive",
  "os",
  "headphones",
  "power-supply",
  "internal-hard-drive",
  "sound-card",
  "computer",
];

tables.forEach((endpoint) => {
  router.get(`/${endpoint}`, (req, res) => {
    const table = endpoint.replace(/-/g, "_"); // map endpoint to table
    const limit = parseInt(req.query.limit as string) || 100; // default 100
    const offset = parseInt(req.query.offset as string) || 0; // default 0
    try {
      const rows = db
        .prepare(`SELECT * FROM \`${table}\` LIMIT ? OFFSET ?`)
        .all(limit, offset);
      return res.status(200).json(OK("Successfully retrieved data", rows));
    } catch (err: any) {
      console.error(`DB error for ${table}:`, err);
      return res.status(500).json(InternalServerError());
    }
  });
});

tables.forEach((endpoint) => {
  router.get(`/${endpoint}/:id`, (req, res) => {
    const table = endpoint.replace(/-/g, "_"); // map endpoint to table
    const id = req.params.id;
    try {
      const rows = db
        .prepare(`SELECT * FROM \`${table}\` WHERE id = ?`)
        .all(id);
      return res.status(200).json(OK("Successfully retrieved data", rows));
    } catch (err: any) {
      console.error(`DB error for ${table}:`, err);
      return res.status(500).json(InternalServerError());
    }
  });
});

export default router;
