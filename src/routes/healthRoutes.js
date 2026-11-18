import { Router } from "express";
import { checkDatabase } from "../controllers/healthController.js";

const router = Router();

router.get("/database", checkDatabase);

export default router;