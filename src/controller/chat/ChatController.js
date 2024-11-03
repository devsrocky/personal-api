const  mongoose = require('mongoose')
const ChatModel = require('../../model/chat/ChatModel')
const UserModel = require('../../model/user/UserModel')
const CommonCreateService = require('../../service/common/CommonCreateService')

const ObjectId = mongoose.Types.ObjectId;

exports.CreateChat = async (req, res) => {
    let data = await CommonCreateService(req, ChatModel)
    res.status(200).json(data)
}

exports.ChatListByClient = async (req, res) => {
    try{
        let UserDetails = JSON.parse(req.headers['UserDetails'])
        let JoinStage1 = {$lookup: {from: 'users', localField: 'ClientId', foreignField: '_id', as: 'user'}}
        let UnwindStage = {$unwind: '$user'}
        let data = await ChatModel.aggregate([
            {$match: {ClientId: new ObjectId(UserDetails['user_id'])}},
            JoinStage1,
            UnwindStage,
            {
                $facet: {
                    Total: [{$count: 'Total'}],
                    Rows: [{$project: {
                        _id: 1,
                        UserText: 1,
                        createdDate: 1,
                        'user.fullName': 1,
                        'user.userPhoto': 1
                    }}]
                }
            }
        ])
        res.status(200).json({status: 'success', data: data})

    }catch(err){
        res.status(200).json({status: 'failed', data: err.toString()})
    }
}

exports.ChatListByAdmin = async (req, res) => {
    try{
        let ClientId = req.params.ClientId;
        let UserDetails = JSON.parse(req.headers['UserDetails'])
        let data = await ChatModel.aggregate([
            {$match: {ClientId: new ObjectId(ClientId), UserStatus: UserDetails['userRole']}}
        ])
        res.status(200).json({status: 'success', data: data})

    }catch(err){
        res.status(200).json({status: 'failed', data: err.toString()})
    }
}

exports.deleteChatByAdmin = async (req, res) => {
    try{
        let DeleteId = req.params.DeleteId;
        let UserDetails = JSON.parse(req.headers['UserDetails'])
        let user = await UserModel.aggregate([
            {$match: {userRole: UserDetails['userRole']}}
        ])
        if(user.length > 0){
            await ChatModel.deleteOne({_id: new ObjectId(DeleteId)})
            res.status(200).json({status: 'success', data: 'The chat has been deleted'})
        }else{
            res.status(200).json({status: 'failed', data: ''})
        }
    }catch(err){
        res.status(200).json({status: 'failed', data: err.toString()})
    }
}