const mongoose = require("mongoose")
const dataSchema = mongoose.Schema({

    UserEmail: {type: String},
    ProjectName: {type: String, maxLength: 25},
    Description: {type: String, maxLength: 300},
    Template: {type: String,require: true},
    NicheId: {type: mongoose.Schema.Types.ObjectId},
    createdDate: {type: Date, default: Date.now()}

}, {versionKey: false})

const PortfolioModel = mongoose.model('portfolios', dataSchema)
module.exports = PortfolioModel;

