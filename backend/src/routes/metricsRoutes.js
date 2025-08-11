// src/routes/metricsRoutes.js
import { Router } from "express";
import { getOverview } from "../controllers/metricsController.js";

const router = Router();

// GET /api/metrics/overview?business_id=...
router.get("/overview", getOverview);

export default router;
