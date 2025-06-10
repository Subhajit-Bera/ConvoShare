import mongoose, { Schema, model, Types } from "mongoose";

const schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // OTP expires after 5 minutes (300 seconds)
  }
});

export const Otp = mongoose.models.Otp || model("Otp", schema);