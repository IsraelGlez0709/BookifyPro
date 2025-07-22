// src/controllers/businessController.js
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';
import * as Biz    from '../models/businessModel.js';
import * as Service from '../models/serviceModel.js';
import * as Feature from '../models/serviceFeatureModel.js';
import * as Spec    from '../models/specialistModel.js';
import * as Pack    from '../models/packageModel.js';
import * as Gallery from '../models/galleryModel.js';
import * as Schedule from '../models/scheduleModel.js';

export async function createBusiness(req, res) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      name, type, address, about,
      services = [], specialists = [],
      packages = [], gallery = [], schedules = [],
      plan_id
    } = req.body;
    const businessId = uuidv4();

    // 1) Inserta el negocio con plan_id
    await Biz.createBusiness({
      id: businessId,
      user_id: req.user.id,
      name, type, address, about,
      plan_id
    });

    // 2) Servicios + características
    for (let svc of JSON.parse(services)) {
      const svcId = uuidv4();
      await Service.createService({ id: svcId, business_id: businessId, name: svc.name });
      for (let feat of svc.features) {
        await Feature.createServiceFeature({
          service_id: svcId,
          feature: feat
        });
      }
    }

    // 3) Especialistas (mapea req.files)
    for (let i = 0; i < specialists.length; i++) {
      const sp = specialists[i];
      const file = req.files.find(f => f.fieldname === `specialists[${i}][photo]`);
      await Spec.createSpecialist({
        id: uuidv4(),
        business_id: businessId,
        name: sp.name,
        role: sp.role,
        photo: file?.path || null
      });
    }

    // 4) Paquetes
    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i];
      const file = req.files.find(f => f.fieldname === `packages[${i}][photo]`);
      await Pack.createPackage({
        id: uuidv4(),
        business_id: businessId,
        name: pkg.name,
        description: pkg.desc,
        price: pkg.price,
        photo: file?.path || null
      });
    }

    // 5) Galería
    const galleryFiles = req.files.filter(f => f.fieldname.startsWith('gallery'));
    for (let file of galleryFiles) {
        await Gallery.createGalleryItem({
        id: uuidv4(),
        business_id: businessId,
        file_url: file.path
        });
    }

    // 6) Horarios
    for (let sch of JSON.parse(schedules)) {
      await Schedule.createSchedule({
        id: uuidv4(),
        business_id: businessId,
        day: sch.day,
        start_time: sch.from,
        end_time: sch.to
      });
    }

    await conn.commit();
    res.status(201).json({ message: 'Negocio creado', id: businessId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al crear negocio' });
  } finally {
    conn.release();
  }
}

export async function getBusinesses(req, res) {
  try {
    const businesses = await Biz.getBusinessesByUser(req.user.id);

    for (let biz of businesses) {
      const images = await Gallery.listGallery(biz.id);
      biz.thumbnail = images.length > 0
        ? images[0]
        : null;
    }

    return res.json(businesses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener negocios' });
  }
}

export async function getBusinessById(req, res) {
  const businessId = req.params.id;
  const userId     = req.user.id;

  try {
    // 1) Traigo el negocio y compruebo que exista y sea del usuario
    const biz = await Biz.getBusinessById(businessId, userId);
    if (!biz) {
      return res.status(404).json({ error: 'Negocio no encontrado' });
    }

    // 2) Servicios + características
    const services = await Service.listServices(businessId);
    for (let svc of services) {
      svc.features = await Feature.listServiceFeatures(svc.id);
    }

    // 3) Especialistas (con ruta de foto)
    const specialists = await Spec.listSpecialists(businessId);

    // 4) Paquetes (con ruta de foto)
    const packages = await Pack.listPackages(businessId);

    // 5) Galería
    const gallery = await Gallery.listGallery(businessId);

    // 6) Horarios
    const schedules = await Schedule.listSchedules(businessId);

    // 7) Ensamblar respuesta
    res.json({
      ...biz,
      services,
      specialists,
      packages,
      gallery,
      schedules
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener negocio' });
  }
}