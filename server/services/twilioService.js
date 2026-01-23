const twilio = require('twilio');

const accountSID = process.env.TWILIO_ACCOUNT_SID
const serviceSID = process.env.TWILIO_SERVICE_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const client = twilio(accountSID, authToken);

const sendOtpPhoneNo = async(phoneNumber) => {
    try {
        console.log('Sending otp to this phone no.', phoneNumber);
        if(!phoneNumber){
            throw new Error("phone number is required");
        }
        const response = await client.verify.v2.services(serviceSID).verifications.create({
            to : phoneNumber,
            channel : 'sms'
        });
        console.log('this is my response', response);
        return response
    } catch (error) {
        console.error(error)
        throw new Error("failed to send otp");
    }
}

const verifyOtp = async(phoneNumber, otp) => {
    try {
        console.log('this is phone no.', phoneNumber);
        console.log('this is otp', otp);
        const response = await client.verify.v2.services(serviceSID).verificationChecks.create({
            to : phoneNumber,
            channel : 'sms'
        });
        console.log('this is my response', response);
        return response   
    } catch (error) {
        console.error(error)
        throw new Error("otp verification failed");
    }
}

module.exports = {
    sendOtpPhoneNo,
    verifyOtp,
}