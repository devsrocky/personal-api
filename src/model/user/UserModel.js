const mongoose = require('mongoose')
const dataSchema = mongoose.Schema({

    email: {type: String, unique: true, require: true},
    mobile: {type: String, unique: true, require: true},
    fullName: {type: String, require: true},
    address: {type: String, require: true},
    country: {type: String, require: true},
    password: {type: String, minLength: 8, maxLength: 100},
    userRole: {type: String},
    profileStatus: {type: String, default: 'pending'},
    sortDes: {type: String, maxLength: 250},
    userPhoto: {type: String},
    createdDate: {type: Date, default: Date.now()}
    
}, {versionKey: false})

const UserModel = mongoose.model('users', dataSchema)
module.exports = UserModel;