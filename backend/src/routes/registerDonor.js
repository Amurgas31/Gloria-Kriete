import express from "express";
import registerDonorController from "../controllers/registerDonorsController.js";

const router = express.Router();

router.route("/").post(registerDonorController.register);
router.route("/verifyCodeEmail").post(registerDonorController.verifyCode);

export default router;