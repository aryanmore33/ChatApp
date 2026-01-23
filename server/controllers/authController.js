const User = require("../models/user");
const otpGenerator = require("../utils/otpGenerator");
const responseHandler = require("../utils/responseHandler");
const sendEmail = require("../services/emailService")
const twilioService = require("../services/twilioService")

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
            await sendEmail(email, otp)
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
            await twilioService.sendOtpPhoneNo(fullPhoneNumber)
            await user.save();
            return responseHandler(res, 200, "OTP sent successfully to your phone number", user); //user
        }
        return responseHandler(res, 400, "Invalid email or phone number");
    } catch (error) {
        return responseHandler(res, 500, "Internal server error", { error: error.message });
    }
}

//verify otp
const verifyOtp = async(req, res) => {
    const {phoneNumber, phoneSuffix, email, otp} = req.body;
    try {
        let user; 
        if(email){
            user = await User.findOne({ email });
            if(!user){
                return responseHandler(res, 404, 'user not found')
            }
            const now = new Date();
            if (!user.emailotp || String(user.emailotp) != String(otp) || now > new Date(user.emailotpExpiry)) {
                return responseHandler(res, 400, "Invalid or expired otp")
            };
            user.isVerified= true;
            user.emailotp= null;
            user.emailotpExpiry=null;
            await user.save();
        }else if(!phoneNumber || !phoneSuffix){
            return responseHandler(res, 400, "Phone number and Phone Suffix are required");
        }else{
            const fullPhoneNumber = `${phoneNumber}${phoneSuffix}`;
            user = await User.findOne({phoneNumber});
            if(!user) {
                return responseHandler(res, 400, "User not found")
            }
            const result = await twilioService.verifyOtp(fullPhoneNumber, otp);
            if(result.status !== 'approved'){
                return responseHandler(res, 400 , "Invalid Otp")
            }
            user.isVerified=true;
            await user.save();
        }
    } catch (error) {
        return responseHandler(res, 500, "Internal server error", { error: error.message });
    }
}

module.exports = { sendOtp };