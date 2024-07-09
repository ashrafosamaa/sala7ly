import { Router } from "express";
import { authAdmin } from "../../middlewares/auth-admin.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";

import * as spareController from './spare.controller.js'
import * as validator from "./spare.validator.js"

import expressAsyncHandler from "express-async-handler";

const router = Router();


router.post('/', authAdmin(),
    multerMiddleHost({extensions: allowedExtensions.image
    }).single('coverImg'), validationMiddleware(validator.addSpareValidator),
    expressAsyncHandler(spareController.addSpare))

router.get('/', validationMiddleware(validator.getAllSparesValidator),
    expressAsyncHandler(spareController.getAllSpares))

router.get('/byId/:spareId', validationMiddleware(validator.IDValidator),
    expressAsyncHandler(spareController.getSpareById))

router.put('/:spareId', authAdmin(), validationMiddleware(validator.updateSpareSchema),
    expressAsyncHandler(spareController.updateSpare))

router.delete('/:spareId', authAdmin(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(spareController.deleteSpare))

router.get('/search', validationMiddleware(validator.searchValidator),
    expressAsyncHandler(spareController.search))


export default router