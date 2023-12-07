import { Router } from "express";
import { controller } from "../Controllers/compras.controller.js";
import { checkToken } from "../Token/middelware.js";

const router =  Router();

router.get("/",controller.compras)

router.get("/getAll",checkToken,controller.getList)

router.post("/new",checkToken,controller.insert)

router.get("/byUser/:usuario_id",checkToken,controller.getComprasByUser)

router.get("/productosByCompra/:compra_id",checkToken,controller.getComprasByUser)

export default router;