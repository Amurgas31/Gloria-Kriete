import donorModel from "../models/donors.js";

import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../../config.js";

const loginDonorController = {};

loginDonorController.login = async (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  try {
    const donorFound = await donorModel.findOne({ email });

    // Si no existe el correo en la base de datos
    if (!donorFound) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Verificar si el usuario está bloqueado
    if (donorFound.timeOut && donorFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    // Validar la contraseña
    const isMatch = await bcrypt.compare(password, donorFound.password);

    if (!isMatch) {
      donorFound.loginAttemps = (donorFound.loginAttemps || 0) + 1;

      // Si llega a 5 intentos fallidos se bloquea la cuenta
      if (donorFound.loginAttemps >= 5) {
        donorFound.timeOut = Date.now() + 5 * 60 * 1000;
        donorFound.loginAttemps = 0;

        await donorFound.save();

        return res.status(403).json({
          message: "Cuenta bloqueada por multiples intentos fallidos",
        });
      }

      await donorFound.save();

      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    donorFound.loginAttemps = 0;
    donorFound.timeOut = null;

    const token = jsonwebtoken.sign(
      { id: donorFound._id, userType: "Donor" },
      config.JWT.secret,
      { expiresIn: "30d" },
    );

    res.cookie("authCookie", token);

    return res.status(200).json({ message: "Login exitoso" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default loginDonorController;
