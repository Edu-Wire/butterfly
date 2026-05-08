import { Router } from "express";
import { WishlistController } from "../controllers/wishlistController.js";

const router = Router();

router.get("/", (req, res) => WishlistController.getWishlist(req, res));
router.post("/", (req, res) => WishlistController.addToWishlist(req, res));
router.delete("/:id", (req, res) => WishlistController.delete(req, res));

export default router;
