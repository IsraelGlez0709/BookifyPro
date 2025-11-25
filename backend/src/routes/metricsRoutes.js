// src/routes/metricsRoutes.js
import { Router } from "express";
import { getOverview } from "../controllers/metricsController.js";

const router = Router();

router.get("/overview", getOverview);

export default router;
