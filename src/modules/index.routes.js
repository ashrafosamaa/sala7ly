import userAuthRouter from "./User-Auth/user-auth.routes.js"
import userRouter from "./User/user.routes.js"
import adminRouter from "./Admin/admin.routes.js"
import serviceRouter from "./Service/service.routes.js"
import spareRouter from "./Spare/spare.routes.js"
import serviceOrderRouter from "./Service-Order/service-order.routes.js"
import spareOrderRouter from "./Spare-Order/spare-order.routes.js"

export {
    userAuthRouter,
    userRouter,
    adminRouter,
    serviceRouter,
    spareRouter,
    serviceOrderRouter,
    spareOrderRouter
}