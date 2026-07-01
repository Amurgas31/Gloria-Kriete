const donationController = {};

import donationModel from "../models/donations.js";

// SELECT
donationController.getDonations = async (req, res) => {
  const donations = await donationModel.find();
  res.json(donations);
};

// INSERT
donationController.insertDonation = async (req, res) => {
  const { donorId, amount, donationDate, paymentStatus, transactionId } =
    req.body;

  const newDonation = new donationModel({
    donorId,
    amount,
    donationDate,
    paymentStatus,
    transactionId,
  });

  await newDonation.save();

  res.json({ message: "Donation saved" });
};

// DELETE
donationController.deleteDonations = async (req, res) => {
  await donationModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Donation Deleted" });
};

// UPDATE
donationController.updateBranches = async (req, res) => {
  const { donorId, amount, donationDate, paymentStatus, transactionId } =
    req.body;

  await donationModel.findByIdAndUpdate(
    req.params.id,
    {
      donorId,
      amount,
      donationDate,
      paymentStatus,
      transactionId,
    },
    { new: true },
  );

  res.json({ message: "Donation updated" });
};

export default donationController;
