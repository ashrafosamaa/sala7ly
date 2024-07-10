import mongoose from "mongoose";

const serviceOrderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: {
        title:{type: String, required: true},
        serviceId:{type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true}
    },
    problemDesc: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    shippingAddress: {
        type: String,
        required: true
    },

    paymentMethod:{type: String, enum:['Cash'], default: 'Cash', required: true},
    orderStatus:{type: String , enum:['Placed', 'Paid', 'Delivered', 'Cancelled'], required: true , default: 'Placed'},

    orderDate:{type: String, required: true},
    orderTime:{type: String, required: true},
    orderType:{type: String, enum:['Normal', 'Emergency'], default: 'Normal', required: true},

},{timestamps: true});


const ServiceOrder = mongoose.model('ServiceOrder', serviceOrderSchema);

export default ServiceOrder