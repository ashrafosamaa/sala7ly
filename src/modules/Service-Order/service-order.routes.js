import { Router } from "express";
import { authUser } from "../../middlewares/auth-user.middleware.js";
import { authAdmin } from "../../middlewares/auth-admin.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

import * as serviceOrderController from './service-order.controller.js'
import * as validator from "./service-order.validator.js"

import expressAsyncHandler from "express-async-handler";

const router = Router();

router.post('/', authUser(), validationMiddleware(validator.createOrderValidator),
    expressAsyncHandler(serviceOrderController.createOrder))

router.get('/', authUser(), validationMiddleware(validator.noValidator),
    expressAsyncHandler(serviceOrderController.getMyOrders))

router.get('/byId/:orderId', authUser(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(serviceOrderController.getOrderById))

router.patch('/cancelById/:orderId', authUser(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(serviceOrderController.cancelMyOrder))

router.get('/for-admins', authAdmin(), validationMiddleware(validator.getAllOrdersValidator),
    expressAsyncHandler(serviceOrderController.getAllOrdersForAdmin))

router.patch('/update-delivered/:orderId', authAdmin(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(serviceOrderController.updateOrderDelivered))

router.patch('/update-paid/:orderId', authAdmin(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(serviceOrderController.updateOrderPaid))

router.patch('/update-cancelled/:orderId', authAdmin(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(serviceOrderController.updateOrderCancelled))


export default router;