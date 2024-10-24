const mongoose = require('mongoose')
const dataSchema = mongoose.Schema({

    UserEmail: {type: String},
    OrderTitle: {type: String, require: true, maxLength: 70},
    NumberPage: {type: String},
    OrderPrice: {type: String, require: true},
    Reference: {type: String},
    OrderStatus: {type: String, default: 'Waiting for accept'},
    DeliveryTime: {type: String},
    OrderNumber: {type: String, require: true},
    RowWorkId: {type: mongoose.Schema.Types.ObjectId},
    BuyerId: {type: mongoose.Schema.Types.ObjectId},
    OrderRequirements: {type: String, maxLength: 5000},
    BTNColor: {type: String, default: 'rgb(255, 212, 135)'},
    createdDate: {type: Date, default: Date.now()}
    
}, {versionKey: false})

const OrderModel = mongoose.model('orders', dataSchema)
module.exports = OrderModel;