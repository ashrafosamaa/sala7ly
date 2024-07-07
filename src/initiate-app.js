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

    app.use('*', (req, res, next)=> {
        return next(new Error('Page not found', { cause: 404 }))
    })

    app.use(globalResponse)

    const server = app.listen(port, ()=> console.log(`server is running on host`))

}