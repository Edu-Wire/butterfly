import { Router } from "express";
import { InventoryController } from "../controllers/inventoryController.js";

const router = Router();

router.get("/", (req, res) => InventoryController.getAll(req, res));
router.post("/", (req, res) => InventoryController.create(req, res));
router.post("/check", (req, res) => InventoryController.checkStock(req, res));
router.get("/movements", (req, res) => InventoryController.getMovements(req, res));
router.get("/:id", (req, res) => InventoryController.getById(req, res));
router.put("/:id", (req, res) => InventoryController.update(req, res));
router.delete("/:id", (req, res) => InventoryController.delete(req, res));
router.post("/:id/reserve", (req, res) => InventoryController.reserve(req, res));
router.post("/:id/release", (req, res) => InventoryController.release(req, res));
router.post("/:id/commit", (req, res) => InventoryController.commit(req, res));
router.post("/:id/restock", (req, res) => InventoryController.restock(req, res));

export default router;
