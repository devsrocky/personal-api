const mongoose = require('mongoose')
const dataSchema = mongoose.Schema({

    UserEmail: {type: String},
    shortTitle: {type: String},
    nameTitle: {type: String},
    shortDescription: {type: String, maxLength: 70},
    Herrothumbnail: {type: String},
    HerroBTNLabel1: {type: String},
    HerroBTNLabel2: {type: String},
    createdDate: {type: Date, default: Date.now()}
    
}, {versionKey: false})

const HeroModel = mongoose.model('heros', dataSchema)
module.exports = HeroModel;