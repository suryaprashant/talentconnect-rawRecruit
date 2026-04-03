// routes/test.js

import express from "express";
import { updateAllUserRankings } from "../services/rankingService.js";

const router = express.Router();

router.get("/run-ranking", async (req, res) => {
  const result = await updateAllUserRankings();
  res.json({ message: "Ranking updated", result });
});

export default router;