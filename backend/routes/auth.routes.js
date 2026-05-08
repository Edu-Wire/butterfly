import { Router } from "express";
import { AuthController } from "../controllers/authController.js";

const router = Router();

router.post("/signup", (req, res) => AuthController.signup(req, res));
router.post("/login", (req, res) => AuthController.login(req, res));
router.post("/logout", (req, res) => AuthController.logout(req, res));

export default router;
