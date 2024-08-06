import mongoose from "mongoose";

const spareOrderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [{
        title:{type: String, required: true},
        quantity:{type: Number, required: true},
        price:{type: Number, required: true},
        spareId:{type: mongoose.Schema.Types.ObjectId, ref: 'Spare', required: true},
    }],

    phoneNumber: {
        type: String,
        required: true
    },

    shippingAddress: {
        type: String,
        required: true
    },

    totalPrice:{type: Number, required: true}, // shipping price - coupon is exits , if not = shipping price

    paymentMethod:{type: String, enum:['Cash', 'Credit'], default: 'Cash', required: true},
    orderStatus:{type: String , enum:['Placed', 'Paid', 'Delivered', 'Cancelled'], required: true , default: 'Placed'},

},{timestamps: true});


const SpareOrder = mongoose.model('SpareOrder', spareOrderSchema);

export default SpareOrder