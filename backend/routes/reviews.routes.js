import { Router } from "express";
import { ReviewController } from "../controllers/reviewController.js";

const router = Router();

// Standalone reviews endpoint (not nested under products)
router.get("/", (req, res) => {
    // Forward productId from query if present
    req.params.id = req.query.productId;
    return ReviewController.getByProduct(req, res);
});

// Used when mounted under /api/products/:id/reviews (server.js mounts products separately)
router.post("/products/:id/reviews", (req, res) => ReviewController.create(req, res));
router.get("/products/:id/reviews", (req, res) => ReviewController.getByProduct(req, res));

export default router;
