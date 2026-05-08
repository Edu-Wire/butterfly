import { Router } from "express";
import { CategoryController } from "../controllers/categoryController.js";

const router = Router();

router.get("/", (req, res) => CategoryController.getAll(req, res));
router.post("/", (req, res) => CategoryController.create(req, res));
router.get("/:id", (req, res) => CategoryController.getById(req, res));
router.put("/:id", (req, res) => CategoryController.update(req, res));
router.delete("/:id", (req, res) => CategoryController.delete(req, res));

export default router;
