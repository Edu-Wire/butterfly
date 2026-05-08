import { Router } from "express";
import { DashboardController } from "../controllers/dashboardController.js";

const router = Router();

router.get("/dashboard", (req, res) => DashboardController.getStats(req, res));

export default router;
