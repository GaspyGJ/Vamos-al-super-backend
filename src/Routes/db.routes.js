import { Router } from "express";
import { controller } from "../Controllers/db.controller.js";

const router =  Router();

router.get("/", controller.database);
  
router.get("/create",controller.createDatabase);
  
export default router;