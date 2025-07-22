// src/controllers/planController.js
import * as Plan from '../models/planModel.js'

export async function getPlans(req, res) {
  try {
    const rows = await Plan.findAll()
    const plans = rows.map(r => ({
      ...r,
      benefits: JSON.parse(r.benefits)
    }))
    res.json(plans)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No pude cargar los planes' })
  }
}
