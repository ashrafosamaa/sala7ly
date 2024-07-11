import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    phoneNumber: {
        type: String,
        unique: true,
        length: 11
    },
    profileImg: {
        secure_url: { type: String },
        public_id: { type: String }
    },
    folderId: { type: String },
    accountActivateCode: String,
    accountActivateExpires: Date,
    accountActive: {
        type: Boolean,
        default: false,
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
        type: String,
        enum: ["user"],
        default: "user",
    }
}, { timestamps: true })

const User = model('User', userSchema)

export default User