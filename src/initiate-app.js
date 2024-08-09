import db_connection from "../DB/connection.js"

import { globalResponse } from "./middlewares/global-response.middleware.js"

import cors from 'cors'

import * as routers from "./modules/index.routes.js"

export const initiateApp = (app, express)=> {
    const port = process.env.PORT

    app.use(cors())

    app.use((req, res, next) => {
        if (req.originalUrl == "/orders/webhook") {
            next()
        }
        else {
            express.json()(req, res, next)
        }
    })

    db_connection()

    app.use('/userAuth', routers.userAuthRouter)
    app.use('/user', routers.userRouter)
    app.use('/admin', routers.adminRouter)
    app.use('/service', routers.serviceRouter)
    app.use('/spare', routers.spareRouter)
    app.use('/service-order', routers.serviceOrderRouter)
    app.use('/spare-order', routers.spareOrderRouter)

    app.get('/', (req, res, next)=> {
        res.send("<h1> Welcome In Sala7ly App </h1>");
    })

    app.all('*', (req, res, next)=> {
        return next(new Error('Sorry Page not found', { cause: 404 }))
    })

    app.use(globalResponse)

    app.listen(port, ()=> console.log(`server is running on host`))
}