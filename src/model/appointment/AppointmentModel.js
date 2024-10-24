const mongoose = require('mongoose')
const dataSchema = mongoose.Schema({

    YourName: {type: String, require: true},
    YourEmail: {type: String, require: true},
    YourPhone: {type: String, require: true},
    YourAddrs: {type: String, require: true},
    Nich: {type: String, require: true},
    ProjectType: {type: String, require: true},
    Description: {type: String, require: true, maxLength: 350},
    Status: {type: String, default: 'pending'},
    createdDate: {type: Date, default: Date.now()}
    
}, {versionKey: false})

const AppointmentModel = mongoose.model('appointments', dataSchema)
module.exports = AppointmentModel;
