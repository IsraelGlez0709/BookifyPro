// src/controllers/metricsController.js
import * as Metrics from "../models/metricsModel.js";

export async function getOverview(req, res) {
  try {
    const { business_id } = req.query;
    if (!business_id) return res.status(400).json({ error: "Falta business_id" });

    const data = await Metrics.getOverview(business_id);
    return res.json(data);
  } catch (err) {
    console.error("metrics.getOverview", err);
    return res.status(500).json({ error: "Error obteniendo métricas" });
  }
}
