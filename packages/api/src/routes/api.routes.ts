import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { OK } from "../lib/api-response";

const router = Router();

router.get("/pc", (req, res) => {
  return res.status(200).json(OK("Heyo"))
});

export default router;