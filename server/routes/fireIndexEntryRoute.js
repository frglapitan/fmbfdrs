import express from "express";
import multer from "multer";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

import {
    addFireIndexEntry,
    readCSVFireIndexEntries,
    getFireIndexEntriesByType
} from "../controllers/fireIndexEntryController.js";

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route('/').post(addFireIndexEntry)
            .get(getFireIndexEntriesByType);

router.route('/csv_upload').post(verifyToken, upload.single('csvfile'), readCSVFireIndexEntries);


export default router;