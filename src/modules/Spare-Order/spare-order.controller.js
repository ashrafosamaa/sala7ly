import { APIFeatures } from "../../utils/api-features.js"

import SpareOrder from "../../../DB/models/spare-order.model.js"
import Spare from "../../../DB/models/spare.model.js"

export const createOrder = async (req, res ,next) => {
    //destruct data from the user
    const { spareId, quantity, paymentMethod, phoneNumber, shippingAddress } = req.body
    const {_id} = req.authUser
    // spare check
    const isSpareAvailable = await Spare.findById(spareId)
    if(!isSpareAvailable) return next(new Error('Spare not found', {cause: 404}))
    if(!isSpareAvailable.stock || isSpareAvailable.stock < quantity) return next(new Error('Spare is out of stock', {cause: 409}))
    // set orderitems
    let orderItems = [{
        title: isSpareAvailable.title,
        spareId: isSpareAvailable._id,
        quantity,
        price: isSpareAvailable.appliedPrice,
    }]
    // prices calculation
    let totalPrice = orderItems[0].price * quantity;
    // order status + paymentmethod
    if(!paymentMethod) paymentMethod = 'Cash';
    const orderStatus = 'Placed';
    // create order
    const order = await SpareOrder.create({
        userId: _id,
        orderItems,
        shippingAddress,
        phoneNumber,
        totalPrice,
        paymentMethod,
        orderStatus
    });
    // save order
    if (!order) {
        return next(new Error('Error while creating order', { cause: 500 }))
    }
    // update spare stock
    isSpareAvailable.stock -= quantity;
    await isSpareAvailable.save();
    // send response
    res.status(201).json({
        msg: 'Order created successfully', 
        statusCode: 201
    })
}

export const getMyOrders = async (req, res, next) => {
    // destruct data from the user
    const {_id} = req.authUser
    // check that order is found
    const orders = await SpareOrder.find({userId: _id, orderStatus: { $ne: 'Cancelled' }})
    .populate({path: 'orderItems.spareId', select: 'coverImage.secure_url'})
    .select('orderItems.title totalPrice orderItems.quantity')
    // check that order is found
    if(!orders.length) return next(new Error('Orders not found', { cause: 404 }));
    // send response
    res.status(200).json({
        msg: 'Orders retrieved successfully', 
        statusCode: 200,
        orders
    })
}

export const getOrderById = async (req, res, next) => {
    // destruct data from the user
    const {_id} = req.authUser
    const {orderId} = req.params;
    // check that order is found
    const order = await SpareOrder.findOne({_id: orderId, userId: _id})
    .populate({path: 'orderItems.spareId', select: 'coverImage.secure_url'})
    .select('-createdAt -updatedAt -__v')
    // check that order is found
    if(!order) return next(new Error('Order not found', { cause: 404 }));
    // send response
    res.status(200).json({
        msg: 'Order retrieved successfully', 
        statusCode: 200,
        order
    })
}

export const cancelMyOrder = async (req, res, next) => {
    // destruct data from the user
    const {orderId} = req.params
    // check that order is found
    const order = await SpareOrder.findById(orderId)
    // check that order is found
    if(!order) return next(new Error('Order not found', { cause: 404 }));
    // update spare
    const isSpareAvailable = await Spare.findById(order.orderItems[0].spareId)
    if(!isSpareAvailable) return next(new Error('Spare not found', { cause: 404 }));
    // check product status
    if (order.orderStatus != 'Placed') return next(new Error('Order can not be cancelled', { cause: 409 }));
    // update order
    order.orderStatus = 'Cancelled'
    await order.save()
    // update spare stock
    isSpareAvailable.stock += order.orderItems[0].quantity
    await isSpareAvailable.save()
    // send response
    res.status(200).json({
        msg: 'Order cancelled successfully', 
        statusCode: 200
    })
}

export const getAllOrdersForAdmin = async (req, res, next) => {
    // destruct data from the user
    const {page, size} = req.query
    // check that order is found
    const features = new APIFeatures(req.query, SpareOrder.find().select('orderItems.title totalPrice orderItems.quantity'))
    .pagination({page, size})
    const orders = await features.mongooseQuery
    if(!orders.length) return next(new Error('Orders not found', { cause: 404 }));
    // send response
    res.status(200).json({
        msg: 'Orders retrieved successfully', 
        statusCode: 200,
        orders
    })
}

export const updateOrderDelivered = async (req, res, next) => {
    // destruct data from the trcker
    const {orderId} = req.params;
    // check that order is found
    const order = await SpareOrder.findById(orderId);
    // check that order is found
    if(!order) return next(new Error('Order not found', { cause: 404 }))
    if (order.orderStatus != 'Placed') return next(new Error('Order can not be delivered', { cause: 409 }));
    // update order
    order.orderStatus = 'Delivered'
    await order.save()
    // send response
    res.status(200).json({
        msg: 'Order status updated successfully', 
        statusCode: 200,
    })
}

export const updateOrderPaid = async (req, res, next) => {
    // destruct data from the tracker
    const {orderId} = req.params;
    // check that order is found
    const order = await SpareOrder.findById(orderId);
    // check that order is found
    if(!order) return next(new Error('Order not found', { cause: 404 }))
    if(order.orderStatus != 'Delivered') return next(new Error('Order can not be updated to paid right now', { cause: 404 }))
        // update order
    order.orderStatus = 'Paid'
    await order.save()
    // send response
    res.status(200).json({
        msg: 'Order status updated successfully', 
        statusCode: 200,
    })
}

export const updateOrderCancelled = async (req, res, next) => {
    // destruct data from the user
    const {orderId} = req.params;
    // check that order is found
    const order = await SpareOrder.findById(orderId);
    // check that order is found
    if(!order) return next(new Error('Order not found', { cause: 404 }));
    // update spare
    const isSpareAvailable = await Spare.findById(order.orderItems[0].spareId)
    if(!isSpareAvailable) return next(new Error('Spare not found', { cause: 404 }));
    if (order.orderStatus != 'Placed') return next(new Error('Order can not be cancelled', { cause: 409 }));
    // update order
    order.orderStatus = 'Cancelled'
    await order.save()
    // update spare stock
    isSpareAvailable.stock += order.orderItems[0].quantity
    await isSpareAvailable.save()
    // send response
    res.status(200).json({
        msg: 'Order status updated successfully', 
        statusCode: 200,
    })
}