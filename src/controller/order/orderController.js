const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;
const DataModel = require('../../model/order/OrderModel');
const UserModel = require('../../model/user/UserModel');
const deliveryModel = require('../../model/delivery/deliveryModel');
const CheckAssociation = require('../../service/common/CheckAssociation');
const CommonListJoinService = require('../../service/common/CommonListJoinService');
const CommonUpdateService = require('../../service/common/CommonUpdateService');
const orderCreateService = require('../../service/order/orderCreateService');


exports.createOrder = async (req, res) => {
    function generateRandomCode (){
        let prefix = '#RO'
        let randomDigit = Math.floor(1000000000 + Math.random() * 9000000000)
        return prefix + randomDigit.toString();
    }
    let OrderNumber = generateRandomCode()
    let data = await orderCreateService(req, DataModel, OrderNumber)
    res.status(200).json(data)
}

exports.updateOrder = async (req, res) => {
    let data = await CommonUpdateService(req, DataModel, UserModel)
    res.status(200).json(data)
}

exports.OrderList = async (req, res) => {

    let SearchRegex = {"$regex": req.params.keyword, "$options": 'i'}
    let SearchKeywords = {$or: [{OrderTitle: SearchRegex}, {OrderPrice: SearchRegex}, {OrderStatus: SearchRegex}, {OrderNumber: SearchRegex}, {'RowWork.RowWorKTitle': SearchRegex}]}
    let JoinStage = {$lookup: {from: 'rowworks', localField: 'RowWorkId', foreignField: '_id', as: 'RowWork'}}
    try{
        let pageNo = Number(req.params.pageNo)
        let PerPage = Number(req.params.PerPage)
        let SearchValue = req.params.keyword

        // (5 - 1) * 5 
        let RowSkip = (pageNo -1 )* PerPage;
        let data;
        if(SearchValue !== "0"){
            data = await DataModel.aggregate([
                {$match: SearchKeywords},
                {$lookup: {from: 'rowworks', localField: 'RowWorkId', foreignField: '_id', as: 'RowWork'}},
                {$unwind: '$RowWork'},
                {
                    $facet: {
                        Total: [{$count: 'Total'}],
                        Rows: [{$skip: RowSkip}, {$limit: PerPage}]
                    }
                }
            ])
        }else{
            data = await DataModel.aggregate([
                {$lookup: {from: 'rowworks', localField: 'RowWorkId', foreignField: '_id', as: 'RowWork'}},
                {$unwind: '$RowWork'},
                {
                    $facet: {
                        Total: [{$count: 'Total'}],
                        Rows: [{$skip: RowSkip}, {$limit: PerPage}]
                    }
                }
            ])
        }
        res.status(200).json({status: 'success', data: data})
    }catch(err){
        res.status(200).json({status: 'failed', data: err.toString()})
    }

}

exports.OrderListByStatus = async (req, res) => {
    try{

        let StatusTXT = req.params.StatusTXT;

        let JoinStage = {$lookup: {from: 'rowworks', localField: 'RowWorkId', foreignField: '_id', as: 'RowWork'}}
        let Unwind = {$unwind: '$RowWork'}
        let data = await DataModel.aggregate([
            {$match: {OrderStatus: StatusTXT}},
            JoinStage,
            Unwind,
            {
                $facet: {
                    Total: [{$count: 'Total'}],
                    Rows: [{$limit: 100}]
                }
            }
            
        ])
        res.status(200).json({status: 'success', data: data})

    }catch(err){
        res.status(200).json({status: 'failed', data: err.toString()})
    }
}

exports.deleteOrder = async (req, res) => {

    let DeleteId = new ObjectId(req.params.DeleteId);
    let associated = await CheckAssociation({OrderId: DeleteId}, deliveryModel)
    if(associated){
        res.status(200).json({status: 'associated', message: 'The Order associated with delivery'})
    }else{
        let deleted = await DataModel.deleteOne({_id: DeleteId})
        res.status(200).json({status: 'success', message: 'The order has been deleted', data: deleted})
    }
}

exports.orderListByUser = async (req, res) => {
    try{
        let UserDetails = JSON.parse(req.headers['UserDetails'])


        let orders = await DataModel.aggregate([
            {$match: {BuyerId: new mongoose.Types.ObjectId(UserDetails['user_id'])}},
            {$lookup: {from: 'rowworks', localField: 'RowWorkId', foreignField: '_id', as: 'RowWork'}},
            {$unwind: '$RowWork'},
            {$lookup: {from: 'users', localField: 'BuyerId', foreignField: '_id', as: 'Buyer'}},
            {$unwind: '$Buyer'},

            {
                $facet: {
                    Rows: [{$project: {_id: 1, OrderTitle: 1, NumberPage: 1, OrderPrice: 1, Reference: 1, OrderStatus: 1, DeliveryTime: 1, BTNColor: 1, 'RowWork.RowWorKTitle': 1, 'RowWork.RowWorKThumb': 1, 'Buyer._id': 1, 'Buyer.fullName':1}}]
                }
            }
        ])

        res.status(200).json({status: 'success', data: orders})

    }catch(err){
        res.status(200).json({status: 'failed', data: err.toString()})
    }
}

exports.orderDetails = async (req, res) => {
    try {
        let OrderId = req.params.OrderId;

        let data = await DataModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(OrderId)}},
            {$lookup: {from: 'rowworks', localField: 'RowWorkId', foreignField: '_id', as: 'RowWork'}},
            {$unwind: '$RowWork'},
            {$lookup: {from: 'users', localField: 'BuyerId', foreignField: '_id', as: 'Buyer'}},
            {$unwind: '$Buyer'},
            
            {$project: {
                _id: 0,
                OrderTitle:1,
                NumberPage:1,
                DeliveryTime: 1,
                Reference: 1,
                OrderPrice:1,
                OrderRequirements:1,
                'RowWork._id':1,
                'RowWork.RowWorKTitle':1,
                'Buyer._id':1,
                'Buyer.email':1,
                'Buyer.fullName':1,
                'Buyer.userPhoto': 1
            }}

        ])
        res.status(200).json({status: 'success', data: data})

    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}

exports.orderAcceptByBuyer = async (req, res) => {
    try {

        const OrderId = req.params.OrderId;
        const UserId = req.params.UserId

        const OrderMatch = await DataModel.aggregate([
            {$match: {_id: new ObjectId(OrderId), BuyerId: new ObjectId(UserId)}}
        ])
        if(OrderMatch.length !== 1){
            res.status(200).json({status: 'failed', message: 'Order didn\'t match'})
        }else{
            await DataModel.updateOne({_id: new ObjectId(OrderId), BuyerId: new ObjectId(UserId)}, {OrderStatus: 'Progress', BTNColor: '#5c5c5c'})
            res.status(200).json({status: 'success', message: 'Order updated'})
        }
    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}

exports.ProgressOrderList = async (req, res) => {
    try{
        let data = await DataModel.aggregate([
            {$match: {OrderStatus: 'Progress'}},
            {
                $facet: {
                    Total: [{$count: 'Total'}],
                    Rows: [{$project: {_id: 1, OrderTitle:1, OrderStatus: 1}}]
                }
            }
        ])
        res.status(200).json({status: 'success', data: data})

    }catch(err){
        res.status(200).json({status: 'failed', data: err.toString()})
    }
}