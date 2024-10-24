const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const DataModel = require('../../model/rowWork/RowWordModel')
const UserModel = require('../../model/user/UserModel')
const OrderModel = require('../../model/order/OrderModel')
const CommonCreateService = require('../../service/common/CommonCreateService')
const CommonListJoinService = require('../../service/common/CommonListJoinService')
const updateAdministratorService = require('../../service/common/updateAdministratorService');
const CheckAssociation = require('../../service/common/CheckAssociation');

exports.createrowWordk = async (req, res) => {
    let data = await CommonCreateService(req, DataModel)
    res.status(200).json(data)
}
exports.updaterowWork = async (req, res) => {
    let data = await updateAdministratorService(req, DataModel, UserModel)
    res.status(200).json(data)
}

exports.RowWorkList = async (req, res) => {

    let searchRegex = {"$regex": req.params.keyword, "$options": "i"}
    let SearchKeywords = {$or: [{RowWorKTitle: searchRegex}, {RowWorKPrice: searchRegex}, {'Niche.Name': searchRegex}]}
    let JoinStage = {$lookup: {from: 'niches', localField: 'NicheId', foreignField: '_id', as: 'Niche'}}

    let data = await CommonListJoinService(req, DataModel, SearchKeywords, JoinStage)
    res.status(200).json(data)

}

exports.deleteRowWork = async (req, res) => {

    let DeleteId = new ObjectId(req.params.DeleteId)
    let associated = await CheckAssociation({RowWorkId: DeleteId}, OrderModel)
    if(associated){
        res.status(200).json({status: 'associated', message: 'The RowWork is associated with order'})
    }else{
        let DeletedId = await DataModel.deleteOne({_id: DeleteId})
        res.status(200).json({status: 'success', message: 'The RowWork has been deleted', data: DeletedId})
    }
}

exports.rowWorkDetails = async (req, res) => {
    try {
        let RowWorkId = req.params.id;
        let data = await DataModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(RowWorkId)}},
            {$lookup: {from: 'niches', localField: 'NicheId', foreignField: '_id', as: 'Niche'}},
            {$unwind: '$Niche'},
            {$project: {_id: 1, RowWorKTitle: 1, PageNo: 1, RowWorKPrice: 1, RowWorKDescription: 1, RowWorKThumb: 1, 'Niche._id': 1, 'Niche.Name': 1}}
        ])
        res.status(200).json({status: 'success', data: data})
    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}