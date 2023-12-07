import { Router } from "express";
import { controller } from "../Controllers/usuario.controller.js";

const router =  Router();

router.post("/register",controller.register)

router.post("/login",controller.login)

router.post("/getList",controller.getList)


export default router;