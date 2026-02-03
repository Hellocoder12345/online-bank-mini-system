const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  accountNo: {
    type: Number,
    required: true,
    unique: true
  },
  holderName: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  isKYCVerified: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model("Account", accountSchema);
