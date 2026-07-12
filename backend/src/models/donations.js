/*
    Campos:
        donorId
        amount
        donationDate
        paymentStatus
        transactionId
  */

import mongoose, { Schema, model } from "mongoose";

const donationsSchema = new Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donors",
    },
    amount: {
      type: Number,
    },
    donationDate: {
      type: Date,
    },
    paymentStatus: {
      type: String,
    },
    transactionId: {
      type: String,
    }
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("Donations", donationsSchema);
