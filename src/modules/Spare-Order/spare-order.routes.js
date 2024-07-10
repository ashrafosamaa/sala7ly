import { Router } from "express";
import { authUser } from "../../middlewares/auth-user.middleware.js";
import { authAdmin } from "../../middlewares/auth-admin.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

import * as spareOrderController from './spare-order.controller.js'
import * as validator from "./spare-order.validator.js"

import expressAsyncHandler from "express-async-handler";

const router = Router();

router.post('/', authUser(), validationMiddleware(validator.createOrderValidator),
    expressAsyncHandler(spareOrderController.createOrder))

router.get('/', authUser(), validationMiddleware(validator.noValidator),
    expressAsyncHandler(spareOrderController.getMyOrders))

router.get('/byId/:orderId', authUser(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(spareOrderController.getOrderById))

router.patch('/cancelById/:orderId', authUser(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(spareOrderController.cancelMyOrder))

router.get('/for-admins', authAdmin(), validationMiddleware(validator.getAllOrdersValidator),
    expressAsyncHandler(spareOrderController.getAllOrdersForAdmin))

router.patch('/update-delivered/:orderId', authAdmin(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(spareOrderController.updateOrderDelivered))

router.patch('/update-paid/:orderId', authAdmin(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(spareOrderController.updateOrderPaid))

router.patch('/update-cancelled/:orderId', authAdmin(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(spareOrderController.updateOrderCancelled))


export default router;