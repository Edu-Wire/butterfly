import { Router } from "express";
import { OrderController } from "../controllers/orderController.js";

const router = Router();

router.get("/", (req, res) => OrderController.getAll(req, res));
router.post("/", (req, res) => OrderController.create(req, res));
router.get("/:id", (req, res) => OrderController.getById(req, res));
router.delete("/:id", (req, res) => OrderController.delete(req, res));

export default router;
