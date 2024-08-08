import { APIFeatures } from "../../utils/api-features.js"
import { ordersData } from "./response.model.js";
import { orderData } from "./response.model.js";

import Service from "../../../DB/models/service.model.js";
import ServiceOrder from "../../../DB/models/service-order.model.js";

export const createOrder = async (req, res ,next) => {
    //destruct data from the user
    const { serviceId, shippingAddress, problemDesc, orderDate, orderTime, orderType, phoneNumber } = req.body
    const { _id } = req.authUser
    // Service check
    const isService = await Service.findById(serviceId)
    if (!isService) {
        return next(new Error('Service not found', { cause: 404 }))
    }
    // set orderitems
    const orderItems = {
        title: isService.title,
        serviceId,
    }
    // order status + paymentmethod
    const paymentMethod = 'Cash';
    const orderStatus = 'Placed';
    // create order
    const order = await ServiceOrder.create({
        userId: _id,
        orderItems,
        paymentMethod,
        orderStatus,
        shippingAddress,
        problemDesc, 
        orderDate,
        orderTime, 
        orderType, 
        phoneNumber
    })
    if (!order) {
        return next(new Error('Error while creating order', { cause: 500 }))
    }
    // send response
    res.status(201).json({
        msg: 'Order for this service created successfully', 
        statusCode: 201
    })
}

export const getMyOrders = async (req, res, next) => {
    // destruct data from the user
    const {_id} = req.authUser
    // check that order is found
    const orders = await ServiceOrder.find({userId: _id, orderStatus: { $ne: 'Cancelled' }})
        .select('problemDesc orderDate orderTime orderType')
    // check that order is found
    if(!orders.length) return next(new Error('Orders not found', { cause: 404 }));
    // send response
    res.status(200).json({
        msg: 'Orders retrieved successfully', 
        statusCode: 200,
        orders: orders.map(order => ordersData(order))
    })
}

export const getOrderById = async (req, res, next) => {
    // destruct data from the user
    const {_id} = req.authUser
    const {orderId} = req.params;
    // check that order is found
    const order = await ServiceOrder.findOne({_id: orderId, userId: _id})
    .select('problemDesc orderDate orderTime orderType orderStatus orderItems.title totalPrice');
    // check that order is found
    if(!order) return next(new Error('Order not found', { cause: 404 }));
    // send response
    res.status(200).json({
        msg: 'Order retrieved successfully', 
        statusCode: 200,
        order: orderData(order)
    })
}

export const cancelMyOrder = async (req, res, next) => {
    // destruct data from the user
    const {orderId} = req.params
    // check that order is found
    const order = await ServiceOrder.findById(orderId)
    // check that order is found
    if(!order) return next(new Error('Order not found', { cause: 404 }));
    // check product status
    if (order.orderStatus != 'Placed') return next(new Error('Order can not be cancelled', { cause: 409 }));
    // update order
    order.orderStatus = 'Cancelled'
    await order.save()
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
    const features = new APIFeatures(req.query, ServiceOrder.find().select('problemDesc orderDate orderTime'))
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
    const order = await ServiceOrder.findById(orderId);
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
    const order = await ServiceOrder.findById(orderId);
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
    const order = await ServiceOrder.findById(orderId);
    // check that order is found
    if(!order) return next(new Error('Order not found', { cause: 404 }));
    if (order.orderStatus != 'Placed') return next(new Error('Order can not be cancelled', { cause: 409 }));
    // update order
    order.orderStatus = 'Cancelled'
    await order.save()
    // send response
    res.status(200).json({
        msg: 'Order status updated successfully', 
        statusCode: 200,
    })
}