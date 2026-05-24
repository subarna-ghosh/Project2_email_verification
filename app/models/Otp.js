const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining Schema
const emailVerificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UModel",
      required: true,
    },
    otp: { type: String, required: true },
    attempts: {
      type: Number,
      default: 0,
    },
    createdAt: { type: Date, default: Date.now, expires: "15m" },
  },
  { versionKey: false },
);

// Model
const EmailVerificationModel = mongoose.model(
  "EmailVerifiy",
  emailVerificationSchema,
);

module.exports = EmailVerificationModel;
