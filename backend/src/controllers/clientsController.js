import * as ClientModel from "../models/clientsModel.js";

export async function suggestClients(req, res) {
  const { business_id, query } = req.query;
  if (!business_id || !query) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  const clientes = await ClientModel.suggestClientsByEmail(business_id, query);
  res.json(clientes);
}

export async function listClients(req, res) {
  try {
    const { business_id } = req.query;
    const clientes = await ClientModel.listClients(business_id);
    res.json(clientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
}

export async function createClient(req, res) {
  try {
    const { business_id, full_name, email, phone, user_id } = req.body;

    const existe = await ClientModel.findClientByEmailOrPhone(business_id, email, phone);
    if (existe) {
      return res.status(409).json({ error: "Cliente ya existe" });
    }

    const nuevoCliente = await ClientModel.createClient({
      business_id,
      user_id: user_id || null,
      full_name,
      email,
      phone,
    });

    res.status(201).json(nuevoCliente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear cliente" });
  }
}