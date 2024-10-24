const mongoose = require("mongoose")
const dataSchema = mongoose.Schema({

    UserEmail: {type: String},
    StarCommunicate: {type: Number},
    StarRecomend: {type: Number},
    StarService: {type: Number},
    ReviewDescription: {type: String, maxLength: 250},
    OrderId: {type: mongoose.Schema.Types.ObjectId},
    UserId: {type: mongoose.Schema.Types.ObjectId},
    NicheId: {type: mongoose.Schema.Types.ObjectId},
    createdDate: {type: Date, default: Date.now()}

}, {versionKey: false})

const ReviewModel = mongoose.model('reviews', dataSchema)
module.exports = ReviewModel;