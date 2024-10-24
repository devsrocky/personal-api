const mongoose = require('mongoose')
const dataSchema = mongoose.Schema({

    UserEmail: {type: String},
    RowWorKTitle: {type: String, require: true, maxLength: 72},
    RowWorKDescription: {type: String, require: true, maxLength: 250},
    RowWorKThumb: {type: String, require: true},
    RowWorKPrice: {type: Number, require: true},
    PageNo: {type: String, require: true},
    NicheId: {type: mongoose.Schema.Types.ObjectId},
    createdDate: {type: Date, default: Date.now()}
    
}, {versionKey: false})

const RowWorkModel = mongoose.model('rowWorks', dataSchema)
module.exports = RowWorkModel;