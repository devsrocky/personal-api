const mongoose = require("mongoose");

const DataSchema = mongoose.Schema({
    accept: {type: String}

}, {versionKey: false})
const ColorModel = mongoose.model('colors', DataSchema)
module.exports = ColorModel;