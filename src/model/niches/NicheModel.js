const mongoose = require("mongoose")
const dataSchema = mongoose.Schema({

    UserEmail: {type: String, require: true},
    Name: {type: String},
    createdDate: {type: Date, default: Date.now()}

}, {versionKey: false})

const NicheModel = mongoose.model('niches', dataSchema)
module.exports = NicheModel;