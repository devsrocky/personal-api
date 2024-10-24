const mongoose = require("mongoose");

const DetaSchema = mongoose.Schema({
    UniqueVisitor: {type: String},
    PageView: {type: String},
    createdDate: {type: Date, default: Date.now()}
}, {versionKey: false})

const DataModel = mongoose.model('visitors', DetaSchema)
module.exports = DataModel