import { Schema, model } from "mongoose";

const spareSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    stock: {
        type: Number,
        required: true, 
        min: 0, 
        default: 1 
    },

    basePrice: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 99
    },
    appliedPrice: {
        type: Number,
        required: true,
    },

    isAvailable: {
        type: Boolean,
        default: true
    },

    coverImage: {
        public_id: {type: String},
        secure_url: {type: String}
    },
    folderId: {
        type: String,
        unique: true 
    },

}, {timestamps: true});


const Spare = model("Spare", spareSchema);

export default Spare;