import { Router } from "express";
import authenticationRouter from "./authentication.router";
import penghuniRouter from "./penghuni.router";
import rumahRouter from "./rumah.router";

const router = Router()

export default (): Router => {
    authenticationRouter(router)
    penghuniRouter(router)
    rumahRouter(router)
    return router
}