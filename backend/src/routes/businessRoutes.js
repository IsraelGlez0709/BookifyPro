// src/routes/businessRoutes.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createBusiness,
  getBusinessById,
  getAllBusinesses,
  getMyBusinesses,
  listServices,
  createService,
  updateService,
  changeServiceStatus,
  listSpecialists,
  createSpecialist,
  updateSpecialist,
  changeSpecialistStatus,
  deleteService,
  createPackageForBusiness,
  updatePackageById,
  deletePackageById
} from "../controllers/businessController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.id;
    let section = "others";
    if (file.fieldname.startsWith("specialist")) section = "specialists";
    else if (file.fieldname.startsWith("package")) section = "packages";
    else if (file.fieldname.startsWith("gallery")) section = "gallery";

    const uploadPath = path.join("uploads", "business", userId, section);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

router.post("/register", authenticateToken, upload.any(), createBusiness);
router.get("/", getAllBusinesses);
router.get("/mine", authenticateToken, getMyBusinesses);
router.get("/services", listServices);
router.get("/specialists", listSpecialists);
router.get("/:id", getBusinessById);

router.post("/services", createService);
router.put("/services/:id", updateService);
router.patch("/services/:id/status", changeServiceStatus);
router.delete("/services/:id", deleteService);

router.post("/:id/packages", authenticateToken, createPackageForBusiness);
router.put("/packages/:id", authenticateToken, updatePackageById);
router.delete("/packages/:id", authenticateToken, deletePackageById);

router.post("/specialists", authenticateToken, upload.any(), createSpecialist);
router.put("/specialists/:id", authenticateToken, upload.any(), updateSpecialist);
router.patch("/specialists/:id/status", changeSpecialistStatus);

export default router;
