const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const DeliveryModel = require('../../model/delivery/deliveryModel')
const UserModel = require('../../model/user/UserModel')
const OrderModel = require('../../model/order/OrderModel')
const CommonCreateByAdminService = require("../../service/common/CommonCreateByAdminService");
const CommonListJoinProjectionService = require('../../service/common/CommonListJoinProjectionService');
const DeliveryService = require('../../service/delivery/DeliveryService');
const { json } = require('body-parser');
const CommonDeleteByAdminService = require('../../service/common/CommonDeleteByAdminService');
const CommonListTwoJoinService = require('../../service/common/CommonListTwoJoinService');

exports.createDelivery = async (req, res) => {
    let data = await CommonCreateByAdminService(req, DeliveryModel, UserModel)
    res.status(200).json(data)
}

exports.updateDelivery = async (req, res) => {
    let UserDetails = JSON.parse(req.headers['UserDetails'])
    let data = await DeliveryService(req, DeliveryModel, UserModel, UserDetails)
    let Delivery = await DeliveryModel.aggregate([
        {$match: {_id: new ObjectId(req.params.id)}}
    ])
    if(data === true){

        await OrderModel.updateOne({_id: Delivery[0]['OrderId']}, {OrderStatus: 'Completed'})
        res.status(200).json({status: 'success', message: 'Thank you!'})

    }else{
        res.status(200).json(data)
    }
}

exports.listOfDelivery = async (req, res) => {

    let SearchRegex = {"$regex": req.params.keyword, "$options": "i"}
    let SearchKeywords = {$or: [{DeliveryStatus: SearchRegex}, {'Order.OrderTitle': SearchRegex}, {'Order.OrderNumber': SearchRegex}, {'User.fullName': SearchRegex}]}

    let JoinStage1 = {$lookup: {from: 'orders', localField: 'OrderId', foreignField: '_id', as: 'Order'}}
    let JoinStage2 = {$lookup: {from: 'users', localField: 'UserId', foreignField: '_id', as: 'User'}}


    let Project = {$project: {_id: 1,
        DeliveryStatus: 1, 'Order.OrderTitle': 1, 'Order._id': 1, 'Order.OrderNumber': 1, 'User._id': 1, 'User.userPhoto': 1, 'User.fullName': 1
    }}

    let data = await CommonListTwoJoinService(req, SearchKeywords, DeliveryModel, JoinStage1, JoinStage2, Project)
    res.status(200).json(data)

}

exports.deleteDelivery = async (req, res) => {
    let data = await CommonDeleteByAdminService(req, DeliveryModel, UserModel)
    res.status(200).json(data)
}

exports.DeliveryListByStatus = async (req, res) => {
    try {
        
        let DeliveryStatus = req.params.status;
        let Project = {$project: {_id: 1,
            DeliveryStatus: 1, 'Order.OrderTitle': 1, 'Order._id': 1, 'Order.OrderNumber': 1, 'User._id': 1, 'User.userPhoto': 1, 'User.fullName': 1
        }}
        let data = await DeliveryModel.aggregate([
            {$match: {DeliveryStatus: DeliveryStatus}},
            {$lookup: {from: 'orders', localField: 'OrderId', foreignField: '_id', as: 'Order'}},
            {$unwind: '$Order'},
            {$lookup: {from: 'users', localField: 'UserId', foreignField: '_id', as: 'User'}},
            {$unwind: '$User'},
            {
                $facet: {
                    Total: [{$count: 'Total'}],
                    Rows: [Project]
                }
            }
        ])

        res.status(200).json({status: 'success', data: data})

    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}

exports.DeliveryListByUser = async (req, res) => {
    try{
        let UserDetails = JSON.parse(req.headers['UserDetails'])

        let orders = await DeliveryModel.aggregate([
            {$match: {UserId: new mongoose.Types.ObjectId(UserDetails['user_id'])}},
            {$lookup: {from: 'orders', localField: 'OrderId', foreignField: '_id', as: 'Order'}},
            {$unwind: '$Order'},
            {$lookup: {from: 'users', localField: 'UserId', foreignField: '_id', as: 'Buyer'}},
            {$unwind: '$Buyer'},

            {
                $facet: {
                    Rows: [{$project: {_id: 1, DeliveryStatus: 1, ProjectTemplate: 1, BTNColor:1, OrderId: 1, 'Order.OrderTitle': 1, 'Order.OrderPrice': 1, 'Buyer._id': 1, 'Buyer.fullName':1}}]
                }
            }
        ])

        res.status(200).json({status: 'success', data: orders})

    }catch(err){
        res.status(200).json({status: 'failed', data: err.toString()})
    }
}

exports.acceptDeliveryByBuyer = async (req, res) => {
    try {
        let DeliveryId = req.params.DeliveryId
        let UserId = req.params.UserId

        let delivery = await DeliveryModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(DeliveryId), UserId: new mongoose.Types.ObjectId(UserId)}}
        ])
        if(delivery.length !== 1){
            res.status(200).json({status: 'failed', message: 'didn\'t match'})
        }else{
            await DeliveryModel.updateOne({_id: new mongoose.Types.ObjectId(DeliveryId), UserId: new mongoose.Types.ObjectId(UserId)}, {DeliveryStatus: 'Completed', BTNColor: '#5c5c5c'})
            await OrderModel.updateOne({_id: new mongoose.Types.ObjectId(delivery[0]['OrderId'])}, {OrderStatus: 'Completed'})
            res.status(200).json({status: 'success', message: 'Thank you'})
        }

    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}