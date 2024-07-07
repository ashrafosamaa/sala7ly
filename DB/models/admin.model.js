import { Schema, model } from "mongoose";

const adminSchema = new Schema({
    userName: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        required: true,
        enum: ["admin"]
    },
    passwordChangedAt: Date,
}, {timestamps: true,});

const Admin = model("Admin", adminSchema);

export default Admin;