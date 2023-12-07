import { Router } from "express";
import { controller } from "../Controllers/productos.controller.js";
import { checkToken } from "../Token/middelware.js";

const router = Router();

router.get("/", controller.productos);

router.get("/getList", checkToken, controller.getList);

router.post("/new", checkToken, controller.insert);

router.post("/getOrCreate", checkToken, controller.getOrCreate);

router.patch("/update", checkToken, controller.update);

router.delete("/remove", checkToken, controller.remove);

export default router;
