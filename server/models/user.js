const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        // required: true,
        unique: true,
        sparse: true,
    },
    phoneSuffix: {
        type: String,
        unique: false,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        sparse: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`,
        },
    },
    emailotp: {
        type: String,
    },
    emailotpExpiry: {
        type: Date,
        unique: false,
    },
    emailotpVerified: {
        type: Boolean,
        default: false,
    },
    profilePicture: {
        // type: String,
        // default: null,
        url: { type: String, default: null },
        public_id: { type: String, default: null }
    },
    about: {
        type: String,
        default: null,
    },
    lastSeen: {
        type: Date,
        default: null,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    agreedToTerms: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;