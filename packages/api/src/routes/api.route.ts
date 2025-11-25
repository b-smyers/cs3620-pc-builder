import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import db from "../services/sqlite.service";
import { OK, InternalServerError, BadRequest } from "../lib/api-response";

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
        .get(id);
      return res.status(200).json(OK("Successfully retrieved data", rows));
    } catch (err: any) {
      console.error(`DB error for ${table}:`, err);
      return res.status(500).json(InternalServerError());
    }
  });
});

router.get('/computer', (req, res) => {
  if (!req.session.user) {
    return res.status(400).json(BadRequest("You are not logged in"))
  }

  try {
    const userId = req.session.user.id

    // Check if the user already has a computer record
    const existing = db
      .prepare("SELECT id FROM computer WHERE user_id = ?")
      .get(userId);

    if (!existing) {
      // --- INSERT NEW RECORD ---
      const query = `INSERT INTO computer (user_id) VALUES (?)`
      db.prepare(query).run(userId);
    }
    const query = `SELECT * FROM computer WHERE user_id = ?`
    const computer = db.prepare(query).get(userId);

    return res.status(200).json(OK("Successfully retrieved data", computer));

  } catch (err: any) {
    console.error(`DB error for computer:`, err);
    return res.status(500).json(InternalServerError());
  }
})

tables.forEach((endpoint) => {
  router.post(`/computer/${endpoint}`, (req, res) => {
    if (!req.session.user) {
      return res.status(400).json(BadRequest("You are not logged in"));
    }

    try {
      const { id } = req.body; // the part ID
      const userId = req.session.user.id;

      // Ensure user has a computer record
      const existing = db
        .prepare("SELECT id FROM computer WHERE user_id = ?")
        .get(userId);

      if (!existing) {
        db.prepare("INSERT INTO computer (user_id) VALUES (?)").run(userId);
      }

      // Update only this part
      const column = `${endpoint.replace(/-/g, "_")}_id`;
      const query = `UPDATE computer SET ${column} = ? WHERE user_id = ?`;
      db.prepare(query).run(id, userId);

      return res.status(200).json(OK(`Successfully updated ${endpoint}`));
    } catch (err: any) {
      console.error(`DB error for computer ${endpoint}:`, err);
      return res.status(500).json(InternalServerError());
    }
  });
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json(BadRequest("Missing username or password"));

    // 1. Try to find the user
    const existing = db
      .prepare("SELECT * FROM users WHERE username = ? AND password = ?")
      .get(username, password);

    let userId: number;

    if (existing) {
      userId = existing.id;
    } else {
      // 2. Create user if not found
      const result = db
        .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
        .run(username, password);

      userId = result.lastInsertRowid as number;
    }

    // 4. Save to session
    req.session.user = { id: userId };

    return res.status(200).json(OK("Logged in", { userId }));
  } catch (err: any) {
    console.error("DB error for login:", err);
    return res.status(500).json(InternalServerError());
  }
});


export default router;
