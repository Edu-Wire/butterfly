import { Router } from "express";
import { ReturnRequestController } from "../controllers/returnRequestController.js";

const router = Router();

router.get("/", (req, res) => ReturnRequestController.getAll(req, res));
router.post("/", (req, res) => ReturnRequestController.create(req, res));
router.get("/:id", (req, res) => ReturnRequestController.getById(req, res));
router.put("/:id", (req, res) => ReturnRequestController.updateStatus(req, res));

export default router;
