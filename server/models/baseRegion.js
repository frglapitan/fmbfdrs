import mongoose from "mongoose";

const baseRegionSchema = mongoose.Schema({
    region: { 
        type: String, 
        required: true
    },
    province: { 
        type: String, 
        required: true
    },
    municName: { 
        type: String, 
        required: true
    },
    municCode: { 
        type: String, 
        required: true
    },
    municId : {
        type: Number,
        required: true,
        unique: true
    }
});

export const BaseRegion = mongoose.model('BaseRegion', baseRegionSchema);