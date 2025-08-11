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

    await Biz.createBusiness({
      id: businessId,
      user_id: req.user.id,
      name, type, address, about,
      plan_id
    });

    for (let svc of JSON.parse(services)) {
      const svcId = uuidv4();
      const price =
    (svc.price === undefined || svc.price === null || svc.price === '')
      ? null
      : Number(String(svc.price).replace(',', '.'));

      await Service.createService({ id: svcId, business_id: businessId, name: svc.name, price });
      for (let feat of svc.features) {
        await Feature.createServiceFeature({
          service_id: svcId,
          feature: feat
        });
      }
    }

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

export async function getAllBusinesses(req, res) {
  try {
    const businesses = await Biz.getAllBusinesses();

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

export async function getMyBusinesses(req, res) {
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

  try {
    const biz = await Biz.getBusinessById(businessId);
    if (!biz) {
      return res.status(404).json({ error: 'Negocio no encontrado' });
    }

    const services = await Service.listServices(businessId);
    for (let svc of services) {
      svc.features = await Feature.listServiceFeatures(svc.id);
    }

    const specialists = await Spec.listSpecialists(businessId);

    const packages = await Pack.listPackages(businessId);

    const gallery = await Gallery.listGallery(businessId);

    const schedules = await Schedule.listSchedules(businessId);

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

export async function listServices(req, res) {
  try {
    const { business_id } = req.query;
    if (!business_id) return res.status(400).json({ error: "business_id requerido" });
    const rows = await Service.listServices(business_id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener servicios" });
  }
}

export async function createService(req, res) {
  try {
    const { business_id, name, price: rawPrice, feature } = req.body;
    if (!business_id || !name) return res.status(400).json({ error: "Faltan campos" });

    const id = uuidv4();
    const price =
      rawPrice === undefined || rawPrice === null || rawPrice === ''
        ? null
        : Number(String(rawPrice).replace(',', '.'));

    await Service.createService({ id, business_id, name, price });

    if (feature && String(feature).trim()) {
      await Feature.createServiceFeature({ service_id: id, feature: String(feature).trim() });
    }

    const features = feature && String(feature).trim() ? [String(feature).trim()] : [];
    res.status(201).json({ id, business_id, name, price, features, status: 'active' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear servicio" });
  }
}

export async function updateService(req, res) {
  try {
    const { id } = req.params;
    const { name, price: rawPrice, status, feature } = req.body;

    const price =
      rawPrice === undefined || rawPrice === null || rawPrice === ''
        ? null
        : Number(String(rawPrice).replace(',', '.'));

    await Service.updateService({ id, name, price, status });

    if (feature !== undefined) {
      await Feature.deleteFeaturesByService(id);
      if (feature && String(feature).trim()) {
        await Feature.createServiceFeature({ service_id: id, feature: String(feature).trim() });
      }
    }

    const features = await Feature.listServiceFeatures(id);
    res.json({ id, name, price, status, features });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar servicio" });
  }
}


export async function changeServiceStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Service.deactivateService(id, status);
    res.json({ message: `Servicio ${status === 'active' ? 'activado' : 'desactivado'}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cambiar status" });
  }
}

export async function deleteService(req, res) {
  try {
    const { id } = req.params;
    if (Feature?.deleteFeaturesByService) {
      await Feature.deleteFeaturesByService(id);
    }
    await Service.deleteService(id);
    res.json({ message: "Servicio eliminado", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar servicio" });
  }
}

export async function listSpecialists(req, res) {
  try {
    const { business_id } = req.query;
    if (!business_id) return res.status(400).json({ error: "business_id requerido" });
    const rows = await Spec.listSpecialists(business_id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener especialistas" });
  }
}

export async function createSpecialist(req, res) {
  try {
    const { business_id, name, role } = req.body;
    let photo = null;

    if (req.file) {
      photo = req.file.path;
    }
    if (!photo && req.files && Array.isArray(req.files)) {
      const file = req.files.find(f => f.fieldname === "photo");
      if (file) photo = file.path;
    }

    if (!business_id || !name || !role)
      return res.status(400).json({ error: "Faltan campos" });

    const id = uuidv4();
    await Spec.createSpecialist({ id, business_id, name, role, photo });
    res.status(201).json({ id, business_id, name, role, photo, status: 'active' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear especialista" });
  }
}

export async function updateSpecialist(req, res) {
  try {
    const { id } = req.params;
    const { name, role, status } = req.body;
    let photo = null;

    if (req.file) {
      photo = req.file.path;
    }
    if (!photo && req.files && Array.isArray(req.files)) {
      const file = req.files.find(f => f.fieldname === "photo");
      if (file) photo = file.path;
    }
    await Spec.updateSpecialist({ id, name, role, photo, status });
    res.json({ message: "Especialista actualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar especialista" });
  }
}

export async function changeSpecialistStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Spec.deactivateSpecialist(id, status);
    res.json({ message: `Especialista ${status === 'active' ? 'activado' : 'desactivado'}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cambiar status" });
  }
}

export async function createPackageForBusiness(req, res) {
  try {
    const { id: business_id } = req.params;
    const { name, description, price, photo } = req.body;
    if (!business_id || !name) {
      return res.status(400).json({ error: "Faltan campos" });
    }
    const pkgId = uuidv4();
    await Pack.createPackage({
      id: pkgId,
      business_id,
      name,
      description: description ?? "",
      price: price == null ? null : Number(String(price).replace(",", ".")),
      photo: photo ?? null,
    });
    const created = await Pack.findPackageById(pkgId);
    return res.status(201).json(created);
  } catch (err) {
    console.error("createPackageForBusiness", err);
    return res.status(500).json({ error: "Error al crear paquete" });
  }
}

// 👇 actualizar paquete
export async function updatePackageById(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, photo } = req.body;

    await Pack.updatePackage({
      id,
      name,
      description: description ?? "",
      price: price == null ? null : Number(String(price).replace(",", ".")),
      // photo opcional: si no quieres tocarla, no mandes 'photo'
      ...(photo !== undefined ? { photo } : {}),
    });

    const updated = await Pack.findPackageById(id);
    return res.json(updated);
  } catch (err) {
    console.error("updatePackageById", err);
    return res.status(500).json({ error: "Error al actualizar paquete" });
  }
}

// 👇 eliminar paquete
export async function deletePackageById(req, res) {
  try {
    const { id } = req.params;
    await Pack.deletePackage(id);
    return res.json({ message: "Paquete eliminado", id });
  } catch (err) {
    console.error("deletePackageById", err);
    return res.status(500).json({ error: "Error al eliminar paquete" });
  }
}