const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// signup new user
module.exports.Signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const formatName = username.toLowerCase();
    const formatEmail = email.toLowerCase();

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "All fields are required" });
    }

    let existingUser = await User.findOne({ email: formatEmail });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: true, message: "Email already exists" });
    }


    // Generate OTP (6-digit number)
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes


    //   hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // Email template for OTP
    const emailTemplate = `
 <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
   <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
     <h1>Verify Your Email</h1>
   </div>
   <div style="padding: 20px;">
     <p>Hello,</p>
     <p>Thank you for signing up! Your verification code is:</p>
     <h1 style="font-size: 36px; color: #4CAF50; text-align: center;">${otp}</h1>
     <p>Enter this code on the verification page to complete your registration.</p>
     <p>This code will expire in <b>10 Minutes</b> for security reasons.</p>
     <p>If you did not create an account with us, please ignore this email.</p>
     <br />
     <p>Best regards,</p>
   </div>
 </div>
`;

    // Attempt to send verification email
    const emailSent = await sendMail(
      formatEmail,
      "RedHide Ranch - Verify Your Email",
      emailTemplate
    );

    if (!emailSent) {
      return res.status(500).json({
        error: true,
        type: "MAIL_FAILED",
        message: "Failed to send verification email. Please try again.",
      });
    }

    const newUser = new User({
      username: formatName,
      email: formatEmail,
      password: hashedPassword,
      emailVerifyOTP: {
        code: otp,
        expiresAt: otpExpiry,
      },
    });

    await newUser.save();

    res.status(200).json({
      error: false,
      type: "MAIL_SENT",
      message: "Verification Email Sent to Your Gmail Please Verify",
    });

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};


// verify email controller
module.exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        error: true,
        message: "Email and verification code are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    // Check if user has an OTP
    if (!user.emailVerifyOTP || !user.emailVerifyOTP.code || !user.emailVerifyOTP.expiresAt) {
      return res.status(400).json({
        error: true,
        message: "No OTP found for this user",
      });
    }

    // Check if OTP is expired
    if (Date.now() > user.emailVerifyOTP.expiresAt) {
      return res.status(400).json({
        error: true,
        message: "OTP has expired, please request a new one",
      });
    }

    // Verify the OTP code
    if (user.emailVerifyOTP.code !== parseInt(code)) {
      return res.status(400).json({
        error: true,
        message: "Invalid verification code",
      });
    }

    // If verification is successful, mark user as verified
    user.verified = true;
    user.emailVerifyOTP = undefined; // Clear OTP after verification
    await user.save();

    return res.status(200).json({
      error: false,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};


// login
module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });
    }


    if (user.verified === false) {
      return res.status(403).json({
        error: true,
        message: "Unable to login, verify email first",
      });
    }

    const token = generateToken(user, res);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, ...userData } = user.toObject();

    return res.json({
      error: false,
      user: userData,
      token,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};



module.exports.sendOTPForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: true, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    // Generate OTP (6-digit number)
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Email template for OTP
    const emailTemplate = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
        <h1>Password Reset Request</h1>
      </div>
      <div style="padding: 20px;">
        <p>Hello,</p>
        <p>Your verification code for Password Reset is:</p>
        <h1 style="font-size: 36px; color: #4CAF50; text-align: center;">${otp}</h1>
        <p>Enter this code on the verification page to complete your password reset.</p>
        <p>This code will expire in <b>10 Minutes</b> for security reasons.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br />
        <p>Best regards,</p>
      </div>
    </div>
  `;

    // Send the OTP email
    const emailSent = await sendMail(
      email.toLowerCase(),
      "RedHide Ranch - Password Reset",
      emailTemplate
    );

    if (!emailSent) {
      return res.status(500).json({
        error: true,
        type: "MAIL_FAILED",
        message: "Failed to send password reset email. Please try again.",
      });
    }

    // Save OTP and expiry to user document
    user.passwordResetOTP = {
      code: otp,
      expiresAt: otpExpiry,
    };

    await user.save();

    res.status(200).json({
      error: false,
      type: "MAIL_SENT",
      message: "Password reset OTP has been sent to your email. Please verify.",
    });
  } catch (error) {
    console.error("Error in sending OTP for password reset:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};


// Reset Password with OTP
module.exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  console.log(req.body);

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ error: true, message: "User not found" });
  }

  if (!user.passwordResetOTP || user.passwordResetOTP.expiresAt < Date.now()) {
    return res.status(400).json({ error: true, message: "OTP expired or invalid." });
  }

  if (user.passwordResetOTP.code !== parseInt(otp)) {
    return res.status(400).json({ error: true, message: "Invalid OTP." });
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update user password and clear OTP
  user.password = hashedPassword;
  user.passwordResetOTP = undefined;
  await user.save();

  res.status(200).json({
    error: false,
    message: "Password reset successfully.",
  });
};



// change password if old know 
module.exports.changePassword = async (req, res) => {
  try {
    console.log(req.body)
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res
      .status(200)
      .json({ error: false, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

// logout the user
module.exports.Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
    });
    res
      .status(200)
      .json({ error: false, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

// get login user details
module.exports.getUser = async (req, res) => {
  try {
    const isUser = await User.findById(req.user._id);
    if (!isUser) {
      return res.status(404).send({ error: true, message: "User not found" });
    }
    res.json({ error: false, user: isUser });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};
