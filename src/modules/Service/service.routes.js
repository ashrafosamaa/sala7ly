import { Router } from "express";
import { authAdmin } from "../../middlewares/auth-admin.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";

import * as serviceController from './service.controller.js'
import * as validator from "./service.validator.js"

import expressAsyncHandler from "express-async-handler";

const router = Router();


router.post('/', authAdmin(),
    multerMiddleHost({extensions: allowedExtensions.image
    }).single('serviceImg'), validationMiddleware(validator.addServiceValidator),
    expressAsyncHandler(serviceController.addService))

router.get('/', validationMiddleware(validator.getAllServicesValidator),
    expressAsyncHandler(serviceController.getAllServices))

router.get('/byId/:serviceId', validationMiddleware(validator.IDValidator),
    expressAsyncHandler(serviceController.getServiceById))

router.put('/:serviceId', authAdmin(), validationMiddleware(validator.updateServiceValidator),
    expressAsyncHandler(serviceController.updateService))

router.delete('/:serviceId', authAdmin(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(serviceController.deleteService))

router.get('/search', validationMiddleware(validator.searchValidator),
    expressAsyncHandler(serviceController.search))


export default router

