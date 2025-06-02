const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordResetOTP: {
      code: Number,
      expiresAt: Date
    },
    emailVerifyOTP: {
      code: Number,
      expiresAt: Date
    },
    role: {
      type: String,
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false
    },
    profileImage: {
      type: Object,
      default: {}
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
