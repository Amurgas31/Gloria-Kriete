import express from "express";
import loginDonorController from "../controllers/loginDonorController.js";

const router = express.Router();

router.route("/").post(loginDonorController.login);

export default router;