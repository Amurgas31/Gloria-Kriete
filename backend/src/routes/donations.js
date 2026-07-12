import express from "express";
import donationsController from "../controllers/donationsController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
    .get(validateAuthCookie(["Admin"]), donationsController.getDonations)
    .post(validateAuthCookie(["Donor"]), donationsController.insertDonation);

router.route("/:id")
    .put(validateAuthCookie(["Donor", "Admin"]), donationsController.updateBranches)
    .delete(validateAuthCookie(["Admin"]), donationsController.deleteDonations);

export default router;