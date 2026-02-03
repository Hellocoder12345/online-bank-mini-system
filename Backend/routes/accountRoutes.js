const express = require("express");
const router = express.Router();
const Account = require("../models/Account");

// CREATE ACCOUNT
router.post("/create", async (req, res) => {
  try {
    const { accountNo, holderName, isKYCVerified } = req.body;

    const account = new Account({
      accountNo,
      holderName,
      isKYCVerified
    });

    await account.save();
    res.send("Account Created Successfully");
  } catch (err) {
    res.send("Account Creation Failed (Duplicate Account No)");
  }
});

module.exports = router;

// DEPOSIT MONEY
router.post("/deposit", async (req, res) => {
  const { accountNo, amount } = req.body;

  // validation
  if (amount <= 0) {
    return res.send("Invalid Deposit Amount");
  }

  const account = await Account.findOne({ accountNo });

  if (!account) {
    return res.send("Account Not Found");
  }

  account.balance += amount;
  await account.save();

  res.send("Deposit Successful");
});


// WITHDRAW MONEY
router.post("/withdraw", async (req, res) => {
  const { accountNo, amount } = req.body;

  if (amount <= 0) {
    return res.send("Invalid Withdrawal Amount");
  }

  const account = await Account.findOne({ accountNo });

  if (!account) {
    return res.send("Account Not Found");
  }

  if (account.balance < amount) {
    return res.send("Insufficient Balance");
  }

  account.balance -= amount;
  await account.save();

  res.send("Withdrawal Successful");
});

// TRANSFER MONEY
router.post("/transfer", async (req, res) => {
  const { senderAccount, receiverAccount, amount } = req.body;

  // basic validation
  if (amount <= 0) {
    return res.send("Invalid Transfer Amount");
  }

  const sender = await Account.findOne({ accountNo: senderAccount });
  const receiver = await Account.findOne({ accountNo: receiverAccount });

  if (!sender || !receiver) {
    return res.send("Sender or Receiver Account Not Found");
  }

  // KYC validation
  if (!sender.isKYCVerified) {
    return res.send("Transfer Failed: KYC Not Verified");
  }

  // balance validation
  if (sender.balance < amount) {
    return res.send("Transfer Failed: Insufficient Balance");
  }

  // transfer logic
  sender.balance -= amount;
  receiver.balance += amount;

  await sender.save();
  await receiver.save();

  res.send("Transfer Successful");
});


// LIST ALL ACCOUNTS
router.get("/all", async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
});
