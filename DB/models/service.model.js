import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    serviceImg: {
        secure_url: { type: String },
        public_id: { type: String }
    },
    folderId: { type: String, unique: true },
}, {timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


const Service = model("Service", serviceSchema);

export default Service;