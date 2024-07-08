import { Router } from "express";
import { authUser } from "../../middlewares/auth-user.middleware.js";
import { authAdmin } from "../../middlewares/auth-admin.middleware.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js"
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

import * as userController from './user.controller.js'
import * as validator from "./user.validator.js"

import expressAsyncHandler from "express-async-handler";

const router = Router();


router.get('/', authAdmin(), validationMiddleware(validator.getAllUsersValidator),
    expressAsyncHandler(userController.getAllUsers))

router.get('/account/:userId', authAdmin(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(userController.getUser))

router.get('/search', authAdmin(), validationMiddleware(validator.searchValidator),
    expressAsyncHandler(userController.search))

router.put('/update/:userId', authAdmin(), validationMiddleware(validator.updateUserValidator),
    expressAsyncHandler(userController.updateUser))

router.delete('/delete/:userId', authAdmin(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(userController.deleteUser))

router.get('/profiledata', authUser(), validationMiddleware(validator.noValidator),
    expressAsyncHandler(userController.getAccountData))

router.put('/updateprofile', authUser(), validationMiddleware(validator.updateByUserValidator),
    expressAsyncHandler(userController.updateProfileData))

router.patch('/updatepassword', authUser(), validationMiddleware(validator.updatePasswordValidator),
    expressAsyncHandler(userController.updatePassword))

router.post('/addprofilepicture', authUser(),
    multerMiddleHost({extensions: allowedExtensions.image
        }).single('profileImg'), validationMiddleware(validator.noValidator),
expressAsyncHandler(userController.addProfilePicture))

router.put('/updateprofilepicture', authUser(),
    multerMiddleHost({extensions: allowedExtensions.image
        }).single('profileImg'), validationMiddleware(validator.updateProfilePictureValidator),
expressAsyncHandler(userController.updateProfilePicture))

router.delete('/deleteaccount', authUser(), validationMiddleware(validator.noValidator),
    expressAsyncHandler(userController.deleteAccount))


export default router;