import { Router } from "express";
import { ContactController } from "../controllers/contactController.js";

const router = Router();

router.get("/", (req, res) => ContactController.getAll(req, res));
router.post("/", (req, res) => ContactController.create(req, res));

export default router;
