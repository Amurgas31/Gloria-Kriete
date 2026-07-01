import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import registerDonorRoutes from "./src/routes/registerDonor.js"
import loginDonorRoutes from "./src/routes/loginDonor.js"

// Logout
import logoutRoutes from "./src/routes/logout.js";

// Wompi (Pasarela de pagos)
import wompiRoutes from "./src/routes/wompi.js";

// Middlewares
import limiter from "./src/middlewares/limiter.js";
import { validateAuthCookie } from "./src/middlewares/authMiddleware.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173/", "https://localhost:5174"],
    credentials: true,
  }),
);

app.use(limiter);

app.use(cookieParser());

app.use(express.json());

// Donors
app.use("/api/registerDonor", registerDonorRoutes);
app.use("/api/loginDonor", loginDonorRoutes)

// Logout
app.use("/api/logout", validateAuthCookie(["Donor"]), logoutRoutes);

// Wompi
app.use("/api/wompi", validateAuthCookie(["Donor"]),  wompiRoutes);

export default app;