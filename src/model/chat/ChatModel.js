const  mongoose = require("mongoose");

const DataSchema = mongoose.Schema({

    UserText: {type: String, maxLength: 5000},
    SenterId: {type: mongoose.Schema.Types.ObjectId},
    MatchId: {type: mongoose.Schema.Types.ObjectId},
    createdDate: {type: Date, default: Date.now()}
    
}, {versionKey: false})

const ChatModel = mongoose.model('chats', DataSchema)
module.exports = ChatModel;