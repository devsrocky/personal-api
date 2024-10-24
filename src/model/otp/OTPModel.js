const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({

    UserEmail: {type: String},
    UserOTP: {type: String},
    OTPStatus: {type: String, default: 'active'},
    createdDate: {type: Date, default: Date.now()}
    
}, {versionKey: false})

const OTPModel = mongoose.model('OTPS', dataSchema)
module.exports = OTPModel;