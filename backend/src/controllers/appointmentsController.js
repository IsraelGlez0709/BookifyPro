// src/controllers/appointmentsController.js
import * as Appointment from "../models/appointmentsModel.js";
import * as ClientModel from "../models/clientsModel.js";
import * as UserModel from "../models/userModel.js";

export async function createAppointment(req, res) {
  try {
    const {
      business_id,
      specialist_id,
      service_id,
      package_id,
      date,
      start_time,
      end_time,
      notes,
      full_name,
      email,
      phone,
      user_id: user_id_from_body,
    } = req.body;

    let client = await ClientModel.findClientByEmailOrPhone(
      business_id,
      email,
      phone
    );
    if (!client) {
      let datosCliente = {};

      if (user_id_from_body) {
        const usuario = await UserModel.findUserById(user_id_from_body);
        if (usuario) {
          datosCliente = {
            business_id,
            user_id: user_id_from_body,
            full_name: usuario.full_name,
            email: usuario.email,
            phone: usuario.phone,
          };
        } else {
          datosCliente = {
            business_id,
            user_id: null,
            full_name,
            email,
            phone,
          };
        }
      } else {
        datosCliente = {
          business_id,
          user_id: null,
          full_name,
          email,
          phone,
        };
      }
      client = await ClientModel.createClient(datosCliente);
    }

    const user_id = client.user_id ? client.user_id : null;

    const cita = await Appointment.createAppointment({
      business_id,
      specialist_id,
      user_id,
      service_id,
      package_id,
      date,
      start_time,
      end_time,
      notes,
    });

    res.status(201).json({ message: "Cita registrada", id: cita.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar cita" });
  }
}

export async function listAppointmentsByBusiness(req, res) {
  try {
    const { id: business_id } = req.params;
    const citas = await Appointment.listAppointmentsByBusiness(business_id);
    res.json(citas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener citas" });
  }
}

export async function getAppointmentById(req, res) {
  try {
    const { id } = req.params;
    const appt = await Appointment.findAppointmentById(id);
    if (!appt) return res.status(404).json({ error: 'Cita no encontrada' });
    return res.json(appt);
  } catch (err) {
    console.error('getAppointmentById error', err);
    return res.status(500).json({ error: 'Error obteniendo cita' });
  }
}

export async function listAppointmentsForToday(req, res) {
  try {
    const { business_id } = req.query;
    if (!business_id) return res.status(400).json({ error: "Falta business_id" });

    const citas = await Appointment.listAppointmentsForToday(business_id);
    res.json(citas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener citas de hoy" });
  }
}
