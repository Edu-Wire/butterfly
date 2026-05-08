import { Router } from "express";
import { UserController } from "../controllers/userController.js";

const router = Router();

router.patch("/address", (req, res) => UserController.updateAddress(req, res));

export default router;
