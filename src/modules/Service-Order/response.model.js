export function ordersData(order) {
    return {
        _id: order._id,
        problemDesc: order.problemDesc,
        orderDate: order.orderDate.toISOString().split('T')[0],
        orderTime: order.orderTime,
        orderType: order.orderType,
    }
}

export function orderData(order) {
    return {
        _id: order._id,
        orderItems: order.orderItems.title,
        problemDesc: order.problemDesc,
        orderDate: order.orderDate.toISOString().split('T')[0],
        orderTime: order.orderTime,
        orderType: order.orderType,
        orderStatus: order.orderStatus,
    }
}