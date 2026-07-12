import adminModel from "../models/admins.js";

import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../../config.js";

const loginAdminController = {};

loginAdminController.login = async (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  try {
    const adminFound = await adminModel.findOne({ email });

    // Si no existe el correo en la base de datos
    if (!adminFound) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Verificar si el usuario está bloqueado
    if (adminFound.timeOut && adminFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    // Validar la contraseña
    const isMatch = await bcrypt.compare(password, adminFound.password);

    if (!isMatch) {
      adminFound.loginAttemps = (adminFound.loginAttemps || 0) + 1;

      // Si llega a 5 intentos fallidos se bloquea la cuenta
      if (adminFound.loginAttemps >= 5) {
        adminFound.timeOut = Date.now() + 5 * 60 * 1000;
        adminFound.loginAttemps = 0;

        await adminFound.save();

        return res.status(403).json({
          message: "Cuenta bloqueada por multiples intentos fallidos",
        });
      }

      await adminFound.save();

      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    adminFound.loginAttemps = 0;
    adminFound.timeOut = null;

    const token = jsonwebtoken.sign(
      { id: adminFound._id, userType: "Admin" },
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

export default loginAdminController;
