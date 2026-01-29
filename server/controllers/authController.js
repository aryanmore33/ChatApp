const User = require("../models/user");
const otpGenerator = require("../utils/otpGenerator");
const responseHandler = require("../utils/responseHandler");
const sendEmail = require("../services/emailService");
const twilioService = require("../services/twilioService");
const generateToken = require("../utils/generateToken");
const {generateUploadSignature}  = require("../config/cloudinary");

// ================= SEND OTP =================
const sendOtp = async (req, res) => {
  const { email, phoneNumber, phoneSuffix } = req.body;
  const otp = otpGenerator();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  try {
    let user;

    // 🔹 EMAIL OTP
    if (email) {
      user = await User.findOne({ email });

      if (!user) {
        user = await User.create({ email });
      }

      user.emailotp = otp;
      user.emailotpExpiry = otpExpiry;
      await user.save();

      await sendEmail(email, otp);

      return responseHandler(res, 200, "OTP sent to email", { email });
    }

    // 🔹 PHONE OTP
    if (!phoneNumber || !phoneSuffix) {
      return responseHandler(res, 400, "Phone number and suffix required");
    }

    user = await User.findOne({ phoneNumber });

    if (!user) {
      user = await User.create({ phoneNumber, phoneSuffix });
    }

    // user.phoneotp = otp;
    // user.phoneotpExpiry = otpExpiry;
    await user.save();

    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
    await twilioService.sendOtpPhoneNo(fullPhoneNumber);

    return responseHandler(res, 200, "OTP sent to phone", { phoneNumber });
  } catch (error) {
    return responseHandler(res, 500, "Internal server error", {
      error: error.message
    });
  }
};

// ================= VERIFY OTP =================
const verifyOtp = async (req, res) => {
  const { email, phoneNumber, phoneSuffix, otp } = req.body;

  try {
    let user;

    // 🔹 EMAIL VERIFY
    if (email) {
      user = await User.findOne({ email });

      if (!user) {
        return responseHandler(res, 404, "User not found");
      }

      if (
        !user.emailotp ||
        String(user.emailotp) !== String(otp) ||
        Date.now() > user.emailotpExpiry
      ) {
        return responseHandler(res, 400, "Invalid or expired OTP");
      }

      user.isVerified = true;
      user.emailotp = null;
      user.emailotpExpiry = null;
      await user.save();
    }

    // 🔹 PHONE VERIFY
    else {
      if (!phoneNumber || !phoneSuffix) {
        return responseHandler(res, 400, "Phone number and suffix required");
      }

      user = await User.findOne({ phoneNumber });

      if (!user) {
        return responseHandler(res, 404, "User not found");
      }

      if (Date.now() > user.phoneotpExpiry) {
        return responseHandler(res, 400, "OTP expired");
      }

      const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
      const result = await twilioService.verifyOtp(fullPhoneNumber, otp);

      if (result.status !== "approved") {
        return responseHandler(res, 400, "Invalid OTP");
      }

      user.isVerified = true;
      user.phoneotp = null;
      user.phoneotpExpiry = null;
      await user.save();
    }

    // 🔐 TOKEN
    const token = generateToken(user._id);

    res.cookie("auth_token", token, {
      httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000
    });

    return responseHandler(res, 200, "OTP verified successfully", {
      user
    });
  } catch (error) {
    return responseHandler(res, 500, "Internal server error", {
      error: error.message
    });
  }
};

// to update profile
const updateProfile = async (req, res) => {
  const { username, about, profilePicture, profilePictureId, agreedToTerms } = req.body;
  const userId = req.user.userId;

  try {
    const updatedFields = {};

    if (username) {
      if (username.length < 3) {
        return res.status(400).json({ success: false, message: 'Username too short' });
      }
      updatedFields.username = username;
    }

    if (about) updatedFields.about = about;
    if (agreedToTerms) updatedFields.agreedToTerms = agreedToTerms;

    if (profilePicture) {
      updatedFields.profilePicture = {
        url: profilePicture,
        public_id: profilePictureId || null
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );

    return res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
const getProfilePicUploadSignature = (req, res) => {
  try {
    const uploadConfig = generateUploadSignature({
      folder: `profiles/${req.user.userId}`,
      public_id: `avatar`
    });
    res.json(uploadConfig);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not generate upload signature' });
  }
};


module.exports = { sendOtp, verifyOtp, updateProfile, getProfilePicUploadSignature };
