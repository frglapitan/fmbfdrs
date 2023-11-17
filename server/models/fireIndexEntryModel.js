import mongoose from "mongoose";

const fireIndexEntrySchema = mongoose.Schema({
    municId : {
        type: Number,
        required: true
    },
    indexType: {
        type: String,
        enum: ['BU','DC','DMC','FFMC','FWI','ISI'],
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    week: {
        type: Number,
        required: true
    },
    indexValue: {
        type: Number,
        required: true
    }
});

fireIndexEntrySchema.index({ municId: 1, indexType: 1, year: 1, week: 1 }, { unique: true });

export const FireIndexEntry = mongoose.model('FireIndexEntry', fireIndexEntrySchema);