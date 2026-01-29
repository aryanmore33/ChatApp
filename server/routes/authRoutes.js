const express = require ("express");
const authController = require("../controllers/authController")
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);

//update Profile
router.put('/update-profile', authMiddleware, authController.updateProfile);

//get profile pic upload signature
router.get('/profile-pic-upload-signature', authMiddleware, authController.getProfilePicUploadSignature);

module.exports = router;