// src/controllers/conversationsController.js
import * as Conv from "../models/conversationsModel.js";

/**
 * Asegura/crea una conversación.
 * - business_support: un hilo por (business_id, customer_user_id)
 * - direct: un hilo por pareja de usuarios (lo manejas como ya lo tenías)
 */
export async function ensureConversation(req, res) {
  try {
    const authUserId = req.user.id;
    const { type = "direct", business_id, peer_user_id } = req.body;

    if (type === "business_support") {
      if (!business_id) return res.status(400).json({ error: "business_id requerido" });

      // 1) find-or-create robusto (usa el índice único para no duplicar)
      const conv = await Conv.ensureBusinessSupportConversation(
        business_id,           // negocio
        authUserId,            // ESTE usuario es el cliente
        authUserId             // created_by
      );

      // 2) Asegurar participantes (INSERT IGNORE evita duplicar filas)
      await Conv.addParticipant(conv.id, authUserId, "member"); // cliente

      const ownerId = await Conv.findBusinessOwnerUserId(business_id);
      if (ownerId) {
        await Conv.addParticipant(conv.id, ownerId, "agent");   // dueño/empleado
      }

      return res.json(conv); // ok (si existía o se creó)
    }

    if (type === "direct") {
      if (!peer_user_id) return res.status(400).json({ error: "peer_user_id requerido" });
      if (peer_user_id === authUserId) {
        return res.status(400).json({ error: "No puedes chatear contigo mismo" });
      }

      const found = await Conv.findDirectBetween(authUserId, peer_user_id);
      if (found) return res.json(found);

      const convId = await Conv.createDirectConversation(authUserId);
      await Conv.addParticipant(convId, authUserId, "member");
      await Conv.addParticipant(convId, peer_user_id, "member");

      const conv = await Conv.findConversationById(convId);
      return res.status(201).json(conv);
    }

    return res.status(400).json({ error: "type inválido" });
  } catch (err) {
    console.error("ensureConversation error", err);
    return res.status(500).json({ error: "Error asegurando conversación" });
  }
}

export async function getInbox(req, res) {
  try {
    const authUserId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);

    const rows = await Conv.getInboxRows(authUserId, limit);
    // rows trae conversaciones; enriquecemos cada una con display fields
    const enriched = await Promise.all(rows.map(async (conv) => {
      try {
        const { display_name, display_avatar } = await resolveDisplayFields(conv, authUserId);
        return { ...conv, display_name, display_avatar };
      } catch {
        return conv; // fallback si algo falla
      }
    }));

    res.json(enriched);
  } catch (err) {
    console.error("getInbox error", err);
    res.status(500).json({ error: "Error obteniendo inbox" });
  }
}

export async function getConversationDetail(req, res) {
  try {
    const authUserId = req.user.id;
    const { id } = req.params;

    const conv = await Conv.findConversationById(id);
    if (!conv) return res.status(404).json({ error: "Conversación no encontrada" });

    const canSee = await Conv.isUserInConversation(id, authUserId);
    if (!canSee) return res.status(403).json({ error: "No tienes acceso a esta conversación" });

    const participants = await Conv.getParticipants(id);

    let display_name = conv.title || null;
    let display_avatar = null;
    let display_context = null;            // 👈 NUEVO

    if (conv.type === "business_support") {
      const biz = await Conv.getBusinessBasic(conv.business_id);
      const ownerId = await Conv.findBusinessOwnerUserId(conv.business_id);
      const isAgent =
        participants.some(p => p.user_id === authUserId && p.role === "agent") ||
        (ownerId && ownerId === authUserId);

      if (isAgent) {
        const customer =
          participants.find(p => p.role !== "agent" && p.user_id !== authUserId) ||
          participants.find(p => p.user_id !== authUserId);
        display_name   = customer?.full_name || "Cliente";
        display_avatar = customer?.profile_photo || null;
        display_context = biz?.name || null; // 👈 nombre del negocio
      } else {
        display_name   = biz?.name || "Soporte";
        display_avatar = biz?.logo || null;
        display_context = null;
      }
    } else if (conv.type === "direct") {
      const other = participants.find(p => p.user_id !== authUserId);
      display_name   = other?.full_name || "Chat";
      display_avatar = other?.profile_photo || null;
    } else if (conv.type === "group") {
      display_name = conv.title || "Grupo";
    }

    res.json({ ...conv, participants, display_name, display_avatar, display_context }); // 👈
  } catch (err) {
    console.error("getConversationDetail error", err);
    res.status(500).json({ error: "Error obteniendo detalle" });
  }
}

export async function pinAppointment(req, res) {
  try {
    const authUserId = req.user.id;
    const { id } = req.params;
    const { appointment_id } = req.body;

    const canSee = await Conv.isUserInConversation(id, authUserId);
    if (!canSee) return res.status(403).json({ error: "Sin acceso" });

    await Conv.updatePinnedAppointment(id, appointment_id || null);
    res.json({ ok: true });
  } catch (err) {
    console.error("pinAppointment error", err);
    res.status(500).json({ error: "Error al fijar cita" });
  }
}

export async function unpinAppointment(req, res) {
  try {
    const authUserId = req.user.id;
    const { id } = req.params;

    const canSee = await Conv.isUserInConversation(id, authUserId);
    if (!canSee) return res.status(403).json({ error: "Sin acceso" });

    await Conv.updatePinnedAppointment(id, null);
    res.json({ ok: true });
  } catch (err) {
    console.error("unpinAppointment error", err);
    res.status(500).json({ error: "Error al quitar cita" });
  }
}

async function resolveDisplayFields(conv, authUserId) {
  const participants = await Conv.getParticipants(conv.id);

  let display_name = conv.title || null;
  let display_avatar = null;

  if (conv.type === "business_support") {
    const biz = await Conv.getBusinessBasic(conv.business_id);
    // ¿es agent/owner?
    const ownerId = await Conv.findBusinessOwnerUserId(conv.business_id);
    const isAgent =
      participants.some(p => p.user_id === authUserId && p.role === "agent") ||
      (ownerId && ownerId === authUserId);

    if (isAgent) {
      // dueño/empleado -> ver datos del cliente
      const customer =
        participants.find(p => p.role !== "agent" && p.user_id !== authUserId) ||
        participants.find(p => p.user_id !== authUserId);

      // si no viene en participants, consulta directo users
      const userBasic =
        (customer?.full_name || customer?.profile_photo)
          ? customer
          : await Conv.getUserBasic(customer?.user_id);

      display_name  = userBasic?.full_name || "Cliente";
      display_avatar = userBasic?.profile_photo || null;
    } else {
      // cliente -> ver negocio
      display_name  = biz?.name || "Soporte";
      display_avatar = biz?.logo || (await Conv.getBusinessPrimaryImage(conv.business_id));
    }
  } else if (conv.type === "direct") {
    const other = participants.find(p => p.user_id !== authUserId) || null;
    if (other) {
      // si participants no trae foto, buscamos al user
      const basic = (other.profile_photo || other.full_name)
        ? other
        : await Conv.getUserBasic(other.user_id);
      display_name  = basic?.full_name || "Chat";
      display_avatar = basic?.profile_photo || null;
    } else {
      display_name = "Chat";
    }
  } else if (conv.type === "group") {
    display_name = conv.title || "Grupo";
  }

  return { display_name, display_avatar, participants };
}