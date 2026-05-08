import { Router } from "express";
import { CollectionController } from "../controllers/collectionController.js";

const router = Router();

router.get("/", (req, res) => CollectionController.getAll(req, res));
router.post("/", (req, res) => CollectionController.create(req, res));
router.post("/reorder", (req, res) => CollectionController.reorder(req, res));
router.get("/:id", (req, res) => CollectionController.getById(req, res));
router.put("/:id", (req, res) => CollectionController.update(req, res));
router.delete("/:id", (req, res) => CollectionController.delete(req, res));

export default router;
