import express from "express";
import multer from "multer";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

import {
    readCSVRegionEntries
} from "../controllers/baseRegionController.js";

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route('/csv_upload').post(verifyToken, upload.single('csvfile'), readCSVRegionEntries);

export default router;