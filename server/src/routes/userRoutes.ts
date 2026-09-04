import { Router } from "express";
import { deleteUserHandler, loginHandler, registerHandler, updatePasswordHandler } from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();
router.post('/register',registerHandler);
router.post('/login',loginHandler);
router.patch('/password',authenticate, updatePasswordHandler);
router.delete('/',authenticate, deleteUserHandler);

export default router;
