import { Router } from "express";
import { SettingsController } from "../controllers/settingsController.js";

const router = Router();

router.get("/", (req, res) => SettingsController.getSettings(req, res));
router.put("/", (req, res) => SettingsController.updateSettings(req, res));

export default router;
