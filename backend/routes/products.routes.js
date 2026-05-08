import { Router } from "express";
import { ProductController } from "../controllers/productController.js";
import { ReviewController } from "../controllers/reviewController.js";

const router = Router();

router.get("/", (req, res) => ProductController.getAll(req, res));
router.post("/", (req, res) => ProductController.create(req, res));
router.post("/bulk", (req, res) => ProductController.bulkCreate(req, res));
router.get("/:id", (req, res) => ProductController.getById(req, res));
router.put("/:id", (req, res) => ProductController.update(req, res));
router.delete("/:id", (req, res) => ProductController.delete(req, res));
router.get("/:id/reviews", (req, res) => ReviewController.getByProduct(req, res));
router.post("/:id/reviews", (req, res) => ReviewController.create(req, res));

export default router;
