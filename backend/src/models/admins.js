/*
    Campos:
        name
        email
        password
        isVerified
        loginAttemps
        timeOut
  */

import { Schema, model } from "mongoose";

const adminsSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    isVerified: {
      type: Boolean,
    },
    loginAttemps: {
      type: Number,
    },
    timeOut: {
      type: Date,
    },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("Admins", adminsSchema);
