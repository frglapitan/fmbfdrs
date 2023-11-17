import { FireIndexEntry } from "../models/fireIndexEntryModel.js";

import csv from "csv-parser";
import fs from "fs";


// @desc    Add Fire Index data
// @route   POST /api/fire_index/
// @access  Private
const addFireIndexEntry = async(req, res) => {
    try {
        console.log("Received json: ", req.body );

        const fireIndexEntry = new FireIndexEntry(req.body);
        
        await fireIndexEntry.save();
        res.json({ message: 'Fire Index created' });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message})
    }
}

// @desc read CSV file and add entries in database
// @route POST /api/fire_index/csv_upload
// @access Private
const readCSVFireIndexEntries = async (req, res) => {
    try {
        let promises = [];
        let rowCount = 0;

        const stream = fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (row) => {
                rowCount++;
                const entries = Object.entries(row);
                const municId = parseInt(entries[0][1]);
                const indexType = entries[1][1];

                for (let i = 2; i < entries.length; i++) {
                    const [year, week] = entries[i][0].split('_');
                    const indexValue = parseFloat(entries[i][1]);

                    const promise = FireIndexEntry.findOneAndUpdate(
                        { municId, indexType, year: parseInt(year), week: parseInt(week) },
                        { indexValue },
                        { upsert: true }
                    );
                    promises.push(promise);
                }

                if (rowCount % 500 === 0) { // adjust this number based on your system's memory capacity
                    stream.pause();
                    Promise.all(promises).then(() => {
                        promises = [];
                        stream.resume();
                    });
                }
            })
            .on('end', async () => {
                try {
                    await Promise.all(promises);
                    fs.unlinkSync(req.file.path);  // delete file after processing
                    res.status(201).json({ message: 'CSV file successfully processed'});
                } catch (err) {
                    console.error(err);
                    res.status(500).json({ error: err});
                }
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err});
    }
};




// @desc    Get new values of properties based on indexType for the geojson
// @route   GET /api/fire_index ? indexType & year & week
// @access  Private
const getFireIndexEntriesByType = async(req, res) => {

    const { indexType, year, week } = req.query;
    console.log(req.query)
    try {
        
        const fireIndexEntries = await FireIndexEntry.find({
            indexType,
            year: parseInt(year),
            week: parseInt(week)
        })
        
        res.json(fireIndexEntries);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message})
    }
}

export {
    addFireIndexEntry,
    readCSVFireIndexEntries,
    getFireIndexEntriesByType
}