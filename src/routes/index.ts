import express from "express";
import userRoute from "./userRoute";
import eventRoute from "./eventRoute";
import { signoutService, verifyTokenService } from "../services/auth/helper";
import { protect } from "../middlewares/auth";

const router = express.Router();

router.use("/user", userRoute);
router.use("/event", eventRoute);
router.get("/verifyToken", verifyTokenService);
router.get("/signout", protect, signoutService);
export default router;
