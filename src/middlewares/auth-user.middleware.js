import jwt from 'jsonwebtoken'
import User from "../../DB/models/user.model.js"

export const authUser = (accessRoles = "user") => {
    return async (req, res, next) => {
        try {
            const { accesstoken } = req.headers
            if (!accesstoken) return next(new Error('Please login first', { cause: 400 }))

            const decodedData = jwt.verify(accesstoken, process.env.JWT_SECRET_LOGIN)
            
            if (!decodedData || !decodedData.id) return next(new Error('Invalid token payload', { cause: 400 }))
            
            // user check 
            const findUser = await User.findById(decodedData.id, 'name email role')
            if (!findUser) return next(new Error('Please signUp first', { cause: 404 }))
            // auhtorization
            if (!accessRoles.includes(findUser.role)) return next(new Error('Unauthorized', { cause: 401 }))
            req.authUser = findUser

            next()
        } catch (error) {
            console.log(error);
            next(new Error('catch error in auth middleware', { cause: 500 }))
        }
    }
}