import { BaseRegion } from "../models/baseRegion.js";

import csv from "csv-parser";
import fs from "fs";

// @desc read CSV file and add entries in database
// @route POST /api/region/csv_upload
// @access Private
const readCSVRegionEntries = async (req, res) => {
    try {
        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.shift(); // remove the first line/row
                results.forEach((row) => {
                    const regionEntry = new BaseRegion({
                        region: row['Region'],
                        province: row['Province'],
                        municName: row['MunicName'],
                        municCode: row['MunicCode'],
                        municId: row['MunicID'],
                    });
                    regionEntry.save();
                });

                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                    console.log('CSV file deleted');
                });
                
                res.status(201).json({ message: 'CSV file has been processed successfully.'});
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error });
    }
};

export {
    readCSVRegionEntries
}