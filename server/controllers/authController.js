const User = require("../models/user");
const otpGenerator = require("../utils/otpGenerator");
const responseHandler = require("../utils/responseHandler");


// send otp

const sendOtp = async (req, res) => {
    const { phoneNumber, email, phoneSuffix } = req.body;
    const otp = otpGenerator();
    const otpExpiry = Date.now() + 10 * 60 * 1000;
    let user;
    try {
        if(email){
            user = await User.findOne({ email });
            if(!user){
                user = await User.create({ email });
            }
            user.emailotp = otp;
            user.emailotpExpiry = otpExpiry;
            await user.save();
            return responseHandler(res, 200, "OTP sent successfully to your email", { email }); //email
        }
        if(phoneNumber){
            if(!phoneSuffix || !phoneNumber){
                return responseHandler(res, 400, "Phone number and phone suffix are required");
            }
            const fullPhoneNumber = `${phoneNumber}${phoneSuffix}`;
            if(!user){
                user = await User.create({ phoneNumber, phoneSuffix });
            }
            user = await User.findOne({ phoneNumber });
            user.phoneotp = otp;
            user.phoneotpExpiry = otpExpiry;
            await user.save();
            return responseHandler(res, 200, "OTP sent successfully to your phone number", user); //user
        }
        return responseHandler(res, 400, "Invalid email or phone number");
    } catch (error) {
        return responseHandler(res, 500, "Internal server error", { error: error.message });
    }
}

module.exports = { sendOtp };