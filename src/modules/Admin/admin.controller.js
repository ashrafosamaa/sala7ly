import Admin from "../../../DB/models/admin.model.js";

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const login = async (req, res, next) => {
    // check Admin data in req.body
    const admin = await Admin.findOne({userName: req.body.userName});
    if (!admin) {
        return next(new Error("Incorrect Username", { cause: 404 }));
    }
    // check password
    const isPasswordCorrect = await bcrypt.compare(req.body.password, admin.password);
    if (!(isPasswordCorrect)) {
        return next(new Error("Incorrect Password", { cause: 404 }));
    }
    // generate token
    const adminToken = jwt.sign({ id: admin._id, userName: req.body.userName, role: admin.role },
        process.env.JWT_SECRET_LOGIN,
        {
            expiresIn: "90d"
        }
    )
    const adminName = admin.userName.split(" ")[0];
    // send response
    return res.status(200).json({
        msg: `Login Successfully, Welcome Mr/Ms. ${adminName}`, 
        statusCode: 200,
        adminToken
    });
}

export const updatePassword = async (req, res, next)=> {
    // destruct data from req.body
    const { oldPassword, password } = req.body
    const { _id } = req.authAdmin
    // check if admin exists
    const admin = await Admin.findById(_id)
    if(!admin){
        return next(new Error("Admin not found", { cause: 404 }));
    }
    // check if password is correct
    const isPasswordMatch = bcrypt.compareSync(oldPassword, admin.password)
    if(!isPasswordMatch){
        return next(new Error("Incorrect old password", { cause: 400 }));
    }
    // update password
    admin.password = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
    // save admin
    await admin.save()
    // generate token
    const adminToken = jwt.sign({ id: admin._id, userName: admin.userName, role: admin.role },
        process.env.JWT_SECRET_LOGIN,
        {
            expiresIn: "90d"
        }
    ) 
    // send response
    res.status(200).json({
        msg: "Password updated successfully", 
        statusCode: 200,
        adminToken
    })
}