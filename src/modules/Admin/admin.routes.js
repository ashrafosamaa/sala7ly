import { Router } from "express";
import { authAdmin } from "../../middlewares/auth-admin.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

import * as adminController from './admin.controller.js'
import * as validator from "./admin.validator.js"

import expressAsyncHandler from "express-async-handler";

const router = Router();

// router.get('/keep-alive', (req, res, next) => {
//     res.send('Application is awake!');
// })


router.post('/login', validationMiddleware(validator.loginValidator),
    expressAsyncHandler(adminController.login))


router.patch('/update-password', authAdmin(),
    validationMiddleware(validator.updatePasswordValidator),
    expressAsyncHandler(adminController.updatePassword))

    
export default router

