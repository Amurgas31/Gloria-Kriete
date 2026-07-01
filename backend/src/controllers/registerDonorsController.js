import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import donorsModel from "../models/donors.js";

import { config } from "../../config.js";

const registerDonorsController = {};

registerDonorsController.register = async (req, res) => {
  const { name, email, password, isVerified } = req.body;

  try {
    const existsDonor = await donorsModel.findOne({ email });
    if (existsDonor) {
      return res.status(400).json({ message: "Donor already exists" });
    }

    const passwordHashed = await bcryptjs.hash(password, 10);

    const randomNumber = crypto.randomBytes(3).toString("hex");

    const token = jsonwebtoken.sign(
      {
        randomNumber,
        name,
        email,
        password: passwordHashed,
        isVerified,
      },
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    res.cookie("registrationCookie", token, { maxAge: 15 * 60 * 1000 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Verificación de Cuenta",
      text:
        "Para verificar tu cuenta, utiliza este código " +
        randomNumber +
        " expira en 15 minutos",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Error sending email" });
      }
      return res.status(200).json({ message: "Email sent" });
    });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

registerDonorsController.verifyCode = async (req, res) => {
  try {
    const { verificationCodeRequest } = req.body;

    const token = req.cookies.registrationCookie;

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const {
      randomNumber: storedCode,
      name,
      email,
      password,
      isVerified,
    } = decoded;

    if (verificationCodeRequest != storedCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const NewDonor = new donorsModel({
      name,
      email,
      password,
      isVerified: true,
    });

    await NewDonor.save();

    res.clearCookie("registrationCookie");

    return res.status(200).json({ message: "Donor registered" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerDonorsController;
