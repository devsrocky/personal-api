const  mongoose = require("mongoose");
const DataSchema = mongoose.Schema({

    UserEmail: {type: String},
    DeliveryStatus: {type: String, default: 'Waiting for accept'},
    DeliDescription: {type: String, maxLength: 250},
    ProjectTemplate: {type: String},
    OrderId: {type: mongoose.Schema.Types.ObjectId},
    UserId: {type: mongoose.Schema.Types.ObjectId},
    BTNColor: {type: String, default: 'rgb(255, 212, 135)'},
    createdDate: {type: Date, default: Date.now()}

}, {versionKey: false})

const DeliveryModel = mongoose.model('deliveries', DataSchema);
module.exports = DeliveryModel;