import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getRefreshToken,
  changePassword,
  getCurrentUser,
  predictLoan,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(getRefreshToken);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/current-user").post(verifyJWT, getCurrentUser);
router.post("/predict", predictLoan);

export default router;
