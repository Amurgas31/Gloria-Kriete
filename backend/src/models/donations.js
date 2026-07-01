/*
    Campos:
        donorId
        amount
        donationDate
        paymentStatus
        transactionId
  */

import { Schema, model } from "mongoose";

const donationsSchema = new Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donors",
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

export default model("Donations", donationsSchema);
